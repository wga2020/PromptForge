// ============================================================
// DATA CONSTANTS FOR PRINT-ON-DEMAND AI PROMPT GENERATOR
// ENHANCED WITH MASTER PROMPT TEMPLATE SYSTEM
// ============================================================

export interface ProductInfo {
  name: string;
  icon: string;
  description: string;
  printArea: string;
  resolution: string;
}

export const PRODUCTS: ProductInfo[] = [
  { name: "T-Shirt", icon: "👕", description: "Camiseta clásica", printArea: "centered chest design", resolution: "4500x5400px" },
  { name: "Hoodie", icon: "🧥", description: "Sudadera con capucha", printArea: "large front or back design, kangaroo pocket compatible", resolution: "4500x5400px" },
  { name: "Mug/Taza", icon: "☕", description: "Taza personalizada", printArea: "wrap-around design, handle-safe area", resolution: "2700x1520px" },
  { name: "Poster/Lámina", icon: "🖼️", description: "Póster decorativo", printArea: "full bleed design, gallery quality", resolution: "6000x8000px" },
  { name: "Phone Case", icon: "📱", description: "Funda de teléfono", printArea: "edge-to-edge design, camera cutout compatible", resolution: "2400x4000px" },
  { name: "Tote Bag", icon: "👜", description: "Bolsa de tela", printArea: "centered design, large print area", resolution: "3600x4200px" },
  { name: "Sticker", icon: "🏷️", description: "Pegatina adhesiva", printArea: "die-cut edge design, bold outlines for cutting", resolution: "3000x3000px" },
  { name: "Notebook/Agenda", icon: "📓", description: "Cuaderno/Agenda", printArea: "cover design, spine area safe", resolution: "2400x3200px" },
  { name: "Cap/Gorra", icon: "🧢", description: "Gorra personalizada", printArea: "front panel design, embroidery-friendly shapes", resolution: "2800x1800px" },
  { name: "Cushion/Cojín", icon: "🛋️", description: "Cojín decorativo", printArea: "full face design, soft texture compatible", resolution: "3600x3600px" },
  { name: "Blanket/Manta", icon: "🧣", description: "Manta personalizada", printArea: "large all-over design, cozy aesthetic", resolution: "5400x7200px" },
  { name: "Pin/Badge", icon: "📌", description: "Pin/Lepismo", printArea: "compact circular design, bold simple shapes", resolution: "1000x1000px" },
  { name: "Card/Invitación", icon: "💌", description: "Tarjeta/Invitación", printArea: "portrait layout design, elegant presentation", resolution: "2400x3600px" },
  { name: "Mousepad", icon: "🖱️", description: "Alfombrilla de ratón", printArea: "full surface design, desk accessory aesthetic", resolution: "3600x2700px" },
  { name: "Cover Ebook", icon: "📖", description: "Portada de Ebook", printArea: "full front cover design, portrait layout, thumbnail-optimized", resolution: "2500x4000px" },
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

// ============================================================
// DESIGN STYLES — Enriched with visual metadata
// ============================================================
export interface DesignStyleDef {
  id: string;
  name: string;           // Used as the style value in prompts
  keywords: string[];     // Mood/aesthetic descriptors shown in UI
  previewColor: string;   // Representative hex color for style card
  previewGradient: string; // CSS gradient for card background
  popularPOD: boolean;    // Top-5 seller in POD market
  bestNiches: string[];   // Niches where this style converts best
  bestProducts: string[]; // Products where this style performs best
  emoji: string;          // Visual icon for the style
}

export const DESIGN_STYLES_ENRICHED: DesignStyleDef[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    keywords: ['Clean', 'Simple', 'Modern', 'Elegante'],
    previewColor: '#2C3E50',
    previewGradient: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
    popularPOD: true,
    bestNiches: ['Moda/Estilo', 'Motivacional', 'Eco/Sostenibilidad', 'Literatura'],
    bestProducts: ['T-Shirt', 'Tote Bag', 'Poster/Lámina', 'Notebook/Agenda'],
    emoji: '◻️',
  },
  {
    id: 'vintage_retro',
    name: 'Vintage/Retro',
    keywords: ['Nostálgico', 'Retro', 'Desgastado', 'Clásico'],
    previewColor: '#8B4513',
    previewGradient: 'linear-gradient(135deg, #D4A574 0%, #8B4513 100%)',
    popularPOD: true,
    bestNiches: ['Deportes', 'Música', 'Hobbies', 'Comida/Bebida', 'Pop Culture'],
    bestProducts: ['T-Shirt', 'Hoodie', 'Cap/Gorra', 'Mug/Taza'],
    emoji: '🏷️',
  },
  {
    id: 'modern_bold',
    name: 'Modern Bold',
    keywords: ['Impactante', 'Dinámico', 'Alto contraste', 'Audaz'],
    previewColor: '#E74C3C',
    previewGradient: 'linear-gradient(135deg, #E74C3C 0%, #2C3E50 100%)',
    popularPOD: true,
    bestNiches: ['Motivacional', 'Deportes', 'Gaming', 'Música'],
    bestProducts: ['T-Shirt', 'Hoodie', 'Poster/Lámina', 'Mousepad'],
    emoji: '⚡',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    keywords: ['Lujoso', 'Refinado', 'Sofisticado', 'Premium'],
    previewColor: '#C4960C',
    previewGradient: 'linear-gradient(135deg, #C4960C 0%, #1B1B1B 100%)',
    popularPOD: false,
    bestNiches: ['Moda/Estilo', 'Amor/Romance', 'Arte/Cultura', 'Fechas Especiales'],
    bestProducts: ['Card/Invitación', 'Poster/Lámina', 'Notebook/Agenda', 'Mug/Taza'],
    emoji: '✨',
  },
  {
    id: 'grunge',
    name: 'Grunge',
    keywords: ['Rudo', 'Urbano', 'Desgastado', 'Raw'],
    previewColor: '#4A4A4A',
    previewGradient: 'linear-gradient(135deg, #2C2C2C 0%, #6B6B6B 100%)',
    popularPOD: false,
    bestNiches: ['Música', 'Deportes', 'Pop Culture', 'Humor/Memes'],
    bestProducts: ['T-Shirt', 'Hoodie', 'Sticker', 'Cap/Gorra'],
    emoji: '🤘',
  },
  {
    id: 'boho',
    name: 'Boho',
    keywords: ['Orgánico', 'Artesanal', 'Libre', 'Étnico'],
    previewColor: '#CC5500',
    previewGradient: 'linear-gradient(135deg, #D4A373 0%, #CC5500 100%)',
    popularPOD: false,
    bestNiches: ['Naturaleza', 'Eco/Sostenibilidad', 'Hobbies', 'Amor/Romance'],
    bestProducts: ['Tote Bag', 'Cushion/Cojín', 'Notebook/Agenda', 'T-Shirt'],
    emoji: '🌿',
  },
  {
    id: 'kawaii',
    name: 'Kawaii',
    keywords: ['Tierno', 'Pastel', 'Adorable', 'Japonés'],
    previewColor: '#FF90B3',
    previewGradient: 'linear-gradient(135deg, #FFB3BA 0%, #BAE1FF 100%)',
    popularPOD: true,
    bestNiches: ['Infantil', 'Amor/Romance', 'Hobbies', 'Humor/Memes'],
    bestProducts: ['Sticker', 'Phone Case', 'Pin/Badge', 'T-Shirt'],
    emoji: '🌸',
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    keywords: ['Urbano', 'Hip-Hop', 'Street', 'Atrevido'],
    previewColor: '#1C1C1C',
    previewGradient: 'linear-gradient(135deg, #1C1C1C 0%, #4A4A4A 100%)',
    popularPOD: true,
    bestNiches: ['Música', 'Gaming', 'Deportes', 'Pop Culture'],
    bestProducts: ['Hoodie', 'T-Shirt', 'Cap/Gorra', 'Mousepad'],
    emoji: '🏙️',
  },
  {
    id: 'art_deco',
    name: 'Art Deco',
    keywords: ['Geométrico', 'Dorado', 'Años 20', 'Glamour'],
    previewColor: '#C5A059',
    previewGradient: 'linear-gradient(135deg, #1A1A1A 0%, #C5A059 100%)',
    popularPOD: false,
    bestNiches: ['Arte/Cultura', 'Moda/Estilo', 'Fechas Especiales', 'Literatura'],
    bestProducts: ['Poster/Lámina', 'Card/Invitación', 'Notebook/Agenda', 'Cushion/Cojín'],
    emoji: '🔶',
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    keywords: ['Neón', 'Retro-Futurista', '80s', 'Cyberpunk'],
    previewColor: '#00D4FF',
    previewGradient: 'linear-gradient(135deg, #0A0A0A 0%, #6B21A8 50%, #00D4FF 100%)',
    popularPOD: false,
    bestNiches: ['Gaming', 'Música', 'Ciencia/Tech', 'Pop Culture'],
    bestProducts: ['Mousepad', 'Hoodie', 'Poster/Lámina', 'Phone Case'],
    emoji: '🌐',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    keywords: ['Acuarela', 'Suave', 'Fluido', 'Artístico'],
    previewColor: '#45B7D1',
    previewGradient: 'linear-gradient(135deg, #FFB3BA 0%, #BAE1FF 50%, #BAFFC9 100%)',
    popularPOD: false,
    bestNiches: ['Naturaleza', 'Amor/Romance', 'Fechas Especiales', 'Arte/Cultura'],
    bestProducts: ['Card/Invitación', 'Notebook/Agenda', 'Poster/Lámina', 'Blanket/Manta'],
    emoji: '🎨',
  },
  {
    id: 'typography_focused',
    name: 'Typography-focused',
    keywords: ['Tipográfico', 'Letras', 'Bold', 'Texto como arte'],
    previewColor: '#1B1B1B',
    previewGradient: 'linear-gradient(135deg, #1B1B1B 0%, #444444 100%)',
    popularPOD: true,
    bestNiches: ['Motivacional', 'Humor/Memes', 'Literatura', 'Profesiones'],
    bestProducts: ['T-Shirt', 'Mug/Taza', 'Tote Bag', 'Poster/Lámina'],
    emoji: '🔤',
  },
];

// Keep backward-compatible flat array for existing prompt generation code
export const DESIGN_STYLES = DESIGN_STYLES_ENRICHED.map(s => s.name);

