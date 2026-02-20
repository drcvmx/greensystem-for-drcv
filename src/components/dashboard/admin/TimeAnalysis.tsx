import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, Package, Truck, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimeStats {
  warehouseId: string;
  warehouseName: string;
  avgValidationTime: number;
  avgPreparationTime: number;
  avgDeliveryTime: number;
  avgTotalTime: number;
}

interface TimeAnalysisProps {
  timeStats: TimeStats[];
  loading: boolean;
}

export function TimeAnalysis({ timeStats, loading }: TimeAnalysisProps) {
  if (loading) {
    return (
      <Card className="card-premium">
        <CardContent className="py-8">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes === 0) return '-';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  // Prepare chart data
  const chartData = timeStats.map(stat => ({
    name: stat.warehouseName.replace('Bodega ', ''),
    Validación: stat.avgValidationTime,
    Preparación: stat.avgPreparationTime,
    Entrega: stat.avgDeliveryTime,
    Total: stat.avgTotalTime,
  }));

  // Find best/worst performers
  const sortedByTotal = [...timeStats].sort((a, b) => {
    if (a.avgTotalTime === 0) return 1;
    if (b.avgTotalTime === 0) return -1;
    return a.avgTotalTime - b.avgTotalTime;
  });
  const fastest = sortedByTotal.find(s => s.avgTotalTime > 0);
  const slowest = sortedByTotal.filter(s => s.avgTotalTime > 0).pop();

  return (
    <div className="space-y-6">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Análisis de Tiempos por Bodega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}m`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [formatTime(value), name]}
                />
                <Legend />
                <Bar dataKey="Validación" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Preparación" fill="#a855f7" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Entrega" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Time Breakdown */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {timeStats.map(stat => (
          <Card key={stat.warehouseId} className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{stat.warehouseName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-muted-foreground">Validación</span>
                </div>
                <span className="font-medium">{formatTime(stat.avgValidationTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-400" />
                  <span className="text-muted-foreground">Preparación</span>
                </div>
                <span className="font-medium">{formatTime(stat.avgPreparationTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-orange-400" />
                  <span className="text-muted-foreground">Entrega</span>
                </div>
                <span className="font-medium">{formatTime(stat.avgDeliveryTime)}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground font-medium">Total</span>
                </div>
                <span className="font-bold text-primary">{formatTime(stat.avgTotalTime)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Insights */}
      {fastest && slowest && fastest.warehouseId !== slowest.warehouseId && (
        <Card className="card-premium">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Zap className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">
                  <strong className="text-emerald-400">{fastest.warehouseName}</strong>
                  {' '}es la más rápida con{' '}
                  <strong>{formatTime(fastest.avgTotalTime)}</strong> promedio
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Clock className="h-5 w-5 text-amber-400" />
                <span className="text-sm">
                  <strong className="text-amber-400">{slowest.warehouseName}</strong>
                  {' '}toma{' '}
                  <strong>{formatTime(slowest.avgTotalTime)}</strong> promedio
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
