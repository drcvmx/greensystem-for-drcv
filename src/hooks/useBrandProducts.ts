import { useMemo } from 'react';
import { useOptionalCatalog } from '@/context/CatalogContext';
import { useProducts as useLegacyProducts } from '@/hooks/useProducts';

export function useBrandProducts(brandId?: string) {
  const catalog = useOptionalCatalog();
  const legacy = useLegacyProducts(brandId);

  const catalogProducts = useMemo(() => {
    if (!catalog || !brandId) return null;
    return catalog.getBrandProducts(brandId);
  }, [catalog, brandId]);

  return {
    products: catalogProducts ?? legacy.products,
    loading: catalog ? false : legacy.loading,
  };
}
