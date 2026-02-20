import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CheckCircle, MapPin, User, Clock, Image as ImageIcon, 
  Truck, Store, Package, DollarSign, ChevronDown, ChevronUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Order, PAYMENT_TYPE_LABELS } from '@/types/orders';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DeliveredOrdersSectionProps {
  orders: Order[];
  isAdmin?: boolean;
}

export function DeliveredOrdersSection({ orders, isAdmin = false }: DeliveredOrdersSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const pageSize = 12;

  if (orders.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(orders.length / pageSize);
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const start = (safeCurrentPage - 1) * pageSize;
  const displayedOrders = orders.slice(start, start + pageSize);

  const openImageDialog = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageUrl(url);
    setImageDialogOpen(true);
  };

  const formatDeliveryTime = (deliveredAt?: string) => {
    if (!deliveredAt) return 'N/A';
    return formatDistanceToNow(new Date(deliveredAt), { addSuffix: true, locale: es });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          Pedidos Entregados ({orders.length})
        </h3>
      </div>

      <div className="grid gap-3">
        {displayedOrders.map((order) => (
          <Card 
            key={order.id} 
            className="card-premium cursor-pointer transition-all border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
            onClick={() => setSelectedOrder(order)}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">#{order.order_number}</span>
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      ENTREGADO
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      <span className="truncate">{order.customer?.name}</span>
                      <Badge variant="outline" className="text-xs">{order.customer?.customer_code}</Badge>
                    </div>
                    
                    {isAdmin && order.driver && (
                      <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5" />
                        <span>{order.driver.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDeliveryTime(order.delivered_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span className="font-medium text-emerald-400">${order.total.toLocaleString()}</span>
                      <span className="text-xs">({PAYMENT_TYPE_LABELS[order.payment_type as keyof typeof PAYMENT_TYPE_LABELS]})</span>
                    </div>
                  </div>
                </div>
                
                {/* Delivery Photo Thumbnail */}
                <div className="shrink-0">
                  {order.delivery_photo_url ? (
                    <button
                      onClick={(e) => openImageDialog(order.delivery_photo_url!, e)}
                      className="relative group"
                    >
                      <img 
                        src={order.delivery_photo_url} 
                        alt="Evidencia de entrega"
                        className="w-20 h-20 object-cover rounded-lg border-2 border-emerald-500/50 group-hover:border-emerald-400 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon className="h-6 w-6 text-white" />
                      </div>
                    </button>
                  ) : (
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {start + 1}–{Math.min(start + pageSize, orders.length)} de {orders.length}
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

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              Pedido #{selectedOrder?.order_number} - Entregado
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Delivery Evidence Photo */}
              {selectedOrder.delivery_photo_url ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Evidencia de Entrega
                  </h4>
                  <button 
                    onClick={(e) => openImageDialog(selectedOrder.delivery_photo_url!, e)}
                    className="w-full group"
                  >
                    <img 
                      src={selectedOrder.delivery_photo_url} 
                      alt="Evidencia de entrega"
                      className="w-full max-h-64 object-contain rounded-lg border border-border group-hover:border-emerald-400 transition-colors"
                    />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">Sin foto de evidencia</p>
                </div>
              )}

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedOrder.customer?.name}</span>
                  <Badge variant="outline" className="text-xs">{selectedOrder.customer?.customer_code}</Badge>
                </div>

                {isAdmin && selectedOrder.driver && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>Repartidor: <strong>{selectedOrder.driver.name}</strong></span>
                  </div>
                )}

                {selectedOrder.delivery_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{selectedOrder.delivery_address}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.store?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.warehouse?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Entregado {formatDeliveryTime(selectedOrder.delivered_at)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Pagado</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ${selectedOrder.total.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Método: {PAYMENT_TYPE_LABELS[selectedOrder.payment_type as keyof typeof PAYMENT_TYPE_LABELS]}
                </div>
              </div>

              {/* Delivery Notes */}
              {selectedOrder.delivery_notes && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Notas de entrega:</div>
                  <div>{selectedOrder.delivery_notes}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Evidencia de Entrega</DialogTitle>
          </DialogHeader>
          {selectedImageUrl && (
            <img 
              src={selectedImageUrl} 
              alt="Evidencia de entrega"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
