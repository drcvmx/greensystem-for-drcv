import { ZONES } from '../config/zones';
import { brands as staticBrands, products as staticProducts } from '../services/brands';
import { Order, OrderStatus, Store, Warehouse, Customer, Driver, OrderPayment, OrderTimeline, PaymentType, DeliveryType } from '../types/orders';
import { AppRole } from '../hooks/useAuth';

// --- Types ---
export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  zone_id: string | null;
  warehouse_id: string | null;
  store_id: string | null;
}

// --- Initial Data ---

// 1. Zones (already have them in config/zones.ts)
export const initialZones = ZONES.map((z, index) => ({
  id: `zone-${index + 1}`,
  name: z.name,
  slug: z.slug,
  is_active: true
}));

// 2. Warehouses (one per some major zones)
export const initialWarehouses: Warehouse[] = [
  { id: 'wh-1', name: 'Bodega Central Polanco', slug: 'bodega-polanco', is_active: true, address: 'Polanco, CDMX', phone: '5511223344' },
  { id: 'wh-2', name: 'Bodega Condesa', slug: 'bodega-condesa', is_active: true, address: 'Condesa, CDMX', phone: '5522334455' },
  { id: 'wh-3', name: 'Bodega Norte (Monterrey)', slug: 'bodega-monterrey', is_active: true, address: 'San Pedro, NL', phone: '8111223344' },
];

// 3. Stores
export const initialStores: Store[] = [
  { id: 'st-1', warehouse_id: 'wh-1', name: 'Tienda Masaryk', slug: 'tienda-masaryk', is_active: true, address: 'Masaryk 201', phone: '5511223344', warehouse: initialWarehouses[0] },
  { id: 'st-2', warehouse_id: 'wh-2', name: 'Tienda Insurgentes', slug: 'tienda-insurgentes', is_active: true, address: 'Insurgentes Sur 253', phone: '5522334455', warehouse: initialWarehouses[1] },
];

// 4. Brands, Categories, Variants
// We'll derive them from brands.ts and products.ts to keep consistency
export const initialBrands = staticBrands.map(b => ({
  id: b.id,
  name: b.name,
  is_active: true,
  zone_id: initialZones[0].id, // Default to Polanco for demo
  logo_url: b.logo_url
}));

// Extract unique categories from staticProducts
const uniqueCategoryNames = Array.from(new Set(staticProducts.map(p => p.category)));
export const initialCategories = uniqueCategoryNames.map((name, index) => {
  const product = staticProducts.find(p => p.category === name);
  return {
    id: `cat-${index + 1}`,
    brand_id: product?.brand_id || '1',
    name: name,
    is_active: true,
    price: 450 // Default demo price
  };
});

export const initialVariants = staticProducts.map((p, index) => ({
  id: p.id,
  category_id: initialCategories.find(c => c.name === p.category && c.brand_id === p.brand_id)?.id || 'cat-1',
  name: p.name,
  is_active: true
}));

// 5. Users (one per role)
export const initialUsers: DemoUser[] = [
  { id: 'u-admin', email: 'admin@greenalchemy.mx', name: 'Super Admin', role: 'super_admin', zone_id: null, warehouse_id: null, store_id: null },
  { id: 'u-vendedora', email: 'vendedora@greenalchemy.mx', name: 'Vendedora Polanco', role: 'vendedora', zone_id: initialZones[0].id, warehouse_id: 'wh-1', store_id: 'st-1' },
  { id: 'u-tesorero', email: 'tesorero@greenalchemy.mx', name: 'Tesorero Central', role: 'tesorero', zone_id: null, warehouse_id: null, store_id: null },
  { id: 'u-bodega', email: 'bodega@greenalchemy.mx', name: 'Jefe de Bodega', role: 'bodega_manager', zone_id: null, warehouse_id: 'wh-1', store_id: null },
  { id: 'u-driver', email: 'driver@greenalchemy.mx', name: 'Repartidor 01', role: 'driver', zone_id: null, warehouse_id: 'wh-1', store_id: null },
  { id: 'u-consultor', email: 'consultor@greenalchemy.mx', name: 'Consultor Externo', role: 'consultor', zone_id: null, warehouse_id: null, store_id: null },
];

// 6. Customers
export const initialCustomers: Customer[] = [
  { id: 'cust-1', name: 'Juan Pérez', email: 'juan@gmail.com', phone: '5511223344', customer_code: 'GA-0001', loyalty_points: 150, total_orders: 5, is_active: true },
  { id: 'cust-2', name: 'María García', email: 'maria@gmail.com', phone: '5599887766', customer_code: 'GA-0002', loyalty_points: 0, total_orders: 1, is_active: true },
  { id: 'cust-3', name: 'Carlos López', email: 'carlos@gmail.com', phone: '5544332211', customer_code: 'GA-0003', loyalty_points: 50, total_orders: 2, is_active: true },
];

// 7. Drivers
export const initialDrivers: Driver[] = [
  { id: 'drv-1', user_id: 'u-driver', warehouse_id: 'wh-1', name: 'Repartidor 01', phone: '5566778899', is_available: true, is_active: true },
];

// 8. Initial Orders (to show metrics)
export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    order_number: 1001,
    customer_id: 'cust-1',
    store_id: 'st-1',
    warehouse_id: 'wh-1',
    created_by: 'u-vendedora',
    status: 'delivered',
    payment_type: 'cash',
    subtotal: 900,
    points_discount: 0,
    total: 900,
    delivery_type: 'delivery',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    customer: initialCustomers[0],
    store: initialStores[0],
    warehouse: initialWarehouses[0]
  },
  {
    id: 'ord-2',
    order_number: 1002,
    customer_id: 'cust-2',
    store_id: 'st-1',
    warehouse_id: 'wh-1',
    created_by: 'u-vendedora',
    status: 'pending_validation',
    payment_type: 'transfer',
    subtotal: 450,
    points_discount: 0,
    total: 450,
    delivery_type: 'pickup',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer: initialCustomers[1],
    store: initialStores[0],
    warehouse: initialWarehouses[0]
  },
  {
    id: 'ord-3',
    order_number: 1003,
    customer_id: 'cust-3',
    store_id: 'st-1',
    warehouse_id: 'wh-1',
    created_by: 'u-vendedora',
    status: 'validated',
    payment_type: 'payment_link',
    subtotal: 1350,
    points_discount: 50,
    total: 1300,
    delivery_type: 'delivery',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    customer: initialCustomers[2],
    store: initialStores[0],
    warehouse: initialWarehouses[0]
  }
];
