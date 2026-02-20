import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X, Warehouse, Store } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
}

interface StoreEntity {
  id: string;
  name: string;
  warehouse_id: string;
}

interface DashboardFiltersProps {
  warehouses: Warehouse[];
  stores: StoreEntity[];
  selectedWarehouseId: string | undefined;
  selectedStoreId: string | undefined;
  onWarehouseChange: (value: string | undefined) => void;
  onStoreChange: (value: string | undefined) => void;
  showStoreFilter?: boolean;
}

export function DashboardFilters({
  warehouses,
  stores,
  selectedWarehouseId,
  selectedStoreId,
  onWarehouseChange,
  onStoreChange,
  showStoreFilter = true,
}: DashboardFiltersProps) {
  // Filter stores based on selected warehouse
  const filteredStores = useMemo(() => {
    if (!selectedWarehouseId) return stores;
    return stores.filter(s => s.warehouse_id === selectedWarehouseId);
  }, [stores, selectedWarehouseId]);

  const handleWarehouseChange = (value: string) => {
    onWarehouseChange(value === 'all' ? undefined : value);
    onStoreChange(undefined); // Reset store filter when warehouse changes
  };

  const handleStoreChange = (value: string) => {
    onStoreChange(value === 'all' ? undefined : value);
  };

  const clearFilters = () => {
    onWarehouseChange(undefined);
    onStoreChange(undefined);
  };

  const hasFilters = selectedWarehouseId || selectedStoreId;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filtrar por:</span>
          </div>

          <Select value={selectedWarehouseId || 'all'} onValueChange={handleWarehouseChange}>
            <SelectTrigger className="w-[200px] bg-background">
              <Warehouse className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Todas las bodegas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las bodegas</SelectItem>
              {warehouses.map((wh) => (
                <SelectItem key={wh.id} value={wh.id}>
                  {wh.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showStoreFilter && (
            <Select value={selectedStoreId || 'all'} onValueChange={handleStoreChange}>
              <SelectTrigger className="w-[200px] bg-background">
                <Store className="h-4 w-4 mr-2 text-cyan-400" />
                <SelectValue placeholder="Todas las tiendas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las tiendas</SelectItem>
                {filteredStores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}

          {hasFilters && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Mostrando datos filtrados
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
