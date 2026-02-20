import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Package, BarChart3, Receipt, Warehouse, Truck } from 'lucide-react';
import { VendedoraDashboard } from '@/components/dashboard/VendedoraDashboard';
import { TesoreroDashboard } from '@/components/dashboard/TesoreroDashboard';
import { BodegaDashboard } from '@/components/dashboard/BodegaDashboard';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';
import { DriverDashboard } from '@/components/dashboard/DriverDashboard';

const ROLE_TITLES: Record<string, string> = {
  super_admin: 'Super Admin',
  zone_admin: 'Admin de Zona',
  vendedora: 'Vendedora',
  tesorero: 'Tesorero',
  bodega_manager: 'Bodega',
  driver: 'Repartidor',
  consultor: 'Consultor',
};

export default function Dashboard() {
  const { user, userRole, loading, signOut, isSuperAdmin, isVendedora, isTesorero, isBodegaManager, isDriver, isConsultor } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>('default');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  // Set default view based on role
  useEffect(() => {
    if (userRole?.role) {
      if (isSuperAdmin || isConsultor) {
        setActiveView('admin');
      } else if (isTesorero) {
        setActiveView('tesorero');
      } else if (isBodegaManager) {
        setActiveView('bodega');
      } else if (isVendedora) {
        setActiveView('vendedora');
      } else if (isDriver) {
        setActiveView('driver');
      }
    }
  }, [userRole, isSuperAdmin, isConsultor, isTesorero, isBodegaManager, isVendedora, isDriver]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  const roleName = userRole?.role ? ROLE_TITLES[userRole.role] : 'Usuario';

  // Both Super Admin and Consultor get full dashboard access
  // Consultor is read-only (handled by individual dashboard components)
  const hasFullAccess = isSuperAdmin || isConsultor;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold metallic-text">Green Alchemy</h1>
                <span className="text-xs text-primary">{roleName}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Super Admin and Consultor get tabbed navigation */}
        {hasFullAccess ? (
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Panel Admin</span>
              </TabsTrigger>
              <TabsTrigger value="vendedora" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Vendedora</span>
              </TabsTrigger>
              <TabsTrigger value="tesorero" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Tesorería</span>
              </TabsTrigger>
              <TabsTrigger value="bodega" className="flex items-center gap-2">
                <Warehouse className="h-4 w-4" />
                <span className="hidden sm:inline">Bodega</span>
              </TabsTrigger>
              <TabsTrigger value="driver" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">Repartidor</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <SuperAdminDashboard readOnly={isConsultor} />
            </TabsContent>
            <TabsContent value="vendedora">
              <VendedoraDashboard isAdmin={true} readOnly={isConsultor} />
            </TabsContent>
            <TabsContent value="tesorero">
              <TesoreroDashboard readOnly={isConsultor} />
            </TabsContent>
            <TabsContent value="bodega">
              <BodegaDashboard isAdmin={true} readOnly={isConsultor} />
            </TabsContent>
            <TabsContent value="driver">
              <DriverDashboard isAdmin={true} readOnly={isConsultor} />
            </TabsContent>
          </Tabs>
        ) : (
          // Other roles see their specific dashboard only
          <>
            {isVendedora && <VendedoraDashboard />}
            {isTesorero && <TesoreroDashboard />}
            {isBodegaManager && <BodegaDashboard />}
            {isDriver && <DriverDashboard />}
          </>
        )}
      </main>
    </div>
  );
}
