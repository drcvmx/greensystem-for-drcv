import { useState, useEffect, useCallback } from 'react';
import { demoStorage } from '@/lib/demoStorage';
import { AppRole } from '@/hooks/useAuth';

interface UserWithRole {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role: AppRole | null;
  zone_id: string | null;
  store_id: string | null;
  warehouse_info: {
    id: string;
    name: string;
  } | null;
  store_info: {
    id: string;
    name: string;
  } | null;
  driver_info: {
    id: string;
    warehouse_id: string;
    phone: string;
    is_active: boolean;
    is_available: boolean;
    warehouse?: { name: string };
  } | null;
}

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: AppRole;
  zone_id?: string;
  warehouse_id?: string;
  store_id?: string;
  phone?: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const allUsers = demoStorage.getAll('users');
      const allRoles = demoStorage.getAll('user_roles');
      const allWarehouses = demoStorage.getAll('warehouses');
      const allStores = demoStorage.getAll('stores');
      const allDrivers = demoStorage.getAll('drivers');

      const usersWithRoles: UserWithRole[] = allUsers.map((u: any) => {
        const userRole = allRoles.find((r: any) => r.user_id === u.id);
        const driver = allDrivers.find((d: any) => d.user_id === u.id);
        const warehouse = userRole?.warehouse_id ? allWarehouses.find((w: any) => w.id === userRole.warehouse_id) : null;
        const store = userRole?.store_id ? allStores.find((s: any) => s.id === userRole.store_id) : null;

        return {
          id: u.id,
          email: u.email,
          name: u.name,
          created_at: u.created_at,
          role: userRole?.role || null,
          zone_id: userRole?.zone_id || null,
          store_id: userRole?.store_id || null,
          warehouse_info: warehouse ? { id: warehouse.id, name: warehouse.name } : null,
          store_info: store ? { id: store.id, name: store.name } : null,
          driver_info: driver ? {
            id: driver.id,
            warehouse_id: driver.warehouse_id,
            phone: driver.phone,
            is_active: driver.is_active,
            is_available: driver.is_available,
            warehouse: allWarehouses.find((w: any) => w.id === driver.warehouse_id)
          } : null
        };
      });

      setUsers(usersWithRoles);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    window.addEventListener('demo_storage_update', fetchUsers);
    return () => window.removeEventListener('demo_storage_update', fetchUsers);
  }, [fetchUsers]);

  const createUser = async (data: CreateUserData) => {
    // 1. Create user in users table
    const newUser = demoStorage.insert('users', {
      email: data.email,
      name: data.name,
      last_sign_in_at: null
    });

    // 2. Create role
    demoStorage.insert('user_roles', {
      user_id: newUser.id,
      role: data.role,
      zone_id: data.zone_id || null,
      warehouse_id: data.warehouse_id || null,
      store_id: data.store_id || null
    });

    // 3. If driver, create driver record
    if (data.role === 'driver' && data.warehouse_id) {
      demoStorage.insert('drivers', {
        user_id: newUser.id,
        warehouse_id: data.warehouse_id,
        name: data.name,
        phone: data.phone || '',
        is_active: true,
        is_available: true
      });
    }

    fetchUsers();
    return newUser;
  };

  const updateUserRole = async (userId: string, role: AppRole, zoneId?: string | null) => {
    const roles = demoStorage.getAll('user_roles');
    const roleRecord = roles.find((r: any) => r.user_id === userId);

    if (roleRecord) {
      demoStorage.update('user_roles', roleRecord.id, { role, zone_id: zoneId || null });
    } else {
      demoStorage.insert('user_roles', { user_id: userId, role, zone_id: zoneId || null });
    }

    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    // Delete user (demoStorage handles cascaded manually if needed, 
    // but here we should at least delete the role and driver if they exist)

    const roles = demoStorage.getAll('user_roles');
    const roleRecord = roles.find((r: any) => r.user_id === userId);
    if (roleRecord) demoStorage.delete('user_roles', roleRecord.id);

    const drivers = demoStorage.getAll('drivers');
    const driverRecord = drivers.find((d: any) => d.user_id === userId);
    if (driverRecord) demoStorage.delete('drivers', driverRecord.id);

    demoStorage.delete('users', userId);
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUserRole,
    deleteUser,
  };
}
