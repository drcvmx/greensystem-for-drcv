import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '@/components/shared/MainLayout';
import ScrollToTop from '@/components/shared/ScrollToTop';
import CatalogPageIndicator from '@/components/shared/CatalogPageIndicator';
import Home from '@/views/Home';
import BrandDetail from '@/views/BrandDetail';
import CustomBrandDetail from '@/views/CustomBrandDetail';
import { Loader2 } from 'lucide-react';
import { CatalogProvider } from '@/context/CatalogContext';
import { useZoneCatalog } from '@/hooks/useZoneCatalog';
import { ZONE_CONFIGS, ZONE_BY_SLUG } from '@/config/zones';

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

// Brand configurations for custom layouts (misma distribución de imágenes)
const CUSTOM_BRAND_CONFIGS: Record<
  string,
  {
    heroBanner: string;
    brandTitle: string;
    tagline?: string;
    categories?: { id: string; name: string; image?: string; flavorCount?: number; aliases?: string[] }[];
  }
> = {
  '1': {
    // AIR
    heroBanner: airHeroBanner,
    brandTitle: 'AIR™',
    tagline: 'Cool Mint + Berry Watermelon + Grape Ice',
    categories: [
      { id: 'Elite', name: 'Elite', image: airElite },
      { id: 'Plus', name: 'Plus', image: airPlus },
      { id: 'Revolution Ultra', name: 'Revolution', image: airRevolution },
    ],
  },
  '2': {
    // Airmez
    heroBanner: airmezHeroBanner,
    brandTitle: 'AIRMEZ',
    tagline: 'Black Mamba + Blue Razz Ice',
  },
  '3': {
    // Bugatti
    heroBanner: bugattiHeroBanner,
    brandTitle: 'BUGATTI',
    tagline: 'Luxury Vape Experience',
  },
  '5': {
    // Block Elf
    heroBanner: blockElfHeroBanner,
    brandTitle: 'BLOCK ELF',
    tagline: 'Experience The Exotic',
  },
  '4': {
    // Easy Smart
    heroBanner: easySmartBanner,
    brandTitle: 'EASY SMART',
    tagline: 'EA9000 Series',
  },
  '6': {
    // Elf Bar Ice King
    heroBanner: elfbarIcekingBanner,
    brandTitle: 'ELF BAR ICE KING',
    tagline: 'Refrescante Experiencia Premium',
  },
  '7': {
    // Fly
    heroBanner: flyHeroBanner,
    brandTitle: 'FLY',
    tagline: 'Vuela Alto con Sabores Únicos',
  },
  '8': {
    // Hello Synix
    heroBanner: helloSynixHeroBanner,
    brandTitle: 'HELLO SYNIX',
    tagline: 'Zero Nicotine Experience',
  },
  '10': {
    // iPlay X-Box
    heroBanner: iplayXboxHeroBanner,
    brandTitle: 'iPLAY X-BOX',
    tagline: 'Next Gen Gaming Power',
    categories: [
      { id: 'XBOX PRO', name: 'X-Box Pro', image: iplayXboxPro, aliases: ['VIBAR', 'XBOX PRO'] },
      { id: 'XBOX', name: 'X-Box', image: iplayXbox },
    ],
  },
  '12': {
    // IVG Regal
    heroBanner: ivgRegalHeroBanner,
    brandTitle: 'IVG REGAL',
    tagline: 'Premium Tropical Fruits',
  },
  '23': {
    // Tyson 2.0
    heroBanner: tysonHeroBanner,
    brandTitle: 'TYSON 2.0',
    tagline: 'Knockout Power',
  },
  '22': {
    // Rif Bar
    heroBanner: rifbarHeroBanner,
    brandTitle: 'RIF BAR',
    tagline: 'Turbo Velocity',
  },
  '15': {
    // Maskking Ice X
    heroBanner: maskkingIcexHeroBanner,
    brandTitle: 'MASKKING ICE X',
    tagline: 'Extreme Ice Experience',
  },
  '14': {
    // Maskking High GTS
    heroBanner: maskkingHighGtsHeroBanner,
    brandTitle: 'MASKKING HIGH GTS',
    tagline: 'Exotic High Tropical Performance',
    categories: [
      { id: 'HIGH GTS', name: 'High GTS', image: maskkingHighGts },
      { id: 'HIGH GT', name: 'High GT', image: maskkingHighPro },
    ],
  },
  '16': {
    // Maskking Jam 2.0
    heroBanner: maskkingJamHeroBanner,
    brandTitle: 'MASKKING JAM 2.0',
    tagline: 'Party Vibes Evolution',
  },
  '17': {
    // Maskking Ultra
    heroBanner: maskkingUltraHeroBanner,
    brandTitle: 'MASKKING ULTRA',
    tagline: 'Cosmic Neon Power',
  },
  '18': {
    // Maskking Vimaxi
    heroBanner: maskkingVimaxiHeroBanner,
    brandTitle: 'MASKKING VIMAXI',
    tagline: 'Aurora Premium Experience',
  },
  '19': {
    // Metaku Spongie
    heroBanner: metakuSpongieHeroBanner,
    brandTitle: 'METAKU SPONGIE',
    tagline: 'Sweet Cloud Fusion',
  },
  '20': {
    // RabBeats
    heroBanner: rabbeatsHeroBanner,
    brandTitle: 'RABBEATS',
    tagline: 'Rhythm of Flavor',
  },
  '13': {
    // Maskking High Pro
    heroBanner: maskkingHeroBanner,
    brandTitle: 'MASKKING HIGH PRO',
    tagline: 'High Pro Performance',
    categories: [
      { id: 'HIGH PRO', name: 'High Pro', image: maskkingHighPro },
    ],
  },
  '25': {
    // Waka
    heroBanner: wakaHeroBanner,
    brandTitle: 'WAKA',
    tagline: 'Dual Mesh Technology',
    categories: [
      { id: 'Blade', name: 'Blade', image: wakaBlade },
      { id: 'SoPro', name: 'SoPro', image: wakaSoPro },
      { id: 'Nova', name: 'Nova', image: wakaSoMax },
    ],
  },
  '9': {
    // iPlay Max
    heroBanner: iplayMaxHeroBanner,
    brandTitle: 'iPLAY',
    tagline: 'Gaming Power',
    categories: [
      { id: 'Big Max', name: 'Big Max', image: iplayBigMax },
      { id: 'Max', name: 'Max', image: iplayMax },
    ],
  },
};