// ============================================================
// STYLE → NICHE COMPATIBILITY MAP
// Returns styles sorted by relevance for a given niche
// ============================================================
export function getRecommendedStylesForNiche(niche: string, product: string): DesignStyleDef[] {
  return [...DESIGN_STYLES_ENRICHED].sort((a, b) => {
    const aMatchesNiche = a.bestNiches.includes(niche) ? 2 : 0;
    const bMatchesNiche = b.bestNiches.includes(niche) ? 2 : 0;
    const aMatchesProduct = a.bestProducts.includes(product) ? 1 : 0;
    const bMatchesProduct = b.bestProducts.includes(product) ? 1 : 0;
    const aScore = aMatchesNiche + aMatchesProduct + (a.popularPOD ? 0.5 : 0);
    const bScore = bMatchesNiche + bMatchesProduct + (b.popularPOD ? 0.5 : 0);
    return bScore - aScore;
  });
}

// ============================================================
// NICHE TEXT EXAMPLES — Hardcoded fallbacks for instant UI
// Used while AI generates personalized suggestions
// ============================================================
export const NICHE_TEXT_EXAMPLES: Record<string, {
  primary: string[];
  secondary: string[];
  accent: string[];
}> = {
  "Motivacional": {
    primary: ["Rise & Grind", "Make It Happen", "Dream Big", "No Excuses", "Stay Focused", "Level Up"],
    secondary: ["Every day is a chance", "Believe in yourself", "Keep going"],
    accent: ["#Goals", "Hustle", "Unstoppable"],
  },
  "Profesiones": {
    primary: ["Born to Code", "Nurse Life", "Teacher Mode", "Chef at Heart", "Doctor by Day", "Engineer Mindset"],
    secondary: ["Proud professional", "Passion made career", "Skills pay the bills"],
    accent: ["Since Day One", "Pro Level", "Certified"],
  },
  "Hobbies": {
    primary: ["Reel Life", "Coffee & Books", "Born to Hike", "Shoot to Thrill", "Hook & Line", "Play It Right"],
    secondary: ["Hobby becomes lifestyle", "Passion never stops", "Weekend warrior"],
    accent: ["All Day", "24/7", "Obsessed"],
  },
  "Religión": {
    primary: ["Faith Over Fear", "Blessed & Grateful", "God Is Good", "Walk by Faith", "His Grace", "Pray Always"],
    secondary: ["Trust in the Lord", "Grace upon grace", "His plan, not mine"],
    accent: ["Amen", "Blessed", "Glory"],
  },
  "Pop Culture": {
    primary: ["Main Character", "Plot Twist", "Fan Since Day One", "Cult Classic", "Fandom Forever", "Iconic"],
    secondary: ["Just here for the vibes", "Living in my era", "This is the way"],
    accent: ["Obsessed", "Vibes Only", "Canon"],
  },
  "Fechas Especiales": {
    primary: ["Happy Birthday", "Cheers to 30", "Best Day Ever", "Party Season", "Celebrate Life", "Another Year Older"],
    secondary: ["Today is your day", "Make a wish", "Celebrate good times"],
    accent: ["Cheers!", "Woo!", "Celebrate"],
  },
  "Amor/Romance": {
    primary: ["You & Me", "Love You More", "My Person", "Better Together", "Always & Forever", "Soulmates"],
    secondary: ["Every day with you", "You had me at hello", "My favorite person"],
    accent: ["Always", "Forever", "XOXO"],
  },
  "Naturaleza": {
    primary: ["Into the Wild", "Born Free", "Earth Lover", "Nature First", "Wild at Heart", "Go Outside"],
    secondary: ["Leave no trace", "Forest therapy", "The earth is calling"],
    accent: ["Explore", "Wander", "Free"],
  },
  "Ciencia/Tech": {
    primary: ["Code & Coffee", "Debug Mode", "Binary Dreams", "404 Sleep Not Found", "Think Digital", "Stay Geeky"],
    secondary: ["It compiles, ship it", "There's no place like", "The cloud is the limit"],
    accent: ["01001", "git push", "CTRL+Z"],
  },
  "Deportes": {
    primary: ["Game Day", "Train Hard", "All In", "Built Different", "No Days Off", "Sweat Now"],
    secondary: ["Play like a champion", "Heart of a winner", "Born to compete"],
    accent: ["Beast Mode", "Game On", "MVP"],
  },
  "Comida/Bebida": {
    primary: ["Foodie Life", "Coffee First", "Wine Not?", "Pizza is Life", "Taco Tuesday", "Brunch Club"],
    secondary: ["Powered by caffeine", "Life is too short for bad food", "But first, coffee"],
    accent: ["Sip Sip", "Cheers", "Yum"],
  },
  "Viajes": {
    primary: ["Wanderlust", "Not All Who Wander", "Passport Ready", "World Explorer", "Born to Roam", "Jet Set Go"],
    secondary: ["Collect moments not things", "Adventure awaits", "The world is yours"],
    accent: ["Explore", "Roam", "Discover"],
  },
  "Arte/Cultura": {
    primary: ["Art is Life", "Create Daily", "Make Art", "Brush Strokes", "Stay Creative", "Art Never Stops"],
    secondary: ["Every stroke tells a story", "Art speaks where words fail", "Create your world"],
    accent: ["Create", "Inspire", "Imagine"],
  },
  "Eco/Sostenibilidad": {
    primary: ["Go Green", "Save the Planet", "Earth First", "Eco Warrior", "Less Plastic", "Plant Trees"],
    secondary: ["One planet, one chance", "Live green, think green", "Reduce, reuse, rethink"],
    accent: ["Green", "Eco", "Recycle"],
  },
  "Moda/Estilo": {
    primary: ["Style Always", "Fashion Forward", "Dress to Impress", "Trendsetter", "Serve Looks", "Outfit Goals"],
    secondary: ["Confidence is key", "Dress how you want to feel", "Style is a way to say who you are"],
    accent: ["OOTD", "Slay", "Chic"],
  },
  "Gaming": {
    primary: ["Player One", "Game Over Reality", "Level 99", "GG No Re", "Respawn", "Git Gud"],
    secondary: ["I paused my game for this", "Born to game, forced to work", "Insert coin to start"],
    accent: ["GG", "AFK", "Noob"],
  },
  "Música": {
    primary: ["Music is Life", "Live for Sound", "Born to Rock", "Turn It Up", "Feel the Beat", "Lost in Music"],
    secondary: ["Life is better with music", "When words fail, music speaks", "Soundtrack of my life"],
    accent: ["Play On", "Loud", "Encore"],
  },
  "Infantil": {
    primary: ["Future Leader", "Little Explorer", "Tiny Human", "Born to Shine", "Dream Big Kid", "Super Kid"],
    secondary: ["Growing up fast", "Watch me grow", "Cute but fierce"],
    accent: ["Yay!", "Whoosh", "Awesome"],
  },
  "Humor/Memes": {
    primary: ["I Woke Up Like This", "Adulting Is Hard", "Nap Queen", "Send Coffee", "Zero Chill", "Mood"],
    secondary: ["Not a morning person", "Professionally awkward", "Error 404: Motivation not found"],
    accent: ["Lol", "Same", "Big Yikes"],
  },
  "Literatura": {
    primary: ["Bookworm", "One More Chapter", "Born to Read", "Story Lover", "Page Turner", "Lost in a Book"],
    secondary: ["A reader lives a thousand lives", "Books are portals", "Coffee, books, repeat"],
    accent: ["Read More", "Chapter One", "Prologue"],
  },
};

// ============================================================
// COLOR PALETTES — Enriched with metadata
// ============================================================
export interface PaletteInfo {
  colors: string[];
  mood: string;
  bestStyles: string[];    // Style names that pair well
  bestNiches: string[];    // Niches this palette fits
}

export const COLOR_PALETTES_META: Record<string, PaletteInfo> = {
  "Elegant Gold": {
    colors: ["#C4960C", "#1B1B1B", "#722F37", "#F5F0E8"],
    mood: "Lujoso · Premium · Clásico",
    bestStyles: ["Elegant", "Art Deco", "Typography-focused"],
    bestNiches: ["Moda/Estilo", "Arte/Cultura", "Fechas Especiales"],
  },
  "Bold Primary": {
    colors: ["#E74C3C", "#2C3E50", "#F39C12", "#ECF0F1"],
    mood: "Enérgico · Impactante · Directo",
    bestStyles: ["Modern Bold", "Streetwear", "Typography-focused"],
    bestNiches: ["Motivacional", "Deportes", "Humor/Memes"],
  },
  "Pastel Soft": {
    colors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA"],
    mood: "Tierno · Dulce · Suave",
    bestStyles: ["Kawaii", "Watercolor", "Boho"],
    bestNiches: ["Infantil", "Amor/Romance", "Naturaleza"],
  },
  "Dark Neon": {
    colors: ["#00D4FF", "#0A0A0A", "#39FF14", "#FF073A"],
    mood: "Eléctrico · Cyberpunk · Nocturno",
    bestStyles: ["Synthwave", "Streetwear", "Modern Bold"],
    bestNiches: ["Gaming", "Música", "Ciencia/Tech"],
  },
  "Earth Tones": {
    colors: ["#8B4513", "#D2B48C", "#CC5500", "#F5F0E8"],
    mood: "Natural · Cálido · Orgánico",
    bestStyles: ["Boho", "Vintage/Retro", "Minimalist"],
    bestNiches: ["Naturaleza", "Eco/Sostenibilidad", "Hobbies"],
  },
  "Monochrome": {
    colors: ["#000000", "#333333", "#666666", "#FFFFFF"],
    mood: "Minimalista · Atemporal · Clean",
    bestStyles: ["Minimalist", "Typography-focused", "Elegant"],
    bestNiches: ["Moda/Estilo", "Arte/Cultura", "Motivacional"],
  },
  "Vibrant Pop": {
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
    mood: "Alegre · Fresco · Energético",
    bestStyles: ["Kawaii", "Modern Bold", "Watercolor"],
    bestNiches: ["Infantil", "Pop Culture", "Fechas Especiales"],
  },
  "Coastal Blue": {
    colors: ["#1A5276", "#2E86C1", "#85C1E9", "#F0F8FF"],
    mood: "Sereno · Fresco · Confiable",
    bestStyles: ["Minimalist", "Elegant", "Watercolor"],
    bestNiches: ["Naturaleza", "Viajes", "Eco/Sostenibilidad"],
  },
  "Forest Green": {
    colors: ["#2D5016", "#6B4423", "#DAA520", "#FEFDF8"],
    mood: "Rústico · Natural · Aventurero",
    bestStyles: ["Vintage/Retro", "Boho", "Minimalist"],
    bestNiches: ["Naturaleza", "Hobbies", "Deportes"],
  },
  "Sunset Warm": {
    colors: ["#FF4500", "#FF8C00", "#FFD700", "#FFF8DC"],
    mood: "Cálido · Brillante · Optimista",
    bestStyles: ["Modern Bold", "Vintage/Retro", "Typography-focused"],
    bestNiches: ["Motivacional", "Viajes", "Deportes"],
  },
};

