import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Warehouse as WarehouseIcon, Package, Clock, DollarSign, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import { Warehouse } from '@/types/orders';

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
  avgProcessingTime: number;
}

interface WarehousePulseProps {
  warehouseStats: WarehouseStats[];
  loading: boolean;
}

export function WarehousePulse({ warehouseStats, loading }: WarehousePulseProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="card-premium animate-pulse">
            <CardContent className="py-8">
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <WarehouseIcon className="h-5 w-5 text-primary" />
        Pulso por Bodega
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {warehouseStats.map(stat => {
          const activeOrders = stat.pendingValidation + stat.inProgress + stat.readyForDispatch + stat.inTransit;
          const completionRate = stat.totalOrders > 0 
            ? Math.round((stat.delivered / stat.totalOrders) * 100) 
            : 0;

          return (
            <Card key={stat.warehouse.id} className="card-premium">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="text-primary">{stat.warehouse.name}</span>
                  <Badge variant="outline" className="font-normal">
                    {stat.totalOrders} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Active Orders Breakdown */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-amber-400">{stat.pendingValidation}</div>
                    <div className="text-xs text-muted-foreground">Validando</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-purple-400">{stat.inProgress}</div>
                    <div className="text-xs text-muted-foreground">Surtiendo</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-cyan-400">{stat.readyForDispatch}</div>
                    <div className="text-xs text-muted-foreground">Listos</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-orange-400">{stat.inTransit}</div>
                    <div className="text-xs text-muted-foreground">En Ruta</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tasa de Entrega</span>
                    <span className="font-medium text-emerald-400">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">{stat.delivered}</span>
                    <span className="text-muted-foreground">entregados</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">~{formatTime(stat.avgProcessingTime)}</span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Ventas Confirmadas
                  </div>
                  <span className="text-lg font-bold text-primary">
                    ${stat.totalRevenue.toLocaleString()}
                  </span>
                </div>

                {/* Alert if there are pending orders */}
                {activeOrders > 5 && (
                  <div className="flex items-center gap-2 pt-2 border-t text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{activeOrders} pedidos activos</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
