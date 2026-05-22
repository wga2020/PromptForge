// ============================================================
// DATA CONSTANTS FOR PRINT-ON-DEMAND AI PROMPT GENERATOR
// ============================================================

export interface ProductInfo {
  name: string;
  icon: string;
  description: string;
}

export const PRODUCTS: ProductInfo[] = [
  { name: "T-Shirt", icon: "👕", description: "Camiseta clásica" },
  { name: "Hoodie", icon: "🧥", description: "Sudadera con capucha" },
  { name: "Mug/Taza", icon: "☕", description: "Taza personalizada" },
  { name: "Poster/Lámina", icon: "🖼️", description: "Póster decorativo" },
  { name: "Phone Case", icon: "📱", description: "Funda de teléfono" },
  { name: "Tote Bag", icon: "👜", description: "Bolsa de tela" },
  { name: "Sticker", icon: "🏷️", description: "Pegatina adhesiva" },
  { name: "Notebook/Agenda", icon: "📓", description: "Cuaderno/Agenda" },
  { name: "Cap/Gorra", icon: "🧢", description: "Gorra personalizada" },
  { name: "Cushion/Cojín", icon: "🛋️", description: "Cojín decorativo" },
  { name: "Blanket/Manta", icon: "🧣", description: "Manta personalizada" },
  { name: "Pin/Badge", icon: "📌", description: "Pin/Lépismos" },
  { name: "Card/Invitación", icon: "💌", description: "Tarjeta/Invitación" },
  { name: "Mousepad", icon: "🖱️", description: "Alfombrilla de ratón" },
];

export const NICHES = [
  "Motivacional",
  "Profesiones",
  "Hobbies",
  "Religión",
  "Pop Culture",
  "Fechas Especiales",
  "Amor/Romance",
  "Naturaleza",
  "Ciencia/Tech",
  "Deportes",
  "Comida/Bebida",
  "Viajes",
  "Arte/Cultura",
  "Eco/Sostenibilidad",
  "Moda/Estilo",
  "Gaming",
  "Música",
  "Infantil",
  "Humor/Memes",
  "Literatura",
];

export const DESIGN_STYLES = [
  "Minimalist",
  "Vintage/Retro",
  "Modern Bold",
  "Elegant",
  "Grunge",
  "Boho",
  "Kawaii",
  "Streetwear",
  "Art Deco",
  "Synthwave",
  "Watercolor",
  "Typography-focused",
];

export const AI_TOOLS = [
  "Midjourney",
  "DALL-E",
  "Leonardo AI",
  "Ideogram",
  "Stable Diffusion",
  "Flux",
];

export const COLOR_PALETTES: Record<string, string[]> = {
  "Elegant Gold": ["#C4960C", "#1B1B1B", "#722F37", "#F5F0E8"],
  "Bold Primary": ["#E74C3C", "#2C3E50", "#F39C12", "#ECF0F1"],
  "Pastel Soft": ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"],
  "Dark Neon": ["#00D4FF", "#0A0A0A", "#39FF14", "#FF073A"],
  "Earth Tones": ["#8B4513", "#D2B48C", "#CC5500", "#F5F0E8"],
  "Monochrome": ["#000000", "#333333", "#666666", "#FFFFFF"],
  "Vibrant Pop": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
  "Coastal Blue": ["#1A5276", "#2E86C1", "#85C1E9", "#F0F8FF"],
  "Forest Green": ["#2D5016", "#6B4423", "#DAA520", "#FEFDF8"],
  "Sunset Warm": ["#FF4500", "#FF8C00", "#FFD700", "#FFF8DC"],
};

