import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useStores, useWarehouses } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Store, Warehouse } from '@/types/orders';
interface StoreManagerProps {
  selectedStoreId: string;
  onStoreChange: (id: string) => void;
}

export function StoreManager({ selectedStoreId, onStoreChange }: StoreManagerProps) {
  const { isSuperAdmin, user, userRole } = useAuth();
  // assignedStoreId is now derived directly from userRole for the demo
  const assignedStoreId = userRole?.store_id || null;
  const loadingAssignment = false; // Demo storage is synchronous
  const { stores, createStore, updateStore, deleteStore } = useStores();
  const { warehouses } = useWarehouses();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  useEffect(() => {
    // Auto-select the assigned store if vendedora has one and nothing is selected
    if (assignedStoreId && !selectedStoreId) {
      onStoreChange(assignedStoreId);
    }
  }, [assignedStoreId, selectedStoreId, onStoreChange]);

  // Filter stores: super_admin sees all, vendedora sees only their assigned store
  const availableStores = isSuperAdmin || !assignedStoreId
    ? stores
    : stores.filter(s => s.id === assignedStoreId);

  // Can manage stores only if super_admin
  const canManageStores = isSuperAdmin;

  const resetForm = () => {
    setName('');
    setAddress('');
    setPhone('');
    setWarehouseId('');
  };

  const handleCreate = async () => {
    if (!name || !warehouseId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Nombre y bodega son requeridos' });
      return;
    }
    try {
      const newStore = await createStore({ name, warehouse_id: warehouseId, address: address || undefined, phone: phone || undefined });
      onStoreChange(newStore.id);
      setIsAddOpen(false);
      resetForm();
      toast({ title: 'Tienda creada' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleUpdate = async () => {
    if (!editingStore || !name) return;
    try {
      await updateStore(editingStore.id, { name, address: address || undefined, phone: phone || undefined });
      setIsEditOpen(false);
      setEditingStore(null);
      resetForm();
      toast({ title: 'Tienda actualizada' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStore(id);
      if (selectedStoreId === id) onStoreChange('');
      toast({ title: 'Tienda eliminada' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const openEdit = (store: Store) => {
    setEditingStore(store);
    setName(store.name);
    setAddress(store.address || '');
    setPhone(store.phone || '');
    setWarehouseId(store.warehouse_id);
    setIsEditOpen(true);
  };

  const selectedStore = stores.find(s => s.id === selectedStoreId);

  // If vendedora has only one store, just show it as text
  if (!isSuperAdmin && assignedStoreId && availableStores.length === 1) {
    const store = availableStores[0];

    return (
      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
        <span className="font-medium">{store.name}</span>
        <span className="text-muted-foreground">→</span>
        <span className="font-medium text-muted-foreground">
          {store.warehouse?.name}
        </span>
      </div>
    );
  }

  if (loadingAssignment) {
    return <div className="p-3 text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select value={selectedStoreId} onValueChange={onStoreChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Seleccionar tienda..." />
          </SelectTrigger>
          <SelectContent>
            {availableStores.map(store => (
              <SelectItem key={store.id} value={store.id}>
                {store.name} → {store.warehouse?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add Store - only for super_admin */}
        {canManageStores && (
          <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Nueva tienda">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva Tienda</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Nombre *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label>Bodega *</Label>
                  <Select value={warehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar bodega..." />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <Button onClick={handleCreate} className="w-full">Crear Tienda</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit/Delete Store - only for super_admin */}
        {canManageStores && selectedStore && (
          <>
            <Button variant="outline" size="icon" onClick={() => openEdit(selectedStore)} title="Editar tienda">
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" title="Eliminar tienda">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar tienda?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará la tienda "{selectedStore.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(selectedStore.id)}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) { setEditingStore(null); resetForm(); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tienda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Nombre *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <Button onClick={handleUpdate} className="w-full">Guardar Cambios</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface WarehouseManagerProps {
  onWarehouseCreated?: (warehouse: Warehouse) => void;
}

export function WarehouseManager({ onWarehouseCreated }: WarehouseManagerProps) {
  const { warehouses, createWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const resetForm = () => {
    setName('');
    setAddress('');
    setPhone('');
  };

  const handleCreate = async () => {
    if (!name) {
      toast({ variant: 'destructive', title: 'Error', description: 'El nombre es requerido' });
      return;
    }
    try {
      const newWarehouse = await createWarehouse({ name, address: address || undefined, phone: phone || undefined });
      setIsAddOpen(false);
      resetForm();
      toast({ title: 'Bodega creada' });
      onWarehouseCreated?.(newWarehouse);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleUpdate = async () => {
    if (!editingWarehouse || !name) return;
    try {
      await updateWarehouse(editingWarehouse.id, { name, address: address || undefined, phone: phone || undefined });
      setEditingWarehouse(null);
      resetForm();
      toast({ title: 'Bodega actualizada' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWarehouse(id);
      toast({ title: 'Bodega eliminada' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const openEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setName(warehouse.name);
    setAddress(warehouse.address || '');
    setPhone(warehouse.phone || '');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Add Warehouse */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nueva Bodega
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Bodega</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button onClick={handleCreate} className="w-full">Crear Bodega</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Warehouses */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            Gestionar
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gestionar Bodegas</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {warehouses.map(warehouse => (
              <div key={warehouse.id} className="flex items-center justify-between p-3 border rounded-md">
                {editingWarehouse?.id === warehouse.id ? (
                  <div className="flex-1 space-y-2">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdate}>Guardar</Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingWarehouse(null); resetForm(); }}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="font-medium">{warehouse.name}</div>
                      {warehouse.address && <div className="text-sm text-muted-foreground">{warehouse.address}</div>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(warehouse)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar bodega?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esto eliminará la bodega "{warehouse.name}" y puede afectar tiendas asociadas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(warehouse.id)}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
