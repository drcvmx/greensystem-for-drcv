import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Warehouse, Truck, Store as StoreIcon, Info } from 'lucide-react';
import { DeliveryType } from '@/types/orders';

// Bosque Real conditional routing constants
export const BOSQUE_REAL_STORE_ID = '73c35dcf-5c60-4490-89cc-3177948b0d91';
export const BODEGA_BOSQUE_REAL_ID = '5a212262-2732-42ee-a390-095dfff86281';
export const BODEGA_INTERLOMAS_ID = '7723eed3-91e5-4617-8bdb-41ac9faa6533';

interface BosqueRealWarehouseSelectorProps {
  selectedWarehouseId: string;
  onWarehouseChange: (warehouseId: string) => void;
  onDeliveryTypeChange: (deliveryType: DeliveryType) => void;
  deliveryType: DeliveryType;
}

/**
 * Special warehouse selector for Bosque Real store.
 * When the user selects a warehouse, the delivery type is automatically set:
 * - Bodega Bosque Real → Pickup
 * - Bodega Interlomas → Delivery (Envío)
 */
export function BosqueRealWarehouseSelector({
  selectedWarehouseId,
  onWarehouseChange,
  onDeliveryTypeChange,
  deliveryType,
}: BosqueRealWarehouseSelectorProps) {
  
  // When warehouse changes, automatically set delivery type
  const handleWarehouseChange = (warehouseId: string) => {
    onWarehouseChange(warehouseId);
    
    // Auto-set delivery type based on warehouse selection
    if (warehouseId === BODEGA_BOSQUE_REAL_ID) {
      onDeliveryTypeChange('pickup');
    } else if (warehouseId === BODEGA_INTERLOMAS_ID) {
      onDeliveryTypeChange('delivery');
    }
  };

  // Sync on initial render if warehouse is already selected
  useEffect(() => {
    if (selectedWarehouseId === BODEGA_BOSQUE_REAL_ID && deliveryType !== 'pickup') {
      onDeliveryTypeChange('pickup');
    } else if (selectedWarehouseId === BODEGA_INTERLOMAS_ID && deliveryType !== 'delivery') {
      onDeliveryTypeChange('delivery');
    }
  }, [selectedWarehouseId, deliveryType, onDeliveryTypeChange]);

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert className="border-amber-500/30 bg-amber-500/10">
        <Info className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-400 text-sm">
          <strong>Tienda Bosque Real:</strong> Selecciona la bodega destino. El tipo de entrega se ajustará automáticamente.
        </AlertDescription>
      </Alert>

      {/* Warehouse Selection */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Warehouse className="h-4 w-4" />
          Bodega Destino
        </Label>
        <RadioGroup 
          value={selectedWarehouseId} 
          onValueChange={handleWarehouseChange}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* Bodega Bosque Real - Pickup */}
          <div 
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedWarehouseId === BODEGA_BOSQUE_REAL_ID 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-border hover:border-purple-500/50 hover:bg-muted/50'
            }`}
          >
            <RadioGroupItem value={BODEGA_BOSQUE_REAL_ID} id="bodega-bosque-real" />
            <Label htmlFor="bodega-bosque-real" className="cursor-pointer flex-1">
              <div className="flex items-center gap-2">
                <StoreIcon className="h-4 w-4 text-purple-400" />
                <span className="font-medium">Bodega Bosque Real</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-purple-400">→</span> Pickup (Recoger en Tienda)
              </div>
            </Label>
          </div>

          {/* Bodega Interlomas - Delivery */}
          <div 
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedWarehouseId === BODEGA_INTERLOMAS_ID 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-border hover:border-blue-500/50 hover:bg-muted/50'
            }`}
          >
            <RadioGroupItem value={BODEGA_INTERLOMAS_ID} id="bodega-interlomas" />
            <Label htmlFor="bodega-interlomas" className="cursor-pointer flex-1">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-400" />
                <span className="font-medium">Bodega Interlomas</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-blue-400">→</span> Envío a Domicilio
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Current Selection Summary */}
      {selectedWarehouseId && (
        <div className={`p-3 rounded-md text-sm ${
          selectedWarehouseId === BODEGA_BOSQUE_REAL_ID 
            ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
            : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            {selectedWarehouseId === BODEGA_BOSQUE_REAL_ID ? (
              <>
                <StoreIcon className="h-4 w-4" />
                <span><strong>Pickup</strong> desde Bodega Bosque Real</span>
              </>
            ) : (
              <>
                <Truck className="h-4 w-4" />
                <span><strong>Envío</strong> desde Bodega Interlomas</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
