// Configuración completa de las 12 zonas de Green Alchemy

export interface ZoneInfo {
  slug: string;
  name: string;
  title: string;
  storeName: string;
  address: string;
  description: string;
  hours: string;
  phone: string;
}

export const ZONES: ZoneInfo[] = [
  {
    slug: 'polanco',
    name: 'Polanco',
    title: 'Catálogo Polanco',
    storeName: 'Green Alchemy Polanco',
    address: 'Av. Presidente Masaryk 201, Polanco, CDMX',
    description: 'Nuestra boutique insignia en el corazón de Polanco, donde la elegancia y el bienestar se encuentran. Un espacio diseñado para ofrecer una experiencia premium única.',
    hours: 'L-V: 10:00-8:00 PM, Sáb: 11:00-7:00 PM, Dom: 12:00-6:00 PM',
    phone: '+52 55 1234 5678',
  },
  {
    slug: 'condesa',
    name: 'Condesa',
    title: 'Catálogo Condesa',
    storeName: 'Green Alchemy Condesa',
    address: 'Av. Insurgentes Sur 253, Condesa, CDMX',
    description: 'Ubicada en uno de los barrios más vibrantes de la ciudad, nuestra boutique en Condesa refleja el espíritu contemporáneo y creativo del vecindario.',
    hours: 'L-V: 10:00-8:00 PM, Sáb: 11:00-7:00 PM, Dom: 12:00-6:00 PM',
    phone: '+52 55 8765 4321',
  },
  {
    slug: 'santa-fe',
    name: 'Santa Fe',
    title: 'Catálogo Santa Fe',
    storeName: 'Green Alchemy Santa Fe',
    address: 'Centro Santa Fe, Santa Fe, CDMX',
    description: 'En el centro comercial más exclusivo, ofrecemos una experiencia de compra moderna con la máxima comodidad y accesibilidad.',
    hours: 'L-V: 10:00-9:00 PM, Sáb: 10:00-9:00 PM, Dom: 11:00-7:00 PM',
    phone: '+52 55 5555 6666',
  },
  {
    slug: 'roma-norte',
    name: 'Roma Norte',
    title: 'Catálogo Roma Norte',
    storeName: 'Green Alchemy Roma Norte',
    address: 'Av. Álvaro Obregón 155, Roma Norte, CDMX',
    description: 'En el corazón de Roma Norte, un espacio que combina arquitectura histórica con diseño moderno para una experiencia única.',
    hours: 'L-V: 10:00-8:00 PM, Sáb: 11:00-7:00 PM, Dom: 12:00-6:00 PM',
    phone: '+52 55 2233 4455',
  },
  {
    slug: 'interlomas',
    name: 'Interlomas',
    title: 'Catálogo Interlomas',
    storeName: 'Green Alchemy Interlomas',
    address: 'Magnocentro Interlomas, Huixquilucan, Estado de México',
    description: 'Ubicada en una de las zonas residenciales más exclusivas, ofrecemos un ambiente premium y acogedor.',
    hours: 'L-V: 10:00-9:00 PM, Sáb: 10:00-9:00 PM, Dom: 11:00-7:00 PM',
    phone: '+52 55 6677 8899',
  },
  {
    slug: 'coyoacan',
    name: 'Coyoacán',
    title: 'Catálogo Coyoacán',
    storeName: 'Green Alchemy Coyoacán',
    address: 'Jardín Centenario, Coyoacán, CDMX',
    description: 'En el histórico barrio de Coyoacán, nuestra boutique respeta la tradición mientras abraza la innovación.',
    hours: 'L-V: 10:00-8:00 PM, Sáb: 10:00-8:00 PM, Dom: 11:00-7:00 PM',
    phone: '+52 55 4433 2211',
  },
  {
    slug: 'guadalajara',
    name: 'Guadalajara',
    title: 'Catálogo Guadalajara',
    storeName: 'Green Alchemy Guadalajara',
    address: 'Av. Chapultepec Sur 45, Guadalajara, Jalisco',
    description: 'Nuestra primera boutique en Guadalajara trae el espíritu Green Alchemy a la Perla de Occidente con productos exclusivos.',
    hours: 'L-V: 10:00-8:00 PM, Sáb: 11:00-7:00 PM, Dom: 12:00-6:00 PM',
    phone: '+52 33 1122 3344',
  },
  {
    slug: 'monterrey',
    name: 'Monterrey',
    title: 'Catálogo Monterrey',
    storeName: 'Green Alchemy Monterrey',
    address: 'Av. San Pedro 215, San Pedro, Monterrey, N.L.',
    description: 'En la zona más exclusiva de San Pedro, ofrecemos productos premium y servicios personalizados.',
    hours: 'L-V: 10:00-8:00 PM, Sáb: 11:00-7:00 PM, Dom: 12:00-6:00 PM',
    phone: '+52 81 8899 7766',
  },
  {
    slug: 'playa-del-carmen',
    name: 'Playa del Carmen',
    title: 'Catálogo Playa del Carmen',
    storeName: 'Green Alchemy Playa del Carmen',
    address: '5ta Avenida, Centro, Playa del Carmen, Q. Roo',
    description: 'En la emblemática Quinta Avenida, nuestra boutique ofrece productos premium con el ambiente relajado de la Riviera Maya.',
    hours: 'L-D: 9:00-10:00 PM',
    phone: '+52 984 555 6677',
  },
  {
    slug: 'puebla',
    name: 'Puebla',
    title: 'Catálogo Puebla',
    storeName: 'Green Alchemy Puebla',
    address: 'Centro Histórico, Puebla, Puebla',
    description: 'En el corazón del Centro Histórico, combinamos la belleza colonial de Puebla con nuestros productos premium.',
    hours: 'L-V: 10:00-8:00 PM, Sáb: 11:00-7:00 PM, Dom: 12:00-6:00 PM',
    phone: '+52 222 333 4455',
  },
  {
    slug: 'queretaro',
    name: 'Querétaro',
    title: 'Catálogo Querétaro',
    storeName: 'Green Alchemy Querétaro',
    address: 'Antea Lifestyle Center, Querétaro, Qro.',
    description: 'En el centro lifestyle más moderno de Querétaro, ofrecemos una experiencia de compra única y sofisticada.',
    hours: 'L-V: 10:00-9:00 PM, Sáb: 10:00-9:00 PM, Dom: 11:00-7:00 PM',
    phone: '+52 442 666 7788',
  },
  {
    slug: 'cancun',
    name: 'Cancún',
    title: 'Catálogo Cancún',
    storeName: 'Green Alchemy Cancún',
    address: 'La Isla Shopping Village, Zona Hotelera, Cancún, Q. Roo',
    description: 'En la Zona Hotelera de Cancún, ofrecemos productos premium con vista a la laguna Nichupté.',
    hours: 'L-D: 9:00-10:00 PM',
    phone: '+52 998 777 8899',
  },
];

// Crear un mapa por slug para acceso rápido
export const ZONE_BY_SLUG: Record<string, ZoneInfo> = ZONES.reduce((acc, zone) => {
  acc[zone.slug] = zone;
  return acc;
}, {} as Record<string, ZoneInfo>);

// Exportar ZONE_CONFIGS compatible con el formato anterior
export const ZONE_CONFIGS: Record<string, { name: string; title: string }> = ZONES.reduce((acc, zone) => {
  acc[zone.slug] = { name: zone.name, title: zone.title };
  return acc;
}, {} as Record<string, { name: string; title: string }>);
