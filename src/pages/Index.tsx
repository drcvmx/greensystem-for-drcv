import { useRef, useEffect, useMemo, useState } from 'react';
import { useBrands } from '@/hooks/useBrands';
import { brandHasProducts } from '@/services/brands';
import MainLayout from '@/components/shared/MainLayout';
import ScrollToTop from '@/components/shared/ScrollToTop';
import CatalogPageIndicator from '@/components/shared/CatalogPageIndicator';
import Home from '@/views/Home';
import BrandDetail from '@/views/BrandDetail';
import CustomBrandDetail from '@/views/CustomBrandDetail';

// AIR assets
import airHeroBanner from '@/assets/air/hero-banner.png';
import airElite from '@/assets/air/air-elite.png';
import airPlus from '@/assets/air/air-plus.png';
import airRevolution from '@/assets/air/air-revolution.png';

// Airmez assets
import airmezHeroBanner from '@/assets/airmez/hero-banner.png';

// Bugatti assets
import bugattiHeroBanner from '@/assets/bugatti/hero-banner.png';

// Easy Smart assets
import easySmartBanner from '@/assets/banners/desktop-banner-easysmart.png';

// Elf Bar Ice King assets
import elfbarIcekingBanner from '@/assets/banners/desktop-banner-elfbar-iceking.png';

// Maskking High Pro assets
import maskkingHeroBanner from '@/assets/maskking-high-pro/hero-banner.png';
import maskkingHighPro from '@/assets/maskking-high-pro/high-pro.png';
import maskkingHighGts from '@/assets/maskking-high-pro/high-gts.png';

// Waka assets
import wakaHeroBanner from '@/assets/waka/hero-banner.png';
import wakaBlade from '@/assets/waka/dual-mesh-blade.png';
import wakaSoPro from '@/assets/waka/sopro.png';
import wakaSoMax from '@/assets/waka/somax.png';

// iPlay Max assets
import iplayMaxHeroBanner from '@/assets/iplay-max/hero-banner.png';
import iplayBigMax from '@/assets/iplay-max/big-max.png';
import iplayMax from '@/assets/iplay-max/max.png';

// Block Elf assets
import blockElfHeroBanner from '@/assets/block-elf/hero-banner.png';

// Fly assets
import flyHeroBanner from '@/assets/fly/hero-banner.png';

// Hello Synix assets
import helloSynixHeroBanner from '@/assets/hello-synix/hero-banner.png';

// iPlay X-Box assets
import iplayXboxHeroBanner from '@/assets/iplay-xbox/hero-banner.png';
import iplayXboxPro from '@/assets/iplay-xbox/x-box-pro.png';
import iplayXbox from '@/assets/iplay-xbox/x-box.png';

// IVG Regal assets
import ivgRegalHeroBanner from '@/assets/ivg-regal/hero-banner.png';

// Tyson 2.0 assets
import tysonHeroBanner from '@/assets/tyson/hero-banner.png';

// Rif Bar assets
import rifbarHeroBanner from '@/assets/rifbar/hero-banner.png';

// Maskking Ice X assets
import maskkingIcexHeroBanner from '@/assets/maskking-icex/hero-banner.png';

// Maskking High GTS assets
import maskkingHighGtsHeroBanner from '@/assets/maskking-high-gts/hero-banner.png';

// Maskking Jam 2.0 assets
import maskkingJamHeroBanner from '@/assets/maskking-jam/hero-banner.png';

// Maskking Ultra assets
import maskkingUltraHeroBanner from '@/assets/maskking-ultra/hero-banner.png';

// Maskking Vimaxi assets
import maskkingVimaxiHeroBanner from '@/assets/maskking-vimaxi/hero-banner.png';

// Metaku Spongie assets
import metakuSpongieHeroBanner from '@/assets/metaku-spongie/hero-banner.png';

// RabBeats assets
import rabbeatsHeroBanner from '@/assets/rabbeats/hero-banner.png';

