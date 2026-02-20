import { Brand } from "@/types";
import BrandCard from "./BrandCard";

interface BrandGridProps {
  brands: Brand[];
  onBrandClick: (brandId: string) => void;
  selectedBrandId?: string | null;
}

const BrandGrid = ({ brands, onBrandClick, selectedBrandId }: BrandGridProps) => {
  return (
    <section className="py-16 md:py-24 section-light" id="brands">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-pure-black/30" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-pure-black/30" />
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-section-light-fg tracking-wide">Marcas</h2>
          <p className="mt-4 text-section-light-muted max-w-lg mx-auto text-sm md:text-base">
            La Marca de vape que fumas
          </p>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
            >
              <BrandCard
                brand={brand}
                onClick={() => onBrandClick(brand.id)}
                isSelected={selectedBrandId === brand.id}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandGrid;
