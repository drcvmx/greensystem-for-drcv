import React, { useState, useMemo } from 'react';
import { PaginatedOrderGrid } from '@/components/shared/PaginatedOrderGrid';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, useDrivers, useWarehouses } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { DateFilter, DateFilterValue, filterOrdersByDate, getDateFilterDescription } from './shared/DateFilter';
import {
  Package,
  CheckCircle,
  Truck,
  Clock,
  AlertTriangle,
  User,
  Car,
  Send,
  Info,
  Warehouse as WarehouseIcon,
  Filter,
  X,
  Calendar,
  Camera,
  DollarSign,
  Eye
} from 'lucide-react';
import { Order, OrderItem, OrderStatus } from '@/types/orders';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface BodegaDashboardProps {
  isAdmin?: boolean;
  readOnly?: boolean;
}

export function BodegaDashboard({ isAdmin = false, readOnly = false }: BodegaDashboardProps) {
  const { user, userRole } = useAuth();
  const { warehouses } = useWarehouses();

  // Filter state - only used in admin mode
  const [filterWarehouseId, setFilterWarehouseId] = useState<string | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('today');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);

  // In admin mode, don't filter by warehouse at query level (or use filter)
  const queryWarehouseId = isAdmin ? filterWarehouseId : (userRole?.warehouse_id || undefined);

  // Single query for ALL relevant statuses, filter locally
  // Pass userRole for role-based throttling and warehouse filtering
  const { orders: allOrders, updateOrderStatus, refetch } = useOrders({
    warehouseId: queryWarehouseId,
    status: ['validated', 'in_preparation', 'ready_for_dispatch', 'assigned_to_driver', 'in_transit', 'delivered'],
    realtime: true,
    limit: undefined,
    userRole: userRole?.role
  });

  // Apply date filter first, then status filter
  const dateFilteredOrders = useMemo(() =>
    filterOrdersByDate(allOrders, dateFilter, 'created_at', customDateRange),
    [allOrders, dateFilter, customDateRange]
  );

  // Local filtering by status - no extra query!
  const pendingOrders = useMemo(() =>
    dateFilteredOrders.filter(o => ['validated', 'in_preparation', 'ready_for_dispatch', 'assigned_to_driver'].includes(o.status)),
    [dateFilteredOrders]
  );
  const inTransitOrders = useMemo(() => dateFilteredOrders.filter(o => o.status === 'in_transit'), [dateFilteredOrders]);

  // Pickup orders delivered in-store (by bodega)
  const pickupDeliveredOrders = useMemo(() =>
    dateFilteredOrders.filter(o => o.status === 'delivered' && o.delivery_type === 'pickup'),
    [dateFilteredOrders]
  );

  // Drivers based on selected warehouse (or all in admin mode without filter)
  const { drivers } = useDrivers(queryWarehouseId);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [uberPlate, setUberPlate] = useState('');
  const [uberPhoto, setUberPhoto] = useState<File | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'uber' | 'internal_driver'>('internal_driver');
  const [processing, setProcessing] = useState(false);

  // Pickup delivery state
  const [pickupOrder, setPickupOrder] = useState<Order | null>(null);
  const [pickupPhoto, setPickupPhoto] = useState<File | null>(null);
  const [pickupPhotoPreview, setPickupPhotoPreview] = useState<string | null>(null);

  // View-only detail modal (for delivered orders)
  const [viewDetailOrder, setViewDetailOrder] = useState<Order | null>(null);

  // Pre-filter available drivers with useMemo
  const availableDrivers = useMemo(
    () => drivers.filter(d => d.is_available),
    [drivers]
  );

  // Get order items from selected order (pre-loaded in query)
  const orderItems = useMemo(
    () => (selectedOrder as any)?.order_items || [],
    [selectedOrder]
  );

  const validatedOrders = pendingOrders.filter(o => o.status === 'validated');
  const preparingOrders = pendingOrders.filter(o => o.status === 'in_preparation');
  const readyOrders = pendingOrders.filter(o => o.status === 'ready_for_dispatch');
  const assignedOrders = pendingOrders.filter(o => o.status === 'assigned_to_driver');

  const handleAcceptOrder = async (order: Order) => {
    setProcessing(true);
    try {
      await updateOrderStatus(order.id, 'in_preparation');
      toast({ title: 'Pedido Aceptado', description: `Iniciando preparación de #${order.order_number}` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkReady = async (order: Order) => {
    setProcessing(true);
    try {
      await updateOrderStatus(order.id, 'ready_for_dispatch');
      toast({ title: 'Pedido Listo', description: `#${order.order_number} listo para despacho` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedOrder) return;

    if (deliveryMethod === 'internal_driver' && !selectedDriver) {
      toast({ variant: 'destructive', title: 'Error', description: 'Selecciona un chofer' });
      return;
    }

    if (deliveryMethod === 'uber' && !uberPlate) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ingresa las placas del Uber' });
      return;
    }

    setProcessing(true);
    try {
      let uberPhotoUrl = null;

      if (deliveryMethod === 'uber' && uberPhoto) {
        // Mock upload for demo: use object URL
        uberPhotoUrl = URL.createObjectURL(uberPhoto);
      }

      await updateOrderStatus(selectedOrder.id, 'assigned_to_driver', {
        delivery_method: deliveryMethod,
        driver_id: deliveryMethod === 'internal_driver' ? selectedDriver : null,
        uber_plate: deliveryMethod === 'uber' ? uberPlate : null,
        uber_photo_url: uberPhotoUrl,
      });

      toast({
        title: 'Chofer Asignado',
        description: `Pedido #${selectedOrder.order_number} asignado`
      });
      setSelectedOrder(null);
      setSelectedDriver('');
      setUberPlate('');
      setUberPhoto(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleDispatch = async (order: Order) => {
    setProcessing(true);
    try {
      await updateOrderStatus(order.id, 'in_transit');
      toast({ title: 'Pedido Despachado', description: `#${order.order_number} en camino` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  // Handle pickup photo selection
  const handlePickupPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Formato no válido', description: 'Solo JPG, PNG o WEBP' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'Archivo muy grande', description: 'Máximo 5MB' });
      return;
    }

    setPickupPhoto(file);
    setPickupPhotoPreview(URL.createObjectURL(file));
  };

  // Handle pickup delivery confirmation
  const handlePickupDelivery = async () => {
    if (!pickupOrder || !pickupPhoto) {
      toast({ variant: 'destructive', title: 'Error', description: 'Toma una foto de la entrega' });
      return;
    }

    setProcessing(true);
    try {
      // Mock upload for demo: use object URL
      const deliveryPhotoUrl = URL.createObjectURL(pickupPhoto);

      // Update order to delivered with photo
      await updateOrderStatus(pickupOrder.id, 'delivered', {
        delivery_photo_url: deliveryPhotoUrl,
      });

      toast({
        title: 'Entrega Confirmada',
        description: `Pedido #${pickupOrder.order_number} entregado en tienda`
      });

      // Reset state
      setPickupOrder(null);
      setPickupPhoto(null);
      if (pickupPhotoPreview) URL.revokeObjectURL(pickupPhotoPreview);
      setPickupPhotoPreview(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const totalQuantity = (items: OrderItem[]) => items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Admin Mode Banner */}
      {isAdmin && (
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-400">
            <strong>Modo Administrador:</strong> Mostrando pedidos de {filterWarehouseId ? 'la bodega seleccionada' : 'todas las bodegas'}.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Filter */}
            <DateFilter
              value={dateFilter}
              onChange={setDateFilter}
              compact
              showCustomRange={isAdmin}
              customRange={customDateRange}
              onCustomRangeChange={setCustomDateRange}
            />

            {/* Warehouse Filter - Only in Admin Mode */}
            {isAdmin && (
              <>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                </div>

                <Select value={filterWarehouseId || 'all'} onValueChange={(v) => setFilterWarehouseId(v === 'all' ? undefined : v)}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <WarehouseIcon className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue placeholder="Todas las bodegas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las bodegas</SelectItem>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {filterWarehouseId && (
                  <Button variant="ghost" size="sm" onClick={() => setFilterWarehouseId(undefined)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </>
            )}

            <div className="ml-auto text-sm text-muted-foreground">
              {getDateFilterDescription(dateFilter)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-400">{validatedOrders.length}</div>
                <div className="text-xs text-muted-foreground">Nuevos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-400">{preparingOrders.length}</div>
                <div className="text-xs text-muted-foreground">Preparando</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold text-cyan-400">{readyOrders.length}</div>
                <div className="text-xs text-muted-foreground">Listos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              <div>
                <div className="text-2xl font-bold text-indigo-400">{assignedOrders.length}</div>
                <div className="text-xs text-muted-foreground">Asignados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-orange-400">{inTransitOrders.length}</div>
                <div className="text-xs text-muted-foreground">En Ruta</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="w-full flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="new" className="flex-1 min-w-0 gap-1.5">
            <span className="truncate">Nuevos</span>
            {validatedOrders.length > 0 && (
              <span className="h-5 min-w-5 px-1 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                {validatedOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="preparing" className="flex-1 min-w-0">
            <span className="truncate">Preparando</span>
          </TabsTrigger>
          <TabsTrigger value="ready" className="flex-1 min-w-0">
            <span className="truncate">Listos</span>
          </TabsTrigger>
          <TabsTrigger value="assigned" className="flex-1 min-w-0">
            <span className="truncate">Asignados</span>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex-1 min-w-0 gap-1.5">
            <span className="truncate">Entregados</span>
            {pickupDeliveredOrders.length > 0 && (
              <span className="h-5 min-w-5 px-1 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                {pickupDeliveredOrders.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* New Orders */}
        <TabsContent value="new" className="space-y-4">
          {validatedOrders.length === 0 ? (
            <Card className="card-premium">
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground">No hay pedidos nuevos</div>
              </CardContent>
            </Card>
          ) : (
            <PaginatedOrderGrid
              orders={validatedOrders}
              pageSize={12}
              totalLabel="pedidos nuevos"
              renderItem={(order) => (
                <React.Fragment key={order.id}>
                  <OrderCard order={order} onClick={() => setSelectedOrder(order)}>
                    <Button
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptOrder(order);
                      }}
                      disabled={processing}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aceptar Pedido
                    </Button>
                  </OrderCard>
                </React.Fragment>
              )}
            />
          )}
        </TabsContent>

        {/* Preparing */}
        <TabsContent value="preparing" className="space-y-4">
          {preparingOrders.length === 0 ? (
            <Card className="card-premium">
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground">No hay pedidos en preparación</div>
              </CardContent>
            </Card>
          ) : (
            <PaginatedOrderGrid
              orders={preparingOrders}
              pageSize={12}
              totalLabel="pedidos en preparación"
              renderItem={(order) => (
                <React.Fragment key={order.id}>
                  <OrderCard order={order} onClick={() => setSelectedOrder(order)}>
                    <Button
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkReady(order);
                      }}
                      disabled={processing}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Marcar como Surtido
                    </Button>
                  </OrderCard>
                </React.Fragment>
              )}
            />
          )}
        </TabsContent>

        {/* Ready */}
        <TabsContent value="ready" className="space-y-4">
          {readyOrders.length === 0 ? (
            <Card className="card-premium">
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground">No hay pedidos listos para despacho</div>
              </CardContent>
            </Card>
          ) : (
            <PaginatedOrderGrid
              orders={readyOrders}
              pageSize={12}
              totalLabel="pedidos listos"
              renderItem={(order) => (
                <React.Fragment key={order.id}>
                  <OrderCard order={order}>
                    <div className="mt-3 space-y-2">
                      {order.delivery_type === 'pickup' ? (
                        <div className="space-y-2">
                          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-emerald-400 text-xs text-center">
                            Recoger en Tienda
                          </div>
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => setPickupOrder(order)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar Entrega
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedOrder(order);
                            setDeliveryMethod('internal_driver');
                          }}
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Asignar Transporte
                        </Button>
                      )}
                    </div>
                  </OrderCard>
                </React.Fragment>
              )}
            />
          )}
        </TabsContent>

        {/* Assigned */}
        <TabsContent value="assigned" className="space-y-4">
          {assignedOrders.length === 0 ? (
            <Card className="card-premium">
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground">No hay pedidos asignados</div>
              </CardContent>
            </Card>
          ) : (
            <PaginatedOrderGrid
              orders={assignedOrders}
              pageSize={12}
              totalLabel="pedidos asignados"
              renderItem={(order) => (
                <React.Fragment key={order.id}>
                  <OrderCard order={order}>
                    <div className="mt-3 space-y-2">
                      {order.driver && (
                        <div className="text-sm text-muted-foreground">
                          Chofer: <span className="text-foreground font-medium">{order.driver.name}</span>
                        </div>
                      )}
                      {order.uber_plate && (
                        <div className="text-sm text-muted-foreground">
                          Uber: <span className="text-foreground font-medium">{order.uber_plate}</span>
                        </div>
                      )}
                      <Button
                        className="w-full"
                        onClick={() => handleDispatch(order)}
                        disabled={processing}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Marcar Salida
                      </Button>
                    </div>
                  </OrderCard>
                </React.Fragment>
              )}
            />
          )}
        </TabsContent>

        {/* Delivered Pickup Orders */}
        <TabsContent value="delivered" className="space-y-4">
          {pickupDeliveredOrders.length === 0 ? (
            <Card className="card-premium">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground">No hay entregas en tienda registradas</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                Entregas en Tienda ({pickupDeliveredOrders.length})
              </div>
              <PaginatedOrderGrid
                orders={pickupDeliveredOrders}
                pageSize={12}
                totalLabel="entregas en tienda"
                renderItem={(order) => (
                  <Card
                    key={order.id}
                    className="card-premium border-emerald-500/30 bg-emerald-500/5 cursor-pointer hover:border-emerald-500/50 transition-colors"
                    onClick={() => setViewDetailOrder(order)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">#{order.order_number}</span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              ENTREGADO
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate">{order.customer?.name}</span>
                            <span className="text-xs text-muted-foreground">({order.customer?.customer_code})</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {order.delivered_at
                                ? formatDistanceToNow(new Date(order.delivered_at), { addSuffix: true, locale: es })
                                : 'N/A'
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-emerald-400 font-medium">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>${order.total.toLocaleString()}</span>
                          </div>

                          {/* Click hint */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                            <Eye className="h-3 w-3" />
                            <span>Click para ver detalles</span>
                          </div>
                        </div>

                        {/* Delivery Photo */}
                        {order.delivery_photo_url && (
                          <div className="shrink-0">
                            <img
                              src={order.delivery_photo_url}
                              alt="Evidencia de entrega"
                              className="w-20 h-20 object-cover rounded-lg border-2 border-emerald-500/50"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Detail / Assign Driver Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Pedido #{selectedOrder?.order_number}
              {orderItems.length > 0 && totalQuantity(orderItems) >= 2 && (
                <span className="ml-2 text-amber-400 text-sm">
                  ⚠️ {totalQuantity(orderItems)} piezas
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Items */}
              <div className="space-y-2">
                <Label>Productos a Surtir</Label>
                <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                  {orderItems.map(item => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground">{item.product_category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">×{item.quantity}</div>
                        <div className="text-sm text-muted-foreground">${item.subtotal.toFixed(0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assign Driver (only for ready orders with delivery) */}
              {selectedOrder.status === 'ready_for_dispatch' && selectedOrder.delivery_type === 'delivery' && (
                <div className="space-y-4 pt-4 border-t">
                  <Label>Asignar Transporte</Label>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={deliveryMethod === 'internal_driver' ? 'default' : 'outline'}
                      onClick={() => setDeliveryMethod('internal_driver')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Chofer Interno
                    </Button>
                    <Button
                      variant={deliveryMethod === 'uber' ? 'default' : 'outline'}
                      onClick={() => setDeliveryMethod('uber')}
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Uber
                    </Button>
                  </div>

                  {deliveryMethod === 'internal_driver' && (
                    <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar chofer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDrivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - {driver.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {deliveryMethod === 'uber' && (
                    <div className="space-y-3">
                      <div>
                        <Label>Placas del Vehículo *</Label>
                        <Input
                          placeholder="ABC-123"
                          value={uberPlate}
                          onChange={(e) => setUberPlate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Foto del Vehículo (opcional)</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setUberPhoto(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleAssignDriver}
                    disabled={processing}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Asignar y Continuar
                  </Button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-4">
                {selectedOrder.status === 'validated' && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleAcceptOrder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    disabled={processing}
                  >
                    Aceptar Pedido
                  </Button>
                )}
                {selectedOrder.status === 'in_preparation' && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleMarkReady(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    disabled={processing}
                  >
                    Marcar como Surtido
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pickup Delivery Dialog */}
      <Dialog open={!!pickupOrder} onOpenChange={(open) => {
        if (!open) {
          setPickupOrder(null);
          setPickupPhoto(null);
          if (pickupPhotoPreview) URL.revokeObjectURL(pickupPhotoPreview);
          setPickupPhotoPreview(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Confirmar Entrega en Tienda
            </DialogTitle>
          </DialogHeader>

          {pickupOrder && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Pedido</div>
                <div className="text-lg font-bold">#{pickupOrder.order_number}</div>
                <div className="text-sm">
                  {pickupOrder.customer?.name} ({pickupOrder.customer?.customer_code})
                </div>
                <div className="text-lg font-semibold text-primary mt-2">
                  ${pickupOrder.total.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Foto de Entrega (Obligatoria)
                </Label>

                <div className="flex flex-col gap-3">
                  {pickupPhotoPreview ? (
                    <div className="relative">
                      <img
                        src={pickupPhotoPreview}
                        alt="Evidencia de entrega"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPickupPhoto(null);
                          URL.revokeObjectURL(pickupPhotoPreview);
                          setPickupPhotoPreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                      <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Toma foto del cliente recibiendo el pedido
                      </p>
                      <Label className="cursor-pointer">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          capture="environment"
                          className="hidden"
                          onChange={handlePickupPhotoChange}
                        />
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                          <Camera className="h-4 w-4" />
                          Tomar Foto
                        </div>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPickupOrder(null);
                    setPickupPhoto(null);
                    if (pickupPhotoPreview) URL.revokeObjectURL(pickupPhotoPreview);
                    setPickupPhotoPreview(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handlePickupDelivery}
                  disabled={!pickupPhoto || processing}
                >
                  {processing ? (
                    <>Procesando...</>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Entrega
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View-only Order Detail Modal */}
      <OrderDetailModal
        order={viewDetailOrder}
        open={!!viewDetailOrder}
        onOpenChange={(open) => !open && setViewDetailOrder(null)}
      />
    </div>
  );
}
