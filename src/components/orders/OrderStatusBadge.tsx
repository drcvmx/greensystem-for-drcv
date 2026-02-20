import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/orders';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${ORDER_STATUS_COLORS[status]} ${className}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