// Brand configurations for custom layouts
const CUSTOM_BRAND_CONFIGS: Record<string, {
  heroBanner: string;
  brandTitle: string;
  tagline?: string;
  categories?: { id: string; name: string; image?: string; flavorCount?: number }[];
}> = {
  '1': { // Air Plus
    heroBanner: airHeroBanner,
    brandTitle: 'AIR™',
    tagline: 'Cool Mint + Berry Watermelon + Grape Ice',
    categories: [
      { id: 'Elite', name: 'Elite', image: airElite, flavorCount: 16 },
      { id: 'Plus', name: 'Plus', image: airPlus, flavorCount: 16 },
      { id: 'Revolution Ultra', name: 'Revolution', image: airRevolution, flavorCount: 17 },
    ]
  },
  '2': { // Airmez
    heroBanner: airmezHeroBanner,
    brandTitle: 'AIRMEZ',
    tagline: 'Black Mamba + Blue Razz Ice',
  },
  '3': { // Bugatti
    heroBanner: bugattiHeroBanner,
    brandTitle: 'BUGATTI',
    tagline: 'Luxury Vape Experience',
  },
  '5': { // Block Elf
    heroBanner: blockElfHeroBanner,
    brandTitle: 'BLOCK ELF',
    tagline: 'Experience The Exotic',
  },
  '4': { // Easy Smart
    heroBanner: easySmartBanner,
    brandTitle: 'EASY SMART',
    tagline: 'EA9000 Series',
  },
  '6': { // Elf Bar Ice King
    heroBanner: elfbarIcekingBanner,
    brandTitle: 'ELF BAR ICE KING',
    tagline: 'Refrescante Experiencia Premium',
  },
  '7': { // Fly
    heroBanner: flyHeroBanner,
    brandTitle: 'FLY',
    tagline: 'Vuela Alto con Sabores Únicos',
  },
  '8': { // Hello Synix
    heroBanner: helloSynixHeroBanner,
    brandTitle: 'HELLO SYNIX',
    tagline: 'Zero Nicotine Experience',
  },
  '10': { // iPlay X-Box
    heroBanner: iplayXboxHeroBanner,
    brandTitle: 'iPLAY X-BOX',
    tagline: 'Next Gen Gaming Power',
    categories: [
      { id: 'Xbox Pro', name: 'X-Box Pro', image: iplayXboxPro, flavorCount: 14 },
      { id: 'Xbox', name: 'X-Box', image: iplayXbox, flavorCount: 25 },
    ]
  },
  '12': { // IVG Regal
    heroBanner: ivgRegalHeroBanner,
    brandTitle: 'IVG REGAL',
    tagline: 'Premium Tropical Fruits',
  },
  '23': { // Tyson 2.0
    heroBanner: tysonHeroBanner,
    brandTitle: 'TYSON 2.0',
    tagline: 'Knockout Power',
  },
  '22': { // Rif Bar
    heroBanner: rifbarHeroBanner,
    brandTitle: 'RIF BAR',
    tagline: 'Turbo Velocity',
  },
  '15': { // Maskking Ice X
    heroBanner: maskkingIcexHeroBanner,
    brandTitle: 'MASKKING ICE X',
    tagline: 'Extreme Ice Experience',
  },
  '14': { // Maskking High GTS
    heroBanner: maskkingHighGtsHeroBanner,
    brandTitle: 'MASKKING HIGH GT-S',
    tagline: 'Exotic High Tropical Performance',
  },
  '16': { // Maskking Jam 2.0
    heroBanner: maskkingJamHeroBanner,
    brandTitle: 'MASKKING JAM 2.0',
    tagline: 'Party Vibes Evolution',
  },
  '17': { // Maskking Ultra
    heroBanner: maskkingUltraHeroBanner,
    brandTitle: 'MASKKING ULTRA',
    tagline: 'Cosmic Neon Power',
  },
  '18': { // Maskking Vimaxi
    heroBanner: maskkingVimaxiHeroBanner,
    brandTitle: 'MASKKING VIMAXI',
    tagline: 'Aurora Premium Experience',
  },
  '19': { // Metaku Spongie
    heroBanner: metakuSpongieHeroBanner,
    brandTitle: 'METAKU SPONGIE',
    tagline: 'Sweet Cloud Fusion',
  },
  '20': { // RabBeats
    heroBanner: rabbeatsHeroBanner,
    brandTitle: 'RABBEATS',
    tagline: 'Rhythm of Flavor',
  },
  '13': { // Maskking High Pro
    heroBanner: maskkingHeroBanner,
    brandTitle: 'MASKKING',
    tagline: 'High Pro + High GT',
    categories: [
      { id: 'High Pro', name: 'High Pro', image: maskkingHighPro, flavorCount: 8 },
      { id: 'High GT', name: 'High GT', image: maskkingHighGts, flavorCount: 5 },
    ]
  },
  '25': { // Waka
    heroBanner: wakaHeroBanner,
    brandTitle: 'WAKA',
    tagline: 'Dual Mesh Technology',
    categories: [
      { id: 'Blade', name: 'Blade', image: wakaBlade, flavorCount: 11 },
      { id: 'SoPro', name: 'SoPro', image: wakaSoPro, flavorCount: 23 },
      { id: 'Nova', name: 'Nova', image: wakaSoMax, flavorCount: 10 },
    ]
  },
  '9': { // iPlay Max
    heroBanner: iplayMaxHeroBanner,
    brandTitle: 'iPLAY',
    tagline: 'Gaming Power',
    categories: [
      { id: 'Big Max', name: 'Big Max', image: iplayBigMax, flavorCount: 12 },
      { id: 'Max', name: 'Max', image: iplayMax, flavorCount: 10 },
    ]
  }
};

