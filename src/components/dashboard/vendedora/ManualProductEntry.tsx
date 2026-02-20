import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { ManualCartItem } from '@/types/orders';

interface ManualProductEntryProps {
  items: ManualCartItem[];
  onItemsChange: (items: ManualCartItem[]) => void;
}

export function ManualProductEntry({ items, onItemsChange }: ManualProductEntryProps) {
  const [reference, setReference] = useState('');
  const [price, setPrice] = useState<number>(0);

  const handleAddProduct = () => {
    if (!reference.trim() || price <= 0) return;

    const newItem: ManualCartItem = {
      id: crypto.randomUUID(),
      reference: reference.trim(),
      price,
      quantity: 1,
    };

    onItemsChange([...items, newItem]);
    setReference('');
    setPrice(0);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    onItemsChange(items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Productos
      </Label>

      {/* Add product form */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <Input
          placeholder="Referencia del producto..."
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddProduct()}
        />
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">$</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={price || ''}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-24"
            placeholder="Precio"
            onKeyDown={(e) => e.key === 'Enter' && handleAddProduct()}
          />
        </div>
        <Button 
          onClick={handleAddProduct}
          disabled={!reference.trim() || price <= 0}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Cart items */}
      {items.length > 0 && (
        <div className="border rounded-md p-3 space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.reference}</div>
                <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} c/u</div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => handleUpdateQuantity(item.id, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => handleUpdateQuantity(item.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <span className="w-16 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* Total */}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-primary">${cartTotal.toFixed(2)}</span>
          </div>
          
          {/* Multiple items warning */}
          {totalItems >= 2 && (
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400 text-sm">
              ⚠️ Pedido con múltiples piezas ({totalItems} items)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
