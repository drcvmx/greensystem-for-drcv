import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Banknote, CreditCard, Gift, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PaymentStats {
  cash: number;
  transfer: number;
  payment_link: number;
  loyalty_points: number;
}

interface PaymentBreakdownProps {
  paymentStats: PaymentStats;
  loading: boolean;
}

const PAYMENT_CONFIG = [
  { key: 'cash', label: 'Efectivo', color: '#22c55e', icon: Banknote },
  { key: 'transfer', label: 'Transferencia', color: '#3b82f6', icon: ArrowUpRight },
  { key: 'payment_link', label: 'Link de Pago', color: '#a855f7', icon: CreditCard },
  { key: 'loyalty_points', label: 'Descuento Puntos', color: '#f97316', icon: Gift },
];

export function PaymentBreakdown({ paymentStats, loading }: PaymentBreakdownProps) {
  if (loading) {
    return (
      <Card className="card-premium">
        <CardContent className="py-8">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = paymentStats.cash + paymentStats.transfer + paymentStats.payment_link;
  
  const pieData = PAYMENT_CONFIG
    .filter(p => p.key !== 'loyalty_points')
    .map(p => ({
      name: p.label,
      value: paymentStats[p.key as keyof PaymentStats],
      color: p.color,
    }))
    .filter(p => p.value > 0);

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Desglose de Pagos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pie Chart */}
        {pieData.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Sin datos de ventas
          </div>
        )}

        {/* Payment Details */}
        <div className="space-y-3">
          {PAYMENT_CONFIG.map(p => {
            const value = paymentStats[p.key as keyof PaymentStats];
            const percentage = totalRevenue > 0 && p.key !== 'loyalty_points'
              ? Math.round((value / totalRevenue) * 100)
              : 0;
            const Icon = p.icon;

            return (
              <div key={p.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: p.color }}
                  />
                  <Icon className="h-4 w-4" style={{ color: p.color }} />
                  <span className="text-sm">{p.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">${value.toLocaleString()}</span>
                  {p.key !== 'loyalty_points' && percentage > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Ingresos</span>
            <span className="text-xl font-bold text-primary">${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-sm">
            <span className="text-muted-foreground">Por cobrar (efectivo)</span>
            <span className="text-amber-400 font-medium">${paymentStats.cash.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-sm">
            <span className="text-muted-foreground">Ya en banco</span>
            <span className="text-emerald-400 font-medium">
              ${(paymentStats.transfer + paymentStats.payment_link).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
