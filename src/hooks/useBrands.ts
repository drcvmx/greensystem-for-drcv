import { useState, useCallback } from 'react';
import { Brand } from '@/types';
import { getBrands, getBrandById } from '@/services/brands';

export const useBrands = () => {
  const [brands] = useState<Brand[]>(getBrands());
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    getBrands().forEach(brand => {
      initial[brand.id] = brand.likes_count;
    });
    return initial;
  });

  const selectBrand = useCallback((brandId: string | null) => {
    if (brandId) {
      const brand = getBrandById(brandId);
      setSelectedBrand(brand || null);
      // Scroll is handled by Index.tsx useEffect
    } else {
      setSelectedBrand(null);
    }
  }, []);

  const toggleLike = useCallback((brandId: string) => {
    setLikes(prev => ({
      ...prev,
      [brandId]: prev[brandId] + 1
    }));
  }, []);

  return {
    brands,
    selectedBrand,
    selectBrand,
    likes,
    toggleLike,
  };
};
