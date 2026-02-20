// ===========================================
// MAPEO DE IMÁGENES LOCALES
// Este archivo preserva las rutas de imágenes originales
// para que el catálogo use datos de la BD pero imágenes locales
// ===========================================

// Brand logos
import logoBugatti from '@/assets/brands/bugatti.png';
import logoEasySmart from '@/assets/brands/easysmart.png';
import logoAirmez from '@/assets/brands/airmez.png';
import logoAirPlus from '@/assets/brands/air-plus.png';
import logoBlockElf from '@/assets/brands/block-elf.png';
import logoElfbarIceking from '@/assets/brands/elfbar-iceking.png';
import logoFly from '@/assets/brands/fly.png';
import logoHelloSynix from '@/assets/brands/hello-synix.png';
import logoIplayMax from '@/assets/brands/iplay-max.png';
import logoIplayXbox from '@/assets/brands/iplay-xbox.png';
import logoIvgRegal from '@/assets/brands/ivg-regal.png';
import logoMaskkingHighPro from '@/assets/brands/maskking-high-pro.png';
import logoMaskkingHighGts from '@/assets/brands/maskking-high-gts.png';
import logoMaskkingIcex from '@/assets/brands/maskking-icex.png';
import logoMaskkingJam from '@/assets/brands/maskking-jam.png';
import logoMaskkingUltra from '@/assets/brands/maskking-ultra.png';
import logoMaskkingVimaxi from '@/assets/brands/maskking-vimaxi.png';
import logoMetakuSpongie from '@/assets/brands/metaku-spongie.png';
import logoRabbeats from '@/assets/brands/rabbeats.png';
import logoRapid from '@/assets/brands/rapid.png';
import logoRifbar from '@/assets/brands/rifbar.png';
import logoTyson from '@/assets/brands/tyson.png';
import logoVapeBinder from '@/assets/brands/vape-binder.png';
import logoWaka from '@/assets/brands/waka.png';

// Brand banners (desktop)
import bannerAirPlus from '@/assets/banners/desktop-banner-1.png';
import bannerAirmez from '@/assets/banners/desktop-banner-2.png';
import bannerBlockElf from '@/assets/banners/desktop-banner-3.png';
import bannerBugatti from '@/assets/banners/desktop-banner-bugatti.png';
import bannerEasySmart from '@/assets/banners/desktop-banner-easysmart.png';
import bannerElfbarIceking from '@/assets/banners/desktop-banner-elfbar-iceking.png';
import bannerFly from '@/assets/banners/desktop-banner-fly.png';
import bannerHelloSynix from '@/assets/banners/desktop-banner-hello-synix.png';
import bannerIplayMax from '@/assets/banners/desktop-banner-iplay-max.png';

// Mobile banners
import mobileBannerElfbarIceking from '@/assets/banners/mobile/elfbar-iceking.png';
import mobileBannerFly from '@/assets/banners/mobile/fly.png';
import mobileBannerHelloSynix from '@/assets/banners/mobile/hello-synix.png';
import mobileBannerIplayMax from '@/assets/banners/mobile/iplay-max.png';
import mobileBannerIplayXbox from '@/assets/banners/mobile/iplay-xbox.png';
import mobileBannerIvgRegal from '@/assets/banners/mobile/ivg-regal.png';
import mobileBannerMaskkingHighGts from '@/assets/banners/mobile/maskking-high-gts.png';

// Hero banners for detail views
import airHeroBanner from '@/assets/air/hero-banner.png';
import airElite from '@/assets/air/air-elite.png';
import airPlus from '@/assets/air/air-plus.png';
import airRevolution from '@/assets/air/air-revolution.png';
import airmezHeroBanner from '@/assets/airmez/hero-banner.png';
import bugattiHeroBanner from '@/assets/bugatti/hero-banner.png';
import blockElfHeroBanner from '@/assets/block-elf/hero-banner.png';
import flyHeroBanner from '@/assets/fly/hero-banner.png';
import helloSynixHeroBanner from '@/assets/hello-synix/hero-banner.png';
import iplayMaxHeroBanner from '@/assets/iplay-max/hero-banner.png';
import iplayBigMax from '@/assets/iplay-max/big-max.png';
import iplayMax from '@/assets/iplay-max/max.png';
import iplayXboxHeroBanner from '@/assets/iplay-xbox/hero-banner.png';
import iplayXboxPro from '@/assets/iplay-xbox/x-box-pro.png';
import iplayXbox from '@/assets/iplay-xbox/x-box.png';
import ivgRegalHeroBanner from '@/assets/ivg-regal/hero-banner.png';
import maskkingHeroBanner from '@/assets/maskking-high-pro/hero-banner.png';
import maskkingHighPro from '@/assets/maskking-high-pro/high-pro.png';
import maskkingHighGts from '@/assets/maskking-high-pro/high-gts.png';
import maskkingHighGtsHeroBanner from '@/assets/maskking-high-gts/hero-banner.png';
import maskkingIcexHeroBanner from '@/assets/maskking-icex/hero-banner.png';
import maskkingJamHeroBanner from '@/assets/maskking-jam/hero-banner.png';
import maskkingUltraHeroBanner from '@/assets/maskking-ultra/hero-banner.png';
import maskkingVimaxiHeroBanner from '@/assets/maskking-vimaxi/hero-banner.png';
import metakuSpongieHeroBanner from '@/assets/metaku-spongie/hero-banner.png';
import rabbeatsHeroBanner from '@/assets/rabbeats/hero-banner.png';
import rifbarHeroBanner from '@/assets/rifbar/hero-banner.png';
import tysonHeroBanner from '@/assets/tyson/hero-banner.png';
import wakaHeroBanner from '@/assets/waka/hero-banner.png';
import wakaBlade from '@/assets/waka/dual-mesh-blade.png';
import wakaSoPro from '@/assets/waka/sopro.png';
import wakaSoMax from '@/assets/waka/somax.png';
import easysmartHeroBanner from '@/assets/easysmart/hero-banner.png';