export const PRODUCT_FONT_MAP: Record<string, Record<string, { principal: string; secundaria: string; acento: string }>> = {
  "T-Shirt": {
    "Motivacional": { principal: "Bebas Neue", secundaria: "Montserrat Light", acento: "Great Vibes" },
    "Profesiones": { principal: "Myriad Pro Bold", secundaria: "Open Sans", acento: "Satisfy" },
    "Hobbies": { principal: "Press Start 2P", secundaria: "Orbitron", acento: "Bungee Shade" },
    "Religión": { principal: "Cinzel Decorative", secundaria: "Cormorant Garamond", acento: "Great Vibes" },
    "Pop Culture": { principal: "Bangers", secundaria: "Anton", acento: "Gugi" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Lora", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Sacramento" },
    "Naturaleza": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Anton" },
    "Comida/Bebida": { principal: "Playfair Display", secundaria: "Lora", acento: "Lobster" },
    "Viajes": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Arte/Cultura": { principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond" },
    "Eco/Sostenibilidad": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Moda/Estilo": { principal: "Didot", secundaria: "Futura", acento: "Sacramento" },
    "Gaming": { principal: "Press Start 2P", secundaria: "Orbitron", acento: "Bungee Shade" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Gochi Hand" },
    "Humor/Memes": { principal: "Impact", secundaria: "Comic Neue Bold", acento: "Permanent Marker" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Caveat" },
  },
  "Mug/Taza": {
    "Motivacional": { principal: "Montserrat Bold", secundaria: "Open Sans", acento: "Satisfy" },
    "Profesiones": { principal: "Bebas Neue", secundaria: "Montserrat", acento: "Caveat" },
    "Humor/Memes": { principal: "Impact", secundaria: "Comic Neue Bold", acento: "Permanent Marker" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Dancing Script" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Great Vibes" },
    "Comida/Bebida": { principal: "Pacifico", secundaria: "Lora", acento: "Kaushan Script" },
  },
  "Poster/Lámina": {
    "Motivacional": { principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Great Vibes" },
    "Arte/Cultura": { principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond" },
    "Naturaleza": { principal: "Montserrat Thin", secundaria: "Playfair Display", acento: "Cormorant Garamond" },
    "Pop Culture": { principal: "Bungee Shade", secundaria: "Syncopate", acento: "Monoton" },
  },
  "Phone Case": {
    "Ciencia/Tech": { principal: "Orbitron", secundaria: "Source Code Pro", acento: "Audiowide" },
    "Gaming": { principal: "Press Start 2P", secundaria: "VT323", acento: "Silkscreen" },
    "Humor/Memes": { principal: "Bebas Neue", secundaria: "Impact", acento: "Permanent Marker" },
  },
  "Tote Bag": {
    "Eco/Sostenibilidad": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Great Vibes" },
    "Moda/Estilo": { principal: "Didot", secundaria: "Futura", acento: "Sacramento" },
  },
  "Hoodie": {
    "Deportes": { principal: "Bebas Neue", secundaria: "Anton", acento: "Permanent Marker" },
    "Gaming": { principal: "Bangers", secundaria: "Rock Salt", acento: "Gochi Hand" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
  },
  "Sticker": {
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Indie Flower" },
    "Humor/Memes": { principal: "Bangers", secundaria: "Fredoka One", acento: "Gochi Hand" },
  },
  "Notebook/Agenda": {
    "Profesiones": { principal: "Montserrat", secundaria: "Lora", acento: "Playfair Display" },
    "Infantil": { principal: "Fredoka One", secundaria: "Baloo 2", acento: "Gochi Hand" },
  },
  "Cap/Gorra": {
    "Deportes": { principal: "College Block", secundaria: "Futura Bold", acento: "Russo One" },
    "Moda/Estilo": { principal: "Bebas Neue", secundaria: "Anton", acento: "Impact" },
  },
};

export const DEFAULT_FONTS = { principal: "Montserrat Bold", secundaria: "Lato Light", acento: "Great Vibes" };

export function getFontsForProductNiche(product: string, niche: string) {
  const productMap = PRODUCT_FONT_MAP[product];
  if (productMap && productMap[niche]) {
    return productMap[niche];
  }
  // Try T-Shirt as fallback (most complete map)
  const tshirtMap = PRODUCT_FONT_MAP["T-Shirt"];
  if (tshirtMap && tshirtMap[niche]) {
    return tshirtMap[niche];
  }
  return DEFAULT_FONTS;
}

// Calendar events data for seeding
export const CALENDAR_EVENTS_SEED = [
  // January
  { name: "Año Nuevo", date: "2026-01-01", type: "holiday", niche: "Fechas Especiales", description: "Celebración del nuevo año", country: "global" },
  { name: "Día de Reyes", date: "2026-01-06", type: "holiday", niche: "Fechas Especiales", description: "Epifanía - Día de los Reyes Magos", country: "latam" },
  { name: "Martin Luther King Jr. Day", date: "2026-01-19", type: "holiday", niche: "Fechas Especiales", description: "Día de Martin Luther King Jr.", country: "usa" },

  // February
  { name: "Groundhog Day", date: "2026-02-02", type: "seasonal", niche: "Humor/Memes", description: "Día de la marmota", country: "usa" },
  { name: "San Valentín", date: "2026-02-14", type: "holiday", niche: "Amor/Romance", description: "Día del amor y la amistad", country: "global" },
  { name: "Presidents Day", date: "2026-02-16", type: "holiday", niche: "Fechas Especiales", description: "Día de los Presidentes", country: "usa" },
  { name: "Carnival", date: "2026-02-17", type: "seasonal", niche: "Pop Culture", description: "Carnaval - Celebración antes de Cuaresma", country: "latam" },

  // March
  { name: "Día Internacional de la Mujer", date: "2026-03-08", type: "awareness", niche: "Profesiones", description: "Celebración de los derechos de la mujer", country: "global" },
  { name: "St. Patrick's Day", date: "2026-03-17", type: "holiday", niche: "Pop Culture", description: "Día de San Patricio", country: "global" },
  { name: "Primavera (Equinoccio)", date: "2026-03-20", type: "seasonal", niche: "Naturaleza", description: "Inicio de la primavera", country: "global" },
  { name: "Día Mundial del Síndrome de Down", date: "2026-03-21", type: "awareness", niche: "Fechas Especiales", description: "Concienciación sobre el Síndrome de Down", country: "global" },

  // April
  { name: "April Fools", date: "2026-04-01", type: "seasonal", niche: "Humor/Memes", description: "Día de los inocentes (April Fools)", country: "usa" },
  { name: "Día Mundial del Autismo", date: "2026-04-02", type: "awareness", niche: "Fechas Especiales", description: "Concienciación sobre el autismo", country: "global" },
  { name: "Viernes Santo", date: "2026-04-03", type: "holiday", niche: "Religión", description: "Viernes Santo - Semana Santa", country: "latam" },
  { name: "Pascua/Easter", date: "2026-04-05", type: "holiday", niche: "Religión", description: "Domingo de Pascua", country: "global" },
  { name: "Día de la Tierra", date: "2026-04-22", type: "awareness", niche: "Eco/Sostenibilidad", description: "Día mundial de la Tierra", country: "global" },
  { name: "Día del Libro", date: "2026-04-23", type: "awareness", niche: "Literatura", description: "Día mundial del libro", country: "global" },

  // May
  { name: "Día del Trabajador", date: "2026-05-01", type: "holiday", niche: "Profesiones", description: "Día internacional del trabajador", country: "global" },
  { name: "Cinco de Mayo", date: "2026-05-05", type: "holiday", niche: "Pop Culture", description: "Batalla de Puebla - Celebración mexicana", country: "mexico" },
  { name: "Día de las Madres (México/Latam)", date: "2026-05-10", type: "holiday", niche: "Amor/Romance", description: "Día de las madres en México y Latinoamérica", country: "latam" },
  { name: "Día de África", date: "2026-05-25", type: "awareness", niche: "Arte/Cultura", description: "Día de África", country: "global" },
  { name: "Día Nacional del Celíaco", date: "2026-05-27", type: "awareness", niche: "Comida/Bebida", description: "Concienciación sobre enfermedad celíaca", country: "latam" },
  { name: "Mother's Day (USA)", date: "2026-05-10", type: "holiday", niche: "Amor/Romance", description: "Día de la madre en Estados Unidos", country: "usa" },

  // June
  { name: "Día Mundial del Medio Ambiente", date: "2026-06-05", type: "awareness", niche: "Eco/Sostenibilidad", description: "Día mundial del medio ambiente", country: "global" },
  { name: "Flag Day (USA)", date: "2026-06-14", type: "holiday", niche: "Fechas Especiales", description: "Día de la bandera estadounidense", country: "usa" },
  { name: "Pride Month (Junio)", date: "2026-06-15", type: "awareness", niche: "Pop Culture", description: "Mes del Orgullo LGBTQ+", country: "global" },
  { name: "Verano (Solsticio)", date: "2026-06-20", type: "seasonal", niche: "Naturaleza", description: "Inicio del verano", country: "global" },
  { name: "Día del Padre (USA/Latam)", date: "2026-06-21", type: "holiday", niche: "Amor/Romance", description: "Día del padre", country: "global" },
  { name: "Día de la Música", date: "2026-06-21", type: "awareness", niche: "Música", description: "Fête de la Musique", country: "global" },

  // July
  { name: "Independence Day (USA)", date: "2026-07-04", type: "holiday", niche: "Fechas Especiales", description: "Día de la independencia de Estados Unidos", country: "usa" },
  { name: "Día de la Independencia (Colombia)", date: "2026-07-20", type: "holiday", niche: "Fechas Especiales", description: "Día de la independencia de Colombia", country: "colombia" },
  { name: "Día de la Independencia (Perú)", date: "2026-07-28", type: "holiday", niche: "Fechas Especiales", description: "Día de la independencia del Perú", country: "peru" },
  { name: "Back to School Start", date: "2026-07-15", type: "commercial", niche: "Infantil", description: "Inicio temporada Back to School", country: "global" },

  // August
  { name: "Back to School Peak", date: "2026-08-01", type: "commercial", niche: "Infantil", description: "Pico de temporada Back to School", country: "global" },
  { name: "Día Internacional de la Juventud", date: "2026-08-12", type: "awareness", niche: "Fechas Especiales", description: "Día internacional de la juventud", country: "global" },
  { name: "Día del Fotografía", date: "2026-08-19", type: "awareness", niche: "Arte/Cultura", description: "Día mundial de la fotografía", country: "global" },

  // September
  { name: "Día de la Independencia (Brasil)", date: "2026-09-07", type: "holiday", niche: "Fechas Especiales", description: "Día de la independencia de Brasil", country: "brazil" },
  { name: "Independence Day (Centroamérica)", date: "2026-09-15", type: "holiday", niche: "Fechas Especiales", description: "Día de la independencia de Costa Rica, Guatemala, Honduras, Nicaragua, El Salvador", country: "latam" },
  { name: "Día de la Independencia (México)", date: "2026-09-16", type: "holiday", niche: "Fechas Especiales", description: "Día de la independencia de México", country: "mexico" },
  { name: "Día Internacional de la Paz", date: "2026-09-21", type: "awareness", niche: "Fechas Especiales", description: "Día internacional de la paz", country: "global" },
  { name: "Otoño (Equinoccio)", date: "2026-09-22", type: "seasonal", niche: "Naturaleza", description: "Inicio del otoño", country: "global" },
  { name: "Día Mundial del Corazón", date: "2026-09-29", type: "awareness", niche: "Fechas Especiales", description: "Concienciación sobre salud cardíaca", country: "global" },

  // October
  { name: "Día del Diseño Gráfico", date: "2026-10-01", type: "awareness", niche: "Arte/Cultura", description: "Día del diseñador gráfico", country: "latam" },
  { name: "Breast Cancer Awareness Month", date: "2026-10-05", type: "awareness", niche: "Fechas Especiales", description: "Mes de concientización sobre el cáncer de mama", country: "global" },
  { name: "Día de la Raza", date: "2026-10-12", type: "holiday", niche: "Fechas Especiales", description: "Día de la raza / Día de la diversidad cultural", country: "latam" },
  { name: "Halloween", date: "2026-10-31", type: "holiday", niche: "Pop Culture", description: "Noche de Halloween", country: "global" },
  { name: "Día Mundial de la Alimentación", date: "2026-10-16", type: "awareness", niche: "Comida/Bebida", description: "Día mundial de la alimentación", country: "global" },
  { name: "Día de la Música (Santoral Cecilia)", date: "2026-10-22", type: "seasonal", niche: "Música", description: "Celebración de Santa Cecilia, patrona de la música", country: "latam" },

  // November
  { name: "Día de los Santos", date: "2026-11-01", type: "holiday", niche: "Religión", description: "Día de todos los santos", country: "latam" },
  { name: "Día de los Muertos", date: "2026-11-02", type: "holiday", niche: "Arte/Cultura", description: "Día de los muertos - Tradición mexicana", country: "mexico" },
  { name: "Thanksgiving (USA)", date: "2026-11-27", type: "holiday", niche: "Fechas Especiales", description: "Día de acción de gracias", country: "usa" },
  { name: "Black Friday", date: "2026-11-28", type: "commercial", niche: "Moda/Estilo", description: "Black Friday - Ofertas masivas", country: "global" },
  { name: "Cyber Monday", date: "2026-11-30", type: "commercial", niche: "Moda/Estilo", description: "Cyber Monday - Ofertas online", country: "global" },
  { name: "Movember (Mes)", date: "2026-11-15", type: "awareness", niche: "Fechas Especiales", description: "Movember - Salud masculina", country: "global" },
  { name: "Día Mundial de la Ciencia", date: "2026-11-10", type: "awareness", niche: "Ciencia/Tech", description: "Día mundial de la ciencia para la paz", country: "global" },

  // December
  { name: "Inicio Navidad", date: "2026-12-01", type: "seasonal", niche: "Fechas Especiales", description: "Inicio de la temporada navideña", country: "global" },
  { name: "Día de la Virgen de Guadalupe", date: "2026-12-12", type: "holiday", niche: "Religión", description: "Día de la Virgen de Guadalupe", country: "mexico" },
  { name: "Invierno (Solsticio)", date: "2026-12-21", type: "seasonal", niche: "Naturaleza", description: "Inicio del invierno", country: "global" },
  { name: "Nochebuena", date: "2026-12-24", type: "holiday", niche: "Religión", description: "Nochebuena - Víspera de Navidad", country: "global" },
  { name: "Navidad", date: "2026-12-25", type: "holiday", niche: "Fechas Especiales", description: "Día de Navidad", country: "global" },
  { name: "Nochevieja/Año Nuevo Eve", date: "2026-12-31", type: "holiday", niche: "Fechas Especiales", description: "Víspera de Año Nuevo", country: "global" },
  { name: "Festivus", date: "2026-12-23", type: "seasonal", niche: "Humor/Memes", description: "Festivus - Para el resto de nosotros", country: "usa" },
  { name: "Hanukkah Start", date: "2026-12-14", type: "holiday", niche: "Religión", description: "Inicio de Jánuca", country: "global" },
  { name: "Kwanzaa Start", date: "2026-12-26", type: "holiday", niche: "Arte/Cultura", description: "Inicio de Kwanzaa", country: "usa" },
  { name: "Boxing Day", date: "2026-12-26", type: "commercial", niche: "Moda/Estilo", description: "Boxing Day - Ventas post-navidad", country: "global" },

  // Additional awareness dates
  { name: "Día Mundial de la Salud Mental", date: "2026-10-10", type: "awareness", niche: "Fechas Especiales", description: "Día mundial de la salud mental", country: "global" },
  { name: "Día Internacional del Voluntario", date: "2026-12-05", type: "awareness", niche: "Fechas Especiales", description: "Día internacional del voluntario", country: "global" },
  { name: "Día de los Derechos Humanos", date: "2026-12-10", type: "awareness", niche: "Fechas Especiales", description: "Día de los derechos humanos", country: "global" },
  { name: "Día del Animal", date: "2026-10-04", type: "awareness", niche: "Naturaleza", description: "Día mundial del animal", country: "global" },
  { name: "Día del Amigo", date: "2026-07-20", type: "holiday", niche: "Amor/Romance", description: "Día del amigo", country: "latam" },
  { name: "Día del Niño", date: "2026-08-16", type: "holiday", niche: "Infantil", description: "Día del niño", country: "latam" },
  { name: "Día del Maestro", date: "2026-09-11", type: "awareness", niche: "Profesiones", description: "Día del maestro", country: "latam" },
  { name: "Día del Médico", date: "2026-10-23", type: "awareness", niche: "Profesiones", description: "Día del médico", country: "latam" },
  { name: "Día del Abogado", date: "2026-08-22", type: "awareness", niche: "Profesiones", description: "Día del abogado", country: "latam" },
  { name: "Día del Ingeniero", date: "2026-09-15", type: "awareness", niche: "Profesiones", description: "Día del ingeniero", country: "latam" },
  { name: "Día del Arquitecto", date: "2026-07-01", type: "awareness", niche: "Profesiones", description: "Día del arquitecto", country: "latam" },
  { name: "Día de la Madre Tierra", date: "2026-04-22", type: "awareness", niche: "Eco/Sostenibilidad", description: "Día de la madre tierra", country: "global" },
  { name: "World Wildlife Day", date: "2026-03-03", type: "awareness", niche: "Naturaleza", description: "Día mundial de la vida silvestre", country: "global" },
  { name: "Día de los Océanos", date: "2026-06-08", type: "awareness", niche: "Eco/Sostenibilidad", description: "Día mundial de los océanos", country: "global" },
  { name: "Día de la Bicicleta", date: "2026-06-03", type: "awareness", niche: "Deportes", description: "Día mundial de la bicicleta", country: "global" },
  { name: "Día del Yoga", date: "2026-06-21", type: "awareness", niche: "Deportes", description: "Día internacional del yoga", country: "global" },
  { name: "Día del Café", date: "2026-10-01", type: "awareness", niche: "Comida/Bebida", description: "Día internacional del café", country: "global" },
  { name: "Día de la Cerveza", date: "2026-08-02", type: "seasonal", niche: "Comida/Bebida", description: "Día internacional de la cerveza", country: "global" },
  { name: "Día del Chocolate", date: "2026-09-13", type: "awareness", niche: "Comida/Bebida", description: "Día internacional del chocolate", country: "global" },
  { name: "Día del Turismo", date: "2026-09-27", type: "awareness", niche: "Viajes", description: "Día mundial del turismo", country: "global" },
  { name: "Día del Arte", date: "2026-04-15", type: "awareness", niche: "Arte/Cultura", description: "Día mundial del arte", country: "global" },
  { name: "Día del Patrimonio", date: "2026-04-18", type: "awareness", niche: "Arte/Cultura", description: "Día internacional de los monumentos y sitios", country: "global" },
  { name: "Día de la Moda", date: "2026-07-06", type: "seasonal", niche: "Moda/Estilo", description: "Día de la moda", country: "global" },
  { name: "World Game Day", date: "2026-05-18", type: "awareness", niche: "Gaming", description: "Día mundial de los juegos", country: "global" },
  { name: "Día del Gamer", date: "2026-08-29", type: "awareness", niche: "Gaming", description: "Día nacional del gamer", country: "latam" },
  { name: "Día de la Poesía", date: "2026-03-21", type: "awareness", niche: "Literatura", description: "Día mundial de la poesía", country: "global" },
  { name: "Día del Idioma", date: "2026-04-23", type: "awareness", niche: "Literatura", description: "Día del idioma español", country: "latam" },
  { name: "Valentine's Season Start", date: "2026-02-01", type: "commercial", niche: "Amor/Romance", description: "Inicio temporada de San Valentín", country: "global" },
  { name: "Christmas Shopping Season", date: "2026-12-15", type: "commercial", niche: "Moda/Estilo", description: "Pico de compras navideñas", country: "global" },
  { name: "Summer Sale Season", date: "2026-07-01", type: "commercial", niche: "Moda/Estilo", description: "Temporada de rebajas de verano", country: "global" },
  { name: "Spring Sale Season", date: "2026-04-15", type: "commercial", niche: "Moda/Estilo", description: "Temporada de rebajas de primavera", country: "global" },
  { name: "Day of the Dead Season Start", date: "2026-10-25", type: "seasonal", niche: "Arte/Cultura", description: "Inicio temporada Día de Muertos", country: "mexico" },
  { name: "Halloween Season Start", date: "2026-10-15", type: "seasonal", niche: "Pop Culture", description: "Inicio temporada de Halloween", country: "global" },
  { name: "Holiday Season Start", date: "2026-11-28", type: "seasonal", niche: "Fechas Especiales", description: "Inicio temporada navideña de compras", country: "global" },
  { name: "Super Bowl", date: "2026-02-08", type: "commercial", niche: "Deportes", description: "Super Bowl - Evento deportivo", country: "usa" },
  { name: "Olympics Season", date: "2026-02-06", type: "seasonal", niche: "Deportes", description: "Juegos Olímpicos de Invierno", country: "global" },
  { name: "FIFA World Cup Season", date: "2026-06-11", type: "seasonal", niche: "Deportes", description: "Temporada Copa Mundial FIFA", country: "global" },
  { name: "Dia de la Constitución (México)", date: "2026-02-05", type: "holiday", niche: "Fechas Especiales", description: "Día de la constitución mexicana", country: "mexico" },
  { name: "Dia de la Bandera (México)", date: "2026-02-24", type: "holiday", niche: "Fechas Especiales", description: "Día de la bandera mexicana", country: "mexico" },
  { name: "Benito Juárez Birthday", date: "2026-03-21", type: "holiday", niche: "Fechas Especiales", description: "Natalicio de Benito Juárez", country: "mexico" },
  { name: "Dia de la Revolución (México)", date: "2026-11-20", type: "holiday", niche: "Fechas Especiales", description: "Día de la revolución mexicana", country: "mexico" },
  { name: "Dia del Abogado (USA)", date: "2026-05-01", type: "awareness", niche: "Profesiones", description: "Law Day / Día del abogado", country: "usa" },
  { name: "Veterans Day", date: "2026-11-11", type: "holiday", niche: "Fechas Especiales", description: "Día de los veteranos", country: "usa" },
  { name: "Memorial Day", date: "2026-05-25", type: "holiday", niche: "Fechas Especiales", description: "Día conmemorativo", country: "usa" },
  { name: "Labor Day (USA)", date: "2026-09-07", type: "holiday", niche: "Profesiones", description: "Día del trabajo en USA", country: "usa" },
  { name: "Dia de la Raza (USA - Columbus Day)", date: "2026-10-12", type: "holiday", niche: "Fechas Especiales", description: "Columbus Day / Indigenous Peoples Day", country: "usa" },
];

// Prompt template
export function generatePromptText(data: {
  product: string;
  niche: string;
  style: string;
  primaryText: string;
  secondaryText: string;
  accentText: string;
  fonts: { principal: string; secundaria: string; acento: string };
  colorPalette: string[];
  paletteName: string;
  aiTool: string;
}): string {
  const productNotes: Record<string, string> = {
    "T-Shirt": "centered chest design, 4500x5400px, transparent background compatible",
    "Hoodie": "large front or back design, 4500x5400px, kangaroo pocket compatible",
    "Mug/Taza": "wrap-around design, 2700x1520px, handle-safe area",
    "Poster/Lámina": "full bleed design, high DPI, gallery quality, 6000x8000px",
    "Phone Case": "edge-to-edge design, camera cutout compatible, 2400x4000px",
    "Tote Bag": "centered design, large print area, 3600x4200px",
    "Sticker": "die-cut edge design, 3000x3000px, bold outlines for cutting",
    "Notebook/Agenda": "cover design, 2400x3200px, spine area safe",
    "Cap/Gorra": "front panel design, 2800x1800px, embroidery-friendly",
    "Cushion/Cojín": "full face design, 3600x3600px, soft texture compatible",
    "Blanket/Manta": "large all-over design, 5400x7200px, cozy aesthetic",
    "Pin/Badge": "compact circular design, 1000x1000px, bold simple shapes",
    "Card/Invitación": "portrait layout design, 2400x3600px, elegant presentation",
    "Mousepad": "full surface design, 3600x2700px, desk accessory aesthetic",
  };

  const notes = productNotes[data.product] || "high resolution, print-ready quality, 3000x3000px";
  const colorStr = data.colorPalette.join(", ");
  
  let prompt = `${data.product} design featuring "${data.primaryText}" in ${data.fonts.principal} typography, ${data.style} style, ${data.niche} theme, color palette of ${data.paletteName} (${colorStr})`;
  
  if (data.secondaryText) {
    prompt += `, secondary text "${data.secondaryText}" in ${data.fonts.secundaria}`;
  }
  if (data.accentText) {
    prompt += `, accent detail "${data.accentText}" in ${data.fonts.acento}`;
  }
  
  prompt += `, optimized for ${data.aiTool}, high resolution, print-ready quality, ${notes}`;
  
  return prompt;
}
