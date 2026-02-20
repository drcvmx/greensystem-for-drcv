import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Order, PAYMENT_TYPE_LABELS, DELIVERY_TYPE_LABELS, ORDER_STATUS_LABELS } from '@/types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';
import { User, MapPin, Package, Truck, CreditCard, Clock, Calendar, FileImage, ShoppingCart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate?: () => void;
}

export function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
  if (!order) return null;

  const timeAgo = formatDistanceToNow(new Date(order.created_at), {
    addSuffix: true,
    locale: es
  });

  // Check if order has order_items
  const orderItems = (order as any).order_items || [];
  const orderPayments = order.order_payments || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">Pedido #{order.order_number}</span>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-2">
            {/* Time & Date Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {timeAgo}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(order.created_at).toLocaleDateString('es-MX', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Cliente
              </h3>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="font-medium">{order.customer?.name || 'Cliente'}</div>
                {order.customer?.customer_code && (
                  <div className="text-sm text-primary">{order.customer.customer_code}</div>
                )}
                {order.customer?.phone && (
                  <div className="text-sm text-muted-foreground">{order.customer.phone}</div>
                )}
              </div>
            </div>

            {/* Store & Warehouse */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                Tienda y Bodega
              </h3>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2">
                  <span>{order.store?.name}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary font-medium">{order.warehouse?.name}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <ShoppingCart className="h-4 w-4" />
                Productos ({orderItems.length})
              </h3>
              <div className="rounded-lg border divide-y">
                {orderItems.length > 0 ? (
                  orderItems.map((item: any) => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.product_name}</div>
                        {item.product_category && (
                          <div className="text-xs text-muted-foreground">{item.product_category}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${Number(item.subtotal).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted-foreground">
                    No hay productos registrados
                  </div>
                )}
              </div>
            </div>

            {/* Payments */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Pagos ({orderPayments.length})
              </h3>
              <div className="rounded-lg border divide-y">
                {orderPayments.length > 0 ? (
                  orderPayments.map((payment) => (
                    <div key={payment.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {PAYMENT_TYPE_LABELS[payment.payment_type]}
                          </Badge>
                        </div>
                        <div className="font-medium text-primary">
                          ${Number(payment.amount).toFixed(2)}
                        </div>
                      </div>
                      {(() => {
                        const urls = payment.evidence_urls?.length
                          ? payment.evidence_urls
                          : (payment.evidence_url ? [payment.evidence_url] : []);
                        return urls.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            <div className={`grid gap-2 ${urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                              {urls.map((url: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  <img
                                    src={url}
                                    alt={`Comprobante ${idx + 1}`}
                                    className="max-h-24 rounded-md border border-border object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                </a>
                              ))}
                            </div>
                            <a
                              href={urls[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <FileImage className="h-3 w-3" />
                              Ver en tamaño completo
                            </a>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted-foreground">
                    No hay pagos registrados
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4" />
                Entrega
              </h3>
              <div className="p-3 rounded-lg bg-muted/50 border space-y-2">
                <Badge variant="outline">{DELIVERY_TYPE_LABELS[order.delivery_type]}</Badge>
                {order.delivery_type === 'delivery' && order.delivery_address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{order.delivery_address}</span>
                  </div>
                )}
                {order.delivery_notes && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Notas:</span> {order.delivery_notes}
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</span>
              </div>
              {order.points_discount > 0 && (
                <div className="text-sm text-muted-foreground">
                  Descuento por puntos: -${order.points_discount.toFixed(2)}
                </div>
              )}
            </div>

            {/* Delivery Photo if exists */}
            {order.delivery_photo_url && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <FileImage className="h-4 w-4" />
                  Foto de Entrega
                </h3>
                <a
                  href={order.delivery_photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={order.delivery_photo_url}
                    alt="Foto de entrega"
                    className="rounded-lg border max-h-48 object-cover hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
