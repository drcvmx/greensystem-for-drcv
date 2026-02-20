import { useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useWarehouses, useStores } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, UserPlus, RefreshCw, Mail, Shield, 
  Warehouse, Truck, Receipt, DollarSign, Crown, Store, Eye
} from 'lucide-react';
import { AppRole } from '@/hooks/useAuth';
import { SuperAdminDeleteButton } from '@/components/admin/SuperAdminDeleteButton';

const ROLE_CONFIG: Record<AppRole, { label: string; icon: typeof Users; color: string }> = {
  super_admin: { label: 'Super Admin', icon: Crown, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  zone_admin: { label: 'Admin Zona', icon: Shield, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  vendedora: { label: 'Vendedora', icon: Receipt, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  tesorero: { label: 'Tesorero', icon: DollarSign, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  bodega_manager: { label: 'Bodega', icon: Warehouse, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  driver: { label: 'Repartidor', icon: Truck, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  consultor: { label: 'Consultor', icon: Eye, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
};

export function UserManagement() {
  const { users, loading, refetch, createUser, updateUserRole, deleteUser } = useUserManagement();
  const { warehouses } = useWarehouses();
  const { stores } = useStores();
  const { user: currentUser } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: '' as AppRole | '',
    warehouse_id: '',
    store_id: '',
    phone: '',
  });

  const handleCreate = async () => {
    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      toast({ variant: 'destructive', title: 'Error', description: 'Completa todos los campos requeridos' });
      return;
    }

    setProcessing(true);
    try {
      await createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role as AppRole,
        warehouse_id: formData.warehouse_id || undefined,
        store_id: formData.store_id || undefined,
        phone: formData.phone || undefined,
      });
      toast({ title: 'Usuario Creado', description: `${formData.name} ahora puede iniciar sesión` });
      setIsCreateOpen(false);
      setFormData({ email: '', password: '', name: '', role: '', warehouse_id: '', store_id: '', phone: '' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AppRole, warehouseId?: string) => {
    setProcessing(true);
    try {
      await updateUserRole(userId, newRole, warehouseId);
      toast({ title: 'Rol Actualizado' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      await deleteUser(userId);
      toast({ title: 'Usuario Eliminado', description: `${userName} ha sido eliminado del sistema` });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({ variant: 'destructive', title: 'Error', description: errorMessage });
      throw err;
    }
  };

  // Group users by role
  const usersByRole = users.reduce((acc, user) => {
    const role = user.role || 'sin_rol';
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {} as Record<string, typeof users>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Gestión de Usuarios
          </h2>
          <p className="text-muted-foreground">
            {users.length} usuarios registrados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contraseña *</Label>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      placeholder="+52 55 1234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rol *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as AppRole })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendedora">Vendedora</SelectItem>
                      <SelectItem value="tesorero">Tesorero</SelectItem>
                      <SelectItem value="bodega_manager">Encargado de Bodega</SelectItem>
                      <SelectItem value="driver">Repartidor</SelectItem>
                      <SelectItem value="zone_admin">Admin de Zona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vendedora store selection */}
                {formData.role === 'vendedora' && (
                  <div className="space-y-2">
                    <Label>Tienda Asignada</Label>
                    <Select
                      value={formData.store_id || 'none'}
                      onValueChange={(value) => setFormData({ ...formData, store_id: value === 'none' ? '' : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sin tienda (ve todo)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin tienda asignada</SelectItem>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Si no asignas tienda, verá todos los pedidos que ella cree.
                    </p>
                  </div>
                )}

                {/* Bodega/Driver warehouse selection */}
                {(formData.role === 'bodega_manager' || formData.role === 'driver') && (
                  <div className="space-y-2">
                    <Label>Bodega Asignada *</Label>
                    <Select
                      value={formData.warehouse_id}
                      onValueChange={(value) => setFormData({ ...formData, warehouse_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar bodega" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((wh) => (
                          <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleCreate} disabled={processing}>
                    {processing ? 'Creando...' : 'Crear Usuario'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Users by Role */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-premium animate-pulse">
              <CardContent className="py-8">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(ROLE_CONFIG).map(([role, config]) => {
            const roleUsers = usersByRole[role] || [];
            if (roleUsers.length === 0) return null;

            const Icon = config.icon;

            return (
              <Card key={role} className="card-premium">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {config.label}
                    <Badge variant="outline">{roleUsers.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    {roleUsers.map((user) => (
                      <div key={user.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">
                              {user.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            {/* Show store for vendedora */}
                            {user.store_info && (
                              <div className="text-xs text-blue-400 flex items-center gap-1">
                                <Store className="h-3 w-3" />
                                {user.store_info.name}
                              </div>
                            )}
                            {/* Show warehouse for bodega_manager */}
                            {user.warehouse_info && (
                              <div className="text-xs text-cyan-400 flex items-center gap-1">
                                <Warehouse className="h-3 w-3" />
                                {user.warehouse_info.name}
                              </div>
                            )}
                            {/* Show warehouse for driver from driver_info */}
                            {user.driver_info?.warehouse && (
                              <div className="text-xs text-orange-400 flex items-center gap-1">
                                <Warehouse className="h-3 w-3" />
                                {user.driver_info.warehouse.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={config.color}>
                            {config.label}
                          </Badge>
                          {user.driver_info && (
                            <Badge variant="outline" className={
                              user.driver_info.is_available 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/20 text-red-400'
                            }>
                              {user.driver_info.is_available ? 'Disponible' : 'Ocupado'}
                            </Badge>
                          )}
                          {user.id !== currentUser?.id && (
                            <SuperAdminDeleteButton
                              onDelete={() => handleDeleteUser(user.id, user.name)}
                              itemName={user.name}
                              itemType="usuario"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Users without role */}
          {usersByRole['sin_rol']?.length > 0 && (
            <Card className="card-premium border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-400">
                  <Shield className="h-5 w-5" />
                  Sin Rol Asignado
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400">
                    {usersByRole['sin_rol'].length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {usersByRole['sin_rol'].map((user) => (
                    <div key={user.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <span className="text-amber-400 font-bold">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <Select
                        onValueChange={(value) => handleRoleChange(user.id, value as AppRole)}
                        disabled={processing}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Asignar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vendedora">Vendedora</SelectItem>
                          <SelectItem value="tesorero">Tesorero</SelectItem>
                          <SelectItem value="bodega_manager">Bodega</SelectItem>
                          <SelectItem value="driver">Repartidor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
