import { createContext, useContext } from 'react';
import type { CatalogProduct } from '@/hooks/useZoneCatalog';

export interface CatalogContextValue {
  getBrandProducts: (brandId: string) => CatalogProduct[];
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export const CatalogProvider = CatalogContext.Provider;

export function useOptionalCatalog() {
  return useContext(CatalogContext);
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within <CatalogProvider>');
  return ctx;
}
