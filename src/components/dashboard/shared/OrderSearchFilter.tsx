import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, DollarSign } from 'lucide-react';
import { PaymentType, PAYMENT_TYPE_LABELS } from '@/types/orders';

interface OrderSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  paymentFilter?: PaymentType | 'all';
  onPaymentFilterChange?: (value: PaymentType | 'all') => void;
  /** Payment types to show in the filter dropdown */
  availablePaymentTypes?: PaymentType[];
  showPaymentFilter?: boolean;
  placeholder?: string;
}

export function OrderSearchFilter({
  searchQuery,
  onSearchChange,
  paymentFilter = 'all',
  onPaymentFilterChange,
  availablePaymentTypes = ['cash', 'transfer', 'payment_link', 'loyalty_points'],
  showPaymentFilter = true,
  placeholder = 'Buscar por #pedido, cliente, tienda, bodega...',
}: OrderSearchFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Payment Type Filter */}
      {showPaymentFilter && onPaymentFilterChange && (
        <Select value={paymentFilter} onValueChange={(v) => onPaymentFilterChange(v as PaymentType | 'all')}>
          <SelectTrigger className="w-[180px] bg-background">
            <DollarSign className="h-4 w-4 mr-2 text-emerald-400" />
            <SelectValue placeholder="Forma de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las formas</SelectItem>
            {availablePaymentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {PAYMENT_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear all */}
      {(searchQuery || paymentFilter !== 'all') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onSearchChange('');
            onPaymentFilterChange?.('all');
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  );
}

/**
 * Filter orders by search query across multiple fields
 */
export function filterOrdersBySearch<T extends {
  order_number?: number;
  total?: number;
  payment_type?: string;
  delivery_type?: string;
  delivery_address?: string | null;
  notes?: string | null;
  customer?: { name?: string; customer_code?: string; phone?: string | null } | null;
  store?: { name?: string } | null;
  warehouse?: { name?: string } | null;
}>(orders: T[], query: string): T[] {
  if (!query.trim()) return orders;

  const q = query.toLowerCase().trim();

  return orders.filter((order) => {
    // Order number
    if (order.order_number?.toString().includes(q)) return true;
    // Total
    if (order.total?.toFixed(2).includes(q)) return true;
    // Payment type label
    if (order.payment_type && PAYMENT_TYPE_LABELS[order.payment_type as keyof typeof PAYMENT_TYPE_LABELS]?.toLowerCase().includes(q)) return true;
    // Customer fields
    if (order.customer?.name?.toLowerCase().includes(q)) return true;
    if (order.customer?.customer_code?.toLowerCase().includes(q)) return true;
    if (order.customer?.phone?.includes(q)) return true;
    // Store
    if (order.store?.name?.toLowerCase().includes(q)) return true;
    // Warehouse
    if (order.warehouse?.name?.toLowerCase().includes(q)) return true;
    // Delivery address
    if (order.delivery_address?.toLowerCase().includes(q)) return true;
    // Notes
    if (order.notes?.toLowerCase().includes(q)) return true;

    return false;
  });
}