// Keep backward-compatible flat color map
export const COLOR_PALETTES: Record<string, string[]> = Object.fromEntries(
  Object.entries(COLOR_PALETTES_META).map(([k, v]) => [k, v.colors])
);

export const AI_TOOLS = [
  "Midjourney",
  "DALL-E",
  "ChatGPT Images",
  "Leonardo AI",
  "Ideogram",
  "Stable Diffusion",
  "Flux",
  "Nano Banana",
];

// ============================================================
// OBJECT CATEGORIES FOR DESIGN CUSTOMIZATION
// 20 categories aligned with niches, each with 5+ objects
// ============================================================
export interface ObjectCategory {
  name: string;
  icon: string;
  niche: string;
  objects: string[];
}

export const OBJECT_CATEGORIES: ObjectCategory[] = [
  {
    name: "Música",
    icon: "🎵",
    niche: "Música",
    objects: ["Guitarra", "Saxofón", "Timbal", "Maracas", "Teclado/Piano", "Trompeta", "Batería"]
  },
  {
    name: "Médica",
    icon: "🏥",
    niche: "Profesiones",
    objects: ["Estetoscopio", "Termómetro", "Jeringa", "Balanza", "Botiquín", "Corazón anatómico"]
  },
  {
    name: "Deportes",
    icon: "⚽",
    niche: "Deportes",
    objects: ["Bate de Béisbol", "Balón de Fútbol", "Balón de Basket", "Raqueta", "Casco", "Guante de Box"]
  },
  {
    name: "Tecnología",
    icon: "💻",
    niche: "Ciencia/Tech",
    objects: ["Circuito integrado", "Robot", "Doble Hélice ADN", "Átomo", "Teclado", "Chip"]
  },
  {
    name: "Culinaria",
    icon: "🍳",
    niche: "Comida/Bebida",
    objects: ["Taza de Café", "Sombrero de Chef", "Rebanada de Pizza", "Copa de Vino", "Cupcake", "Cuchillo de Chef"]
  },
  {
    name: "Naturaleza",
    icon: "🌿",
    niche: "Naturaleza",
    objects: ["Hoja", "Montaña", "Ola", "Árbol", "Flor", "Mariposa"]
  },
  {
    name: "Viajes",
    icon: "✈️",
    niche: "Viajes",
    objects: ["Avión", "Brújula", "Globo terráqueo", "Maleta", "Pasaporte", "Cámara de fotos"]
  },
  {
    name: "Espiritualidad",
    icon: "✝️",
    niche: "Religión",
    objects: ["Cruz", "Rosario", "Paloma", "Cáliz", "Vela", "Biblia"]
  },
  {
    name: "Romance",
    icon: "💕",
    niche: "Amor/Romance",
    objects: ["Corazón", "Rosa", "Anillo", "Flecha de Cupido", "Carta de amor", "Cupido"]
  },
  {
    name: "Festivo",
    icon: "🎉",
    niche: "Fechas Especiales",
    objects: ["Regalo", "Fuegos artificiales", "Globo", "Pastel", "Estrella", "Piñata"]
  },
  {
    name: "Arte",
    icon: "🎨",
    niche: "Arte/Cultura",
    objects: ["Pincel", "Máscaras de Teatro", "Escultura", "Caballete", "Violín", "Paleta de colores"]
  },
  {
    name: "Ecológica",
    icon: "♻️",
    niche: "Eco/Sostenibilidad",
    objects: ["Símbolo Reciclar", "Panel Solar", "Molino de Viento", "Brote/Semilla", "Gota de Agua", "Hoja Verde"]
  },
  {
    name: "Moda",
    icon: "👠",
    niche: "Moda/Estilo",
    objects: ["Taco Alto", "Gafas de Sol", "Bolso", "Corbata", "Diamante", "Corona"]
  },
  {
    name: "Gaming",
    icon: "🎮",
    niche: "Gaming",
    objects: ["Control/Mando", "Joystick", "Gafas VR", "Dado", "Espada Pixel", "Moneda"]
  },
  {
    name: "Infantil",
    icon: "🧸",
    niche: "Infantil",
    objects: ["Oso de Peluche", "Globo Animal", "Cohete de Juguete", "Bloques", "Chupete", "Tren de Juguete"]
  },
  {
    name: "Humor",
    icon: "😂",
    niche: "Humor/Memes",
    objects: ["Emoji Risueño", "Cojín de Broma", "Pato de Goma", "Varita Mágica", "Sombrero de Bufón", "Llama"]
  },
  {
    name: "Literatura",
    icon: "📚",
    niche: "Literatura",
    objects: ["Libro Abierto", "Pluma Estilográfica", "Gafas de Lectura", "Pergamino", "Tintero", "Lámpara de Lectura"]
  },
  {
    name: "Superación",
    icon: "🚀",
    niche: "Motivacional",
    objects: ["Mancuerna", "Cumbre de Montaña", "Trofeo", "Cohete", "Amanecer", "Fénix"]
  },
  {
    name: "Hobbies",
    icon: "🎯",
    niche: "Hobbies",
    objects: ["Cámara Fotográfica", "Telescopio", "Caña de Pescar", "Paleta de Pintor", "Pieza de Ajedrez", "Bicicleta"]
  },
  {
    name: "Pop Culture",
    icon: "🎬",
    niche: "Pop Culture",
    objects: ["Micrófono", "Claqueta", "Auriculares", "Disco de Vinilo", "Palomitas", "Estrella de Hollywood"]
  },
];

// ============================================================
// STYLE → FONT AESTHETIC MAPPING
// Maps design styles to the font aesthetic descriptors from the master prompt
// ============================================================
export const STYLE_FONT_AESTHETIC: Record<string, string> = {
  "Minimalist": "clean modern sans-serif, minimal geometric",
  "Vintage/Retro": "vintage retro letterpress, aged distressed",
  "Modern Bold": "bold sans-serif, contemporary impact",
  "Elegant": "elegant serif, refined sophisticated",
  "Grunge": "graffiti distressed, rough edgy grunge",
  "Boho": "hand-lettered bohemian, organic free-flowing",
  "Kawaii": "cute rounded bubbly, playful kawaii",
  "Streetwear": "graffiti urban bold, streetwear stencil",
  "Art Deco": "art deco geometric, 1920s glamorous",
  "Synthwave": "futuristic neon retro-digital, 80s synthwave",
  "Watercolor": "hand-lettered watercolor, soft flowing brush",
  "Typography-focused": "bold impactful display, typographic composition",
};

// ============================================================
// STYLE → ILLUSTRATION APPROACH MAPPING
// How each design style affects the illustration technique in the prompt
// ============================================================
export const STYLE_ILLUSTRATION_MAP: Record<string, string> = {
  "Minimalist": "Minimalist vector illustration with clean precise outlines, limited color palette with elegant simplicity, flat design with subtle depth cues, generous white space",
  "Vintage/Retro": "Vintage illustration with retro color palette and aged texture, nostalgic distressed feel, classic mid-century aesthetic with weathered edges, retro halftone dot patterns",
  "Modern Bold": "Bold vector illustration with high-contrast shapes, striking geometric composition, contemporary flat design with vivid saturated colors, sharp clean edges",
  "Elegant": "Refined illustration with sophisticated linework, delicate ornamental details, luxurious metallic accents and gradients, classical composition with modern polish",
  "Grunge": "Grunge illustration with rough distressed textures, splatter and drip effects, torn edges and gritty imperfections, raw urban decay aesthetic with paint splashes",
  "Boho": "Bohemian illustration with organic flowing lines, botanical and mandala elements, earthy warm tones with hand-drawn imperfections, whimsical nature motifs",
  "Kawaii": "Kawaii illustration with ultra-cute rounded shapes, pastel rainbow colors, sparkles and hearts, adorable chibi proportions with happy expressions",
  "Streetwear": "Streetwear illustration with bold stencil-style graphics, spray paint effects and drips, urban graffiti tags and motifs, hip-hop culture references with raw energy",
  "Art Deco": "Art Deco illustration with geometric fan patterns, symmetrical ornamental borders, gold and black luxury palette, 1920s Gatsby-era glamour with opulent details",
  "Synthwave": "Synthwave illustration with neon glow effects, grid landscapes and retro-futuristic elements, chrome reflections and laser beams, 80s cyberpunk sunset aesthetic",
  "Watercolor": "Watercolor illustration with soft blended washes, organic paint bleed edges, delicate transparency and layering, dreamy ethereal atmosphere with fluid color transitions",
  "Typography-focused": "Typography-dominant design with illustrative letterforms, creative text manipulation and custom lettering, decorative typographic ornaments, text as the primary visual element",
};

// ============================================================
// PRODUCT → MASTER PROMPT TEMPLATE ADAPTATION
// Each product has a customized version of the master prompt
// ============================================================