const normalize = (s: string) => s.toLowerCase().trim();

// Mapeo por nombre de BD -> IDs legacy (para conservar la distribución existente)
// Los nombres en la BD son: AIR, AIRMEZ, BLOCK-ELF, BUGATTI, ELF-BAR, etc.
const LEGACY_ID_BY_BRAND_NAME: Record<string, string> = {
  air: '1',
  'air™': '1',
  'air plus': '1',
  airmez: '2',
  bugatti: '3',
  'easy-smart': '4',
  'easy smart': '4',
  'block-elf': '5',
  'block elf': '5',
  'elf-bar': '6',
  'elf bar': '6',
  'elf bar ice king': '6',
  fly: '7',
  'hello-synix': '8',
  'hello synix': '8',
  iplay: '9',
  'iplay max': '9',
  'iplay xbox': '10',
  'iplay x-box': '10',
  'iplay x-box pro': '10',
  ivg: '12',
  'ivg regal': '12',
  maskking: '13',
  'maskking high gts': '14',
  'maskking ice x': '15',
  'maskking jam 2.0': '16',
  'maskking ultra': '17',
  'maskking vimaxi': '18',
  metaku: '19',
  'metaku spongie': '19',
  rabbeats: '20',
  rapid: '21',
  rifbar: '22',
  'rif bar': '22',
  tyson: '23',
  'tyson 2.0': '23',
  'vape-binder': '24',
  'vape binder': '24',
  waka: '25',
  wonder: '25',
};

const getLegacyIdForBrandName = (brandName: string): string | null => {
  const key = normalize(brandName);
  return LEGACY_ID_BY_BRAND_NAME[key] || null;
};

const ZoneCatalog = () => {
  const { zone } = useParams<{ zone: string }>();

  const brandSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const brandsGridRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  // Validate zone
  const zoneConfig = zone ? ZONE_CONFIGS[zone] : null;
  const zoneInfo = zone ? ZONE_BY_SLUG[zone] : undefined;

  // Load data from backend
  const { brands, loading, error, getBrandProducts, brandHasProducts } = useZoneCatalog(zone || '');

  const selectedBrand = useMemo(
    () => brands.find((b) => b.id === selectedBrandId) || null,
    [brands, selectedBrandId],
  );

  // Filter brands that have products for the catalog display
  const brandsWithProducts = useMemo(
    () => brands.filter((brand) => brandHasProducts(brand.id)),
    [brands, brandHasProducts],
  );

  // Total pages: Hero (1) + Brands Grid (2) + Each brand detail (3+)
  const totalPages = 2 + brandsWithProducts.length;

  // Select brand handler
  const selectBrand = (brandId: string | null) => {
    setSelectedBrandId(brandId);
  };

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
    handleScroll();

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

  // Redirect to 404 if zone is invalid
  if (!zoneConfig) {
    return <Navigate to="/404" replace />;
  }

  if (loading) {
    return (
      <MainLayout onSelectBrand={selectBrand} zoneName={zoneConfig.name} zoneInfo={zoneInfo}>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Cargando catálogo...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout onSelectBrand={selectBrand} zoneName={zoneConfig.name} zoneInfo={zoneInfo}>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <p className="text-destructive text-lg">{error}</p>
            <p className="text-muted-foreground">Por favor intenta de nuevo más tarde</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const renderBrandDetail = (brand: (typeof brands)[0]) => {
    const legacyId = getLegacyIdForBrandName(brand.name);
    const customConfig = legacyId ? CUSTOM_BRAND_CONFIGS[legacyId] : undefined;

    if (customConfig) {
      // Importante: dejamos que CustomBrandDetail calcule el conteo real desde los productos.
      const customCategories = customConfig.categories
        ? customConfig.categories.map((c) => ({ id: c.id, name: c.name, image: c.image, aliases: c.aliases }))
        : undefined;

      return (
        <CustomBrandDetail
          brand={brand}
          onBack={() => selectBrand(null)}
          showCloseButton={selectedBrand?.id === brand.id}
          heroBanner={customConfig.heroBanner}
          brandTitle={customConfig.brandTitle}
          tagline={customConfig.tagline}
          categories={customCategories}
        />
      );
    }

    return (
      <BrandDetail brand={brand} onBack={() => selectBrand(null)} showCloseButton={selectedBrand?.id === brand.id} />
    );
  };

  return (
    <CatalogProvider value={{ getBrandProducts }}>
      <MainLayout onSelectBrand={selectBrand} zoneName={zoneConfig.name} zoneInfo={zoneInfo}>
        {/* Hero + grid de marcas */}
        <Home
          brands={brands}
          onBrandClick={selectBrand}
          selectedBrandId={selectedBrand?.id || null}
          brandsGridRef={brandsGridRef}
          zoneName={zoneConfig.name}
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
    </CatalogProvider>
  );
};

export default ZoneCatalog;
