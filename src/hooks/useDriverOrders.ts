import { useState, useEffect, useCallback, useMemo } from 'react';
import { demoStorage } from '@/lib/demoStorage';
import { Order, OrderStatus } from '@/types/orders';
import { AppRole } from './useAuth';

interface UseDriverOrdersOptions {
  showAll?: boolean;
  userRole?: AppRole | null;
}

export function useDriverOrders(options: UseDriverOrdersOptions = {}) {
  const { showAll = false } = options;

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverWarehouseId, setDriverWarehouseId] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = demoStorage.getCurrentUser();
      if (!currentUser) {
        setLoading(false);
        return;
      }

      let driverId: string | null = null;
      let warehouseId: string | null = null;

      if (!showAll) {
        const drivers = demoStorage.getAll('drivers');
        const driver = drivers.find((d: any) => d.user_id === currentUser.id);

        if (!driver) {
          setLoading(false);
          return;
        }

        driverId = driver.id;
        warehouseId = driver.warehouse_id;
        setDriverWarehouseId(warehouseId);
      }

      let orders = demoStorage.getOrdersWithRelations();

      // Driver relevant statuses
      orders = orders.filter(o => ['assigned_to_driver', 'in_transit', 'delivered'].includes(o.status));

      if (!showAll && driverId) {
        orders = orders.filter(o => o.driver_id === driverId);
      }

      // Sort by date ascending (oldest first for delivery queue)
      orders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      setAllOrders(orders);
    } catch (err) {
      console.error('Error fetching driver orders:', err);
      setError('Error cargando pedidos');
    } finally {
      setLoading(false);
    }
  }, [showAll]);

  useEffect(() => {
    fetchOrders();
    window.addEventListener('demo_storage_update', fetchOrders);
    return () => window.removeEventListener('demo_storage_update', fetchOrders);
  }, [fetchOrders]);

  const assignedOrders = useMemo(
    () => allOrders.filter(o => o.status === 'assigned_to_driver'),
    [allOrders]
  );

  const inTransitOrders = useMemo(
    () => allOrders.filter(o => o.status === 'in_transit'),
    [allOrders]
  );

  const deliveredOrders = useMemo(
    () => allOrders.filter(o => o.status === 'delivered' && o.delivery_type === 'delivery'),
    [allOrders]
  );

  const deliveredToday = useMemo(
    () => deliveredOrders.length,
    [deliveredOrders]
  );

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    deliveryPhotoUrl?: string
  ) => {
    const updateData: any = { status: newStatus };
    const now = new Date().toISOString();

    switch (newStatus) {
      case 'in_transit':
        updateData.dispatched_at = now;
        break;
      case 'delivered':
        updateData.delivered_at = now;
        if (deliveryPhotoUrl) {
          updateData.delivery_photo_url = deliveryPhotoUrl;
        }
        break;
    }

    demoStorage.update('orders', orderId, updateData);
    fetchOrders();
  };

  return {
    assignedOrders,
    inTransitOrders,
    deliveredOrders,
    deliveredToday,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
  };
}
