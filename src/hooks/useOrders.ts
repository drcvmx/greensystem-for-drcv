import { useState, useEffect, useCallback } from 'react';
import { demoStorage } from '@/lib/demoStorage';
import { Order, OrderStatus, Store, Warehouse, Customer, Driver } from '@/types/orders';
import { AppRole } from './useAuth';

interface UseOrdersOptions {
  warehouseId?: string;
  storeId?: string;
  status?: OrderStatus | OrderStatus[];
  realtime?: boolean;
  limit?: number;
  userRole?: AppRole | null;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    try {
      setLoading(true);
      let allOrders = demoStorage.getOrdersWithRelations();

      // Apply filters
      if (options.warehouseId) {
        allOrders = allOrders.filter(o => o.warehouse_id === options.warehouseId);
      }
      if (options.storeId) {
        allOrders = allOrders.filter(o => o.store_id === options.storeId);
      }
      if (options.status) {
        const statuses = Array.isArray(options.status) ? options.status : [options.status];
        allOrders = allOrders.filter(o => statuses.includes(o.status));
      }

      // Sort by date descending
      allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (options.limit) {
        allOrders = allOrders.slice(0, options.limit);
      }

      setOrders(allOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error cargando pedidos');
    } finally {
      setLoading(false);
    }
  }, [options.warehouseId, options.storeId, options.status, options.limit]);

  useEffect(() => {
    fetchOrders();

    const handleUpdate = () => {
      if (options.realtime) {
        fetchOrders();
      }
    };

    window.addEventListener('demo_storage_update', handleUpdate);
    return () => window.removeEventListener('demo_storage_update', handleUpdate);
  }, [fetchOrders, options.realtime]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, additionalData?: Partial<Order>) => {
    const updateData: any = { status: newStatus, ...additionalData };
    const now = new Date().toISOString();

    switch (newStatus) {
      case 'validated': updateData.validated_at = now; break;
      case 'in_preparation': updateData.preparation_started_at = now; break;
      case 'ready_for_dispatch': updateData.ready_at = now; break;
      case 'in_transit': updateData.dispatched_at = now; break;
      case 'delivered': updateData.delivered_at = now; break;
      case 'cancelled': updateData.cancelled_at = now; break;
    }

    demoStorage.update('orders', orderId, updateData);
    fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
  };
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(() => {
    const data = demoStorage.getAll('stores');
    const warehouses = demoStorage.getAll('warehouses');

    const storesWithWarehouse = data.map((s: any) => ({
      ...s,
      warehouse: warehouses.find((w: any) => w.id === s.warehouse_id)
    }));

    setStores(storesWithWarehouse.filter((s: any) => s.is_active));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStores();
    window.addEventListener('demo_storage_update', fetchStores);
    return () => window.removeEventListener('demo_storage_update', fetchStores);
  }, [fetchStores]);

  const createStore = async (store: { name: string; warehouse_id: string; address?: string; phone?: string }) => {
    const slug = store.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newItem = demoStorage.insert('stores', { ...store, slug });
    return newItem as Store;
  };

  const updateStore = async (id: string, updates: Partial<Store>) => {
    demoStorage.update('stores', id, updates);
  };

  const deleteStore = async (id: string) => {
    demoStorage.delete('stores', id);
  };

  return { stores, loading, createStore, updateStore, deleteStore, refetch: fetchStores };
}

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWarehouses = useCallback(() => {
    const data = demoStorage.getAll('warehouses');
    setWarehouses(data.filter((w: any) => w.is_active));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWarehouses();
    window.addEventListener('demo_storage_update', fetchWarehouses);
    return () => window.removeEventListener('demo_storage_update', fetchWarehouses);
  }, [fetchWarehouses]);

  const createWarehouse = async (warehouse: { name: string; address?: string; phone?: string }) => {
    const slug = warehouse.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newItem = demoStorage.insert('warehouses', { ...warehouse, slug });
    return newItem as Warehouse;
  };

  const updateWarehouse = async (id: string, updates: Partial<Warehouse>) => {
    demoStorage.update('warehouses', id, updates);
  };

  const deleteWarehouse = async (id: string) => {
    demoStorage.delete('warehouses', id);
  };

  return { warehouses, loading, createWarehouse, updateWarehouse, deleteWarehouse, refetch: fetchWarehouses };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(() => {
    const data = demoStorage.getAll('customers');
    setCustomers(data.filter((c: any) => c.is_active));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
    window.addEventListener('demo_storage_update', fetchCustomers);
    return () => window.removeEventListener('demo_storage_update', fetchCustomers);
  }, [fetchCustomers]);

  const createCustomer = async (customer: { name: string; phone?: string; email?: string; address?: string }) => {
    const newItem = demoStorage.insert('customers', {
      ...customer,
      customer_code: `GA-${Math.floor(1000 + Math.random() * 9000)}`,
      loyalty_points: 0,
      total_orders: 0
    });
    return newItem as Customer;
  };

  return { customers, loading, createCustomer, refetch: fetchCustomers };
}

export function useDrivers(warehouseId?: string) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = useCallback(() => {
    let data = demoStorage.getAll('drivers');
    if (warehouseId) {
      data = data.filter((d: any) => d.warehouse_id === warehouseId);
    }
    setDrivers(data.filter((d: any) => d.is_active));
    setLoading(false);
  }, [warehouseId]);

  useEffect(() => {
    fetchDrivers();
    window.addEventListener('demo_storage_update', fetchDrivers);
    return () => window.removeEventListener('demo_storage_update', fetchDrivers);
  }, [fetchDrivers]);

  return { drivers, loading };
}
