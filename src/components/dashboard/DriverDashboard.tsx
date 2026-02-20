import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDriverOrders } from '@/hooks/useDriverOrders';
import { useWarehouses, useStores } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DeliveryConfirmationDialog } from './driver/DeliveryConfirmationDialog';
import { DeliveredOrdersSection } from './driver/DeliveredOrdersSection';
import { DashboardFilters } from './shared/DashboardFilters';
import { DateFilter, DateFilterValue, filterOrdersByDate, getDateFilterDescription } from './shared/DateFilter';
import {
  Truck, MapPin, Phone, DollarSign, CheckCircle,
  Navigation, Package, Clock, AlertTriangle, User,
  Banknote, CreditCard, RefreshCw, Info, Camera, Calendar
} from 'lucide-react';
import { Order, ORDER_STATUS_LABELS, PAYMENT_TYPE_LABELS } from '@/types/orders';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DriverDashboardProps {
  isAdmin?: boolean;
  readOnly?: boolean;
}

export function DriverDashboard({ isAdmin = false, readOnly = false }: DriverDashboardProps) {
  const { user, userRole } = useAuth();
  const { warehouses } = useWarehouses();
  const { stores } = useStores();

  // Filter state - only used in admin mode
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(undefined);
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('today');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);

  // Pass userRole for role-based throttling
  const { assignedOrders, inTransitOrders, deliveredOrders, deliveredToday, loading, updateOrderStatus, refetch } = useDriverOrders({
    showAll: isAdmin,
    userRole: userRole?.role
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deliveryConfirmOrder, setDeliveryConfirmOrder] = useState<Order | null>(null);
  const [processing, setProcessing] = useState(false);

  // Format stores for filter component
  const storesForFilter = useMemo(() =>
    stores.map(s => ({ id: s.id, name: s.name, warehouse_id: s.warehouse?.id || '' })),
    [stores]
  );

  // Filter orders based on selected filters (only in admin mode) and date
  const filteredAssignedOrders = useMemo(() => {
    let result = assignedOrders;
    if (isAdmin) {
      if (selectedWarehouseId) result = result.filter(o => o.warehouse_id === selectedWarehouseId);
      if (selectedStoreId) result = result.filter(o => o.store_id === selectedStoreId);
    }
    return filterOrdersByDate(result, dateFilter, 'created_at', customDateRange);
  }, [assignedOrders, selectedWarehouseId, selectedStoreId, isAdmin, dateFilter, customDateRange]);

  const filteredInTransitOrders = useMemo(() => {
    let result = inTransitOrders;
    if (isAdmin) {
      if (selectedWarehouseId) result = result.filter(o => o.warehouse_id === selectedWarehouseId);
      if (selectedStoreId) result = result.filter(o => o.store_id === selectedStoreId);
    }
    return filterOrdersByDate(result, dateFilter, 'created_at', customDateRange);
  }, [inTransitOrders, selectedWarehouseId, selectedStoreId, isAdmin, dateFilter, customDateRange]);

  const filteredDeliveredOrders = useMemo(() => {
    let result = deliveredOrders;
    if (isAdmin) {
      if (selectedWarehouseId) result = result.filter(o => o.warehouse_id === selectedWarehouseId);
      if (selectedStoreId) result = result.filter(o => o.store_id === selectedStoreId);
    }
    // For delivered orders, filter by delivered_at instead of created_at
    return filterOrdersByDate(result, dateFilter, 'delivered_at', customDateRange);
  }, [deliveredOrders, selectedWarehouseId, selectedStoreId, isAdmin, dateFilter, customDateRange]);

  const handleStartRoute = async (order: Order) => {
    setProcessing(true);
    try {
      await updateOrderStatus(order.id, 'in_transit');
      toast({
        title: '¡En Ruta!',
        description: `Pedido #${order.order_number} - Dirígete a la dirección`
      });
      setSelectedOrder(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmDelivery = async (orderId: string, photoUrl: string) => {
    await updateOrderStatus(orderId, 'delivered', photoUrl);
    setSelectedOrder(null);
  };

  const openDeliveryConfirmation = (order: Order) => {
    setDeliveryConfirmOrder(order);
  };

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // All payments are received before dispatch - driver never collects
  const getPaymentMethodLabel = (paymentType: string) => {
    return PAYMENT_TYPE_LABELS[paymentType as keyof typeof PAYMENT_TYPE_LABELS] || paymentType;
  };

  const activeOrders = [...filteredAssignedOrders, ...filteredInTransitOrders];

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Mode Banner */}
      {isAdmin && (
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-400">
            <strong>Modo Administrador:</strong> Mostrando todos los pedidos asignados y en ruta de todos los choferes.
          </AlertDescription>
        </Alert>
      )}

      {/* Date Filter */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Filter with custom range for admins */}
            <DateFilter
              value={dateFilter}
              onChange={setDateFilter}
              compact
              showCustomRange={isAdmin}
              customRange={customDateRange}
              onCustomRangeChange={setCustomDateRange}
            />

            <div className="ml-auto text-sm text-muted-foreground">
              {getDateFilterDescription(dateFilter, customDateRange)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse/Store Filters - Only in Admin Mode */}
      {isAdmin && (
        <DashboardFilters
          warehouses={warehouses}
          stores={storesForFilter}
          selectedWarehouseId={selectedWarehouseId}
          selectedStoreId={selectedStoreId}
          onWarehouseChange={setSelectedWarehouseId}
          onStoreChange={setSelectedStoreId}
        />
      )}

      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="card-premium">
          <CardContent className="pt-4 text-center">
            <Package className="h-6 w-6 mx-auto text-indigo-400" />
            <div className="text-2xl font-bold text-indigo-400 mt-1">{filteredAssignedOrders.length}</div>
            <div className="text-xs text-muted-foreground">Asignados</div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4 text-center">
            <Truck className="h-6 w-6 mx-auto text-orange-400" />
            <div className="text-2xl font-bold text-orange-400 mt-1">{filteredInTransitOrders.length}</div>
            <div className="text-xs text-muted-foreground">En Ruta</div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-emerald-400" />
            <div className="text-2xl font-bold text-emerald-400 mt-1">{filteredDeliveredOrders.length}</div>
            <div className="text-xs text-muted-foreground">Entregados</div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Active Orders */}
      {activeOrders.length === 0 ? (
        <Card className="card-premium">
          <CardContent className="py-12 text-center">
            <Truck className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <div className="text-lg font-medium">Sin entregas pendientes</div>
            <div className="text-muted-foreground">Espera a que te asignen pedidos</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Hoja de Ruta ({activeOrders.length})
          </h3>

          {activeOrders.map((order, index) => (
            <Card
              key={order.id}
              className={`card-premium cursor-pointer transition-all ${order.status === 'in_transit'
                  ? 'border-orange-500/50 bg-orange-500/5'
                  : ''
                }`}
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className="pt-4">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <span className="font-bold text-lg">#{order.order_number}</span>
                      <Badge
                        variant="outline"
                        className={order.status === 'in_transit'
                          ? 'ml-2 bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'ml-2 bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        }
                      >
                        {order.status === 'in_transit' ? 'EN RUTA' : 'ASIGNADO'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* Show driver name in admin mode */}
                    {isAdmin && order.driver && (
                      <div className="text-xs text-muted-foreground mb-1">
                        <Truck className="h-3 w-3 inline mr-1" />
                        {order.driver.name}
                      </div>
                    )}
                    <div className="text-lg font-bold">${order.total.toLocaleString()}</div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{order.customer?.name}</span>
                    <Badge variant="outline" className="text-xs">{order.customer?.customer_code}</Badge>
                  </div>

                  {order.delivery_address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{order.delivery_address}</span>
                    </div>
                  )}

                  {order.customer?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="text-primary underline"
                        onClick={e => e.stopPropagation()}
                      >
                        {order.customer.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Payment Status - Always PAID */}
                <div className="p-3 rounded-lg mb-3 flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/30">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <div>
                    <div className="font-bold text-emerald-400">✅ PAGADO - ${order.total.toLocaleString()}</div>
                    <div className="text-xs text-emerald-400/80">
                      Método: {getPaymentMethodLabel(order.payment_type)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.delivery_address && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoogleMaps(order.delivery_address!);
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Google Maps
                    </Button>
                  )}

                  {order.status === 'assigned_to_driver' && (
                    <Button
                      size="sm"
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRoute(order);
                      }}
                      disabled={processing}
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Iniciar Ruta
                    </Button>
                  )}

                  {order.status === 'in_transit' && (
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeliveryConfirmation(order);
                      }}
                      disabled={processing}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Finalizar Entrega
                    </Button>
                  )}
                </div>

                {/* Delivery Notes */}
                {order.delivery_notes && (
                  <div className="mt-3 p-2 rounded bg-muted/50 text-sm">
                    <span className="text-muted-foreground">Notas: </span>
                    {order.delivery_notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Pedido #{selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Payment Status - Always PAID */}
              <div className="p-4 rounded-lg text-center bg-emerald-500/20 border-2 border-emerald-500">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-400 mb-2" />
                <div className="text-2xl font-bold text-emerald-400">
                  ✅ PAGADO - ${selectedOrder.total.toLocaleString()}
                </div>
                <div className="text-emerald-400/80">
                  Método: {getPaymentMethodLabel(selectedOrder.payment_type)}
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{selectedOrder.customer?.name}</span>
                </div>

                {selectedOrder.customer?.phone && (
                  <a
                    href={`tel:${selectedOrder.customer.phone}`}
                    className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-primary font-medium">{selectedOrder.customer.phone}</span>
                  </a>
                )}

                {selectedOrder.delivery_address && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span>{selectedOrder.delivery_address}</span>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => openGoogleMaps(selectedOrder.delivery_address!)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Abrir en Google Maps
                    </Button>
                  </div>
                )}

                {selectedOrder.delivery_notes && (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground mb-1">Notas de entrega:</div>
                    <div>{selectedOrder.delivery_notes}</div>
                  </div>
                )}
              </div>

              {/* Store/Warehouse Info */}
              <div className="text-sm text-muted-foreground border-t pt-3">
                <div>Tienda: {selectedOrder.store?.name}</div>
                <div>Bodega: {selectedOrder.warehouse?.name}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {selectedOrder.status === 'assigned_to_driver' && (
                  <Button
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    size="lg"
                    onClick={() => handleStartRoute(selectedOrder)}
                    disabled={processing}
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    Iniciar Ruta
                  </Button>
                )}

                {selectedOrder.status === 'in_transit' && (
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    size="lg"
                    onClick={() => {
                      setSelectedOrder(null);
                      openDeliveryConfirmation(selectedOrder);
                    }}
                    disabled={processing}
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Finalizar Entrega
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delivery Confirmation Dialog */}
      <DeliveryConfirmationDialog
        order={deliveryConfirmOrder}
        open={!!deliveryConfirmOrder}
        onOpenChange={(open) => !open && setDeliveryConfirmOrder(null)}
        onConfirm={handleConfirmDelivery}
      />

      {/* Delivered Orders Section - Only visible in admin mode (Super Admin / Consultor) */}
      {isAdmin && filteredDeliveredOrders.length > 0 && (
        <DeliveredOrdersSection
          orders={filteredDeliveredOrders}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
