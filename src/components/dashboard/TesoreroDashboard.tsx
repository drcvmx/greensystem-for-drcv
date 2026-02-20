import React, { useState, useMemo, useCallback } from 'react';
import { PaginatedOrderGrid } from '@/components/shared/PaginatedOrderGrid';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, useWarehouses, useStores } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { OrderCard } from '@/components/orders/OrderCard';
import { DashboardFilters } from './shared/DashboardFilters';
import { DateFilter, DateFilterValue, filterOrdersByDate, getDateFilterDescription } from './shared/DateFilter';
import { CheckCircle, XCircle, Clock, DollarSign, AlertTriangle, Image, RefreshCw, ImageOff, Calendar } from 'lucide-react';
import { Order, PAYMENT_TYPE_LABELS, PaymentType } from '@/types/orders';
import { OrderSearchFilter, filterOrdersBySearch } from './shared/OrderSearchFilter';

// Component for payment evidence image with error handling
function PaymentEvidenceImage({ url, onClick }: { url: string; onClick: () => void }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-muted/50 rounded-lg border border-dashed border-amber-500/50">
        <ImageOff className="h-10 w-10 text-amber-400 mb-2" />
        <span className="text-sm text-amber-400">Imagen no disponible</span>
        <span className="text-xs text-muted-foreground">El archivo fue eliminado del storage</span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <img
        src={url}
        alt="Comprobante"
        className="w-full max-h-64 object-contain bg-black/50 cursor-pointer"
        onClick={onClick}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

interface TesoreroDashboardProps {
  readOnly?: boolean;
}

export function TesoreroDashboard({ readOnly = false }: TesoreroDashboardProps) {
  const { user, userRole } = useAuth();
  const { warehouses, loading: warehousesLoading } = useWarehouses();
  const { stores, loading: storesLoading } = useStores();

  // ALL useState hooks MUST be at the top, before any other hooks
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(undefined);
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('today');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentType | 'all'>('all');

  // Memoize the role to prevent unnecessary re-renders
  const currentRole = userRole?.role;

  // Memoize filter options to prevent unnecessary re-renders
  // Include all post-validation statuses so the history section can show orders
  // that already moved past 'validated' (e.g. in_preparation, delivered, etc.)
  const orderOptions = useMemo(() => ({
    status: [
      'pending_validation',
      'validated',
      'in_preparation',
      'ready_for_dispatch',
      'assigned_to_driver',
      'in_transit',
      'delivered'
    ] as ('pending_validation' | 'validated' | 'in_preparation' | 'ready_for_dispatch' | 'assigned_to_driver' | 'in_transit' | 'delivered')[],
    warehouseId: selectedWarehouseId,
    storeId: selectedStoreId,
    realtime: true,
    limit: undefined,
    userRole: currentRole
  }), [selectedWarehouseId, selectedStoreId, currentRole]);

  // Single query for both statuses, filter locally
  const { orders: allOrders, loading: ordersLoading, updateOrderStatus, refetch } = useOrders(orderOptions);

  // Combined loading state - only show loading when all essential data is loading
  const isInitialLoading = ordersLoading && allOrders.length === 0;

  // Local filtering by status, date, payment type, and search - no extra queries!
  // Tesorero does NOT handle transfer orders
  const orders = useMemo(() => {
    let statusFiltered = allOrders.filter(o => o.status === 'pending_validation' && o.payment_type !== 'cash' && o.payment_type !== 'loyalty_points');
    statusFiltered = filterOrdersByDate(statusFiltered, dateFilter, 'created_at', customDateRange);
    if (paymentFilter !== 'all') {
      statusFiltered = statusFiltered.filter(o => o.payment_type === paymentFilter);
    }
    return filterOrdersBySearch(statusFiltered, searchQuery);
  }, [allOrders, dateFilter, customDateRange, paymentFilter, searchQuery]);

  const validatedOrders = useMemo(() => {
    // Show all orders that were validated by tesorero (have payment_validated_at),
    // regardless of current status — this includes orders already delivered
    let statusFiltered = allOrders.filter(o =>
      o.status !== 'pending_validation' &&
      o.payment_type !== 'cash' &&
      o.payment_type !== 'loyalty_points' &&
      o.payment_validated_at
    );
    statusFiltered = filterOrdersByDate(statusFiltered, dateFilter, 'validated_at', customDateRange);
    if (paymentFilter !== 'all') {
      statusFiltered = statusFiltered.filter(o => o.payment_type === paymentFilter);
    }
    return filterOrdersBySearch(statusFiltered, searchQuery);
  }, [allOrders, dateFilter, customDateRange, paymentFilter, searchQuery]);

  // Handle manual refresh with proper loading state
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // Format stores for filter component
  const storesForFilter = useMemo(() =>
    stores.map(s => ({ id: s.id, name: s.name, warehouse_id: s.warehouse?.id || '' })),
    [stores]
  );

  const handleValidate = async (order: Order) => {
    setProcessing(true);
    try {
      await updateOrderStatus(order.id, 'validated', {
        payment_validated_at: new Date().toISOString(),
        payment_validated_by: user?.id,
      });
      toast({
        title: 'Pago Validado',
        description: `Pedido #${order.order_number} enviado a bodega`
      });
      setSelectedOrder(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder || !rejectionReason) return;

    setProcessing(true);
    try {
      await updateOrderStatus(selectedOrder.id, 'cancelled', {
        cancellation_reason: rejectionReason,
      });
      toast({
        title: 'Pedido Rechazado',
        description: `Pedido #${selectedOrder.order_number} cancelado`
      });
      setSelectedOrder(null);
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const pendingTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const validatedTotal = validatedOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4">
            <DateFilter
              value={dateFilter}
              onChange={setDateFilter}
              compact
              showCustomRange={true}
              customRange={customDateRange}
              onCustomRangeChange={setCustomDateRange}
            />
            <div className="ml-auto text-sm text-muted-foreground">
              {getDateFilterDescription(dateFilter, customDateRange)} • {orders.length + validatedOrders.length} pedidos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Payment Filter */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-3">
          <OrderSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            paymentFilter={paymentFilter}
            onPaymentFilterChange={setPaymentFilter}
            availablePaymentTypes={['transfer', 'payment_link']}
          />
        </CardContent>
      </Card>

      {/* Filters */}
      <DashboardFilters
        warehouses={warehouses}
        stores={storesForFilter}
        selectedWarehouseId={selectedWarehouseId}
        selectedStoreId={selectedStoreId}
        onWarehouseChange={setSelectedWarehouseId}
        onStoreChange={setSelectedStoreId}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-2xl font-bold text-amber-400">{orders.length}</div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-2xl font-bold text-amber-400">${pendingTotal.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Por Validar</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-emerald-400">{validatedOrders.length}</div>
                <div className="text-sm text-muted-foreground">Validados Hoy</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-emerald-400">${validatedTotal.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Confirmado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Pagos Pendientes de Validación
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="ml-2">Actualizar</span>
          </Button>
        </div>

        {isInitialLoading ? (
          <div className="text-muted-foreground">Cargando...</div>
        ) : orders.length === 0 ? (
          <Card className="card-premium">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <div className="text-lg font-medium">¡Todo validado!</div>
              <div className="text-muted-foreground">No hay pagos pendientes de validación</div>
            </CardContent>
          </Card>
        ) : (
          <PaginatedOrderGrid
            orders={orders}
            pageSize={12}
            totalLabel="pedidos pendientes"
            renderItem={(order) => (
              <React.Fragment key={order.id}>
                <OrderCard
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                >
                  {!readOnly && (
                    <div className="pt-3 border-t flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleValidate(order);
                        }}
                        disabled={processing}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Validar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setIsRejectDialogOpen(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </OrderCard>
              </React.Fragment>
            )}
          />
        )}
      </div>

      {/* Validated Orders History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          Historial de Validados
        </h2>

        {validatedOrders.length === 0 ? (
          <Card className="card-premium">
            <CardContent className="py-8 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <div className="text-muted-foreground">No hay pedidos validados en este período</div>
            </CardContent>
          </Card>
        ) : (
          <PaginatedOrderGrid
            orders={validatedOrders}
            pageSize={12}
            totalLabel="pedidos validados"
            renderItem={(order) => (
              <React.Fragment key={order.id}>
                <OrderCard
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Validado</span>
                      {order.payment_validated_at && (
                        <span className="text-muted-foreground ml-auto">
                          {new Date(order.payment_validated_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </OrderCard>
              </React.Fragment>
            )}
          />
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder && !isRejectDialogOpen} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Cliente</div>
                  <div className="font-medium">{selectedOrder.customer?.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedOrder.customer?.customer_code}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold text-primary">${selectedOrder.total.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tienda</div>
                  <div className="font-medium">{selectedOrder.store?.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Bodega</div>
                  <div className="font-medium text-primary">{selectedOrder.warehouse?.name}</div>
                </div>
              </div>

              {/* Payment Details - Multiple Payments */}
              <div className="space-y-3">
                <div className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Formas de Pago
                </div>

                {selectedOrder.order_payments && selectedOrder.order_payments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.order_payments.map((payment, index) => (
                      <div key={payment.id || index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{PAYMENT_TYPE_LABELS[payment.payment_type]}</span>
                          <span className="text-lg font-bold">${payment.amount.toFixed(2)}</span>
                        </div>

                        {/* Cash payment indicator */}
                        {payment.payment_type === 'cash' && (
                          <div className="text-sm text-emerald-400 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Pago en efectivo - No requiere comprobante
                          </div>
                        )}

                        {/* Evidence for transfer/payment_link - multiple images */}
                        {(() => {
                          const urls = payment.evidence_urls?.length
                            ? payment.evidence_urls
                            : (payment.evidence_url ? [payment.evidence_url] : []);
                          return urls.length > 0 ? (
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                Comprobantes ({urls.length})
                              </div>
                              <div className={`grid gap-2 ${urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {urls.map((url: string, idx: number) => (
                                  <React.Fragment key={idx}>
                                    <PaymentEvidenceImage
                                      url={url}
                                      onClick={() => { window.open(url, '_blank'); }}
                                    />
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ) : payment.payment_type !== 'cash' ? (
                            <div className="text-sm text-amber-400 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Sin comprobante adjunto
                            </div>
                          ) : null;
                        })()}
                      </div>
                    ))}
                  </div>
                ) : selectedOrder.payment_evidence_url ? (
                  /* Fallback to legacy payment_evidence_url */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{PAYMENT_TYPE_LABELS[selectedOrder.payment_type]}</span>
                      <span className="text-lg font-bold">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <PaymentEvidenceImage
                      url={selectedOrder.payment_evidence_url}
                      onClick={() => { window.open(selectedOrder.payment_evidence_url!, '_blank'); }}
                    />
                  </div>
                ) : (
                  /* No order_payments and no legacy evidence - show payment type info */
                  <div className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{PAYMENT_TYPE_LABELS[selectedOrder.payment_type]}</span>
                      <span className="text-lg font-bold">${selectedOrder.total.toFixed(2)}</span>
                    </div>

                    {selectedOrder.payment_type === 'cash' ? (
                      <div className="text-sm text-emerald-400 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Pago en efectivo - No requiere comprobante
                      </div>
                    ) : (
                      <div className="text-sm text-amber-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Sin comprobante adjunto
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions - only show if not read-only */}
              {!readOnly && (
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={() => handleValidate(selectedOrder)}
                    disabled={processing}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Validar Pago
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => setIsRejectDialogOpen(true)}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Rechazar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Rechazar Pedido #{selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Motivo del rechazo *</label>
              <Textarea
                placeholder="Ej: Comprobante no coincide con el monto..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectionReason('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
                disabled={!rejectionReason || processing}
              >
                Confirmar Rechazo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
