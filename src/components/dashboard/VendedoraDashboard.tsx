import React, { useState, useMemo } from 'react';
import { PaginatedOrderGrid } from '@/components/shared/PaginatedOrderGrid';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, useStores, useCustomers } from '@/hooks/useOrders';
import { demoStorage } from '@/lib/demoStorage';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { MultiplePayments } from './vendedora/MultiplePayments';
import { ManualProductEntry } from './vendedora/ManualProductEntry';
import { StoreManager } from './vendedora/StoreWarehouseManager';
import { BosqueRealWarehouseSelector, BOSQUE_REAL_STORE_ID, BODEGA_BOSQUE_REAL_ID, BODEGA_INTERLOMAS_ID } from './vendedora/BosqueRealWarehouseSelector';
import { DateFilter, DateFilterValue, filterOrdersByDate, getDateFilterDescription } from './shared/DateFilter';
import { Plus, Search, Package, User, MapPin, Truck, Pencil, Trash2, Info, Store, Filter, X, Calendar } from 'lucide-react';
import { DeliveryType, PaymentType, PaymentEntry, ManualCartItem, Order } from '@/types/orders';
import { OrderSearchFilter, filterOrdersBySearch } from './shared/OrderSearchFilter';

interface VendedoraDashboardProps {
  isAdmin?: boolean;
  readOnly?: boolean;
}

