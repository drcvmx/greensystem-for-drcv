import { useState, useEffect, useMemo, useCallback } from 'react';
import { demoStorage } from '@/lib/demoStorage';
import {
  getBrandAssets,
  defaultBanner,
  defaultLogo,
} from '@/config/localAssets';

// Types matching what the catalog expects
export interface CatalogBrand {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  mobile_banner_url?: string;
  likes_count: number;
  created_at: string;
  is_active: boolean;
}

export interface CatalogCategory {
  id: string;
  brand_id: string;
  name: string;
  image?: string;
  is_active: boolean;
  price?: number;
}

export interface CatalogVariant {
  id: string;
  category_id: string;
  name: string;
  is_active: boolean;
}

// Product type expected by ProductAccordion
export interface CatalogProduct {
  id: string;
  brand_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at: string;
}

interface UseZoneCatalogResult {
  brands: CatalogBrand[];
  categories: CatalogCategory[];
  variants: CatalogVariant[];
  loading: boolean;
  error: string | null;
  getBrandProducts: (brandId: string) => CatalogProduct[];
  brandHasProducts: (brandId: string) => boolean;
}

const normalize = (s: string) => s.toLowerCase().trim();

const BRAND_NAME_TO_ASSETS_KEY: Record<string, string> = {
  air: 'air',
  'air plus': 'air plus',
  airmez: 'airmez',
  bugatti: 'bugatti',
  'block-elf': 'block elf',
  'block elf': 'block elf',
  'easy-smart': 'easy smart',
  'easy smart': 'easy smart',
  'elf-bar': 'elf bar ice king',
  'elf bar': 'elf bar ice king',
  'elf bar ice king': 'elf bar ice king',
  fly: 'fly',
  'hello-synix': 'hello synix',
  'hello synix': 'hello synix',
  iplay: 'iplay max',
  'iplay max': 'iplay max',
  'iplay x-box': 'iplay x-box',
  ivg: 'ivg regal',
  'ivg regal': 'ivg regal',
  maskking: 'maskking high pro',
  'maskking high pro': 'maskking high pro',
  'maskking high gts': 'maskking high gts',
  'maskking ice x': 'maskking ice x',
  'maskking jam 2.0': 'maskking jam 2.0',
  'maskking ultra': 'maskking ultra',
  'maskking vimaxi': 'maskking vimaxi',
  metaku: 'metaku spongie',
  'metaku spongie': 'metaku spongie',
  rabbeats: 'rabbeats',
  rapid: 'rapid',
  rifbar: 'rif bar',
  'rif bar': 'rif bar',
  tyson: 'tyson 2.0',
  'tyson 2.0': 'tyson 2.0',
  'vape-binder': 'vape binder',
  'vape binder': 'vape binder',
  waka: 'waka',
  wonder: 'waka',
};

function getAssetsKeyForBrandName(name: string): string {
  const key = normalize(name);
  return BRAND_NAME_TO_ASSETS_KEY[key] || key;
}

export function useZoneCatalog(zoneSlug: string): UseZoneCatalogResult {
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [variants, setVariants] = useState<CatalogVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      // 1) Get zone by slug
      const zones = demoStorage.getAll('zones');
      const zone = zones.find((z: any) => z.slug === zoneSlug && z.is_active);

      if (!zone) {
        setError('Zona no encontrada');
        return;
      }

      const zoneId = zone.id;

      // 2) Brands
      const allBrands = demoStorage.getAll('brands');
      const zoneBrands = allBrands.filter((b: any) => b.zone_id === zoneId && b.is_active);
      const brandIds = zoneBrands.map((b: any) => b.id);

      // 3) Categories
      const allCategories = demoStorage.getAll('categories');
      const zoneCategories = allCategories.filter((c: any) => brandIds.includes(c.brand_id) && c.is_active);
      const categoryIds = zoneCategories.map((c: any) => c.id);

      // 4) Variants
      const allVariants = demoStorage.getAll('variants');
      const zoneVariants = allVariants.filter((v: any) => categoryIds.includes(v.category_id) && v.is_active);

      // 5) Transform brands
      const transformedBrands: CatalogBrand[] = zoneBrands.map((b: any) => {
        const assetsKey = getAssetsKeyForBrandName(b.name);
        const assets = getBrandAssets(assetsKey);
        return {
          id: b.id,
          name: b.name,
          description: assets?.tagline || '',
          logo_url: assets?.logo || defaultLogo,
          banner_url: assets?.banner || defaultBanner,
          mobile_banner_url: assets?.mobileBanner || undefined,
          likes_count: 0,
          created_at: b.created_at,
          is_active: b.is_active,
        };
      });

      // 6) Transform categories
      const transformedCategories: CatalogCategory[] = zoneCategories.map((c: any) => ({
        id: c.id,
        brand_id: c.brand_id,
        name: c.name,
        image: c.image_url || undefined,
        is_active: c.is_active,
        price: c.price ? parseFloat(c.price) : undefined,
      }));

      // 7) Transform variants
      const transformedVariants: CatalogVariant[] = zoneVariants.map((v: any) => ({
        id: v.id,
        category_id: v.category_id,
        name: v.name,
        is_active: v.is_active,
      }));

      setBrands(transformedBrands);
      setCategories(transformedCategories);
      setVariants(transformedVariants);
    } catch (err) {
      console.error('Error loading catalog:', err);
      setError('Error cargando el catálogo');
    } finally {
      setLoading(false);
    }
  }, [zoneSlug]);

  useEffect(() => {
    if (zoneSlug) fetchData();
    window.addEventListener('demo_storage_update', fetchData);
    return () => window.removeEventListener('demo_storage_update', fetchData);
  }, [fetchData, zoneSlug]);

  const getBrandProducts = useMemo(() => {
    return (brandId: string): CatalogProduct[] => {
      const brandCategories = categories.filter((c) => c.brand_id === brandId);
      const products: CatalogProduct[] = [];

      brandCategories.forEach((cat) => {
        const catVariants = variants.filter((v) => v.category_id === cat.id);
        catVariants.forEach((variant) => {
          products.push({
            id: variant.id,
            brand_id: brandId,
            name: variant.name,
            description: '',
            price: cat.price || 0,
            image_url: '',
            category: cat.name,
            in_stock: true,
            created_at: variant.id,
          });
        });
      });

      return products;
    };
  }, [categories, variants]);

  const brandHasProducts = useMemo(() => {
    return (brandId: string): boolean => {
      const brandCategories = categories.filter((c) => c.brand_id === brandId);
      if (brandCategories.length === 0) return false;
      return brandCategories.some((cat) => variants.some((v) => v.category_id === cat.id));
    };
  }, [categories, variants]);

  return {
    brands,
    categories,
    variants,
    loading,
    error,
    getBrandProducts,
    brandHasProducts,
  };
}
