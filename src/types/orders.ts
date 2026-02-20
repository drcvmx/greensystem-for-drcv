// Order system types

export type OrderStatus = 
  | 'pending_validation'
  | 'validated'
  | 'in_preparation'
  | 'ready_for_dispatch'
  | 'assigned_to_driver'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type PaymentType = 'cash' | 'transfer' | 'payment_link' | 'loyalty_points';

// Payment entry for multiple payments
export interface PaymentEntry {
  id: string;
  type: PaymentType;
  amount: number;
  evidenceFile: File | null; // Legacy single file (kept for compatibility)
  evidenceFiles: File[]; // Multiple evidence files (up to 3)
  existingEvidenceUrl?: string; // Legacy single URL
  existingEvidenceUrls: string[]; // Multiple existing URLs for editing
}

// Manual cart item with free text reference
export interface ManualCartItem {
  id: string;
  reference: string;
  price: number;
  quantity: number;
}

// Database payment record
export interface OrderPayment {
  id: string;
  order_id: string;
  payment_type: PaymentType;
  amount: number;
  evidence_url?: string;
  evidence_urls?: string[];
  created_at: string;
}

export type DeliveryType = 'pickup' | 'delivery';

export type DeliveryMethod = 'uber' | 'internal_driver';

export interface Warehouse {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  is_active: boolean;
}

export interface Store {
  id: string;
  warehouse_id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  is_active: boolean;
  warehouse?: Warehouse;
}

export interface Customer {
  id: string;
  customer_code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  loyalty_points: number;
  total_orders: number;
  is_active: boolean;
}

export interface Driver {
  id: string;
  user_id?: string;
  warehouse_id: string;
  name: string;
  phone: string;
  is_available: boolean;
  is_active: boolean;
}

export interface Order {
  id: string;
  order_number: number;
  customer_id: string;
  store_id: string;
  warehouse_id: string;
  created_by: string;
  status: OrderStatus;
  payment_type: PaymentType;
  subtotal: number;
  points_discount: number;
  total: number;
  payment_evidence_url?: string;
  payment_validated_at?: string;
  payment_validated_by?: string;
  delivery_type: DeliveryType;
  delivery_method?: DeliveryMethod;
  delivery_address?: string;
  delivery_notes?: string;
  driver_id?: string;
  uber_photo_url?: string;
  uber_plate?: string;
  validated_at?: string;
  preparation_started_at?: string;
  ready_at?: string;
  dispatched_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  notes?: string;
  delivery_photo_url?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  customer?: Customer;
  store?: Store;
  warehouse?: Warehouse;
  driver?: Driver;
  order_payments?: OrderPayment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id?: string;
  product_name: string;
  product_category?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  from_status?: OrderStatus;
  to_status: OrderStatus;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

// Status labels in Spanish
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_validation: 'Esperando Validación',
  validated: 'Validado',
  in_preparation: 'En Preparación',
  ready_for_dispatch: 'Listo para Envío',
  assigned_to_driver: 'Asignado a Chofer',
  in_transit: 'En Ruta',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_validation: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  validated: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_preparation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ready_for_dispatch: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  assigned_to_driver: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  in_transit: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  payment_link: 'Link de Pago',
  loyalty_points: 'Puntos',
};

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  pickup: 'Recoger en Tienda',
  delivery: 'Envío a Domicilio',
};
