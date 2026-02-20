import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface CartNotificationProps {
  productName: string;
  isVisible: boolean;
  onHide: () => void;
}

const CartNotification = ({ productName, isVisible, onHide }: CartNotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[100] animate-fade-in" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg md:rounded-full shadow-lg max-w-sm mx-auto md:mx-0">
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 animate-scale-in">
          <Check className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium truncate">
          {productName} agregado
        </span>
      </div>
    </div>
  );
};

// Hook para manejar las notificaciones
export const useCartNotification = () => {
  const [notification, setNotification] = useState<{ productName: string; visible: boolean }>({
    productName: '',
    visible: false
  });

  const showNotification = (productName: string) => {
    setNotification({ productName, visible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};

export default CartNotification;
