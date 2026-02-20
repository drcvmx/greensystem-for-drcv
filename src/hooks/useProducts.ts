import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types';
import { getProductsByBrandId, getAllProducts } from '@/services/brands';

// Hook that uses static data
export const useProducts = (brandId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Simulate async loading
    setTimeout(() => {
      if (brandId) {
        setProducts(getProductsByBrandId(brandId));
      } else {
        setProducts(getAllProducts());
      }
      setLoading(false);
    }, 300);
  }, [brandId]);

  return {
    products,
    loading,
  };
};
