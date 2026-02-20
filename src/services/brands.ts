import { Brand, Product } from '@/types';

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
import logoMaskking from '@/assets/brands/maskking.png';
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


export const brands: Brand[] = [
  {
    id: '1',
    name: 'Air Plus',
    description: 'Dispositivos premium de última generación con tecnología avanzada.',
    logo_url: logoAirPlus,
    banner_url: bannerAirPlus,
    likes_count: 128,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Airmez',
    description: 'Innovación y diseño en cada producto. Calidad excepcional.',
    logo_url: logoAirmez,
    banner_url: bannerAirmez,
    likes_count: 95,
    created_at: '2024-01-01',
  },
  {
    id: '3',
    name: 'Bugatti',
    description: 'Lujo y rendimiento incomparables. La excelencia en vapeo.',
    logo_url: logoBugatti,
    banner_url: bannerBugatti,
    likes_count: 156,
    created_at: '2024-01-01',
  },
  {
    id: '4',
    name: 'Easy Smart',
    description: 'Dispositivos POD desechables. Simplicidad y conveniencia.',
    logo_url: logoEasySmart,
    banner_url: bannerEasySmart,
    likes_count: 87,
    created_at: '2024-01-01',
  },
  {
    id: '5',
    name: 'Block Elf',
    description: '5th Edition. Diseño único y sabores excepcionales.',
    logo_url: logoBlockElf,
    banner_url: bannerBlockElf,
    likes_count: 203,
    created_at: '2024-01-01',
  },
  {
    id: '6',
    name: 'Elf Bar Ice King',
    description: 'Experiencia refrescante de alta calidad.',
    logo_url: logoElfbarIceking,
    banner_url: bannerElfbarIceking,
    mobile_banner_url: mobileBannerElfbarIceking,
    likes_count: 145,
    created_at: '2024-01-01',
  },
  {
    id: '7',
    name: 'Fly',
    description: 'Vuela alto con sabores únicos.',
    logo_url: logoFly,
    banner_url: bannerFly,
    mobile_banner_url: mobileBannerFly,
    likes_count: 112,
    created_at: '2024-01-01',
  },
  {
    id: '8',
    name: 'Hello Synix',
    description: 'Innovación y tecnología avanzada.',
    logo_url: logoHelloSynix,
    banner_url: bannerHelloSynix,
    mobile_banner_url: mobileBannerHelloSynix,
    likes_count: 98,
    created_at: '2024-01-01',
  },
  {
    id: '9',
    name: 'iPlay Max',
    description: 'Máximo rendimiento y potencia.',
    logo_url: logoIplayMax,
    banner_url: bannerIplayMax,
    mobile_banner_url: mobileBannerIplayMax,
    likes_count: 167,
    created_at: '2024-01-01',
  },
  {
    id: '10',
    name: 'iPlay X-Box',
    description: 'La nueva generación de vapeo.',
    logo_url: logoIplayXbox,
    banner_url: bannerEasySmart,
    mobile_banner_url: mobileBannerIplayXbox,
    likes_count: 134,
    created_at: '2024-01-01',
  },
  {
    id: '12',
    name: 'IVG Regal',
    description: 'Calidad real para paladares exigentes.',
    logo_url: logoIvgRegal,
    banner_url: bannerBugatti,
    mobile_banner_url: mobileBannerIvgRegal,
    likes_count: 178,
    created_at: '2024-01-01',
  },
  {
    id: '13',
    name: 'Maskking High Pro',
    description: 'Profesionalismo en cada calada.',
    logo_url: logoMaskking,
    banner_url: bannerAirmez,
    likes_count: 156,
    created_at: '2024-01-01',
  },
  {
    id: '14',
    name: 'Maskking High GTS',
    description: 'Gran Turismo de sabores.',
    logo_url: logoMaskkingHighGts,
    banner_url: bannerEasySmart,
    mobile_banner_url: mobileBannerMaskkingHighGts,
    likes_count: 142,
    created_at: '2024-01-01',
  },
  {
    id: '15',
    name: 'Maskking Ice X',
    description: 'Frescura extrema en cada puff.',
    logo_url: logoMaskkingIcex,
    banner_url: bannerBlockElf,
    likes_count: 189,
    created_at: '2024-01-01',
  },
  {
    id: '16',
    name: 'Maskking Jam 2.0',
    description: 'La evolución del sabor intenso.',
    logo_url: logoMaskkingJam,
    banner_url: bannerAirPlus,
    likes_count: 165,
    created_at: '2024-01-01',
  },
  {
    id: '17',
    name: 'Maskking Ultra',
    description: 'Potencia ultra para los más exigentes.',
    logo_url: logoMaskkingUltra,
    banner_url: bannerBugatti,
    likes_count: 178,
    created_at: '2024-01-01',
  },
  {
    id: '18',
    name: 'Maskking Vimaxi',
    description: 'Máxima intensidad en rojo.',
    logo_url: logoMaskkingVimaxi,
    banner_url: bannerAirmez,
    likes_count: 143,
    created_at: '2024-01-01',
  },
  {
    id: '19',
    name: 'Metaku Spongie',
    description: 'Diversión y sabor en cada puff.',
    logo_url: logoMetakuSpongie,
    banner_url: bannerEasySmart,
    likes_count: 121,
    created_at: '2024-01-01',
  },
  {
    id: '20',
    name: 'RabBeats',
    description: 'El ritmo del vapor premium.',
    logo_url: logoRabbeats,
    banner_url: bannerBlockElf,
    likes_count: 198,
    created_at: '2024-01-01',
  },
  {
    id: '21',
    name: 'Rapid',
    description: 'Velocidad y potencia explosiva.',
    logo_url: logoRapid,
    banner_url: bannerAirPlus,
    likes_count: 167,
    created_at: '2024-01-01',
  },
  {
    id: '22',
    name: 'Rif Bar',
    description: 'Elegancia minimalista premium.',
    logo_url: logoRifbar,
    banner_url: bannerBugatti,
    likes_count: 134,
    created_at: '2024-01-01',
  },
  {
    id: '23',
    name: 'Tyson 2.0',
    description: 'Potencia de campeón mundial.',
    logo_url: logoTyson,
    banner_url: bannerAirmez,
    likes_count: 245,
    created_at: '2024-01-01',
  },
  {
    id: '24',
    name: 'Vape Binder',
    description: 'Nubes explosivas de sabor.',
    logo_url: logoVapeBinder,
    banner_url: bannerEasySmart,
    likes_count: 156,
    created_at: '2024-01-01',
  },
  {
    id: '25',
    name: 'Waka',
    description: 'Frescura tropical en cada inhalación.',
    logo_url: logoWaka,
    banner_url: bannerBlockElf,
    likes_count: 187,
    created_at: '2024-01-01',
  },
];

