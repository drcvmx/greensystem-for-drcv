import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, MapPin, Clock, Camera, CreditCard, Truck, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_TYPE_LABELS } from '@/types/orders';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { SuperAdminDeleteButton } from '@/components/admin/SuperAdminDeleteButton';
import { toast } from '@/hooks/use-toast';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';

interface RecentOrdersProps {
  orders: Order[];
  loading: boolean;
  onDeleteOrder?: (orderId: string) => Promise<void>;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

function EvidenceModal({ isOpen, onClose, order }: EvidenceModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!order) return null;

  const paymentEvidences = order.order_payments?.filter(p => p.evidence_url) || [];
  const hasDeliveryPhoto = !!order.delivery_photo_url;
  const hasPaymentEvidence = paymentEvidences.length > 0 || !!order.payment_evidence_url;
  const hasAnyEvidence = hasDeliveryPhoto || hasPaymentEvidence;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Evidencias - Pedido #{order.order_number}
          </DialogTitle>
        </DialogHeader>

        {!hasAnyEvidence ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay evidencias para este pedido</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Evidences */}
            {hasPaymentEvidence && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-emerald-400" />
                  Comprobantes de Pago
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Individual payment evidences */}
                  {paymentEvidences.map((payment, idx) => (
                    <div
                      key={payment.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                      onClick={() => setSelectedImage(payment.evidence_url!)}
                    >
                      <img
                        src={payment.evidence_url}
                        alt={`Comprobante ${idx + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="text-xs text-white font-medium">
                          {PAYMENT_TYPE_LABELS[payment.payment_type]}
                        </div>
                        <div className="text-xs text-white/70">
                          ${payment.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Legacy single payment evidence */}
                  {order.payment_evidence_url && !paymentEvidences.length && (
                    <div
                      className="relative group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                      onClick={() => setSelectedImage(order.payment_evidence_url!)}
                    >
                      <img
                        src={order.payment_evidence_url}
                        alt="Comprobante de pago"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="text-xs text-white font-medium">
                          {PAYMENT_TYPE_LABELS[order.payment_type]}
                        </div>
                        <div className="text-xs text-white/70">
                          ${order.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Evidence */}
            {hasDeliveryPhoto && (
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-orange-400" />
                  Evidencia de Entrega
                </h3>
                <div
                  className="relative group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-colors max-w-xs"
                  onClick={() => setSelectedImage(order.delivery_photo_url!)}
                >
                  <img
                    src={order.delivery_photo_url}
                    alt="Foto de entrega"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="text-xs text-white font-medium">
                      Entregado
                    </div>
                    {order.delivered_at && (
                      <div className="text-xs text-white/70">
                        {new Date(order.delivered_at).toLocaleString('es-MX')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fullscreen Image Preview */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={selectedImage}
              alt="Vista completa"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function RecentOrders({ orders, loading, onDeleteOrder }: RecentOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(orders.length / pageSize);
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const paginatedOrders = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, safeCurrentPage]);

  const handleDelete = async (order: Order) => {
    if (!onDeleteOrder) return;
    try {
      await onDeleteOrder(order.id);
      toast({ title: 'Pedido Eliminado', description: `Pedido #${order.order_number} eliminado correctamente` });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    }
  };

  const openEvidenceModal = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setShowEvidence(true);
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const hasEvidence = (order: Order): boolean => {
    const hasDelivery = !!order.delivery_photo_url;
    const hasPayments = order.order_payments?.some(p => p.evidence_url) || !!order.payment_evidence_url;
    return hasDelivery || hasPayments;
  };

  if (loading) {
    return (
      <Card className="card-premium">
        <CardContent className="py-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Pedidos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay pedidos registrados
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedOrders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openDetailModal(order)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <div className="text-lg font-bold text-primary">#{order.order_number}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.customer?.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {order.customer?.customer_code}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.store?.name}
                          </span>
                          <span>→</span>
                          <span className="text-primary">{order.warehouse?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Evidence Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${hasEvidence(order) ? 'text-emerald-400 hover:text-emerald-300' : 'text-muted-foreground'}`}
                        onClick={(e) => openEvidenceModal(order, e)}
                        title={hasEvidence(order) ? 'Ver evidencias' : 'Sin evidencias'}
                      >
                        <Camera className="h-4 w-4" />
                        {hasEvidence(order) && (
                          <span className="ml-1 text-xs">
                            {(order.order_payments?.filter(p => p.evidence_url).length || 0) +
                              (order.payment_evidence_url ? 1 : 0) +
                              (order.delivery_photo_url ? 1 : 0)}
                          </span>
                        )}
                      </Button>

                      <div className="text-right">
                        <div className="font-bold">${order.total.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {PAYMENT_TYPE_LABELS[order.payment_type]}
                        </div>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <Badge
                          variant="outline"
                          className={ORDER_STATUS_COLORS[order.status]}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(order.created_at), {
                            addSuffix: true,
                            locale: es
                          })}
                        </div>
                      </div>

                      {onDeleteOrder && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <SuperAdminDeleteButton
                            onDelete={() => handleDelete(order)}
                            itemName={`Pedido #${order.order_number}`}
                            itemType="pedido"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">
                    {((safeCurrentPage - 1) * pageSize) + 1}–{Math.min(safeCurrentPage * pageSize, orders.length)} de {orders.length} pedidos
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safeCurrentPage <= 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">{safeCurrentPage} / {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safeCurrentPage >= totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <EvidenceModal
        isOpen={showEvidence}
        onClose={() => setShowEvidence(false)}
        order={selectedOrder}
      />

      <OrderDetailModal
        order={selectedOrder}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
}