export const PRODUCT_PROMPT_CONFIG: Record<string, {
  productContext: string;
  backgroundSpec: string;
  compositionSpec: string;
  typographySpec: string;
  qualityMarkers: string;
  chromaColor: string;
  aspectRatio: string;
}> = {
  "T-Shirt": {
    productContext: "Vertical flat 2D graphic print design, crisp edges, sticker-style silhouette",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal in Photoshop, no background scenery, no shadows touching the edges, clean silhouette separation. MANDATORY: The design MUST have a solid WHITE BORDER/OUTLINE (#FFFFFF) around all elements to ensure perfect edge separation from the chroma background.",
    compositionSpec: "Centered composition",
    typographySpec: "Bold typography with short impactful text, slogan or phrase in ENGLISH related to the theme, integrated naturally into the composition",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 4500x5400px, 300 DPI, print-ready",
    chromaColor: "chroma green",
    aspectRatio: "3:4",
  },
  "Hoodie": {
    productContext: "Vertical oversized flat 2D graphic print design, statement piece with crisp edges, sticker-style silhouette",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal in Photoshop, no background scenery, no shadows touching the edges, clean silhouette separation. MANDATORY: The design MUST have a solid WHITE BORDER/OUTLINE (#FFFFFF) around all elements to ensure perfect edge separation from the chroma background.",
    compositionSpec: "Large centered composition, impactful at distance",
    typographySpec: "Bold oversized typography with short impactful text, slogan or phrase in ENGLISH related to the theme, integrated naturally into the composition, readable from 2 meters away",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 4500x5400px, 300 DPI, print-ready",
    chromaColor: "chroma green",
    aspectRatio: "3:4",
  },
  "Mug/Taza": {
    productContext: "Horizontal panoramic flat 2D graphic print design, wide format",
    backgroundSpec: "CRITICAL: isolated on a solid flat white background (#FFFFFF). NO 3D rendering, NO photography, NO shadows. This is a FLAT PRINT FILE ONLY. Clean white background, the artwork floats flat on it.",
    compositionSpec: "Horizontal composition, wider than tall (landscape orientation), centered artwork. Keep all critical elements within the center 60% width zone.",
    typographySpec: "Clear bold legible typography with short impactful text in ENGLISH related to the theme, comfortably sized for reading",
    qualityMarkers: "Ultra detailed, 4K, professional flat graphic design, 2700x1520px, 300 DPI, print-ready, NO 3D PRODUCT RENDERING",
    chromaColor: "solid white",
    aspectRatio: "16:9",
  },
  "Poster/Lámina": {
    productContext: "Vertical flat 2D art print design, gallery-quality fine art presentation, decorative statement piece",
    backgroundSpec: "full artistic background with intentional design elements, coherent visual environment supporting the theme, no isolation needed as this is a finished artwork",
    compositionSpec: "Balanced full-frame composition with clear visual hierarchy, impactful from 2+ meters distance",
    typographySpec: "Artistic typography with text, quote or phrase in ENGLISH related to the theme, integrated as a design element within the composition, elegant kerning and layout",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 6000x8000px, 300 DPI, gallery-quality, museum-grade aesthetic",
    chromaColor: "full artistic background",
    aspectRatio: "3:4",
  },
  "Phone Case": {
    productContext: "Vertical slim flat 2D graphic print design, edge-to-edge bleed, optimized for 9:16 aspect ratio format",
    backgroundSpec: "full bleed flat design covering entire canvas, no isolation needed, area kept clear of critical text elements at top left",
    compositionSpec: "Full-bleed vertical composition, key elements in lower two-thirds",
    typographySpec: "Concise bold typography with short text or word in ENGLISH related to the theme, minimal text for small format, ultra-legible",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2400x4000px, 300 DPI, print-ready",
    chromaColor: "full bleed background",
    aspectRatio: "9:16",
  },
  "Tote Bag": {
    productContext: "Vertical flat 2D graphic print design, eco-friendly aesthetic, bold central graphic",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, no background scenery, clean edges. MANDATORY: The design MUST have a solid WHITE BORDER/OUTLINE (#FFFFFF) around all elements to ensure perfect edge separation from the chroma background.",
    compositionSpec: "Centered composition, bold and visible from distance",
    typographySpec: "Bold typography with short impactful text, slogan or phrase in ENGLISH related to the theme, thick strokes for clarity, integrated naturally into the composition",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3600x4200px, 300 DPI, print-ready",
    chromaColor: "chroma magenta",
    aspectRatio: "4:5",
  },
  "Sticker": {
    productContext: "Flat 2D die-cut sticker graphic design, thick bold outlines for clean cutting path, decal aesthetic",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, clean die-cut edge definition, no fuzzy edges, crisp silhouette. MANDATORY: The design MUST have a solid thick WHITE BORDER/OUTLINE (#FFFFFF) around the entire silhouette to act as a die-cut line and buffer against the chroma background.",
    compositionSpec: "Compact centered composition, bold simple shapes, maximum impact at small size",
    typographySpec: "Extra bold condensed typography with short text or word in ENGLISH, 1-3 words maximum, ultra-thick strokes for small-format legibility, high contrast against design",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3000x3000px, 300 DPI, print-ready",
    chromaColor: "chroma green",
    aspectRatio: "1:1",
  },
  "Notebook/Agenda": {
    productContext: "Vertical flat 2D book cover graphic design, premium stationery aesthetic",
    backgroundSpec: "full flat design with intentional background, elegant presentation, no isolation needed",
    compositionSpec: "Centered composition, elegant balanced layout",
    typographySpec: "Elegant typography with title or phrase in ENGLISH related to the theme, sophisticated lettering that conveys quality and craftsmanship, integrated as a key design element",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2400x3200px, 300 DPI, print-ready",
    chromaColor: "full cover background",
    aspectRatio: "2:3",
  },
  "Cap/Gorra": {
    productContext: "Horizontal flat 2D patch graphic design, bold simple shapes",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, no background scenery, clean silhouette. MANDATORY: The design MUST have a solid WHITE BORDER/OUTLINE (#FFFFFF) around all elements to ensure perfect edge separation from the chroma background.",
    compositionSpec: "Compact centered horizontal composition, simplified shapes",
    typographySpec: "Bold block typography with short text in ENGLISH, 1-3 words maximum, thick block letters, no thin serifs or delicate scripts",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2800x1800px, 300 DPI, print-ready",
    chromaColor: "chroma green",
    aspectRatio: "3:2",
  },
  "Cushion/Cojín": {
    productContext: "Square flat 2D graphic print design, soft aesthetic, seamless edge-to-edge layout",
    backgroundSpec: "full flat design with intentional background, inviting presentation, no isolation needed",
    compositionSpec: "Centered square composition, harmonious context",
    typographySpec: "Decorative typography with text or phrase in ENGLISH related to the theme, warm and inviting lettering style",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3600x3600px, 300 DPI, print-ready",
    chromaColor: "full decorative background",
    aspectRatio: "1:1",
  },
  "Blanket/Manta": {
    productContext: "Vertical large-format flat 2D graphic print design, cozy aesthetic, full bleed",
    backgroundSpec: "full coverage flat design with seamless or intentionally bordered layout, warm inviting atmosphere, no isolation needed",
    compositionSpec: "Large all-over centered composition, visually cohesive at scale, soft edges preferred over hard cuts",
    typographySpec: "Large comfortable typography with text or phrase in ENGLISH related to the theme, warm inviting lettering, readable at distance",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 5400x7200px, 300 DPI, print-ready",
    chromaColor: "full coverage background",
    aspectRatio: "4:5",
  },
  "Pin/Badge": {
    productContext: "Compact circular flat 2D graphic design, hard enamel style, metal border outline",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, clean border definition, no fuzzy edges, bold solid color fills. MANDATORY: The design MUST have a solid WHITE BORDER/OUTLINE (#FFFFFF) around all elements to ensure perfect edge separation from the chroma background.",
    compositionSpec: "Compact centered circular composition, extremely simplified, maximum 2-3 colors",
    typographySpec: "Ultra bold condensed typography with 1-2 words maximum in ENGLISH, block letters with thick strokes, no scripts or serifs",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 1000x1000px, 300 DPI, print-ready",
    chromaColor: "chroma green",
    aspectRatio: "1:1",
  },
  "Card/Invitación": {
    productContext: "Vertical flat 2D premium card graphic design, fine stationery aesthetic",
    backgroundSpec: "full flat design with sophisticated background, decorative borders and ornamental framing encouraged, no isolation needed",
    compositionSpec: "Elegant portrait composition with decorative framing, formal balanced layout with hierarchical text placement",
    typographySpec: "Elegant refined typography with formal text in ENGLISH, calligraphic script for names paired with classic serif for details, sophisticated kerning and leading, luxury stationery lettering quality",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2400x3600px, 300 DPI, print-ready",
    chromaColor: "full elegant background",
    aspectRatio: "3:4",
  },
  "Mousepad": {
    productContext: "Horizontal wide flat 2D graphic print design, full surface desk aesthetic",
    backgroundSpec: "full bleed flat design covering entire canvas, no isolation needed",
    compositionSpec: "Full-surface horizontal composition with central focal point, avoid critical details at extreme edges",
    typographySpec: "Moderate typography with text in ENGLISH related to the theme, balanced against illustrative elements",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3600x2700px, 300 DPI, print-ready",
    chromaColor: "full bleed background",
    aspectRatio: "4:3",
  },
  "Cover Ebook": {
    productContext: "Vertical flat 2D digital book cover graphic design, visually stunning and captivating at thumbnail size",
    backgroundSpec: "full flat design with immersive atmospheric background, cinematic depth of field, dramatic lighting and mood that captures the book's essence, no isolation needed",
    compositionSpec: "Portrait composition with clear visual hierarchy optimized for thumbnail visibility, title positioned in the upper third for maximum impact, author name in the lower third, focal point imagery in the center drawing the eye, strong contrast between text and background for legibility at small sizes",
    typographySpec: "Bestselling book cover typography with bold captivating title in ENGLISH as the primary visual anchor, rendered in a style that conveys the genre and tone of the book, author name in clean complementary font at the bottom, tagline or subtitle in smaller supporting text, all text perfectly legible at thumbnail size (120px wide)",
    qualityMarkers: "Ultra detailed, 4K, professional flat design, trending on Behance and BookCoverArchive, 2500x4000px, 300 DPI, print-ready",
    chromaColor: "full cinematic background",
    aspectRatio: "2:3",
  },
};

// ============================================================
// NICHE → THEME DESCRIPTORS
// Rich thematic descriptions for each niche to enrich prompts
// ============================================================
export const NICHE_THEME_MAP: Record<string, string> = {
  "Motivacional": "motivational empowerment and personal growth, inspiring strength and determination, positive mindset and achievement",
  "Profesiones": "professional pride and dedication, career identity and expertise, workplace culture and vocation",
  "Hobbies": "passionate hobbyist culture and enthusiast lifestyle, dedicated community and creative expression",
  "Religión": "spiritual faith and devotion, sacred symbolism and divine connection, religious reverence and worship",
  "Pop Culture": "trending pop culture references and viral moments, entertainment fandom and cultural icons, meme-worthy aesthetic",
  "Fechas Especiales": "seasonal celebration and festive spirit, holiday tradition and joyful gathering, commemorative occasion",
  "Amor/Romance": "romantic love and deep affection, heartfelt connection and tender devotion, passionate emotion and relationship",
  "Naturaleza": "natural world and organic beauty, wilderness and landscape grandeur, environmental harmony and botanical wonder",
  "Ciencia/Tech": "technology innovation and scientific discovery, digital frontier and futuristic advancement, cybernetic progress and space exploration",
  "Deportes": "athletic performance and competitive spirit, sports fandom and team loyalty, physical strength and sporting achievement",
  "Comida/Bebida": "culinary passion and gastronomic culture, foodie lifestyle and beverage appreciation, flavor and recipe celebration",
  "Viajes": "wanderlust and travel adventure, world exploration and cultural discovery, journey and destination aspiration",
  "Arte/Cultura": "artistic expression and cultural heritage, creative mastery and aesthetic beauty, visual storytelling and artistic tradition",
  "Eco/Sostenibilidad": "environmental consciousness and sustainability, green living and ecological awareness, nature conservation and planet care",
  "Moda/Estilo": "fashion-forward style and trend-setting aesthetic, personal expression through design, haute couture and street style",
  "Gaming": "gaming culture and virtual worlds, esports competition and player identity, retro and modern video game aesthetics",
  "Música": "musical rhythm and sound expression, band culture and concert energy, genre identity and musical passion",
  "Infantil": "playful childish wonder and imagination, cute adorable characters and bright colors, educational fun and kids entertainment",
  "Humor/Memes": "witty humor and internet meme culture, sarcastic irreverence and comedic irony, viral joke and playful absurdity",
  "Literatura": "literary passion and bookish culture, poetic expression and storytelling tradition, reading devotion and intellectual depth",
};

// ============================================================
// FONT MAP (SAME AS BEFORE - COMPLETE)
// ============================================================
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
    "Hobbies": { principal: "Josefin Sans", secundaria: "Raleway", acento: "Mr De Haviland" },
    "Religión": { principal: "Cinzel", secundaria: "Raleway", acento: "Allura" },
    "Pop Culture": { principal: "Lobster", secundaria: "Quicksand Bold", acento: "Pacifico" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Dancing Script" },
    "Naturaleza": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Source Code Pro", secundaria: "Fira Code", acento: "Press Start 2P" },
    "Deportes": { principal: "Oswald", secundaria: "Roboto Condensed", acento: "Russo One" },
    "Comida/Bebida": { principal: "Pacifico", secundaria: "Lora", acento: "Kaushan Script" },
    "Viajes": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Arte/Cultura": { principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond" },
    "Eco/Sostenibilidad": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Moda/Estilo": { principal: "Playfair Display Bold", secundaria: "Lato", acento: "Great Vibes" },
    "Gaming": { principal: "Press Start 2P", secundaria: "VT323", acento: "Silkscreen" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Gochi Hand" },
    "Humor/Memes": { principal: "Impact", secundaria: "Comic Neue Bold", acento: "Permanent Marker" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Caveat" },
  },
  "Poster/Lámina": {
    "Motivacional": { principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Great Vibes" },
    "Profesiones": { principal: "Montserrat Bold", secundaria: "Source Sans Pro", acento: "Dancing Script" },
    "Hobbies": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Religión": { principal: "Cinzel Decorative", secundaria: "Cormorant Garamond", acento: "Great Vibes" },
    "Pop Culture": { principal: "Bungee Shade", secundaria: "Syncopate", acento: "Monoton" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Sacramento" },
    "Naturaleza": { principal: "Montserrat Thin", secundaria: "Playfair Display", acento: "Cormorant Garamond" },
    "Ciencia/Tech": { principal: "Space Grotesk", secundaria: "Inter", acento: "Syne" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Russo One" },
    "Comida/Bebida": { principal: "Playfair Display", secundaria: "Lora", acento: "Lobster" },
    "Viajes": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Arte/Cultura": { principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond" },
    "Eco/Sostenibilidad": { principal: "Cormorant Garamond", secundaria: "Raleway Light", acento: "Allura" },
    "Moda/Estilo": { principal: "Didot", secundaria: "Futura", acento: "Sacramento" },
    "Gaming": { principal: "Audiowide", secundaria: "Orbitron", acento: "Press Start 2P" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Quicksand Bold", acento: "Indie Flower" },
    "Humor/Memes": { principal: "Bangers", secundaria: "Impact", acento: "Comic Neue Bold" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Allura" },
  },
  "Phone Case": {
    "Motivacional": { principal: "Montserrat Bold", secundaria: "Raleway", acento: "Sacramento" },
    "Profesiones": { principal: "Inter", secundaria: "Space Grotesk", acento: "JetBrains Mono" },
    "Hobbies": { principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide" },
    "Religión": { principal: "Cinzel", secundaria: "Raleway", acento: "Allura" },
    "Pop Culture": { principal: "Bangers", secundaria: "Anton", acento: "Gugi" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Nunito", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Playfair Display", acento: "Sacramento" },
    "Naturaleza": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Orbitron", secundaria: "Source Code Pro", acento: "Audiowide" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Anton" },
    "Comida/Bebida": { principal: "Pacifico", secundaria: "Quicksand", acento: "Lobster" },
    "Viajes": { principal: "Rye", secundaria: "Montserrat Light", acento: "Satisfy" },
    "Arte/Cultura": { principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond" },
    "Eco/Sostenibilidad": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Moda/Estilo": { principal: "Futura Bold", secundaria: "Avenir Next", acento: "Didot" },
    "Gaming": { principal: "Press Start 2P", secundaria: "VT323", acento: "Silkscreen" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Indie Flower" },
    "Humor/Memes": { principal: "Bebas Neue", secundaria: "Impact", acento: "Permanent Marker" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Caveat" },
  },
  "Tote Bag": {
    "Motivacional": { principal: "Montserrat Bold", secundaria: "Open Sans", acento: "Dancing Script" },
    "Profesiones": { principal: "Bebas Neue", secundaria: "Montserrat", acento: "Caveat" },
    "Hobbies": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Great Vibes" },
    "Religión": { principal: "Cinzel", secundaria: "Raleway", acento: "Allura" },
    "Pop Culture": { principal: "Lobster", secundaria: "Quicksand Bold", acento: "Pacifico" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Sacramento" },
    "Naturaleza": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Space Grotesk", secundaria: "Inter", acento: "JetBrains Mono" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Russo One" },
    "Comida/Bebida": { principal: "Playfair Display", secundaria: "Lora", acento: "Pacifico" },
    "Viajes": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Arte/Cultura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Great Vibes" },
    "Eco/Sostenibilidad": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Moda/Estilo": { principal: "Didot", secundaria: "Futura", acento: "Sacramento" },
    "Gaming": { principal: "Bangers", secundaria: "Orbitron", acento: "Gochi Hand" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Gochi Hand" },
    "Humor/Memes": { principal: "Bebas Neue", secundaria: "Impact", acento: "Comic Neue Bold" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Great Vibes" },
  },
  "Hoodie": {
    "Motivacional": { principal: "Bebas Neue", secundaria: "Montserrat Light", acento: "Sacramento" },
    "Profesiones": { principal: "Anton", secundaria: "Oswald", acento: "Caveat" },
    "Hobbies": { principal: "Bangers", secundaria: "Rock Salt", acento: "Gochi Hand" },
    "Religión": { principal: "Cinzel Decorative", secundaria: "Cormorant Garamond", acento: "Great Vibes" },
    "Pop Culture": { principal: "Bungee", secundaria: "Anton", acento: "Lobster" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Lora", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Playfair Display", acento: "Sacramento" },
    "Naturaleza": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Rock Salt" },
    "Ciencia/Tech": { principal: "Orbitron", secundaria: "Share Tech Mono", acento: "Audiowide" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Anton", acento: "Permanent Marker" },
    "Comida/Bebida": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Viajes": { principal: "Rye", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Arte/Cultura": { principal: "UnifrakturMaguntia", secundaria: "Cinzel", acento: "Nosifer" },
    "Eco/Sostenibilidad": { principal: "Montserrat Bold", secundaria: "Nunito", acento: "Indie Flower" },
    "Moda/Estilo": { principal: "Bebas Neue", secundaria: "Anton", acento: "Brush Script MT" },
    "Gaming": { principal: "Bangers", secundaria: "Rock Salt", acento: "Gochi Hand" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Gochi Hand" },
    "Humor/Memes": { principal: "Impact", secundaria: "Bebas Neue", acento: "Permanent Marker" },
    "Literatura": { principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Sacramento" },
  },
  "Sticker": {
    "Motivacional": { principal: "Bebas Neue", secundaria: "Montserrat Bold", acento: "Satisfy" },
    "Profesiones": { principal: "Anton", secundaria: "Impact", acento: "Caveat" },
    "Hobbies": { principal: "Bangers", secundaria: "Fredoka One", acento: "Gochi Hand" },
    "Religión": { principal: "Bebas Neue", secundaria: "Montserrat", acento: "Great Vibes" },
    "Pop Culture": { principal: "Bangers", secundaria: "Anton", acento: "Gugi" },
    "Fechas Especiales": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Indie Flower" },
    "Amor/Romance": { principal: "Lobster", secundaria: "Pacifico", acento: "Satisfy" },
    "Naturaleza": { principal: "Bebas Neue", secundaria: "Montserrat Bold", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Orbitron", secundaria: "Audiowide", acento: "Press Start 2P" },
    "Deportes": { principal: "Impact", secundaria: "Anton", acento: "Russo One" },
    "Comida/Bebida": { principal: "Lobster", secundaria: "Pacifico", acento: "Fredoka One" },
    "Viajes": { principal: "Bebas Neue", secundaria: "Montserrat Bold", acento: "Rock Salt" },
    "Arte/Cultura": { principal: "Bangers", secundaria: "Didot", acento: "Cormorant Garamond" },
    "Eco/Sostenibilidad": { principal: "Montserrat Bold", secundaria: "Nunito", acento: "Indie Flower" },
    "Moda/Estilo": { principal: "Bebas Neue", secundaria: "Anton", acento: "Impact" },
    "Gaming": { principal: "Press Start 2P", secundaria: "VT323", acento: "Silkscreen" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Indie Flower" },
    "Humor/Memes": { principal: "Bangers", secundaria: "Fredoka One", acento: "Gochi Hand" },
    "Literatura": { principal: "Montserrat Bold", secundaria: "Playfair Display", acento: "Caveat" },
  },
  "Notebook/Agenda": {
    "Motivacional": { principal: "Montserrat", secundaria: "Lora", acento: "Playfair Display" },
    "Profesiones": { principal: "Montserrat", secundaria: "Lora", acento: "Playfair Display" },
    "Hobbies": { principal: "Quicksand Bold", secundaria: "Nunito", acento: "Caveat" },
    "Religión": { principal: "Cinzel", secundaria: "EB Garamond", acento: "Sacramento" },
    "Pop Culture": { principal: "Lobster", secundaria: "Quicksand Bold", acento: "Pacifico" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Sacramento" },
    "Naturaleza": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Raleway", secundaria: "Source Sans Pro", acento: "Dancing Script" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Russo One" },
    "Comida/Bebida": { principal: "Playfair Display", secundaria: "Lora", acento: "Pacifico" },
    "Viajes": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Arte/Cultura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Allura" },
    "Eco/Sostenibilidad": { principal: "Nunito", secundaria: "Raleway Light", acento: "Caveat" },
    "Moda/Estilo": { principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Sacramento" },
    "Gaming": { principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Baloo 2", acento: "Gochi Hand" },
    "Humor/Memes": { principal: "Lobster", secundaria: "Comic Neue Bold", acento: "Permanent Marker" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Caveat" },
  },
  "Cap/Gorra": {
    "Motivacional": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Russo One" },
    "Profesiones": { principal: "College Block", secundaria: "Futura Bold", acento: "Russo One" },
    "Hobbies": { principal: "Bungee", secundaria: "Oswald", acento: "Gochi Hand" },
    "Religión": { principal: "Bebas Neue", secundaria: "Montserrat", acento: "Satisfy" },
    "Pop Culture": { principal: "Bebas Neue", secundaria: "Anton", acento: "Impact" },
    "Fechas Especiales": { principal: "Russo One", secundaria: "Oswald", acento: "Bungee" },
    "Amor/Romance": { principal: "Bebas Neue", secundaria: "Playfair Display", acento: "Great Vibes" },
    "Naturaleza": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Rock Salt" },
    "Ciencia/Tech": { principal: "Orbitron", secundaria: "Audiowide", acento: "Share Tech Mono" },
    "Deportes": { principal: "College Block", secundaria: "Futura Bold", acento: "Russo One" },
    "Comida/Bebida": { principal: "Bebas Neue", secundaria: "Rockwell", acento: "Rock Salt" },
    "Viajes": { principal: "Bungee", secundaria: "Oswald", acento: "Rock Salt" },
    "Arte/Cultura": { principal: "Russo One", secundaria: "Bebas Neue", acento: "Cinzel" },
    "Eco/Sostenibilidad": { principal: "Montserrat Bold", secundaria: "Oswald", acento: "Caveat" },
    "Moda/Estilo": { principal: "Bebas Neue", secundaria: "Anton", acento: "Impact" },
    "Gaming": { principal: "Bangers", secundaria: "Orbitron", acento: "Press Start 2P" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Gochi Hand" },
    "Humor/Memes": { principal: "Impact", secundaria: "Bebas Neue", acento: "Permanent Marker" },
    "Literatura": { principal: "Bebas Neue", secundaria: "Playfair Display", acento: "Caveat" },
  },
  "Cushion/Cojín": {
    "Motivacional": { principal: "Playfair Display", secundaria: "Lora", acento: "Great Vibes" },
    "Profesiones": { principal: "Montserrat", secundaria: "Lora", acento: "Playfair Display" },
    "Hobbies": { principal: "Cormorant Garamond", secundaria: "Raleway", acento: "Caveat" },
    "Religión": { principal: "Cinzel Decorative", secundaria: "EB Garamond", acento: "Great Vibes" },
    "Pop Culture": { principal: "Lobster", secundaria: "Quicksand Bold", acento: "Pacifico" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Sacramento" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Allura" },
    "Naturaleza": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Montserrat Bold", secundaria: "Lato", acento: "Dancing Script" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Russo One" },
    "Comida/Bebida": { principal: "Playfair Display", secundaria: "Lora", acento: "Satisfy" },
    "Viajes": { principal: "Cormorant Garamond", secundaria: "Raleway Light", acento: "Allura" },
    "Arte/Cultura": { principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond" },
    "Eco/Sostenibilidad": { principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat" },
    "Moda/Estilo": { principal: "Montserrat Thin", secundaria: "Futura Light", acento: "Didot" },
    "Gaming": { principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide" },
    "Música": { principal: "Playfair Display", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito", acento: "Indie Flower" },
    "Humor/Memes": { principal: "Lobster", secundaria: "Montserrat Bold", acento: "Rock Salt" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Allura" },
  },
  "Blanket/Manta": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Dancing Script" } as any,
  "Pin/Badge": { principal: "Futura Bold", secundaria: "Montserrat Black", acento: "Bebas Neue" } as any,
  "Card/Invitación": { principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Allura" } as any,
  "Mousepad": { principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide" } as any,
  "Cover Ebook": {
    "Motivacional": { principal: "Bebas Neue", secundaria: "Montserrat Light", acento: "Great Vibes" },
    "Profesiones": { principal: "Cinzel", secundaria: "Cormorant Garamond", acento: "Satisfy" },
    "Hobbies": { principal: "Playfair Display Bold", secundaria: "Lora", acento: "Great Vibes" },
    "Religión": { principal: "Cinzel Decorative", secundaria: "Cormorant Garamond", acento: "Great Vibes" },
    "Pop Culture": { principal: "Bangers", secundaria: "Anton", acento: "Gugi" },
    "Fechas Especiales": { principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Great Vibes" },
    "Amor/Romance": { principal: "Great Vibes", secundaria: "Playfair Display", acento: "Sacramento" },
    "Naturaleza": { principal: "Playfair Display Bold", secundaria: "Cormorant Garamond", acento: "Caveat" },
    "Ciencia/Tech": { principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide" },
    "Deportes": { principal: "Bebas Neue", secundaria: "Oswald", acento: "Anton" },
    "Comida/Bebida": { principal: "Playfair Display Bold", secundaria: "Lora", acento: "Lobster" },
    "Viajes": { principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy" },
    "Arte/Cultura": { principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond" },
    "Eco/Sostenibilidad": { principal: "Playfair Display Bold", secundaria: "Lora Italic", acento: "Caveat" },
    "Moda/Estilo": { principal: "Didot", secundaria: "Futura", acento: "Sacramento" },
    "Gaming": { principal: "Press Start 2P", secundaria: "Orbitron", acento: "Bungee Shade" },
    "Música": { principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt" },
    "Infantil": { principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Gochi Hand" },
    "Humor/Memes": { principal: "Bangers", secundaria: "Impact", acento: "Comic Neue Bold" },
    "Literatura": { principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Allura" },
  },
};

// Fill in remaining products with all niches using the T-Shirt fallback
["Blanket/Manta", "Pin/Badge", "Card/Invitación", "Mousepad"].forEach(product => {
  const singleEntry = PRODUCT_FONT_MAP[product] as any;
  if (singleEntry && typeof singleEntry.principal === 'string') {
    const base = { principal: singleEntry.principal, secundaria: singleEntry.secundaria, acento: singleEntry.acento };
    const fullMap: Record<string, { principal: string; secundaria: string; acento: string }> = {};
    NICHES.forEach(niche => {
      fullMap[niche] = PRODUCT_FONT_MAP["T-Shirt"][niche] || base;
    });
    // Override with product-specific defaults where they make sense
    PRODUCT_FONT_MAP[product] = fullMap;
  }
});

export const DEFAULT_FONTS = { principal: "Montserrat Bold", secundaria: "Lato Light", acento: "Great Vibes" };

export function getFontsForProductNiche(product: string, niche: string) {
  const productMap = PRODUCT_FONT_MAP[product];
  if (productMap && productMap[niche]) {
    return productMap[niche];
  }
  const tshirtMap = PRODUCT_FONT_MAP["T-Shirt"];
  if (tshirtMap && tshirtMap[niche]) {
    return tshirtMap[niche];
  }
  return DEFAULT_FONTS;
}

// ============================================================
// CHROMA COLOR INTELLIGENT SELECTION
// Picks the best chroma key color based on the design's dominant palette
// ============================================================
export function selectChromaColor(paletteColors: string[]): string {
  // Check if palette is predominantly dark
  const darkColors = paletteColors.filter(c => {
    const hex = c.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r + g + b) / 3 < 128;
  });
  
  if (darkColors.length > paletteColors.length / 2) {
    return "chroma magenta"; // Better contrast against dark designs
  }
  return "chroma green"; // Default, better contrast against light designs
}

// ============================================================
// ENHANCED MASTER PROMPT GENERATOR
// Based on the Premium Master Prompt template adapted per product
// ============================================================
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
  selectedObjects?: string[];
  garmentTone?: 'dark' | 'light' | 'any';
}): string {
  const config = PRODUCT_PROMPT_CONFIG[data.product] || PRODUCT_PROMPT_CONFIG["T-Shirt"];
  const fontAesthetic = STYLE_FONT_AESTHETIC[data.style] || STYLE_FONT_AESTHETIC["Modern Bold"];
  const illustrationApproach = STYLE_ILLUSTRATION_MAP[data.style] || STYLE_ILLUSTRATION_MAP["Modern Bold"];
  const nicheTheme = NICHE_THEME_MAP[data.niche] || data.niche;
  
  // Select chroma color based on palette
  const chromaColor = config.chromaColor.includes("{chromaColor}") 
    ? selectChromaColor(data.colorPalette)
    : config.chromaColor;
  
  const backgroundSpec = config.backgroundSpec.replace("{chromaColor}", chromaColor);
  const colorStr = data.colorPalette.join(", ");

  // Build the typography section
  let typographySection = config.typographySpec;
  typographySection += ` with clean kerning and high contrast against the design. The lettering style must be a ${fontAesthetic}. All text must be perfectly legible and correctly spelled.`;

  // Build the text content section
  let textContent = `Primary text written out: "${data.primaryText}"`;
  if (data.secondaryText) {
    textContent += `. Secondary text written out: "${data.secondaryText}"`;
  }
  if (data.accentText) {
    textContent += `. Accent detail written out: "${data.accentText}"`;
  }
  textContent += `. No template text. MANDATORY RULE: Each text string must appear exactly once in the design. Do not repeat words.`;

  // Build the color palette section
  const colorSection = `Rich and vibrant colors using ${data.paletteName} (${colorStr}) with smooth gradients, depth and dimension. DO NOT include any color palette legend, text boxes with color names, or swatches.`;

  // Build the objects section
  let objectsSection = "";
  if (data.selectedObjects && data.selectedObjects.length > 0) {
    const objectsList = data.selectedObjects.join(", ");
    objectsSection = `Featuring detailed illustrations of: ${objectsList}. Each object rendered with precision, realistic proportions, and integrated harmoniously into the composition. `;
  }

  // Build the contrast section based on garmentTone
  let contrastSection = "";
  if (data.garmentTone === 'dark') {
    contrastSection = "MANDATORY: Use LIGHT, BRIGHT colors for typography and main elements. The design will be printed on a BLACK/DARK garment, so high contrast is essential. Avoid dark texts.";
  } else if (data.garmentTone === 'light') {
    contrastSection = "MANDATORY: Use DARK colors for typography and main elements. The design will be printed on a WHITE/LIGHT garment, so high contrast is essential. Avoid white texts.";
  }

  // SURGICAL CORRECTION: Structural separation of negative constraints
  const negativePrompts = [
    "mockup", "3D render", "physical product", "clothing", "garment", 
    "person", "background scenery", "color palette legend", "color names",
    "color swatches", "text boxes", "repeated text", "duplicate words", "watermark"
  ];
  const negativeString = negativePrompts.join(", ");

  // Assemble the positive master prompt
  const promptParts = [
    `CRITICAL INSTRUCTION: Generate ONLY the flat 2D artwork itself.`,
    `Vector illustration with hyperrealistic detail, ${data.niche} theme featuring ${nicheTheme}.`,
    objectsSection,
    illustrationApproach,
    `Bold clean vector outlines combined with photorealistic rendering, sharp shading, intricate textures, dramatic lighting with strong contrast.`,
    colorSection,
    contrastSection,
    typographySection,
    textContent,
    `${config.compositionSpec}, ${config.productContext}. REQUIRED ASPECT RATIO: ${config.aspectRatio}.`,
    backgroundSpec,
    config.qualityMarkers,
  ];

  const prompt = promptParts.filter(Boolean).join(" ");

  // Append engine-specific syntax for negative prompts and aspect ratio
  const toolName = (data.aiTool || '').toLowerCase();
  if (toolName.includes('midjourney')) {
    return `${prompt} --no ${negativeString} --ar ${config.aspectRatio}`;
  } else if (toolName.includes('stable diffusion') || toolName.includes('nano banana')) {
    return `${prompt} NEGATIVE PROMPT: ${negativeString}`;
  } else {
    // Fallback for DALL-E, ChatGPT Images, Ideogram, Flux
    return `${prompt}. EXPLICIT NEGATIVE PROMPT (DO NOT INCLUDE): ${negativeString}.`;
  }
}

// ============================================================
// Calendar events data for seeding
// ============================================================
export const CALENDAR_EVENTS_SEED = [
  { name: "Año Nuevo", date: "2026-01-01", type: "holiday", niche: "Fechas Especiales", description: "Celebración del nuevo año", country: "global" },
  { name: "Día de Reyes", date: "2026-01-06", type: "holiday", niche: "Fechas Especiales", description: "Epifanía - Día de los Reyes Magos", country: "latam" },
  { name: "Martin Luther King Jr. Day", date: "2026-01-19", type: "holiday", niche: "Fechas Especiales", description: "Día de Martin Luther King Jr.", country: "usa" },
  { name: "Groundhog Day", date: "2026-02-02", type: "seasonal", niche: "Humor/Memes", description: "Día de la marmota", country: "usa" },
  { name: "San Valentín", date: "2026-02-14", type: "holiday", niche: "Amor/Romance", description: "Día del amor y la amistad", country: "global" },
  { name: "Presidents Day", date: "2026-02-16", type: "holiday", niche: "Fechas Especiales", description: "Día de los Presidentes", country: "usa" },
  { name: "Carnival", date: "2026-02-17", type: "seasonal", niche: "Pop Culture", description: "Carnaval - Celebración antes de Cuaresma", country: "latam" },
  { name: "Día Internacional de la Mujer", date: "2026-03-08", type: "awareness", niche: "Profesiones", description: "Celebración de los derechos de la mujer", country: "global" },
  { name: "St. Patrick's Day", date: "2026-03-17", type: "holiday", niche: "Pop Culture", description: "Día de San Patricio", country: "global" },
  { name: "Primavera (Equinoccio)", date: "2026-03-20", type: "seasonal", niche: "Naturaleza", description: "Inicio de la primavera", country: "global" },
  { name: "April Fools", date: "2026-04-01", type: "seasonal", niche: "Humor/Memes", description: "Día de los inocentes", country: "usa" },
  { name: "Día Mundial del Autismo", date: "2026-04-02", type: "awareness", niche: "Fechas Especiales", description: "Concienciación sobre el autismo", country: "global" },
  { name: "Viernes Santo", date: "2026-04-03", type: "holiday", niche: "Religión", description: "Viernes Santo", country: "latam" },
  { name: "Pascua/Easter", date: "2026-04-05", type: "holiday", niche: "Religión", description: "Domingo de Pascua", country: "global" },
  { name: "Día de la Tierra", date: "2026-04-22", type: "awareness", niche: "Eco/Sostenibilidad", description: "Día mundial de la Tierra", country: "global" },
  { name: "Día del Libro", date: "2026-04-23", type: "awareness", niche: "Literatura", description: "Día mundial del libro", country: "global" },
  { name: "Día del Trabajador", date: "2026-05-01", type: "holiday", niche: "Profesiones", description: "Día internacional del trabajador", country: "global" },
  { name: "Cinco de Mayo", date: "2026-05-05", type: "holiday", niche: "Pop Culture", description: "Batalla de Puebla", country: "mexico" },
  { name: "Día de las Madres (México/Latam)", date: "2026-05-10", type: "holiday", niche: "Amor/Romance", description: "Día de las madres", country: "latam" },
  { name: "Mother's Day (USA)", date: "2026-05-10", type: "holiday", niche: "Amor/Romance", description: "Día de la madre", country: "usa" },
  { name: "Día Mundial del Medio Ambiente", date: "2026-06-05", type: "awareness", niche: "Eco/Sostenibilidad", description: "Día mundial del medio ambiente", country: "global" },
  { name: "Pride Month", date: "2026-06-15", type: "awareness", niche: "Pop Culture", description: "Mes del Orgullo LGBTQ+", country: "global" },
  { name: "Verano (Solsticio)", date: "2026-06-20", type: "seasonal", niche: "Naturaleza", description: "Inicio del verano", country: "global" },
  { name: "Día del Padre", date: "2026-06-21", type: "holiday", niche: "Amor/Romance", description: "Día del padre", country: "global" },
  { name: "Independence Day (USA)", date: "2026-07-04", type: "holiday", niche: "Fechas Especiales", description: "Día de la independencia de USA", country: "usa" },
  { name: "Día de la Independencia (Colombia)", date: "2026-07-20", type: "holiday", niche: "Fechas Especiales", description: "Independencia de Colombia", country: "colombia" },
  { name: "Back to School Start", date: "2026-07-15", type: "commercial", niche: "Infantil", description: "Inicio temporada Back to School", country: "global" },
  { name: "Back to School Peak", date: "2026-08-01", type: "commercial", niche: "Infantil", description: "Pico temporada Back to School", country: "global" },
  { name: "Día de la Independencia (Brasil)", date: "2026-09-07", type: "holiday", niche: "Fechas Especiales", description: "Independencia de Brasil", country: "brazil" },
  { name: "Día de la Independencia (México)", date: "2026-09-16", type: "holiday", niche: "Fechas Especiales", description: "Independencia de México", country: "mexico" },
  { name: "Otoño (Equinoccio)", date: "2026-09-22", type: "seasonal", niche: "Naturaleza", description: "Inicio del otoño", country: "global" },
  { name: "Breast Cancer Awareness Month", date: "2026-10-05", type: "awareness", niche: "Fechas Especiales", description: "Mes del cáncer de mama", country: "global" },
  { name: "Halloween", date: "2026-10-31", type: "holiday", niche: "Pop Culture", description: "Noche de Halloween", country: "global" },
  { name: "Día de los Muertos", date: "2026-11-02", type: "holiday", niche: "Arte/Cultura", description: "Día de los muertos", country: "mexico" },
  { name: "Thanksgiving (USA)", date: "2026-11-27", type: "holiday", niche: "Fechas Especiales", description: "Día de acción de gracias", country: "usa" },
  { name: "Black Friday", date: "2026-11-28", type: "commercial", niche: "Moda/Estilo", description: "Black Friday", country: "global" },
  { name: "Cyber Monday", date: "2026-11-30", type: "commercial", niche: "Moda/Estilo", description: "Cyber Monday", country: "global" },
  { name: "Inicio Navidad", date: "2026-12-01", type: "seasonal", niche: "Fechas Especiales", description: "Inicio temporada navideña", country: "global" },
  { name: "Día de la Virgen de Guadalupe", date: "2026-12-12", type: "holiday", niche: "Religión", description: "Virgen de Guadalupe", country: "mexico" },
  { name: "Navidad", date: "2026-12-25", type: "holiday", niche: "Fechas Especiales", description: "Día de Navidad", country: "global" },
  { name: "Nochevieja", date: "2026-12-31", type: "holiday", niche: "Fechas Especiales", description: "Víspera de Año Nuevo", country: "global" },
  { name: "Super Bowl", date: "2026-02-08", type: "commercial", niche: "Deportes", description: "Super Bowl", country: "usa" },
  { name: "Día Mundial de la Salud Mental", date: "2026-10-10", type: "awareness", niche: "Fechas Especiales", description: "Salud mental", country: "global" },
  { name: "Veterans Day", date: "2026-11-11", type: "holiday", niche: "Fechas Especiales", description: "Día de los veteranos", country: "usa" },
  { name: "Dia del Café", date: "2026-10-01", type: "awareness", niche: "Comida/Bebida", description: "Día internacional del café", country: "global" },
  { name: "Día del Turismo", date: "2026-09-27", type: "awareness", niche: "Viajes", description: "Día mundial del turismo", country: "global" },
  { name: "Día del Animal", date: "2026-10-04", type: "awareness", niche: "Naturaleza", description: "Día mundial del animal", country: "global" },
  { name: "Día del Niño", date: "2026-08-16", type: "holiday", niche: "Infantil", description: "Día del niño", country: "latam" },
  { name: "Día del Maestro", date: "2026-09-11", type: "awareness", niche: "Profesiones", description: "Día del maestro", country: "latam" },
  { name: "World Game Day", date: "2026-05-18", type: "awareness", niche: "Gaming", description: "Día mundial de los juegos", country: "global" },
  { name: "Día del Gamer", date: "2026-08-29", type: "awareness", niche: "Gaming", description: "Día del gamer", country: "latam" },
  { name: "Día de la Poesía", date: "2026-03-21", type: "awareness", niche: "Literatura", description: "Día mundial de la poesía", country: "global" },
  { name: "Día del Yoga", date: "2026-06-21", type: "awareness", niche: "Deportes", description: "Día internacional del yoga", country: "global" },
  { name: "FIFA World Cup Season", date: "2026-06-11", type: "seasonal", niche: "Deportes", description: "Copa Mundial FIFA", country: "global" },
  { name: "Hanukkah Start", date: "2026-12-14", type: "holiday", niche: "Religión", description: "Inicio de Jánuca", country: "global" },
  { name: "Kwanzaa Start", date: "2026-12-26", type: "holiday", niche: "Arte/Cultura", description: "Inicio de Kwanzaa", country: "usa" },
  { name: "Valentine's Season Start", date: "2026-02-01", type: "commercial", niche: "Amor/Romance", description: "Inicio temporada San Valentín", country: "global" },
  { name: "Halloween Season Start", date: "2026-10-15", type: "seasonal", niche: "Pop Culture", description: "Inicio temporada Halloween", country: "global" },
  { name: "Christmas Shopping Season", date: "2026-12-15", type: "commercial", niche: "Moda/Estilo", description: "Pico compras navideñas", country: "global" },
  { name: "Summer Sale Season", date: "2026-07-01", type: "commercial", niche: "Moda/Estilo", description: "Rebajas de verano", country: "global" },
  { name: "Dia de la Constitución (México)", date: "2026-02-05", type: "holiday", niche: "Fechas Especiales", description: "Constitución mexicana", country: "mexico" },
  { name: "Dia de la Bandera (México)", date: "2026-02-24", type: "holiday", niche: "Fechas Especiales", description: "Bandera mexicana", country: "mexico" },
  { name: "Día de la Raza", date: "2026-10-12", type: "holiday", niche: "Fechas Especiales", description: "Día de la raza", country: "latam" },
  { name: "Memorial Day", date: "2026-05-25", type: "holiday", niche: "Fechas Especiales", description: "Memorial Day", country: "usa" },
  { name: "Labor Day (USA)", date: "2026-09-07", type: "holiday", niche: "Profesiones", description: "Labor Day", country: "usa" },
  { name: "Día de los Océanos", date: "2026-06-08", type: "awareness", niche: "Eco/Sostenibilidad", description: "Día de los océanos", country: "global" },
  { name: "Día de la Bicicleta", date: "2026-06-03", type: "awareness", niche: "Deportes", description: "Día de la bicicleta", country: "global" },
  { name: "Día del Chocolate", date: "2026-09-13", type: "awareness", niche: "Comida/Bebida", description: "Día del chocolate", country: "global" },
  { name: "Día del Arte", date: "2026-04-15", type: "awareness", niche: "Arte/Cultura", description: "Día mundial del arte", country: "global" },
  { name: "Día de la Moda", date: "2026-07-06", type: "seasonal", niche: "Moda/Estilo", description: "Día de la moda", country: "global" },
  { name: "Día de la Cerveza", date: "2026-08-02", type: "seasonal", niche: "Comida/Bebida", description: "Día de la cerveza", country: "global" },
  { name: "Boxing Day", date: "2026-12-26", type: "commercial", niche: "Moda/Estilo", description: "Boxing Day", country: "global" },
  { name: "Día del Idioma", date: "2026-04-23", type: "awareness", niche: "Literatura", description: "Día del idioma español", country: "latam" },
  { name: "Día Internacional de la Juventud", date: "2026-08-12", type: "awareness", niche: "Fechas Especiales", description: "Día de la juventud", country: "global" },
  { name: "World Wildlife Day", date: "2026-03-03", type: "awareness", niche: "Naturaleza", description: "Día de la vida silvestre", country: "global" },
  { name: "Día Mundial de la Ciencia", date: "2026-11-10", type: "awareness", niche: "Ciencia/Tech", description: "Día de la ciencia", country: "global" },
  { name: "Día de los Derechos Humanos", date: "2026-12-10", type: "awareness", niche: "Fechas Especiales", description: "Derechos humanos", country: "global" },
  { name: "Día del Fotografía", date: "2026-08-19", type: "awareness", niche: "Arte/Cultura", description: "Día de la fotografía", country: "global" },
  { name: "Día del Amigo", date: "2026-07-20", type: "holiday", niche: "Amor/Romance", description: "Día del amigo", country: "latam" },
  { name: "Día Mundial del Síndrome de Down", date: "2026-03-21", type: "awareness", niche: "Fechas Especiales", description: "Síndrome de Down", country: "global" },
  { name: "Independence Day (Centroamérica)", date: "2026-09-15", type: "holiday", niche: "Fechas Especiales", description: "Independencia Centroamérica", country: "latam" },
  { name: "Dia de la Revolución (México)", date: "2026-11-20", type: "holiday", niche: "Fechas Especiales", description: "Revolución mexicana", country: "mexico" },
  { name: "Día Mundial del Corazón", date: "2026-09-29", type: "awareness", niche: "Fechas Especiales", description: "Salud cardíaca", country: "global" },
  { name: "Día del Patrimonio", date: "2026-04-18", type: "awareness", niche: "Arte/Cultura", description: "Día del patrimonio", country: "global" },
  { name: "Movember", date: "2026-11-15", type: "awareness", niche: "Fechas Especiales", description: "Movember - Salud masculina", country: "global" },
  { name: "Día Internacional del Voluntario", date: "2026-12-05", type: "awareness", niche: "Fechas Especiales", description: "Día del voluntario", country: "global" },
  { name: "Nochebuena", date: "2026-12-24", type: "holiday", niche: "Religión", description: "Nochebuena", country: "global" },
  { name: "Invierno (Solsticio)", date: "2026-12-21", type: "seasonal", niche: "Naturaleza", description: "Inicio del invierno", country: "global" },
  { name: "Festivus", date: "2026-12-23", type: "seasonal", niche: "Humor/Memes", description: "Festivus", country: "usa" },
  { name: "Benito Juárez Birthday", date: "2026-03-21", type: "holiday", niche: "Fechas Especiales", description: "Natalicio de Benito Juárez", country: "mexico" },
  { name: "Spring Sale Season", date: "2026-04-15", type: "commercial", niche: "Moda/Estilo", description: "Rebajas de primavera", country: "global" },
  { name: "Día de la Madre Tierra", date: "2026-04-22", type: "awareness", niche: "Eco/Sostenibilidad", description: "Madre Tierra", country: "global" },
  { name: "Day of the Dead Season Start", date: "2026-10-25", type: "seasonal", niche: "Arte/Cultura", description: "Temporada Día de Muertos", country: "mexico" },
  { name: "Holiday Season Start", date: "2026-11-28", type: "seasonal", niche: "Fechas Especiales", description: "Temporada navideña de compras", country: "global" },
  { name: "Día de los Santos", date: "2026-11-01", type: "holiday", niche: "Religión", description: "Día de todos los santos", country: "latam" },
  { name: "Día del Médico", date: "2026-10-23", type: "awareness", niche: "Profesiones", description: "Día del médico", country: "latam" },
  { name: "Día del Ingeniero", date: "2026-09-15", type: "awareness", niche: "Profesiones", description: "Día del ingeniero", country: "latam" },
  { name: "Día del Abogado", date: "2026-08-22", type: "awareness", niche: "Profesiones", description: "Día del abogado", country: "latam" },
  { name: "Día del Arquitecto", date: "2026-07-01", type: "awareness", niche: "Profesiones", description: "Día del arquitecto", country: "latam" },
  { name: "Día de la Música", date: "2026-06-21", type: "awareness", niche: "Música", description: "Fête de la Musique", country: "global" },
  { name: "Día del Diseño Gráfico", date: "2026-10-01", type: "awareness", niche: "Arte/Cultura", description: "Día del diseñador gráfico", country: "latam" },
  { name: "Día Mundial de la Alimentación", date: "2026-10-16", type: "awareness", niche: "Comida/Bebida", description: "Día de la alimentación", country: "global" },
  { name: "Olympics Season", date: "2026-02-06", type: "seasonal", niche: "Deportes", description: "Juegos Olímpicos de Invierno", country: "global" },
];

// ============================================================
// PUNS MASTER PROMPT
// System prompt for AI-powered pun generation for POD products
// ============================================================
export const PUNS_MASTER_PROMPT = `Act as an expert creative copywriter specializing in POD (Print on Demand) product optimization and wordplay (puns). Your goal is to generate creative, original, highly commercial wordplay (puns) that are free of copyrighted material or registered trademarks.

A pun is a humorous device that uses words with similar sounds (homophones) or multiple meanings (polysemy) to create a fun double meaning. In the POD world, puns are the absolute king of sales because they are short, witty, and create an instant connection with the customer.

Three construction techniques for puns:
1. PARONOMASIA (Sound Similarity): Replace a real word with another that sounds similar but fits the niche. Example: "Brew-tiful" instead of "Beautiful" for coffee niche.
2. POLYSEMY (Double Meaning): Use a word that has two valid meanings in the same phrase. Example: "Espresso Yourself" instead of "Express Yourself" - espresso refers to coffee while sounding like "express".
3. POP CULTURE MODIFICATION: Take a famous saying, movie title, or cultural reference and adapt it to the niche. Example: "Java the Hutt" instead of "Jabba the Hutt" for coffee (Java = slang for coffee).

Distribution across POD products (25 total):
- T-Shirts (3): Identity, humor, pride - phrases people want to WEAR
- Hoodies (3): Cozy, mindset, weekend vibes, oversized comfort
- Mugs (3): Morning routine, office, coffee/tea, tiredness
- Tote Bags (3): Shopping, eco-friendly, relaxed lifestyle
- Stickers (3): Very short, visual, direct - for laptops, bottles, notebooks
- Cap/Gorra (2): Ultra-short, attitude, sports, sun, bad hair day
- Cushion/Cojín (2): Home, rest, laziness, decor, coziness
- Blanket/Manta (2): Sleep, winter, binge-watching, warmth, extreme laziness
- MousePad (2): Office work, gaming, productivity, technology, work stress

Quality Rules:
- Each pun MUST make sense with the product format and usage context
- Keep texts clean and ready for graphic design use
- Humor and irony must be perfectly understood in the requested language
- All puns must be ORIGINAL - no copyrighted phrases or trademarked slogans
- Never reference real brand names, protected IP, or registered trademarks`;