// ===========================================
// MAPEO POR NOMBRE DE MARCA (normalizado a minúsculas)
// ===========================================

interface BrandAssets {
  logo: string;
  banner: string;
  mobileBanner?: string;
  heroBanner?: string;
  brandTitle?: string;
  tagline?: string;
  categoryImages?: Record<string, string>;
}

// Función para normalizar nombres (minúsculas, sin espacios extras)
const normalize = (name: string): string => name.toLowerCase().trim();

// Mapeo de marcas a sus assets
const brandAssetsMap: Record<string, BrandAssets> = {
  // 1. AIR PLUS
  'air': {
    logo: logoAirPlus,
    banner: bannerAirPlus,
    heroBanner: airHeroBanner,
    brandTitle: 'AIR™',
    tagline: 'Cool Mint + Berry Watermelon + Grape Ice',
    categoryImages: {
      'elite': airElite,
      'plus': airPlus,
      'revolution ultra': airRevolution,
      'revolution': airRevolution,
    }
  },
  'air plus': {
    logo: logoAirPlus,
    banner: bannerAirPlus,
    heroBanner: airHeroBanner,
    brandTitle: 'AIR™',
    tagline: 'Cool Mint + Berry Watermelon + Grape Ice',
    categoryImages: {
      'elite': airElite,
      'plus': airPlus,
      'revolution ultra': airRevolution,
      'revolution': airRevolution,
    }
  },
  // 2. AIRMEZ
  'airmez': {
    logo: logoAirmez,
    banner: bannerAirmez,
    heroBanner: airmezHeroBanner,
    brandTitle: 'AIRMEZ',
    tagline: 'Black Mamba + Blue Razz Ice',
  },
  // 3. BLOCK ELF
  'block elf': {
    logo: logoBlockElf,
    banner: bannerBlockElf,
    heroBanner: blockElfHeroBanner,
    brandTitle: 'BLOCK ELF',
    tagline: 'Experience The Exotic',
  },
  // 4. BUGATTI
  'bugatti': {
    logo: logoBugatti,
    banner: bannerBugatti,
    heroBanner: bugattiHeroBanner,
    brandTitle: 'BUGATTI',
    tagline: 'Luxury Vape Experience',
  },
  // 5. EASYSMART
  'easysmart': {
    logo: logoEasySmart,
    banner: bannerEasySmart,
    heroBanner: easysmartHeroBanner,
    brandTitle: 'EASYSMART',
    tagline: 'EA9000 Series',
  },
  'easy smart': {
    logo: logoEasySmart,
    banner: bannerEasySmart,
    heroBanner: easysmartHeroBanner,
    brandTitle: 'EASYSMART',
    tagline: 'EA9000 Series',
  },
  // 6. ELFBAR ICEKING
  'elfbar iceking': {
    logo: logoElfbarIceking,
    banner: mobileBannerElfbarIceking,
    heroBanner: mobileBannerElfbarIceking,
    brandTitle: 'ELFBAR ICEKING',
    tagline: 'Refrescante Experiencia Premium',
  },
  'elf bar ice king': {
    logo: logoElfbarIceking,
    banner: mobileBannerElfbarIceking,
    heroBanner: mobileBannerElfbarIceking,
    brandTitle: 'ELFBAR ICEKING',
    tagline: 'Refrescante Experiencia Premium',
  },
  // 7. FLY
  'fly': {
    logo: logoFly,
    banner: bannerFly,
    heroBanner: flyHeroBanner,
    brandTitle: 'FLY',
    tagline: 'Vuela Alto con Sabores Únicos',
  },
  // 8. HELLO SYNIX
  'hello synix': {
    logo: logoHelloSynix,
    banner: bannerHelloSynix,
    heroBanner: helloSynixHeroBanner,
    brandTitle: 'HELLO SYNIX',
    tagline: 'Zero Nicotine Experience',
  },
  // 9. IPLAY MAX
  'iplay max': {
    logo: logoIplayMax,
    banner: bannerIplayMax,
    heroBanner: iplayMaxHeroBanner,
    brandTitle: 'iPLAY MAX',
    tagline: 'Gaming Power',
    categoryImages: {
      'big max': iplayBigMax,
      'max': iplayMax,
    }
  },
  // 10. IPLAY XBOX
  'iplay xbox': {
    logo: logoIplayXbox,
    banner: mobileBannerIplayXbox,
    heroBanner: iplayXboxHeroBanner,
    brandTitle: 'iPLAY XBOX',
    tagline: 'Next Gen Gaming Power',
    categoryImages: {
      'xbox pro': iplayXboxPro,
      'xbox': iplayXbox,
      'vibar': iplayXboxPro,
    }
  },
  'iplay x-box': {
    logo: logoIplayXbox,
    banner: mobileBannerIplayXbox,
    heroBanner: iplayXboxHeroBanner,
    brandTitle: 'iPLAY XBOX',
    tagline: 'Next Gen Gaming Power',
    categoryImages: {
      'xbox pro': iplayXboxPro,
      'xbox': iplayXbox,
      'vibar': iplayXboxPro,
    }
  },
  // 11. IVG REGAL
  'ivg regal': {
    logo: logoIvgRegal,
    banner: mobileBannerIvgRegal,
    heroBanner: ivgRegalHeroBanner,
    brandTitle: 'IVG REGAL',
    tagline: 'Premium Tropical Fruits',
  },
  // 12. MASKKING HIGH PRO
  'maskking high pro': {
    logo: logoMaskkingHighPro,
    banner: maskkingHeroBanner,
    heroBanner: maskkingHeroBanner,
    brandTitle: 'MASKKING HIGH PRO',
    tagline: 'High Pro Performance',
    categoryImages: {
      'high pro': maskkingHighPro,
    }
  },
  'maskking': {
    logo: logoMaskkingHighPro,
    banner: maskkingHeroBanner,
    heroBanner: maskkingHeroBanner,
    brandTitle: 'MASKKING HIGH PRO',
    tagline: 'High Pro Performance',
    categoryImages: {
      'high pro': maskkingHighPro,
    }
  },
  // 13. MASKKING HIGH GTS
  'maskking high gts': {
    logo: logoMaskkingHighGts,
    banner: maskkingHighGtsHeroBanner,
    heroBanner: maskkingHighGtsHeroBanner,
    brandTitle: 'MASKKING HIGH GTS',
    tagline: 'Exotic High Tropical Performance',
    categoryImages: {
      'high gts': maskkingHighGts,
      'high gt': maskkingHighPro,
    }
  },
  // 14. MASKKING ICEX
  'maskking icex': {
    logo: logoMaskkingIcex,
    banner: maskkingIcexHeroBanner,
    heroBanner: maskkingIcexHeroBanner,
    brandTitle: 'MASKKING ICEX',
    tagline: 'Extreme Ice Experience',
  },
  'maskking ice x': {
    logo: logoMaskkingIcex,
    banner: maskkingIcexHeroBanner,
    heroBanner: maskkingIcexHeroBanner,
    brandTitle: 'MASKKING ICEX',
    tagline: 'Extreme Ice Experience',
  },
  // 15. MASKKING JAM
  'maskking jam': {
    logo: logoMaskkingJam,
    banner: maskkingJamHeroBanner,
    heroBanner: maskkingJamHeroBanner,
    brandTitle: 'MASKKING JAM',
    tagline: 'Party Vibes Evolution',
  },
  'maskking jam 2.0': {
    logo: logoMaskkingJam,
    banner: maskkingJamHeroBanner,
    heroBanner: maskkingJamHeroBanner,
    brandTitle: 'MASKKING JAM',
    tagline: 'Party Vibes Evolution',
  },
  // 16. MASKKING ULTRA
  'maskking ultra': {
    logo: logoMaskkingUltra,
    banner: maskkingUltraHeroBanner,
    heroBanner: maskkingUltraHeroBanner,
    brandTitle: 'MASKKING ULTRA',
    tagline: 'Cosmic Neon Power',
  },
  // 17. MASKKING VIMAXI
  'maskking vimaxi': {
    logo: logoMaskkingVimaxi,
    banner: maskkingVimaxiHeroBanner,
    heroBanner: maskkingVimaxiHeroBanner,
    brandTitle: 'MASKKING VIMAXI',
    tagline: 'Aurora Premium Experience',
  },
  // 18. METAKU SPONGIE
  'metaku spongie': {
    logo: logoMetakuSpongie,
    banner: metakuSpongieHeroBanner,
    heroBanner: metakuSpongieHeroBanner,
    brandTitle: 'METAKU SPONGIE',
    tagline: 'Sweet Cloud Fusion',
  },
  // 19. RABBEATS
  'rabbeats': {
    logo: logoRabbeats,
    banner: rabbeatsHeroBanner,
    heroBanner: rabbeatsHeroBanner,
    brandTitle: 'RABBEATS',
    tagline: 'Rhythm of Flavor',
  },
  // 20. RAPID (0 productos - en desarrollo)
  'rapid': {
    logo: logoRapid,
    banner: bannerAirPlus,
    brandTitle: 'RAPID',
    tagline: 'Próximamente',
  },
  // 21. RIFBAR
  'rifbar': {
    logo: logoRifbar,
    banner: rifbarHeroBanner,
    heroBanner: rifbarHeroBanner,
    brandTitle: 'RIFBAR',
    tagline: 'Turbo Velocity',
  },
  'rif bar': {
    logo: logoRifbar,
    banner: rifbarHeroBanner,
    heroBanner: rifbarHeroBanner,
    brandTitle: 'RIFBAR',
    tagline: 'Turbo Velocity',
  },
  // 22. TYSON
  'tyson': {
    logo: logoTyson,
    banner: tysonHeroBanner,
    heroBanner: tysonHeroBanner,
    brandTitle: 'TYSON',
    tagline: 'Knockout Power',
  },
  'tyson 2.0': {
    logo: logoTyson,
    banner: tysonHeroBanner,
    heroBanner: tysonHeroBanner,
    brandTitle: 'TYSON',
    tagline: 'Knockout Power',
  },
  // 23. VAPE BINDER (0 productos - en desarrollo)
  'vape binder': {
    logo: logoVapeBinder,
    banner: bannerAirPlus,
    brandTitle: 'VAPE BINDER',
    tagline: 'Próximamente',
  },
  // 24. WAKA
  'waka': {
    logo: logoWaka,
    banner: wakaHeroBanner,
    heroBanner: wakaHeroBanner,
    brandTitle: 'WAKA',
    tagline: 'Dual Mesh Technology',
    categoryImages: {
      'blade': wakaBlade,
      'sopro': wakaSoPro,
      'so pro': wakaSoPro,
      'nova': wakaSoMax,
      'somax': wakaSoMax,
      'so max': wakaSoMax,
    }
  },
  // 25. WONDER (en desarrollo)
  'wonder': {
    logo: logoAirPlus, // placeholder - en desarrollo
    banner: bannerAirPlus, // placeholder - en desarrollo
    brandTitle: 'WONDER',
    tagline: 'En Desarrollo',
  },
};

