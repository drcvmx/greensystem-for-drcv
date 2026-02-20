import { useState, useEffect, useCallback, useMemo } from 'react';
import { demoStorage } from '@/lib/demoStorage';
import { Order, Warehouse } from '@/types/orders';
import { AppRole } from './useAuth';

interface WarehouseStats {
  warehouse: Warehouse;
  totalOrders: number;
  pendingValidation: number;
  inProgress: number;
  readyForDispatch: number;
  inTransit: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  avgProcessingTime: number; // minutes
}

interface DailyStats {
  date: string;
  ordersCreated: number;
  ordersDelivered: number;
  revenue: number;
  cashRevenue: number;
  transferRevenue: number;
  pointsDiscount: number;
}

interface TimeStats {
  warehouseId: string;
  warehouseName: string;
  avgValidationTime: number; // minutes
  avgPreparationTime: number;
  avgDeliveryTime: number;
  avgTotalTime: number;
}

interface PaymentStats {
  cash: number;
  transfer: number;
  payment_link: number;
  loyalty_points: number;
}

interface AdminStatsFilters {
  dateRange?: { start: Date; end: Date };
  warehouseId?: string;
  storeId?: string;
  userRole?: AppRole | null;
}

export function useAdminStats(filters?: AdminStatsFilters) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stores, setStores] = useState<{ id: string; name: string; warehouse_id: string }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouseStats, setWarehouseStats] = useState<WarehouseStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [timeStats, setTimeStats] = useState<TimeStats[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    cash: 0,
    transfer: 0,
    payment_link: 0,
    loyalty_points: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    try {
      setLoading(true);

      const allWarehouses = demoStorage.getAll('warehouses').filter((w: any) => w.is_active);
      const allStores = demoStorage.getAll('stores').filter((s: any) => s.is_active);
      let allOrders = demoStorage.getOrdersWithRelations();

      // Apply Filters
      if (filters?.warehouseId) {
        allOrders = allOrders.filter(o => o.warehouse_id === filters.warehouseId);
      }
      if (filters?.storeId) {
        allOrders = allOrders.filter(o => o.store_id === filters.storeId);
      }
      if (filters?.dateRange) {
        const start = filters.dateRange.start.getTime();
        const end = filters.dateRange.end.getTime();
        allOrders = allOrders.filter(o => {
          const created = new Date(o.created_at).getTime();
          return created >= start && created <= end;
        });
      }

      setWarehouses(allWarehouses);
      setStores(allStores);
      setOrders(allOrders);

      // --- 1. Payment Stats ---
      const pStats: PaymentStats = { cash: 0, transfer: 0, payment_link: 0, loyalty_points: 0 };
      allOrders.filter(o => o.status === 'delivered').forEach(o => {
        if (o.payment_type in pStats) {
          pStats[o.payment_type as keyof PaymentStats] += o.total;
        }
      });
      setPaymentStats(pStats);

      // --- 2. Daily Stats ---
      const dailyMap = new Map<string, DailyStats>();
      allOrders.forEach(o => {
        const date = o.created_at.split('T')[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date, ordersCreated: 0, ordersDelivered: 0, revenue: 0,
            cashRevenue: 0, transferRevenue: 0, pointsDiscount: 0
          });
        }
        const day = dailyMap.get(date)!;
        day.ordersCreated++;
        if (o.status === 'delivered') {
          day.ordersDelivered++;
          day.revenue += o.total;
          if (o.payment_type === 'cash') day.cashRevenue += o.total;
          if (o.payment_type === 'transfer') day.transferRevenue += o.total;
        }
        day.pointsDiscount += (o.points_discount || 0);
      });
      setDailyStats(Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)));

      // --- 3. Time Stats ---
      const tStats: TimeStats[] = allWarehouses.map(wh => {
        const whOrders = allOrders.filter(o => o.warehouse_id === wh.id && o.status === 'delivered');
        const calcAvg = (startField: keyof Order, endField: keyof Order) => {
          const relevant = whOrders.filter(o => o[startField] && o[endField]);
          if (relevant.length === 0) return 0;
          const total = relevant.reduce((sum, o) => {
            return sum + (new Date(o[endField] as string).getTime() - new Date(o[startField] as string).getTime()) / 60000;
          }, 0);
          return Math.round(total / relevant.length);
        };

        return {
          warehouseId: wh.id,
          warehouseName: wh.name,
          avgValidationTime: calcAvg('created_at', 'validated_at'),
          avgPreparationTime: calcAvg('validated_at', 'ready_at'),
          avgDeliveryTime: calcAvg('ready_at', 'delivered_at'),
          avgTotalTime: calcAvg('created_at', 'delivered_at'),
        };
      });
      setTimeStats(tStats);

      // --- 4. Warehouse Stats ---
      const wStats: WarehouseStats[] = allWarehouses.map(wh => {
        const whOrders = allOrders.filter(o => o.warehouse_id === wh.id);
        const delivered = whOrders.filter(o => o.status === 'delivered');
        const avgTime = delivered.length > 0
          ? delivered.reduce((sum, o) => sum + (new Date(o.delivered_at!).getTime() - new Date(o.created_at).getTime()) / 60000, 0) / delivered.length
          : 0;

        return {
          warehouse: wh,
          totalOrders: whOrders.length,
          pendingValidation: whOrders.filter(o => o.status === 'pending_validation').length,
          inProgress: whOrders.filter(o => ['validated', 'in_preparation'].includes(o.status)).length,
          readyForDispatch: whOrders.filter(o => o.status === 'ready_for_dispatch').length,
          inTransit: whOrders.filter(o => ['assigned_to_driver', 'in_transit'].includes(o.status)).length,
          delivered: delivered.length,
          cancelled: whOrders.filter(o => o.status === 'cancelled').length,
          totalRevenue: delivered.reduce((sum, o) => sum + o.total, 0),
          avgProcessingTime: Math.round(avgTime),
        };
      });
      setWarehouseStats(wStats);

    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  }, [filters?.dateRange?.start, filters?.dateRange?.end, filters?.warehouseId, filters?.storeId]);

  useEffect(() => {
    fetchData();
    window.addEventListener('demo_storage_update', fetchData);
    return () => window.removeEventListener('demo_storage_update', fetchData);
  }, [fetchData]);

  const summary = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.created_at.split('T')[0] === todayStr);

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pendingValidation: orders.filter(o => o.status === 'pending_validation').length,
      inProgress: orders.filter(o => ['validated', 'in_preparation', 'ready_for_dispatch'].includes(o.status)).length,
      inTransit: orders.filter(o => ['assigned_to_driver', 'in_transit'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
      todayRevenue: todayOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
    };
  }, [orders]);

  const deleteOrder = async (orderId: string) => {
    demoStorage.delete('orders', orderId);
    fetchData();
  };

  return {
    warehouses,
    stores,
    orders,
    warehouseStats,
    dailyStats,
    timeStats,
    paymentStats,
    summary,
    loading,
    refetch: fetchData,
    deleteOrder,
  };
}