export function VendedoraDashboard({ isAdmin = false, readOnly = false }: VendedoraDashboardProps) {
  const { user, userRole } = useAuth();

  // Filter state - only used in admin mode
  const [filterStoreId, setFilterStoreId] = useState<string | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('today');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<PaymentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pass userRole for role-based throttling and store filtering
  // In admin mode, don't filter by store at query level
  const { orders, loading: ordersLoading, refetch } = useOrders({
    realtime: true,
    storeId: isAdmin ? undefined : (userRole?.store_id || undefined),
    userRole: userRole?.role
  });
  const { stores, refetch: refetchStores } = useStores();
  const { customers, createCustomer, refetch: refetchCustomers } = useCustomers();

  // Filter orders locally (by store, date, payment type, and search)
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by store in admin mode
    if (isAdmin && filterStoreId) {
      result = result.filter(o => o.store_id === filterStoreId);
    }

    // Apply date filter
    result = filterOrdersByDate(result, dateFilter, 'created_at', customDateRange);

    // Apply payment type filter
    if (paymentFilter !== 'all') {
      result = result.filter(o => o.payment_type === paymentFilter);
    }

    // Apply search
    result = filterOrdersBySearch(result, searchQuery);

    return result;
  }, [orders, filterStoreId, isAdmin, dateFilter, customDateRange, paymentFilter, searchQuery]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Form state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [cartItems, setCartItems] = useState<ManualCartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // For Bosque Real: track explicitly selected warehouse
  const [bosqueRealWarehouseId, setBosqueRealWarehouseId] = useState<string>('');
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);

  // New customer form
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  // Get selected store's warehouse
  // Special logic for Bosque Real: user selects warehouse, delivery type follows
  const selectedStore = stores.find(s => s.id === selectedStoreId);
  const isBosqueReal = selectedStoreId === BOSQUE_REAL_STORE_ID;

  // For Bosque Real: use explicitly selected warehouse; for others: use store's warehouse
  const warehouseId = isBosqueReal
    ? bosqueRealWarehouseId
    : selectedStore?.warehouse_id || '';

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.customer_code.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    (c.phone && c.phone.includes(searchCustomer))
  );


  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const paymentsTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const isPaymentBalanced = Math.abs(paymentsTotal - cartTotal) < 0.01;

  const resetForm = () => {
    setSelectedCustomerId('');
    setSelectedStoreId('');
    setPayments([]);
    setCartItems([]);
    setDeliveryType('pickup');
    setDeliveryAddress('');
    setDeliveryNotes('');
    setEditingOrder(null);
    setBosqueRealWarehouseId('');
  };

  const handleCreateCustomer = async () => {
    try {
      const newCustomer = await createCustomer({
        name: newCustomerName,
        phone: newCustomerPhone || undefined,
        email: newCustomerEmail || undefined,
        address: newCustomerAddress || undefined,
      });
      setSelectedCustomerId(newCustomer.id);
      setIsNewCustomerOpen(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewCustomerEmail('');
      setNewCustomerAddress('');
      toast({ title: 'Cliente creado', description: `Código: ${newCustomer.customer_code}` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const loadOrderForEdit = async (order: Order) => {
    setLoadingOrderItems(true);
    try {
      // Load order data with relations from demoStorage
      const fullOrder = demoStorage.getOrdersWithRelations().find(o => o.id === order.id);

      if (!fullOrder) throw new Error('Pedido no encontrado');

      // Convert to ManualCartItem format
      const cartItemsFromOrder: ManualCartItem[] = (fullOrder.order_items || []).map((item: any) => ({
        id: item.id,
        reference: item.product_name,
        price: Number(item.unit_price),
        quantity: item.quantity,
      }));

      // Load payments
      const orderPayments = fullOrder.order_payments || [];
      const paymentsFromOrder: PaymentEntry[] = orderPayments.map((p: any) => ({
        id: p.id,
        type: p.payment_type,
        amount: Number(p.amount),
        evidenceFile: null,
        evidenceFiles: [],
        existingEvidenceUrl: p.evidence_url || undefined,
        existingEvidenceUrls: p.evidence_urls?.length ? p.evidence_urls : (p.evidence_url ? [p.evidence_url] : []),
      }));

      // Set form state
      setSelectedCustomerId(fullOrder.customer_id);
      setSelectedStoreId(fullOrder.store_id);
      setCartItems(cartItemsFromOrder);
      setPayments(paymentsFromOrder.length > 0 ? paymentsFromOrder : []);
      setDeliveryType(fullOrder.delivery_type);
      setDeliveryAddress(fullOrder.delivery_address || '');
      setDeliveryNotes(fullOrder.delivery_notes || '');
      setEditingOrder(fullOrder);

      // For Bosque Real: set the warehouse from the order
      if (fullOrder.store_id === BOSQUE_REAL_STORE_ID) {
        setBosqueRealWarehouseId(fullOrder.warehouse_id);
      }

      setIsCreateOpen(true);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar el pedido' });
    } finally {
      setLoadingOrderItems(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedCustomerId || !selectedStoreId || cartItems.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Completa todos los campos requeridos' });
      return;
    }

    // Bosque Real requires warehouse selection
    if (isBosqueReal && !bosqueRealWarehouseId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Selecciona la bodega destino para Bosque Real' });
      return;
    }

    if (payments.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Selecciona al menos una forma de pago' });
      return;
    }

    if (!isPaymentBalanced) {
      toast({ variant: 'destructive', title: 'Error', description: 'El total de pagos debe igualar el total del carrito' });
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ingresa la dirección de entrega' });
      return;
    }

    setSubmitting(true);
    try {
      const isEditing = !!editingOrder;

      // Determine status - cash only goes straight to validated
      const hasCashOnly = payments.every(p => p.type === 'cash');
      const newStatus = hasCashOnly ? 'validated' : 'pending_validation';

      // Main payment type for the order
      const mainPaymentType = payments[0].type;

      let orderRecord: any;

      if (isEditing) {
        // UPDATE existing order
        orderRecord = demoStorage.update('orders', editingOrder.id, {
          customer_id: selectedCustomerId,
          store_id: selectedStoreId,
          warehouse_id: warehouseId,
          status: newStatus,
          payment_type: mainPaymentType,
          subtotal: cartTotal,
          total: cartTotal,
          delivery_type: deliveryType,
          delivery_address: deliveryType === 'delivery' ? deliveryAddress : null,
          delivery_notes: deliveryNotes || null,
          validated_at: hasCashOnly ? new Date().toISOString() : null,
        });

        // Delete old items and payments
        demoStorage.deleteWhere('order_items', 'order_id', editingOrder.id);
        demoStorage.deleteWhere('order_payments', 'order_id', editingOrder.id);

      } else {
        // CREATE new order
        const orderCount = demoStorage.getAll('orders').length;
        orderRecord = demoStorage.insert('orders', {
          order_number: 1000 + orderCount + 1,
          customer_id: selectedCustomerId,
          store_id: selectedStoreId,
          warehouse_id: warehouseId,
          created_by: user?.id,
          status: newStatus,
          payment_type: mainPaymentType,
          subtotal: cartTotal,
          total: cartTotal,
          delivery_type: deliveryType,
          delivery_address: deliveryType === 'delivery' ? deliveryAddress : null,
          delivery_notes: deliveryNotes || null,
          validated_at: hasCashOnly ? new Date().toISOString() : null,
        });
      }

      const orderId = orderRecord.id;

      // Create order items
      cartItems.forEach(item => {
        demoStorage.insert('order_items', {
          order_id: orderId,
          variant_id: null,
          product_name: item.reference,
          product_category: null,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
        });
      });

      // Create order payments
      payments.forEach(payment => {
        // In demo, we just simulate the evidence URLs
        const dummyEvidenceUrls = [];
        if (payment.type === 'transfer' || payment.type === 'payment_link') {
          dummyEvidenceUrls.push(`https://demo-storage.com/evidence/${orderId}-${payment.type}.jpg`);
        }

        demoStorage.insert('order_payments', {
          order_id: orderId,
          payment_type: payment.type,
          amount: payment.amount,
          evidence_url: dummyEvidenceUrls[0] || null,
          evidence_urls: dummyEvidenceUrls,
        });
      });

      // Add timeline entry
      demoStorage.insert('order_timeline', {
        order_id: orderId,
        to_status: newStatus,
        changed_by: user?.id,
        notes: isEditing ? 'Pedido editado (Demo)' : 'Pedido creado (Demo)',
      });

      toast({
        title: isEditing ? 'Pedido actualizado' : 'Pedido creado',
        description: `Pedido #${orderRecord.order_number}`
      });

      // Reset form
      setIsCreateOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      demoStorage.delete('orders', orderId);
      demoStorage.deleteWhere('order_items', 'order_id', orderId);
      demoStorage.deleteWhere('order_payments', 'order_id', orderId);
      demoStorage.deleteWhere('order_timeline', 'order_id', orderId);

      toast({ title: 'Pedido eliminado' });
      refetch();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  // In admin mode, use all filtered orders; otherwise filter to user's own orders
  const displayOrders = isAdmin ? filteredOrders : filteredOrders.filter(o => o.created_by === user?.id);

  return (
    <div className="space-y-6">
      {/* Admin Mode Banner */}
      {isAdmin && (
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-400">
            <strong>Modo Administrador:</strong> Mostrando pedidos de todas las tiendas.
          </AlertDescription>
        </Alert>
      )}

      {/* Store Filter - Only in Admin Mode */}
      {isAdmin && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filtrar por:</span>
              </div>

              <Select value={filterStoreId || 'all'} onValueChange={(v) => setFilterStoreId(v === 'all' ? undefined : v)}>
                <SelectTrigger className="w-[250px] bg-background">
                  <Store className="h-4 w-4 mr-2 text-cyan-400" />
                  <SelectValue placeholder="Todas las tiendas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las tiendas</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filterStoreId && (
                <Button variant="ghost" size="sm" onClick={() => setFilterStoreId(undefined)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4 mr-1" />
                  Limpiar filtro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Filter */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <DateFilter
              value={dateFilter}
              onChange={setDateFilter}
              showCustomRange={isAdmin}
              customRange={customDateRange}
              onCustomRangeChange={setCustomDateRange}
            />
            <div className="text-sm text-muted-foreground">
              {getDateFilterDescription(dateFilter, customDateRange)} • {displayOrders.length} pedidos
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
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-primary">{displayOrders.length}</div>
            <div className="text-sm text-muted-foreground">Pedidos</div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-400">
              ${displayOrders.reduce((s, o) => s + o.total, 0).toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">Venta Total</div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-400">
              {displayOrders.filter(o => o.status === 'pending_validation').length}
            </div>
            <div className="text-sm text-muted-foreground">Esperando Validación</div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">
              {displayOrders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-muted-foreground">Entregados</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Order Button */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        if (open) refetchCustomers();
        if (!open) resetForm();
      }}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Pedido
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingOrder ? `Editar Pedido #${editingOrder.order_number}` : 'Crear Nuevo Pedido'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Customer Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, código o teléfono..."
                    value={searchCustomer}
                    onChange={(e) => setSearchCustomer(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Nombre *</Label>
                        <Input value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
                      </div>
                      <div>
                        <Label>Teléfono</Label>
                        <Input value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={newCustomerEmail} onChange={(e) => setNewCustomerEmail(e.target.value)} />
                      </div>
                      <div>
                        <Label>Dirección</Label>
                        <Textarea value={newCustomerAddress} onChange={(e) => setNewCustomerAddress(e.target.value)} />
                      </div>
                      <Button onClick={handleCreateCustomer} disabled={!newCustomerName} className="w-full">
                        Crear Cliente
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {searchCustomer && (
                <div className="max-h-40 overflow-y-auto border rounded-md divide-y bg-background z-50 relative shadow-lg">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      className={`p-3 cursor-pointer hover:bg-muted transition-colors ${selectedCustomerId === customer.id ? 'bg-primary/10 border-l-2 border-primary' : ''}`}
                      onClick={() => {
                        setSelectedCustomerId(customer.id);
                        setSearchCustomer('');
                      }}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.customer_code} • {customer.phone || 'Sin teléfono'}
                        {customer.loyalty_points > 0 && (
                          <span className="ml-2 text-primary">★ {customer.loyalty_points} pts</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomerId && !searchCustomer && (
                <div className="p-3 bg-primary/10 rounded-md border border-primary/30">
                  <div className="font-medium">{customers.find(c => c.id === selectedCustomerId)?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {customers.find(c => c.id === selectedCustomerId)?.customer_code}
                  </div>
                </div>
              )}
            </div>

            {/* Store Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Tienda
              </Label>
              <StoreManager
                selectedStoreId={selectedStoreId}
                onStoreChange={(id) => {
                  setSelectedStoreId(id);
                  // Reset Bosque Real warehouse when store changes
                  if (id !== BOSQUE_REAL_STORE_ID) {
                    setBosqueRealWarehouseId('');
                  }
                }}
              />
            </div>

            {/* Products - Manual Entry */}
            <ManualProductEntry
              items={cartItems}
              onItemsChange={setCartItems}
            />

            {/* Payment - Multiple Methods */}
            <MultiplePayments
              payments={payments}
              onPaymentsChange={setPayments}
              cartTotal={cartTotal}
            />

            {/* Delivery Type - Special handling for Bosque Real */}
            {isBosqueReal ? (
              // Bosque Real: User selects warehouse, delivery type follows automatically
              <div className="space-y-3">
                <BosqueRealWarehouseSelector
                  selectedWarehouseId={bosqueRealWarehouseId}
                  onWarehouseChange={setBosqueRealWarehouseId}
                  onDeliveryTypeChange={setDeliveryType}
                  deliveryType={deliveryType}
                />

                {deliveryType === 'delivery' && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección de Entrega *
                    </Label>
                    <Textarea
                      placeholder="Calle, número, colonia, referencias..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label>Notas adicionales</Label>
                  <Textarea
                    placeholder="Instrucciones especiales..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              // Standard stores: User selects delivery type normally
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Tipo de Entrega
                </Label>
                <RadioGroup value={deliveryType} onValueChange={(v) => setDeliveryType(v as DeliveryType)}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer flex-1">🏪 Recoger en Tienda</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted cursor-pointer">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="cursor-pointer flex-1">🚚 Envío a Domicilio</Label>
                    </div>
                  </div>
                </RadioGroup>

                {deliveryType === 'delivery' && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección de Entrega *
                    </Label>
                    <Textarea
                      placeholder="Calle, número, colonia, referencias..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label>Notas adicionales</Label>
                  <Textarea
                    placeholder="Instrucciones especiales..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmitOrder}
              disabled={submitting || loadingOrderItems || !selectedCustomerId || !selectedStoreId || cartItems.length === 0 || !isPaymentBalanced}
              className="w-full"
              size="lg"
            >
              {submitting
                ? (editingOrder ? 'Guardando...' : 'Creando...')
                : (editingOrder
                  ? `Guardar Cambios - $${cartTotal.toFixed(2)}`
                  : `Crear Pedido - $${cartTotal.toFixed(2)}`)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Orders Grid */}
      <PaginatedOrderGrid
        orders={displayOrders}
        loading={ordersLoading}
        onOrderClick={setSelectedOrderForDetail}
        onEditClick={loadOrderForEdit}
        onDeleteClick={handleDeleteOrder}
        readOnly={readOnly}
      />

      {/* Details Modal */}
      {selectedOrderForDetail && (
        <OrderDetailModal
          order={selectedOrderForDetail}
          open={!!selectedOrderForDetail}
          onOpenChange={(open) => !open && setSelectedOrderForDetail(null)}
          onStatusUpdate={refetch}
        />
      )}
    </div>
  );
}
