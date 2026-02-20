import React, { useState, useMemo } from 'react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package, DollarSign, Clock, TrendingUp,
  RefreshCw, Warehouse, AlertTriangle, CheckCircle,
  Truck, Users, Eye, Store, Receipt
} from 'lucide-react';
import { WarehousePulse } from './admin/WarehousePulse';
import { RevenueChart } from './admin/RevenueChart';
import { TimeAnalysis } from './admin/TimeAnalysis';
import { PaymentBreakdown } from './admin/PaymentBreakdown';
import { RecentOrders } from './admin/RecentOrders';
import { DashboardFilters } from './shared/DashboardFilters';
import { TesoreroDashboard } from './TesoreroDashboard';

export function ConsultorDashboard() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(undefined);
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('overview');

  // Pass userRole for role-based throttling (2s for consultors - lowest priority)
  const filters = useMemo(() => ({
    warehouseId: selectedWarehouseId,
    storeId: selectedStoreId,
    userRole: 'consultor' as const,
  }), [selectedWarehouseId, selectedStoreId]);

  const { summary, warehouses, stores, warehouseStats, dailyStats, timeStats, paymentStats, orders, loading, refetch } = useAdminStats(filters);

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

  const hasFilters = selectedWarehouseId || selectedStoreId;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Panel de Consultor
            </h2>
            <p className="text-muted-foreground">Vista de solo lectura - Monitoreo de operaciones</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
              <Eye className="h-3 w-3 mr-1" />
              Solo Lectura
            </Badge>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
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
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{summary.todayOrders}</div>
                <div className="text-xs text-muted-foreground">Pedidos Hoy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-2xl font-bold text-amber-400">{summary.pendingValidation}</div>
                <div className="text-xs text-muted-foreground">Por Validar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">{summary.inProgress}</div>
                <div className="text-xs text-muted-foreground">En Proceso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-orange-400">{summary.inTransit}</div>
                <div className="text-xs text-muted-foreground">En Ruta</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-emerald-400">{summary.delivered}</div>
                <div className="text-xs text-muted-foreground">Entregados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">${summary.todayRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Venta Hoy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs - Read Only (no Users tab) */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-xl">
          <TabsTrigger value="overview">Pulso</TabsTrigger>
          <TabsTrigger value="revenue">Ventas</TabsTrigger>
          <TabsTrigger value="tesoreria" className="flex items-center gap-1">
            <Receipt className="h-3 w-3" />
            <span className="hidden sm:inline">Tesorería</span>
          </TabsTrigger>
          <TabsTrigger value="times">Tiempos</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
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

        <TabsContent value="tesoreria" className="space-y-6 mt-6">
          <TesoreroDashboard readOnly={true} />
        </TabsContent>

        <TabsContent value="times" className="space-y-6 mt-6">
          <TimeAnalysis timeStats={timeStats} loading={loading} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 mt-6">
          {/* Pass undefined for onDeleteOrder to hide delete buttons */}
          <RecentOrders orders={orders} loading={loading} onDeleteOrder={undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
