import { useEffect, useState } from "react";
import { demoStorage } from "@/lib/demoStorage";

export type AppRole = "super_admin" | "zone_admin" | "vendedora" | "tesorero" | "bodega_manager" | "driver" | "consultor";

interface UserRole {
  role: AppRole;
  zone_id: string | null;
  warehouse_id: string | null;
  store_id: string | null;
}

// Mock User and Session types to maintain compatibility without Supabase
interface MockUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface MockSession {
  user: MockUser;
}

export const useAuth = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in demoStorage
    const storedUser = demoStorage.getCurrentUser();
    if (storedUser) {
      const mockUser: MockUser = {
        id: storedUser.id,
        email: storedUser.email,
        user_metadata: { full_name: storedUser.name }
      };
      setUser(mockUser);
      setSession({ user: mockUser });
      setUserRole({
        role: storedUser.role,
        zone_id: storedUser.zone_id,
        warehouse_id: storedUser.warehouse_id,
        store_id: storedUser.store_id
      });
    }
    setLoading(false);

    // Simulation of storage updates (if login happens in another tab/component)
    const handleStorageUpdate = () => {
      const updatedUser = demoStorage.getCurrentUser();
      if (updatedUser) {
        const mockUser: MockUser = {
          id: updatedUser.id,
          email: updatedUser.email,
          user_metadata: { full_name: updatedUser.name }
        };
        setUser(mockUser);
        setSession({ user: mockUser });
        setUserRole({
          role: updatedUser.role,
          zone_id: updatedUser.zone_id,
          warehouse_id: updatedUser.warehouse_id,
          store_id: updatedUser.store_id
        });
      } else {
        setUser(null);
        setSession(null);
        setUserRole(null);
      }
    };

    window.addEventListener('demo_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('demo_storage_update', handleStorageUpdate);
  }, []);

  const signOut = async () => {
    demoStorage.setCurrentUser(null);
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  return {
    user,
    session,
    userRole,
    loading,
    signOut,
    // Role helpers
    isSuperAdmin: userRole?.role === "super_admin",
    isZoneAdmin: userRole?.role === "zone_admin",
    isVendedora: userRole?.role === "vendedora",
    isTesorero: userRole?.role === "tesorero",
    isBodegaManager: userRole?.role === "bodega_manager",
    isDriver: userRole?.role === "driver",
    isConsultor: userRole?.role === "consultor",
  };
};