// ===========================================
// FUNCIONES DE ACCESO
// ===========================================

export function getBrandAssets(brandName: string): BrandAssets | null {
  const normalized = normalize(brandName);
  return brandAssetsMap[normalized] || null;
}

export function getBrandLogo(brandName: string): string | null {
  const assets = getBrandAssets(brandName);
  return assets?.logo || null;
}

export function getBrandBanner(brandName: string): string | null {
  const assets = getBrandAssets(brandName);
  return assets?.banner || null;
}

export function getBrandMobileBanner(brandName: string): string | null {
  const assets = getBrandAssets(brandName);
  return assets?.mobileBanner || null;
}

export function getBrandHeroBanner(brandName: string): string | null {
  const assets = getBrandAssets(brandName);
  return assets?.heroBanner || assets?.banner || null;
}

export function getBrandTitle(brandName: string): string | null {
  const assets = getBrandAssets(brandName);
  return assets?.brandTitle || null;
}

export function getBrandTagline(brandName: string): string | null {
  const assets = getBrandAssets(brandName);
  return assets?.tagline || null;
}

export function getCategoryImage(brandName: string, categoryName: string): string | null {
  const assets = getBrandAssets(brandName);
  if (!assets?.categoryImages) return null;
  const normalizedCategory = normalize(categoryName);
  return assets.categoryImages[normalizedCategory] || null;
}

export function hasCategoryImages(brandName: string): boolean {
  const assets = getBrandAssets(brandName);
  return !!assets?.categoryImages && Object.keys(assets.categoryImages).length > 0;
}

// Default fallback banner
export const defaultBanner = bannerAirPlus;
export const defaultLogo = logoAirPlus;
