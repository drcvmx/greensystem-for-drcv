import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface CartNotificationState {
  productName: string;
  visible: boolean;
}

interface CartNotificationContextType {
  notification: CartNotificationState;
  showNotification: (productName: string) => void;
  hideNotification: () => void;
}

const CartNotificationContext = createContext<CartNotificationContextType | null>(null);

export const CartNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<CartNotificationState>({
    productName: '',
    visible: false
  });

  const showNotification = useCallback((productName: string) => {
    setNotification({ productName, visible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <CartNotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </CartNotificationContext.Provider>
  );
};

export const useCartNotificationContext = () => {
  const ctx = useContext(CartNotificationContext);
  if (!ctx) throw new Error('useCartNotificationContext must be used within CartNotificationProvider');
  return ctx;
};
