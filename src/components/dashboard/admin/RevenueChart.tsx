import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyStats {
  date: string;
  ordersCreated: number;
  ordersDelivered: number;
  revenue: number;
  cashRevenue: number;
  transferRevenue: number;
  pointsDiscount: number;
}

interface RevenueChartProps {
  dailyStats: DailyStats[];
  loading: boolean;
}

export function RevenueChart({ dailyStats, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <Card className="card-premium">
        <CardContent className="py-8">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = dailyStats.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = dailyStats.reduce((sum, d) => sum + d.ordersDelivered, 0);

  // Format date for display
  const chartData = dailyStats.map(d => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }),
  }));

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Ventas Últimos 7 Días
          </span>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{totalOrders} pedidos</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dateLabel" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ventas']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily breakdown */}
        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {chartData.map(d => (
            <div key={d.date} className="text-xs">
              <div className="font-medium text-muted-foreground">{d.dateLabel.split(' ')[0]}</div>
              <div className="text-primary font-bold">{d.ordersDelivered}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
