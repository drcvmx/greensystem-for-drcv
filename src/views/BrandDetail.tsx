import { X } from 'lucide-react';
import { useBrandProducts } from '@/hooks/useBrandProducts';
import ProductAccordion from '@/components/products/ProductAccordion';
import { useIsMobile } from '@/hooks/use-mobile';

// Brand interface matching what ZoneCatalog passes
interface BrandProp {
  id: string;
  name: string;
  description?: string;
  logo_url: string;
  banner_url?: string;
  mobile_banner_url?: string;
}

interface BrandDetailProps {
  brand: BrandProp;
  onBack: () => void;
  showCloseButton?: boolean;
}

const BrandDetail = ({ brand, onBack, showCloseButton = false }: BrandDetailProps) => {
  const { products, loading } = useBrandProducts(brand.id);
  const isMobile = useIsMobile();

  // Always prefer mobile banner (portrait format) for consistent 2-column layout
  const bannerUrl = brand.mobile_banner_url || brand.banner_url;

  // Mobile: vertical layout | Desktop: 2-column layout
  if (isMobile) {
    return (
      <section className="bg-pure-black">
        {/* Mobile: Hero banner full width */}
        <div className="relative w-full" style={{ aspectRatio: '2/3', maxHeight: '70vh' }}>
          <img
            src={bannerUrl}
            alt={`${brand.name} banner`}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent" />

          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={onBack}
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm rounded-full"
              aria-label="Volver a marcas"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mobile: Brand info below hero */}
        <div className="bg-pure-black py-6 relative border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              {/* Brand logo */}
              <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <div className="w-14 h-14 bg-card rounded-sm p-2 flex items-center justify-center shadow-md border border-border">
                  <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Brand name and description */}
              <div className="flex-1">
                <h2 className="font-sans font-bold text-lg text-foreground tracking-wider mb-0.5">{brand.name}</h2>
                <p className="text-muted-foreground text-xs line-clamp-2">{brand.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Sabores section - Gray theme */}
        <div className="bg-card py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 max-w-[30px] bg-gradient-to-r from-transparent to-border" />
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-medium">Sabores</span>
              <div className="h-px flex-1 max-w-[30px] bg-gradient-to-l from-transparent to-border" />
            </div>

            <ProductAccordion products={products} brandName={brand.name} loading={loading} />
          </div>
        </div>
      </section>
    );
  }

  // Desktop: 2-column layout - Banner left, Content right
  return (
    <section className="bg-pure-black">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start">
          {/* Left: Banner - Fixed width matching mobile aspect ratio */}
          <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ width: '320px', aspectRatio: '2/3' }}>
              <img
                src={bannerUrl}
                alt={`${brand.name} banner`}
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Right: Brand info + Sabores */}
          <div className="flex flex-col">
            {/* Brand header */}
            <div className="flex items-center gap-6 mb-8">
              {/* Brand logo */}
              <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <div className="w-16 h-16 bg-card rounded-sm p-2 flex items-center justify-center shadow-md border border-border">
                  <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Brand name and description */}
              <div className="flex-1">
                <h2 className="font-sans font-bold text-2xl lg:text-3xl text-foreground tracking-wider mb-1">{brand.name}</h2>
                <p className="text-muted-foreground text-sm max-w-lg">{brand.description}</p>
              </div>

              {/* Close button */}
              {showCloseButton && (
                <button
                  onClick={onBack}
                  className="group inline-flex items-center justify-center w-10 h-10 text-foreground/60 hover:text-foreground transition-colors duration-300 bg-muted/50 backdrop-blur-sm rounded-full"
                  aria-label="Volver a marcas"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sabores section - Gray theme */}
            <div className="flex-1 bg-card p-4 md:p-6 rounded-lg border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-border" />
                <span className="text-sm tracking-[0.3em] text-muted-foreground uppercase font-medium">Sabores</span>
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-border" />
              </div>

              <div className="overflow-y-auto pr-3" style={{ maxHeight: '400px' }}>
                <ProductAccordion products={products} brandName={brand.name} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandDetail;
