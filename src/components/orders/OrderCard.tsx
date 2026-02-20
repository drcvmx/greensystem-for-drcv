import { Order, PAYMENT_TYPE_LABELS, DELIVERY_TYPE_LABELS } from '@/types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, MapPin, CheckCircle, Package, Clock, Truck } from 'lucide-react';

const getPaymentMethodLabel = (paymentType: string) => {
  const labels: Record<string, string> = {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    payment_link: 'Link de Pago',
    loyalty_points: 'Puntos'
  };
  return labels[paymentType] || paymentType;
};
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
  readOnly?: boolean;
}

export function OrderCard({ order, onClick, onEdit, onDelete, children, readOnly = false }: OrderCardProps) {
  const timeAgo = formatDistanceToNow(new Date(order.created_at), {
    addSuffix: true,
    locale: es
  });

  return (
    <Card
      className={`card-premium ${onClick ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">#{order.order_number}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">${order.total.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{PAYMENT_TYPE_LABELS[order.payment_type]}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Customer */}
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{order.customer?.name || 'Cliente'}</span>
          {order.customer?.customer_code && (
            <span className="text-xs text-muted-foreground">({order.customer.customer_code})</span>
          )}
        </div>

        {/* Store & Warehouse */}
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{order.store?.name}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-primary">{order.warehouse?.name}</span>
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{DELIVERY_TYPE_LABELS[order.delivery_type]}</span>
          {order.delivery_type === 'delivery' && order.delivery_address && (
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              - {order.delivery_address}
            </span>
          )}
        </div>

        {/* Payment status indicator */}
        {order.status !== 'delivered' && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-emerald-400">
                ✅ PAGADO - ${order.total.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-400/70">
                Método: {getPaymentMethodLabel(order.payment_type)}
              </div>
            </div>
          </div>
        )}

        {/* Standard Actions */}
        {!readOnly && order.status === 'pending_validation' && (onEdit || onDelete) && (
          <div className="pt-3 border-t flex gap-2">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar pedido #{order.order_number}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminarán todos los datos del pedido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete()}>
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}

        {/* Actions slot */}
        {children}
      </CardContent>
    </Card>
  );
}