const Index = () => {
  const { brands, selectedBrand, selectBrand } = useBrands();
  const brandSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const brandsGridRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter brands that have products for the catalog display
  const brandsWithProducts = useMemo(() => 
    brands.filter(brand => brandHasProducts(brand.id)), 
    [brands]
  );

  // Total pages: Hero (1) + Brands Grid (2) + Each brand detail (3+)
  const totalPages = 2 + brandsWithProducts.length;

  // Detect current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Check if we're in the brands grid section first
      if (brandsGridRef.current) {
        const brandsTop = brandsGridRef.current.offsetTop;
        const brandsBottom = brandsTop + brandsGridRef.current.offsetHeight;
        
        // If we're in the brands grid area
        if (scrollY + windowHeight * 0.5 >= brandsTop && scrollY < brandsBottom - windowHeight * 0.3) {
          setCurrentPage(2);
          return;
        }
      }
      
      // Check if we're in the hero (before brands grid)
      if (brandsGridRef.current) {
        const brandsTop = brandsGridRef.current.offsetTop;
        if (scrollY + windowHeight * 0.5 < brandsTop) {
          setCurrentPage(1);
          return;
        }
      }
      
      // Check each brand section
      for (let i = 0; i < brandsWithProducts.length; i++) {
        const brand = brandsWithProducts[i];
        const el = brandSectionRefs.current[brand.id];
        if (el) {
          const elTop = el.offsetTop;
          const elBottom = elTop + el.offsetHeight;
          if (scrollY + windowHeight * 0.5 >= elTop && scrollY < elBottom - windowHeight * 0.3) {
            setCurrentPage(3 + i);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [brandsWithProducts]);

  // Scroll to the brand section when a brand is selected from the grid
  useEffect(() => {
    if (!selectedBrand) return;

    const el = brandSectionRefs.current[selectedBrand.id];
    if (!el) return;

    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [selectedBrand]);

  const renderBrandDetail = (brand: typeof brands[0]) => {
    const customConfig = CUSTOM_BRAND_CONFIGS[brand.id];
    
    if (customConfig) {
      return (
        <CustomBrandDetail
          brand={brand}
          onBack={() => selectBrand(null)}
          showCloseButton={selectedBrand?.id === brand.id}
          heroBanner={customConfig.heroBanner}
          brandTitle={customConfig.brandTitle}
          tagline={customConfig.tagline}
          categories={customConfig.categories}
        />
      );
    }
    
    return (
      <BrandDetail
        brand={brand}
        onBack={() => selectBrand(null)}
        showCloseButton={selectedBrand?.id === brand.id}
      />
    );
  };

  return (
    <MainLayout onSelectBrand={selectBrand}>
      {/* Hero + grid de marcas */}
      <Home
        brands={brands}
        onBrandClick={selectBrand}
        selectedBrandId={selectedBrand?.id || null}
        brandsGridRef={brandsGridRef}
      />

      {/* Catálogo scrolleable: solo marcas con productos */}
      <main>
        {brandsWithProducts.map((brand) => (
          <div
            key={brand.id}
            ref={(node) => {
              brandSectionRefs.current[brand.id] = node;
            }}
            id={`brand-${brand.id}`}
          >
            {renderBrandDetail(brand)}
          </div>
        ))}
      </main>

      <CatalogPageIndicator currentPage={currentPage} totalPages={totalPages} />
      <ScrollToTop />
    </MainLayout>
  );
};

export default Index;
