import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from '@/types/orders';
import { OrderCard } from '@/components/orders/OrderCard';

interface PaginatedOrderGridProps {
  orders: Order[];
  loading?: boolean;
  onOrderClick?: (order: Order) => void;
  onEditClick?: (order: Order) => void;
  onDeleteClick?: (orderId: string) => void;
  renderItem?: (order: Order) => React.ReactNode;
  pageSize?: number;
  totalLabel?: string;
  readOnly?: boolean;
}

export function PaginatedOrderGrid({
  orders,
  loading,
  onOrderClick,
  onEditClick,
  onDeleteClick,
  renderItem,
  pageSize = 12,
  totalLabel = 'pedidos',
  readOnly = false
}: PaginatedOrderGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset to page 1 when orders length changes significantly
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  const paginatedOrders = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, safeCurrentPage, pageSize]);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Cargando pedidos...</div>;
  }

  if (totalItems === 0) {
    return <div className="text-center py-12 text-muted-foreground">No se encontraron pedidos.</div>;
  }

  const renderContent = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {paginatedOrders.map(order =>
        renderItem ? (
          <React.Fragment key={order.id}>
            {renderItem(order)}
          </React.Fragment>
        ) : (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => onOrderClick?.(order)}
            onEdit={() => onEditClick?.(order)}
            onDelete={() => onDeleteClick?.(order.id)}
            readOnly={readOnly}
          />
        )
      )}
    </div>
  );

  // No pagination needed
  if (totalPages <= 1) {
    return renderContent();
  }

  return (
    <div className="space-y-4">
      {renderContent()}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-muted-foreground">
          {((safeCurrentPage - 1) * pageSize) + 1}–{Math.min(safeCurrentPage * pageSize, totalItems)} de {totalItems} {totalLabel}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (safeCurrentPage <= 3) {
                pageNum = i + 1;
              } else if (safeCurrentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = safeCurrentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === safeCurrentPage ? 'default' : 'outline'}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
