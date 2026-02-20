import React, { useState, useMemo } from 'react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package, DollarSign, Clock, TrendingUp,
  RefreshCw, Warehouse, AlertTriangle, CheckCircle,
  Truck, Users, BarChart3, Store
} from 'lucide-react';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/orders';
import { WarehousePulse } from './admin/WarehousePulse';
import { RevenueChart } from './admin/RevenueChart';
import { TimeAnalysis } from './admin/TimeAnalysis';
import { PaymentBreakdown } from './admin/PaymentBreakdown';
import { RecentOrders } from './admin/RecentOrders';
import { UserManagement } from './admin/UserManagement';
import { DashboardFilters } from './shared/DashboardFilters';
import { DateFilter, DateFilterValue, getDateRange, getDateFilterDescription } from './shared/DateFilter';

interface SuperAdminDashboardProps {
  readOnly?: boolean;
}

export function SuperAdminDashboard({ readOnly = false }: SuperAdminDashboardProps) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(undefined);
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('today');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);

  // Pass userRole for role-based throttling (1s for admins)
  const filters = useMemo(() => {
    const { start, end } = getDateRange(dateFilter, customDateRange);
    return {
      warehouseId: selectedWarehouseId,
      storeId: selectedStoreId,
      userRole: 'super_admin' as const,
      ...(start && end ? { dateRange: { start, end } } : {}),
    };
  }, [selectedWarehouseId, selectedStoreId, dateFilter, customDateRange]);

  const { summary, warehouses, stores, warehouseStats, dailyStats, timeStats, paymentStats, orders, loading, refetch, deleteOrder } = useAdminStats(filters);

  // Filter stores based on selected warehouse
  const filteredStores = useMemo(() => {
    if (!selectedWarehouseId) return stores;
    return stores.filter(s => s.warehouse_id === selectedWarehouseId);
  }, [stores, selectedWarehouseId]);

  // Format stores for filter component
  const storesForFilter = useMemo(() =>
    stores.map(s => ({ id: s.id, name: s.name, warehouse_id: s.warehouse_id })),
    [stores]
  );

  // Dynamic label for period
  const periodLabel = useMemo(() => {
    switch (dateFilter) {
      case 'today': return 'Hoy';
      case 'yesterday': return 'Ayer';
      case 'week': return '7 Días';
      case 'month': return '30 Días';
      case 'all': return 'Total';
      case 'custom': return 'Período';
      default: return 'Hoy';
    }
  }, [dateFilter]);

  const hasFilters = selectedWarehouseId || selectedStoreId;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Panel de Control
            </h2>
            <p className="text-muted-foreground">Vista consolidada de operaciones</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Filter Bar */}
        <DashboardFilters
          warehouses={warehouses}
          stores={storesForFilter}
          selectedWarehouseId={selectedWarehouseId}
          selectedStoreId={selectedStoreId}
          onWarehouseChange={setSelectedWarehouseId}
          onStoreChange={setSelectedStoreId}
        />

        {/* Date Filter */}
        <DateFilter
          value={dateFilter}
          onChange={setDateFilter}
          showCustomRange
          customRange={customDateRange}
          onCustomRangeChange={setCustomDateRange}
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="card-premium">
          <CardContent className="pt-4 px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold truncate">{summary.totalOrders}</div>
                <div className="text-xs text-muted-foreground">Pedidos {periodLabel}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4 px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-amber-400 truncate">{summary.pendingValidation}</div>
                <div className="text-xs text-muted-foreground">Por Validar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4 px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-purple-400 truncate">{summary.inProgress}</div>
                <div className="text-xs text-muted-foreground">En Proceso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4 px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-400 truncate">{summary.inTransit}</div>
                <div className="text-xs text-muted-foreground">En Ruta</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4 px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 truncate">{summary.delivered}</div>
                <div className="text-xs text-muted-foreground">Entregados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4 px-3 sm:px-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-primary truncate">${summary.totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Venta {periodLabel}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full max-w-xl ${readOnly ? 'grid-cols-4' : 'grid-cols-5'}`}>
          <TabsTrigger value="overview">Pulso</TabsTrigger>
          <TabsTrigger value="revenue">Ventas</TabsTrigger>
          <TabsTrigger value="times">Tiempos</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          {!readOnly && <TabsTrigger value="users">Usuarios</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <WarehousePulse warehouseStats={warehouseStats} loading={loading} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <RevenueChart dailyStats={dailyStats} loading={loading} />
            <PaymentBreakdown paymentStats={paymentStats} loading={loading} />
          </div>
        </TabsContent>

        <TabsContent value="times" className="space-y-6 mt-6">
          <TimeAnalysis timeStats={timeStats} loading={loading} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 mt-6">
          <RecentOrders orders={orders} loading={loading} onDeleteOrder={readOnly ? undefined : deleteOrder} />
        </TabsContent>

        {!readOnly && (
          <TabsContent value="users" className="space-y-6 mt-6">
            <UserManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