export const products: Product[] = [
  // AIR - ELITE
  { id: 'air-elite-1', brand_id: '1', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-2', brand_id: '1', name: 'Black Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-3', brand_id: '1', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-4', brand_id: '1', name: 'Cola Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-5', brand_id: '1', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-6', brand_id: '1', name: 'Frozen Grape', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-7', brand_id: '1', name: 'Frozen Mint', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-8', brand_id: '1', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-9', brand_id: '1', name: 'Lush Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-10', brand_id: '1', name: 'Mango Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-11', brand_id: '1', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-12', brand_id: '1', name: 'Peach Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-13', brand_id: '1', name: 'Strawberry Kiwi', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-14', brand_id: '1', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-15', brand_id: '1', name: 'Tropical Fruit', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-elite-16', brand_id: '1', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Elite', in_stock: true, created_at: '2024-01-01' },
  // AIR - PLUS
  { id: 'air-plus-1', brand_id: '1', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-2', brand_id: '1', name: 'Black Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-3', brand_id: '1', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-4', brand_id: '1', name: 'Cola Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-5', brand_id: '1', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-6', brand_id: '1', name: 'Frozen Grape', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-7', brand_id: '1', name: 'Frozen Mint', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-8', brand_id: '1', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-9', brand_id: '1', name: 'Lush Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-10', brand_id: '1', name: 'Mango Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-11', brand_id: '1', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-12', brand_id: '1', name: 'Peach Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-13', brand_id: '1', name: 'Strawberry Kiwi', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-14', brand_id: '1', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-15', brand_id: '1', name: 'Tropical Fruit', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-plus-16', brand_id: '1', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Plus', in_stock: true, created_at: '2024-01-01' },
  // AIR - REVOLUTION ULTRA
  { id: 'air-ultra-1', brand_id: '1', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-2', brand_id: '1', name: 'Black Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-3', brand_id: '1', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-4', brand_id: '1', name: 'Cola Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-5', brand_id: '1', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-6', brand_id: '1', name: 'Frozen Grape', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-7', brand_id: '1', name: 'Frozen Mint', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-8', brand_id: '1', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-9', brand_id: '1', name: 'Lush Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-10', brand_id: '1', name: 'Mango Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-11', brand_id: '1', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-12', brand_id: '1', name: 'Peach Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-13', brand_id: '1', name: 'Strawberry Kiwi', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-14', brand_id: '1', name: 'Strawberry Lychee', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-15', brand_id: '1', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-16', brand_id: '1', name: 'Tropical Fruit', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'air-ultra-17', brand_id: '1', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Revolution Ultra', in_stock: true, created_at: '2024-01-01' },
  
  // AIRMEZ
  { id: 'airmez-1', brand_id: '2', name: 'Black Mamba', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-2', brand_id: '2', name: 'Black Winter', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-3', brand_id: '2', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-4', brand_id: '2', name: 'Cherry Strazz', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-5', brand_id: '2', name: 'Cranberry Grape', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-6', brand_id: '2', name: 'Kiwi Dragon Berry', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-7', brand_id: '2', name: 'Mr Blue', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-8', brand_id: '2', name: 'NRG Berry Ice', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-9', brand_id: '2', name: 'Polar Mint Ice', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-10', brand_id: '2', name: 'Red Mojito', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },
  { id: 'airmez-11', brand_id: '2', name: 'Turkish Coffee', description: '', price: 0, image_url: '', category: 'Premium', in_stock: true, created_at: '2024-01-01' },

  // BLOCK-ELF
  { id: 'blockelf-1', brand_id: '5', name: 'Cherry Lemon', description: '', price: 0, image_url: '', category: 'Block Elf', in_stock: true, created_at: '2024-01-01' },
  { id: 'blockelf-2', brand_id: '5', name: 'Cranberry Grape', description: '', price: 0, image_url: '', category: 'Block Elf', in_stock: true, created_at: '2024-01-01' },
  { id: 'blockelf-3', brand_id: '5', name: 'Passion Fruit Orange Guava', description: '', price: 0, image_url: '', category: 'Block Elf', in_stock: true, created_at: '2024-01-01' },
  { id: 'blockelf-4', brand_id: '5', name: 'Peach Mango Watermelon', description: '', price: 0, image_url: '', category: 'Block Elf', in_stock: true, created_at: '2024-01-01' },

  // BUGATTI
  { id: 'bugatti-1', brand_id: '3', name: 'Apple', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-2', brand_id: '3', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-3', brand_id: '3', name: 'Blue Razz', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-4', brand_id: '3', name: 'Energy Drink', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-5', brand_id: '3', name: 'Grape', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-6', brand_id: '3', name: 'Guava Strawberry', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-7', brand_id: '3', name: 'Kiwi Passion Fruit', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-8', brand_id: '3', name: 'Lemon Mint', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-9', brand_id: '3', name: 'Lychee Ice', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-10', brand_id: '3', name: 'Mango Ice', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-11', brand_id: '3', name: 'Mint', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-12', brand_id: '3', name: 'Peach Ice', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-13', brand_id: '3', name: 'Pineapple Ice', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-14', brand_id: '3', name: 'Red Bull', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-15', brand_id: '3', name: 'Strawberry Kiwi', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-16', brand_id: '3', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },
  { id: 'bugatti-17', brand_id: '3', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Bugatti', in_stock: true, created_at: '2024-01-01' },

  // EASY-SMART EA9000
  { id: 'easy-1', brand_id: '4', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'EA9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'easy-2', brand_id: '4', name: 'Frozen Mint', description: '', price: 0, image_url: '', category: 'EA9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'easy-3', brand_id: '4', name: 'Kipagu', description: '', price: 0, image_url: '', category: 'EA9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'easy-4', brand_id: '4', name: 'Peach Burst', description: '', price: 0, image_url: '', category: 'EA9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'easy-5', brand_id: '4', name: 'Strawberry Melon Ice', description: '', price: 0, image_url: '', category: 'EA9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'easy-6', brand_id: '4', name: 'Watermelon Kiwi Berry', description: '', price: 0, image_url: '', category: 'EA9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'easy-7', brand_id: '4', name: 'Watermelon Strawberry', description: '', price: 0, image_url: '', category: 'EA9000', in_stock: true, created_at: '2024-01-01' },

  // ELF-BAR ICE KING
  { id: 'elfbar-1', brand_id: '6', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-2', brand_id: '6', name: 'Double Apple Ice', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-3', brand_id: '6', name: 'Dragon Strawnana', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-4', brand_id: '6', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-5', brand_id: '6', name: 'Mango Magic', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-6', brand_id: '6', name: 'Miami Mint', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-7', brand_id: '6', name: 'Peach Plus', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-8', brand_id: '6', name: 'Sour Lush Gummy', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-9', brand_id: '6', name: 'Strawberry Ice', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },
  { id: 'elfbar-10', brand_id: '6', name: 'Tigers Blood', description: '', price: 0, image_url: '', category: 'Ice King', in_stock: true, created_at: '2024-01-01' },

  // FLY
  { id: 'fly-1', brand_id: '7', name: 'Passion Grapefruit Ice', description: '', price: 0, image_url: '', category: 'Fly', in_stock: true, created_at: '2024-01-01' },
  { id: 'fly-2', brand_id: '7', name: 'Red Bull', description: '', price: 0, image_url: '', category: 'Fly', in_stock: true, created_at: '2024-01-01' },

  // HELLO-SYNIX
  { id: 'synix-1', brand_id: '8', name: 'Blueberry Ice', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-2', brand_id: '8', name: 'Flavor 11', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-3', brand_id: '8', name: 'Flavor 14', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-4', brand_id: '8', name: 'Flavor 15', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-5', brand_id: '8', name: 'Flavor 16', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-6', brand_id: '8', name: 'Flavor 17', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-7', brand_id: '8', name: 'Flavor 18', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-8', brand_id: '8', name: 'Flavor 19', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-9', brand_id: '8', name: 'Flavor 20', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-10', brand_id: '8', name: 'Flavor 21', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-11', brand_id: '8', name: 'Flavor 22', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-12', brand_id: '8', name: 'Juicy Peach', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-13', brand_id: '8', name: 'Miami Mint', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-14', brand_id: '8', name: 'Raspberry Peach Lime', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-15', brand_id: '8', name: 'Sour Apple Ice', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-16', brand_id: '8', name: 'Strawberry Kiwi', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },
  { id: 'synix-17', brand_id: '8', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Synix', in_stock: true, created_at: '2024-01-01' },

  // IPLAY BIG MAX
  { id: 'iplay-bigmax-1', brand_id: '9', name: 'Black Mint', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-2', brand_id: '9', name: 'Blueberry Ice', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-3', brand_id: '9', name: 'Blueberry Watermelon', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-4', brand_id: '9', name: 'Cherry Lemonade', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-5', brand_id: '9', name: 'Cherry Mint', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-6', brand_id: '9', name: 'Coconut Strawberry', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-7', brand_id: '9', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-8', brand_id: '9', name: 'Double Mint', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-9', brand_id: '9', name: 'Energy Drink', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-10', brand_id: '9', name: 'Grape Strawberry', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-11', brand_id: '9', name: 'Kiwi Grape', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-12', brand_id: '9', name: 'Pineapple Twist', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-13', brand_id: '9', name: 'Spearmint', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-14', brand_id: '9', name: 'Tulum Mint', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-bigmax-15', brand_id: '9', name: 'Watermelon Rush', description: '', price: 0, image_url: '', category: 'Big Max', in_stock: true, created_at: '2024-01-01' },
  // IPLAY MAX
  { id: 'iplay-max-1', brand_id: '9', name: 'Banana Cherry Dragon Fruit', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-2', brand_id: '9', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-3', brand_id: '9', name: 'Blue Raz Lemon', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-4', brand_id: '9', name: 'Coconut Strawberry', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-5', brand_id: '9', name: 'Cucumber Lemonade', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-6', brand_id: '9', name: 'Energy Water Ice', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-7', brand_id: '9', name: 'Grape Soda', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-8', brand_id: '9', name: 'Grape Strawberry', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-9', brand_id: '9', name: 'Guava Raspberry', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-10', brand_id: '9', name: 'Kiwi Dragon Berry', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-11', brand_id: '9', name: 'Low Mint', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-12', brand_id: '9', name: 'Mixed Berries Lemon', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-13', brand_id: '9', name: 'Peach Berries Ice', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-14', brand_id: '9', name: 'Pineapple Coconut', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-15', brand_id: '9', name: 'Sour Apple Melon', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-16', brand_id: '9', name: 'Sour Raspberry', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-max-17', brand_id: '9', name: 'Watermelon Banana', description: '', price: 0, image_url: '', category: 'Max', in_stock: true, created_at: '2024-01-01' },
  // IPLAY VIBAR
  { id: 'iplay-vibar-1', brand_id: '9', name: 'Mango Ice Cream', description: '', price: 0, image_url: '', category: 'Vibar', in_stock: true, created_at: '2024-01-01' },

  // IPLAY XBOX
  { id: 'iplay-xbox-1', brand_id: '10', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-2', brand_id: '10', name: 'Black Ice', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-3', brand_id: '10', name: 'Blue Razz', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-4', brand_id: '10', name: 'Blueberry Mint', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-5', brand_id: '10', name: 'Cherry Mint', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-6', brand_id: '10', name: 'Coconut Melon', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-7', brand_id: '10', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-8', brand_id: '10', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-9', brand_id: '10', name: 'Grape Melon', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-10', brand_id: '10', name: 'Gummy Bear', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-11', brand_id: '10', name: 'Iced Americano', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-12', brand_id: '10', name: 'Kiwi Ice', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-13', brand_id: '10', name: 'Lemon Strawberry', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-14', brand_id: '10', name: 'Lychee Ice', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-15', brand_id: '10', name: 'Miami Mint', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-16', brand_id: '10', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-17', brand_id: '10', name: 'Peach Ice', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-18', brand_id: '10', name: 'Pink Lemonade', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-19', brand_id: '10', name: 'Sour Apple', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-20', brand_id: '10', name: 'Strawberry Banana', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-21', brand_id: '10', name: 'Strawberry Grape', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-22', brand_id: '10', name: 'Strawberry Mango', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-23', brand_id: '10', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-24', brand_id: '10', name: 'Tabaco', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xbox-25', brand_id: '10', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Xbox', in_stock: true, created_at: '2024-01-01' },
  // IPLAY XBOX PRO
  { id: 'iplay-xboxpro-1', brand_id: '10', name: 'Blueberry Lemonade', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-2', brand_id: '10', name: 'Cherry Cranberry', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-3', brand_id: '10', name: 'Double Mint', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-4', brand_id: '10', name: 'Grape Bubble Gum', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-5', brand_id: '10', name: 'Miami Mint', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-6', brand_id: '10', name: 'Pink Lemonade', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-7', brand_id: '10', name: 'Sour Apple', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-8', brand_id: '10', name: 'Strawberry Ice', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'iplay-xboxpro-9', brand_id: '10', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Xbox Pro', in_stock: true, created_at: '2024-01-01' },

  // IVG REGAL
  { id: 'ivg-1', brand_id: '12', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-2', brand_id: '12', name: 'Blue Raspberry Ice', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-3', brand_id: '12', name: 'Caramel Coffee', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-4', brand_id: '12', name: 'Classic Menthol', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-5', brand_id: '12', name: 'Classic Tobacco', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-6', brand_id: '12', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-7', brand_id: '12', name: 'Mint Burst', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-8', brand_id: '12', name: 'Passion Fruit', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-9', brand_id: '12', name: 'Pink Lemonade', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-10', brand_id: '12', name: 'Strawberry Ice', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },
  { id: 'ivg-11', brand_id: '12', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Regal', in_stock: true, created_at: '2024-01-01' },

  // MASKKING HIGH GT
  { id: 'maskking-gt-1', brand_id: '13', name: 'Blue Razz', description: '', price: 0, image_url: '', category: 'High GT', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gt-2', brand_id: '13', name: 'Coconut Ice', description: '', price: 0, image_url: '', category: 'High GT', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gt-3', brand_id: '13', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'High GT', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gt-4', brand_id: '13', name: 'Pure Tobacco', description: '', price: 0, image_url: '', category: 'High GT', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gt-5', brand_id: '13', name: 'Strawberry Lychee', description: '', price: 0, image_url: '', category: 'High GT', in_stock: true, created_at: '2024-01-01' },

  // MASKKING HIGH GTS
  { id: 'maskking-gts-1', brand_id: '14', name: 'Apple Cantaloupe', description: '', price: 0, image_url: '', category: 'High GTS', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gts-2', brand_id: '14', name: 'Blackcurrant', description: '', price: 0, image_url: '', category: 'High GTS', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gts-3', brand_id: '14', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'High GTS', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gts-4', brand_id: '14', name: 'Melon Coconut', description: '', price: 0, image_url: '', category: 'High GTS', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-gts-5', brand_id: '14', name: 'Strawlychee Watermelon', description: '', price: 0, image_url: '', category: 'High GTS', in_stock: true, created_at: '2024-01-01' },

  // MASKKING HIGH PRO
  { id: 'maskking-pro-1', brand_id: '13', name: 'Apple Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-pro-2', brand_id: '13', name: 'Cherry Ice', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-pro-3', brand_id: '13', name: 'Energy Juice', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-pro-4', brand_id: '13', name: 'Guava Raspberry', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-pro-5', brand_id: '13', name: 'Ice Black Tea', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-pro-6', brand_id: '13', name: 'Lush Ice', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-pro-7', brand_id: '13', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-pro-8', brand_id: '13', name: 'Strawlychee', description: '', price: 0, image_url: '', category: 'High Pro', in_stock: true, created_at: '2024-01-01' },

  // MASKKING ICEX
  { id: 'maskking-icex-1', brand_id: '15', name: 'Black Cherry Peach', description: '', price: 0, image_url: '', category: 'Ice X', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-icex-2', brand_id: '15', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'Ice X', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-icex-3', brand_id: '15', name: 'Espresso Velvet', description: '', price: 0, image_url: '', category: 'Ice X', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-icex-4', brand_id: '15', name: 'Gold Tobacco', description: '', price: 0, image_url: '', category: 'Ice X', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-icex-5', brand_id: '15', name: 'Grape Storm', description: '', price: 0, image_url: '', category: 'Ice X', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-icex-6', brand_id: '15', name: 'Miami Mint', description: '', price: 0, image_url: '', category: 'Ice X', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-icex-7', brand_id: '15', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Ice X', in_stock: true, created_at: '2024-01-01' },

  // MASKKING JAM
  { id: 'maskking-jam-1', brand_id: '16', name: 'Grape Paradise', description: '', price: 0, image_url: '', category: 'Jam', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-jam-2', brand_id: '16', name: 'Melon Coconut', description: '', price: 0, image_url: '', category: 'Jam', in_stock: true, created_at: '2024-01-01' },

  // MASKKING ULTRA
  { id: 'maskking-ultra-1', brand_id: '17', name: 'Apple Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-2', brand_id: '17', name: 'Banana Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-3', brand_id: '17', name: 'Blue Razz Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-4', brand_id: '17', name: 'Blueberry Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-5', brand_id: '17', name: 'Cherry Cola', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-6', brand_id: '17', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-7', brand_id: '17', name: 'Cotton Candy', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-8', brand_id: '17', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-9', brand_id: '17', name: 'Kiwi Passion Fruit', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-10', brand_id: '17', name: 'Lush Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-11', brand_id: '17', name: 'Mango Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-12', brand_id: '17', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-13', brand_id: '17', name: 'Orange Soda', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-14', brand_id: '17', name: 'Peach Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-15', brand_id: '17', name: 'Pineapple Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-16', brand_id: '17', name: 'Pink Lemonade', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-17', brand_id: '17', name: 'Strawberry Banana', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-18', brand_id: '17', name: 'Strawberry Lychee', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-19', brand_id: '17', name: 'Tropical Punch', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-ultra-20', brand_id: '17', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Ultra', in_stock: true, created_at: '2024-01-01' },

  // MASKKING VIMAXI
  { id: 'maskking-vimaxi-1', brand_id: '18', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Vimaxi', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-vimaxi-2', brand_id: '18', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'Vimaxi', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-vimaxi-3', brand_id: '18', name: 'Strawberry Banana', description: '', price: 0, image_url: '', category: 'Vimaxi', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-vimaxi-4', brand_id: '18', name: 'Strawberry Ice', description: '', price: 0, image_url: '', category: 'Vimaxi', in_stock: true, created_at: '2024-01-01' },
  { id: 'maskking-vimaxi-5', brand_id: '18', name: 'Strawberry Lychee', description: '', price: 0, image_url: '', category: 'Vimaxi', in_stock: true, created_at: '2024-01-01' },

  // METAKU SPONGIE
  { id: 'metaku-1', brand_id: '19', name: 'Green Apple Ice', description: '', price: 0, image_url: '', category: 'Spongie', in_stock: true, created_at: '2024-01-01' },
  { id: 'metaku-2', brand_id: '19', name: 'Gum Mint', description: '', price: 0, image_url: '', category: 'Spongie', in_stock: true, created_at: '2024-01-01' },
  { id: 'metaku-3', brand_id: '19', name: 'Strawberry Kiwi', description: '', price: 0, image_url: '', category: 'Spongie', in_stock: true, created_at: '2024-01-01' },
  { id: 'metaku-4', brand_id: '19', name: 'Strawberry Peach Mint', description: '', price: 0, image_url: '', category: 'Spongie', in_stock: true, created_at: '2024-01-01' },

  // RABBEATS RC10000
  { id: 'rabbeats-1', brand_id: '20', name: 'Blackberry Cranberry', description: '', price: 0, image_url: '', category: 'RC10000', in_stock: true, created_at: '2024-01-01' },
  { id: 'rabbeats-2', brand_id: '20', name: 'Cherry Watermelon', description: '', price: 0, image_url: '', category: 'RC10000', in_stock: true, created_at: '2024-01-01' },
  { id: 'rabbeats-3', brand_id: '20', name: 'Grape Cherry', description: '', price: 0, image_url: '', category: 'RC10000', in_stock: true, created_at: '2024-01-01' },
  { id: 'rabbeats-4', brand_id: '20', name: 'Miami Mint', description: '', price: 0, image_url: '', category: 'RC10000', in_stock: true, created_at: '2024-01-01' },

  // RIFBAR TURBO X
  { id: 'rifbar-1', brand_id: '22', name: 'Alaskan Mint', description: '', price: 0, image_url: '', category: 'Turbo X', in_stock: true, created_at: '2024-01-01' },
  { id: 'rifbar-2', brand_id: '22', name: 'Blueberry Mint', description: '', price: 0, image_url: '', category: 'Turbo X', in_stock: true, created_at: '2024-01-01' },
  { id: 'rifbar-3', brand_id: '22', name: 'Mint Ice', description: '', price: 0, image_url: '', category: 'Turbo X', in_stock: true, created_at: '2024-01-01' },
  { id: 'rifbar-4', brand_id: '22', name: 'Peach Pear', description: '', price: 0, image_url: '', category: 'Turbo X', in_stock: true, created_at: '2024-01-01' },
  { id: 'rifbar-5', brand_id: '22', name: 'Pina Colada', description: '', price: 0, image_url: '', category: 'Turbo X', in_stock: true, created_at: '2024-01-01' },
  { id: 'rifbar-6', brand_id: '22', name: 'Sour Cranberry Grape', description: '', price: 0, image_url: '', category: 'Turbo X', in_stock: true, created_at: '2024-01-01' },
  { id: 'rifbar-7', brand_id: '22', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Turbo X', in_stock: true, created_at: '2024-01-01' },

  // TYSON LIGHTWEIGHT
  { id: 'tyson-1', brand_id: '23', name: 'Blue Razz', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-2', brand_id: '23', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-3', brand_id: '23', name: 'Frozen Grape', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-4', brand_id: '23', name: 'Frozen Mango', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-5', brand_id: '23', name: 'Frozen Mix', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-6', brand_id: '23', name: 'Frozen Peach', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-7', brand_id: '23', name: 'Frozen Strawberry', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-8', brand_id: '23', name: 'Green Apple', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-9', brand_id: '23', name: 'Lush Freeze', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-10', brand_id: '23', name: 'Mint Mix', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-11', brand_id: '23', name: 'Mix', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-12', brand_id: '23', name: 'Raspberry Watermelon', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-13', brand_id: '23', name: 'Strawberry Banana', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-14', brand_id: '23', name: 'Strawberry Watermelon', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },
  { id: 'tyson-15', brand_id: '23', name: 'VIP Mix', description: '', price: 0, image_url: '', category: 'Lightweight', in_stock: true, created_at: '2024-01-01' },

  // WAKA BLADE
  { id: 'waka-blade-1', brand_id: '25', name: 'Blueberry Mint', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-2', brand_id: '25', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-3', brand_id: '25', name: 'Grape Mint', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-4', brand_id: '25', name: 'King Mint', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-5', brand_id: '25', name: 'Lychee Ice', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-6', brand_id: '25', name: 'Mango Passion Fruit', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-7', brand_id: '25', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-8', brand_id: '25', name: 'Peach Ice', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-9', brand_id: '25', name: 'Sour Apple', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-10', brand_id: '25', name: 'Strawberry Guava', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-blade-11', brand_id: '25', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Blade', in_stock: true, created_at: '2024-01-01' },
  // WAKA NOVA
  { id: 'waka-nova-1', brand_id: '25', name: 'Acai Berry Ice', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-2', brand_id: '25', name: 'Blackcurrant Ice', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-3', brand_id: '25', name: 'Blue Razz', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-4', brand_id: '25', name: 'Energy Drink', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-5', brand_id: '25', name: 'Peach Blueberry Raspberry', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-6', brand_id: '25', name: 'Pineapple Strawberry Banana', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-7', brand_id: '25', name: 'Sour Strawberry Burst', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-8', brand_id: '25', name: 'Strawberry Mango Raspberry', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-9', brand_id: '25', name: 'Tropical Rainbow Blast', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-nova-10', brand_id: '25', name: 'Watermelon Apple Ice', description: '', price: 0, image_url: '', category: 'Nova', in_stock: true, created_at: '2024-01-01' },
  // WAKA SOPRO
  { id: 'waka-sopro-1', brand_id: '25', name: 'Banana Berry Ice', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-2', brand_id: '25', name: 'Berry Mix Ice', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-3', brand_id: '25', name: 'Blueberry Mint', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-4', brand_id: '25', name: 'Cherry Berry', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-5', brand_id: '25', name: 'Cherry Grape', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-6', brand_id: '25', name: 'Cherry Mint', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-7', brand_id: '25', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-8', brand_id: '25', name: 'Cucumber Pear', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-9', brand_id: '25', name: 'Frozen Mint', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-10', brand_id: '25', name: 'Grape Ice', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-11', brand_id: '25', name: 'Grape Lychee', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-12', brand_id: '25', name: 'Grape Mint', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-13', brand_id: '25', name: 'Green Apple Ice', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-14', brand_id: '25', name: 'Lemon Mint', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-15', brand_id: '25', name: 'Lychee Lemon', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-16', brand_id: '25', name: 'Mango Ice', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-17', brand_id: '25', name: 'Peach Mango Watermelon', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-18', brand_id: '25', name: 'Pineapple Ice', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-19', brand_id: '25', name: 'Sour Apple', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-20', brand_id: '25', name: 'Spearmint', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-21', brand_id: '25', name: 'Strawberry Banana', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-22', brand_id: '25', name: 'Strawberry Kiwi', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },
  { id: 'waka-sopro-23', brand_id: '25', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'SoPro', in_stock: true, created_at: '2024-01-01' },

  // WONDER 4500
  { id: 'wonder-4500-1', brand_id: '24', name: 'Apple Ice', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-2', brand_id: '24', name: 'Banana Ice', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-3', brand_id: '24', name: 'Berry Lemonade', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-4', brand_id: '24', name: 'Black Ice', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-5', brand_id: '24', name: 'Cool Mint', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-6', brand_id: '24', name: 'Double Mint', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-7', brand_id: '24', name: 'Grape Soda', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-8', brand_id: '24', name: 'Lemon Mint', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-9', brand_id: '24', name: 'Mango Passion Fruit', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-10', brand_id: '24', name: 'Miami Mint', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-11', brand_id: '24', name: 'Mixed Berries', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-12', brand_id: '24', name: 'Peach Ice', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-13', brand_id: '24', name: 'Strawberry Coconut', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-14', brand_id: '24', name: 'Strawberry Kiwi Lychee', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-4500-15', brand_id: '24', name: 'Strawberry Mango', description: '', price: 0, image_url: '', category: '4500', in_stock: true, created_at: '2024-01-01' },
  // WONDER NEO P9000
  { id: 'wonder-neo-1', brand_id: '24', name: 'Black Ice', description: '', price: 0, image_url: '', category: 'Neo P9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-neo-2', brand_id: '24', name: 'Blueberry Ice', description: '', price: 0, image_url: '', category: 'Neo P9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-neo-3', brand_id: '24', name: 'Cool Mint', description: '', price: 0, image_url: '', category: 'Neo P9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-neo-4', brand_id: '24', name: 'Strawberry Banana', description: '', price: 0, image_url: '', category: 'Neo P9000', in_stock: true, created_at: '2024-01-01' },
  { id: 'wonder-neo-5', brand_id: '24', name: 'Watermelon Ice', description: '', price: 0, image_url: '', category: 'Neo P9000', in_stock: true, created_at: '2024-01-01' },
];

export const getBrands = (): Brand[] => brands;

export const getBrandById = (id: string): Brand | undefined => {
  return brands.find(brand => brand.id === id);
};

export const getProductsByBrandId = (brandId: string): Product[] => {
  return products.filter(product => product.brand_id === brandId);
};

export const getAllProducts = (): Product[] => {
  return products;
};

export const brandHasProducts = (brandId: string): boolean => {
  return products.some(product => product.brand_id === brandId);
};

export const getBrandsWithProducts = (): Brand[] => {
  return brands.filter(brand => brandHasProducts(brand.id));
};
