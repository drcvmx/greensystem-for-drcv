import { RefObject } from "react";
import { ChevronDown } from "lucide-react";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.png";
import { Brand } from "@/types";
import BrandGrid from "@/components/brands/BrandGrid";

interface HomeProps {
  brands: Brand[];
  onBrandClick: (brandId: string) => void;
  selectedBrandId?: string | null;
  brandsGridRef?: RefObject<HTMLDivElement | null>;
  zoneName?: string;
}

const Home = ({ brands, onBrandClick, selectedBrandId, brandsGridRef, zoneName }: HomeProps) => {
  const scrollToBrands = () => {
    const brandsSection = document.getElementById("brands");
    brandsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image - Desktop */}
        <div className="absolute inset-0 hidden md:block">
          <img src={heroDesktop} alt="Green Alchemy Collection" className="w-full h-full object-cover object-center" />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        </div>

        {/* Background image - Mobile */}
        <div className="absolute inset-0 md:hidden">
          <img src={heroMobile} alt="Green Alchemy Collection" className="w-full h-full object-cover object-center" />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Zone Name - Large */}
            <div
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-foreground uppercase font-bold">
                {zoneName || 'GREEN ALCHEMY'}
              </h1>
            </div>

            {/* Divider */}
            <div
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-primary/60" />
                <div className="w-2 h-2 rotate-45 border border-primary/60" />
                <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-primary/60" />
              </div>
            </div>

            {/* Tagline */}
            <div
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <p className="text-lg md:text-xl text-muted-foreground tracking-[0.2em] uppercase font-light">
                Catálogo Premium 2026
              </p>
              <p className="mt-4 text-sm md:text-base text-muted-foreground/80 max-w-md mx-auto">
                Las marcas de vape más premium del mercado
              </p>
            </div>

            {/* CTA Button */}
            <div
              className="opacity-0 animate-fade-in-up pt-4"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              <button
                onClick={scrollToBrands}
                className="group inline-flex flex-col items-center gap-2 text-primary/80 hover:text-primary transition-colors duration-300"
              >
                <span className="text-xs tracking-[0.3em] uppercase">Escoger mi vape</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>
          </div>
        </div>

        {/* Art deco corner decorations */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/20 hidden md:block" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/20 hidden md:block" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/20 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/20 hidden md:block" />
      </section>

      {/* Brands Section */}
      <div ref={brandsGridRef}>
        <BrandGrid brands={brands} onBrandClick={onBrandClick} selectedBrandId={selectedBrandId} />
      </div>
    </>
  );
};

export default Home;
