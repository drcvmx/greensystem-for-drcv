import { MessageCircle, X, Minus, Plus, Trash2, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartContext } from '@/context/CartContext';
import { cn } from '@/lib/utils';

// WhatsApp icon component
export const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Cart button component for the header
export const CartButton = ({ onClick }: { onClick: () => void }) => {
  const { totalItems } = useCartContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTotalRef = useRef(totalItems);

  // Trigger animation when items are added
  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  return (
    <button
      onClick={onClick}
      aria-label="Abrir pedido"
      className={cn(
        "relative p-2 rounded-full transition-all duration-200",
        "hover:bg-whatsapp/20",
        isAnimating && "animate-bounce"
      )}
    >
      <WhatsAppIcon className="w-6 h-6 text-whatsapp" />
      {totalItems > 0 && (
        <span 
          className={cn(
            "absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-whatsapp text-white text-[10px] font-bold rounded-full",
            isAnimating && "animate-scale-in"
          )}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, totalItems, updateQuantity, removeItem, clearCart } = useCartContext();

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';

    let message = '¡Hola! 👋 Me gustaría hacer el siguiente pedido:\n\n';
    
    // Group items by brand
    const groupedByBrand: Record<string, typeof items> = {};
    items.forEach(item => {
      if (!groupedByBrand[item.brandName]) {
        groupedByBrand[item.brandName] = [];
      }
      groupedByBrand[item.brandName].push(item);
    });

    // Build message
    Object.entries(groupedByBrand).forEach(([brandName, brandItems]) => {
      message += `📦 *${brandName}*\n`;
      brandItems.forEach(item => {
        message += `   • ${item.flavorName} x${item.quantity}\n`;
      });
      message += '\n';
    });

    message += `━━━━━━━━━━━━━━━\n`;
    message += `📊 *Total: ${totalItems} productos*\n\n`;
    message += `¡Gracias! 🙏`;

    return encodeURIComponent(message);
  };

  const sendToWhatsApp = () => {
    const message = generateWhatsAppMessage();
    // Replace with your WhatsApp number (include country code without +)
    const phoneNumber = ''; // Example: '521234567890'
    const url = phoneNumber 
      ? `https://wa.me/${phoneNumber}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-background shadow-xl flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header with WhatsApp branding */}
        <header className="flex items-center justify-between px-4 py-4 bg-whatsapp-dark text-white">
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="w-5 h-5" />
            <h2 className="font-medium text-lg">Tu Pedido</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar pedido" className="hover:opacity-70 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">
                Tu pedido está vacío
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Agrega sabores para enviar por WhatsApp
              </p>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-start gap-3 border-b border-border pb-4"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{item.flavorName}</p>
                <p className="text-xs text-muted-foreground">{item.brandName}</p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                className="text-destructive hover:opacity-70 transition-opacity"
                aria-label="Eliminar del pedido"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer with WhatsApp send button */}
        {items.length > 0 && (
          <footer className="px-4 py-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total de productos</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            
            {/* Send to WhatsApp button */}
            <button
              onClick={sendToWhatsApp}
              className="w-full py-3 flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Enviar pedido por WhatsApp</span>
            </button>
            
            <button
              onClick={clearCart}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Vaciar pedido
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
