import { X } from 'lucide-react';
import { useBrandProducts } from '@/hooks/useBrandProducts';
import ProductAccordion from '@/components/products/ProductAccordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useRef, useMemo } from 'react';

interface CategoryData {
  id: string;
  name: string;
  image?: string;
  flavorCount?: number;
  /** Otros nombres/ids que pueden venir en la BD para esta misma categoría */
  aliases?: string[];
}

// Brand interface matching what ZoneCatalog passes
interface BrandProp {
  id: string;
  name: string;
  description?: string;
  logo_url: string;
  banner_url?: string;
  mobile_banner_url?: string;
}

interface CustomBrandDetailProps {
  brand: BrandProp;
  onBack: () => void;
  showCloseButton?: boolean;
  heroBanner: string;
  brandTitle: string;
  tagline?: string;
  categories?: CategoryData[];
}

const CustomBrandDetail = ({
  brand,
  onBack,
  showCloseButton = false,
  heroBanner,
  brandTitle,
  tagline,
  categories: customCategories,
}: CustomBrandDetailProps) => {
  const { products, loading } = useBrandProducts(brand.id);

  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flavorsRef = useRef<HTMLDivElement>(null);

  const normalize = (value?: string) => (value || '').toLowerCase().trim();

  const categoryMatchesProduct = (productCategory: string | undefined, category: CategoryData) => {
    const p = normalize(productCategory);
    if (!p) return false;

    if (p === normalize(category.id) || p === normalize(category.name)) return true;

    return (category.aliases || []).some((a) => p === normalize(a));
  };

  // Auto-detect categories from products if not provided
  const categories: CategoryData[] = useMemo(() => {
    if (customCategories && customCategories.length > 0) {
      return customCategories.map((cat) => ({
        ...cat,
        flavorCount:
          cat.flavorCount ??
          products.filter((p) => categoryMatchesProduct(p.category, cat)).length,
      }));
    }

    // Auto-generate from products
    const categoryMap = new Map<string, number>();
    products.forEach((p) => {
      if (p.category) {
        categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
      }
    });

    return Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      name: id,
      flavorCount: count,
    }));
  }, [customCategories, products]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    // Scroll to flavors section on desktop
    setTimeout(() => {
      flavorsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Filter products by selected category (match by id/name/aliases)
  const selectedCategoryObj = selectedCategory ? categories.find((c) => c.id === selectedCategory) : null;

  const filteredProducts = selectedCategoryObj
    ? products.filter((p) => categoryMatchesProduct(p.category, selectedCategoryObj))
    : products;

  const hasMultipleCategories = categories.length > 1;

  // Mobile: vertical layout
  if (isMobile) {
    return (
      <section className="bg-pure-black">
        {/* Hero Banner */}
        <div className="relative w-full" style={{ aspectRatio: '2/3', maxHeight: '70vh' }}>
          <img
            src={heroBanner}
            alt={brandTitle}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-pure-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="font-sans font-bold text-3xl tracking-[0.1em] text-white mb-2">{brandTitle}</h1>
            {tagline && <p className="text-white/80 text-sm">{tagline}</p>}
          </div>
        </div>

        {/* Categories + Flavors */}
        <div ref={containerRef} className="bg-pure-black">
          {hasMultipleCategories && (
            <div className="py-6 border-b border-border">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-border" />
                  <span className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Categorías</span>
                  <div className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-border" />
                </div>
                <div
                  className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="flex gap-3 w-max">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`flex-shrink-0 group transition-all duration-300 rounded-lg overflow-hidden ${
                          selectedCategory === category.id
                            ? 'ring-2 ring-whatsapp scale-[1.02]'
                            : 'hover:scale-[1.02]'
                        }`}
                        style={{ width: '140px' }}
                      >
                        <div className="relative w-full aspect-square bg-card">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-whatsapp/20 to-secondary/40" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="font-sans font-semibold text-sm text-white tracking-wider mb-0.5">{category.name}</h3>
                            <p className="text-white/70 text-[10px] tracking-wider">{category.flavorCount} sabores</p>
                          </div>
                          {selectedCategory === category.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-whatsapp rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flavors List - Gray theme */}
          <div className="py-6 bg-card">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-border" />
                  <span className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                    {selectedCategory ? `Sabores ${selectedCategory}` : 'Todos los Sabores'}
                  </span>
                  <span className="text-xs text-muted-foreground">({filteredProducts.length})</span>
                </div>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-whatsapp hover:text-whatsapp-light tracking-wider transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Ver todos
                  </button>
                )}
              </div>
              <ProductAccordion
                products={filteredProducts}
                brandName={brand.name}
                loading={loading}
                openCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop: 2-column layout - Banner left, Content right
  return (
    <section className="bg-pure-black">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
          {/* Left: Banner - Fixed width matching mobile aspect ratio */}
          <div className="opacity-0 animate-fade-in sticky top-24" style={{ animationFillMode: 'forwards' }}>
            <div
              className="relative rounded-lg overflow-hidden shadow-lg border border-border"
              style={{ width: '320px', aspectRatio: '2/3' }}
            >
              <img
                src={heroBanner}
                alt={brandTitle}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              {/* Overlay with brand info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h1 className="font-sans font-bold text-xl tracking-[0.1em] text-white mb-1">{brandTitle}</h1>
                {tagline && <p className="text-white/70 text-xs">{tagline}</p>}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div ref={containerRef} className="flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-card rounded-sm p-2 flex items-center justify-center shadow-md border border-border">
                  <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-2xl text-foreground tracking-wider">{brand.name}</h2>
                  <p className="text-muted-foreground text-sm">{brand.description}</p>
                </div>
              </div>
              {showCloseButton && (
                <button onClick={onBack} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Volver">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Categories - horizontal scroll - Dark theme */}
            {hasMultipleCategories && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-border" />
                  <span className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Categorías</span>
                  <div className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-border" />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex-shrink-0 group transition-all duration-300 rounded-lg overflow-hidden ${
                        selectedCategory === category.id
                          ? 'ring-2 ring-whatsapp scale-[1.02]'
                          : 'hover:scale-[1.02]'
                      }`}
                      style={{ width: '160px' }}
                    >
                      <div className="relative w-full aspect-square bg-card">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-whatsapp/20 to-secondary/40" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="font-sans font-semibold text-sm text-white tracking-wider mb-0.5">{category.name}</h3>
                          <p className="text-white/70 text-[10px] tracking-wider">{category.flavorCount} sabores</p>
                        </div>
                        {selectedCategory === category.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-whatsapp rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sabores section - Gray theme */}
            <div ref={flavorsRef} className="flex-1 bg-card p-4 md:p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-border" />
                  <span className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                    {selectedCategory ? `Sabores ${selectedCategory}` : 'Todos los Sabores'}
                  </span>
                  <span className="text-xs text-muted-foreground">({filteredProducts.length})</span>
                </div>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-whatsapp hover:text-whatsapp-light tracking-wider transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Ver todos
                  </button>
                )}
              </div>

              <ProductAccordion
                products={filteredProducts}
                brandName={brand.name}
                loading={loading}
                openCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomBrandDetail;
