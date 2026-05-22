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
}> = {
  "T-Shirt": {
    productContext: "T-shirt print design, crisp edges, sticker-style silhouette",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal in Photoshop, no background scenery, no shadows touching the edges, clean silhouette separation",
    compositionSpec: "Centered composition",
    typographySpec: "Bold typography with short impactful text, slogan or phrase in ENGLISH related to the theme, integrated naturally into the composition",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 4500x5400px, 300 DPI, print-ready for DTG and screen printing",
    chromaColor: "chroma green",
  },
  "Hoodie": {
    productContext: "Hoodie print design, bold oversized graphic, statement piece with crisp edges, sticker-style silhouette",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal in Photoshop, no background scenery, no shadows touching the edges, clean silhouette separation",
    compositionSpec: "Large centered composition, impactful at distance",
    typographySpec: "Bold oversized typography with short impactful text, slogan or phrase in ENGLISH related to the theme, integrated naturally into the composition, readable from 2 meters away",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 4500x5400px, 300 DPI, print-ready for DTG and DTF printing on fleece fabric",
    chromaColor: "chroma green",
  },
  "Mug/Taza": {
    productContext: "Mug wrap-around print design, cylindrical surface compatible, visible from front viewing angle",
    backgroundSpec: "clean solid color background that complements the design, no distracting scenery, soft shadows acceptable for product mockup context",
    compositionSpec: "Centered horizontal composition optimized for front-of-mug visibility",
    typographySpec: "Clear legible typography with short impactful text, slogan or phrase in ENGLISH related to the theme, sized for comfortable reading at arm's length",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2700x1520px, 300 DPI, print-ready for sublimation and direct printing on ceramic",
    chromaColor: "solid white",
  },
  "Poster/Lámina": {
    productContext: "Poster wall art print design, gallery-quality fine art presentation, decorative statement piece",
    backgroundSpec: "full artistic background with intentional design elements, coherent visual environment supporting the theme, no isolation needed as this is a finished artwork",
    compositionSpec: "Balanced full-frame composition with clear visual hierarchy, impactful from 2+ meters distance",
    typographySpec: "Artistic typography with text, quote or phrase in ENGLISH related to the theme, integrated as a design element within the composition, elegant kerning and layout",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 6000x8000px, 300 DPI, gallery-quality giclée print-ready, museum-grade aesthetic",
    chromaColor: "full artistic background",
  },
  "Phone Case": {
    productContext: "Phone case edge-to-edge print design, camera cutout compatible, slim profile aesthetic",
    backgroundSpec: "full bleed design covering entire case surface, no isolation needed as design wraps the product, camera area kept clear of critical text elements",
    compositionSpec: "Full-bleed vertical composition with camera cutout zone consideration, key elements in lower two-thirds",
    typographySpec: "Concise bold typography with short text or word in ENGLISH related to the theme, minimal text for small format, ultra-legible at phone-size viewing",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2400x4000px, 300 DPI, print-ready for case wrapping and UV printing",
    chromaColor: "full bleed background",
  },
  "Tote Bag": {
    productContext: "Tote bag canvas print design, natural fabric texture compatible, eco-friendly aesthetic",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, no background scenery, clean edges for fabric printing on cotton canvas",
    compositionSpec: "Centered composition, bold and visible from distance, consider fabric absorption",
    typographySpec: "Bold typography with short impactful text, slogan or phrase in ENGLISH related to the theme, thick strokes for canvas printing clarity, integrated naturally into the composition",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3600x4200px, 300 DPI, print-ready for screen printing and DTG on cotton canvas",
    chromaColor: "chroma magenta",
  },
  "Sticker": {
    productContext: "Die-cut sticker design, thick bold outlines for clean cutting path, vinyl decal aesthetic",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, clean die-cut edge definition, no fuzzy edges, crisp silhouette",
    compositionSpec: "Compact centered composition, bold simple shapes, maximum impact at small size",
    typographySpec: "Extra bold condensed typography with short text or word in ENGLISH, 1-3 words maximum, ultra-thick strokes for small-format legibility, high contrast against design",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3000x3000px, 300 DPI, print-ready for vinyl die-cut sticker production with kiss-cut edges",
    chromaColor: "chroma green",
  },
  "Notebook/Agenda": {
    productContext: "Notebook cover design, premium stationery aesthetic, spine-safe layout",
    backgroundSpec: "full cover design with intentional background, elegant presentation suitable for product photography, no isolation needed",
    compositionSpec: "Centered composition with spine margin consideration, elegant balanced layout",
    typographySpec: "Elegant typography with title or phrase in ENGLISH related to the theme, sophisticated lettering that conveys quality and craftsmanship, integrated as a key design element",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2400x3200px, 300 DPI, print-ready for hardcover and softcover binding with lamination",
    chromaColor: "full cover background",
  },
  "Cap/Gorra": {
    productContext: "Cap front panel embroidery/print design, structured crown compatible, bold simple shapes for thread rendering",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, no background scenery, clean silhouette for embroidery digitizing",
    compositionSpec: "Compact centered composition within front panel area, simplified for embroidery thread limitation",
    typographySpec: "Bold block typography with short text in ENGLISH, 1-3 words maximum, thick block letters suitable for embroidery digitizing, no thin serifs or delicate scripts",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2800x1800px, 300 DPI, embroidery-friendly with minimum 0.5mm stroke width, print-ready for front panel application",
    chromaColor: "chroma green",
  },
  "Cushion/Cojín": {
    productContext: "Decorative cushion cover design, soft home decor aesthetic, front face print area",
    backgroundSpec: "full face design with intentional background, cozy and inviting presentation, no isolation needed as this is a finished home decor product",
    compositionSpec: "Centered square composition, harmonious with interior decor context",
    typographySpec: "Decorative typography with text or phrase in ENGLISH related to the theme, warm and inviting lettering style that complements home aesthetics",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3600x3600px, 300 DPI, print-ready for sublimation on polyester cushion cover",
    chromaColor: "full decorative background",
  },
  "Blanket/Manta": {
    productContext: "Blanket all-over print design, cozy warm aesthetic, large-format textile application",
    backgroundSpec: "full coverage design with seamless or intentionally bordered layout, warm inviting atmosphere, no isolation needed as design covers entire blanket surface",
    compositionSpec: "Large all-over centered composition, visually cohesive at blanket scale, soft edges preferred over hard cuts",
    typographySpec: "Large comfortable typography with text or phrase in ENGLISH related to the theme, warm inviting lettering, readable at distance with soft fabric consideration",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 5400x7200px, 300 DPI, print-ready for sublimation on fleece and woven blanket materials",
    chromaColor: "full coverage background",
  },
  "Pin/Badge": {
    productContext: "Enamel pin design, hard enamel or soft enamel style, metal border outline, compact circular format",
    backgroundSpec: "isolated on a solid flat {chromaColor} background for easy background removal, clean metal border definition, no fuzzy edges, bold solid color fills",
    compositionSpec: "Compact centered circular composition, extremely simplified for 1-2 inch physical size, maximum 2-3 colors for enamel production",
    typographySpec: "Ultra bold condensed typography with 1-2 words maximum in ENGLISH, block letters with thick strokes, minimum 3mm character height for physical pin legibility, no scripts or serifs",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 1000x1000px, 300 DPI, enamel pin production-ready with metal plating lines and color separations",
    chromaColor: "chroma green",
  },
  "Card/Invitación": {
    productContext: "Premium invitation card design, fine stationery aesthetic, elegant presentation",
    backgroundSpec: "full card design with sophisticated background, luxury stationery context, decorative borders and ornamental framing encouraged, no isolation needed",
    compositionSpec: "Elegant portrait composition with decorative framing, formal balanced layout with hierarchical text placement",
    typographySpec: "Elegant refined typography with formal text in ENGLISH, calligraphic script for names paired with classic serif for details, sophisticated kerning and leading, luxury stationery lettering quality",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 2400x3600px, 300 DPI, letterpress and foil-ready, print-ready on premium cardstock with envelope",
    chromaColor: "full elegant background",
  },
  "Mousepad": {
    productContext: "Mousepad full surface design, desk accessory aesthetic, functional workspace enhancement",
    backgroundSpec: "full bleed design covering entire mousepad surface, no isolation needed, design extends to all edges for rubber base wrapping",
    compositionSpec: "Full-surface horizontal composition with central focal point, consider wrist rest area and mouse movement zone, avoid critical details at extreme edges",
    typographySpec: "Moderate typography with text in ENGLISH related to the theme, balanced against illustrative elements, legible while using the mouse on the pad surface",
    qualityMarkers: "Ultra detailed, 4K, professional graphic design, trending on Behance, 3600x2700px, 300 DPI, print-ready for sublimation on fabric-top rubber-base mousepad",
    chromaColor: "full bleed background",
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
  typographySection += `, using a ${fontAesthetic} font style that matches the aesthetic (specifically: "${data.fonts.principal}" for the primary text`;
  if (data.secondaryText) {
    typographySection += `, "${data.fonts.secundaria}" for the secondary text`;
  }
  if (data.accentText) {
    typographySection += `, "${data.fonts.acento}" for accent details`;
  }
  typographySection += `). All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design`;

  // Build the text content section
  let textContent = `Primary text: "${data.primaryText}"`;
  if (data.secondaryText) {
    textContent += `. Secondary text: "${data.secondaryText}"`;
  }
  if (data.accentText) {
    textContent += `. Accent detail: "${data.accentText}"`;
  }

  // Build the color palette section
  const colorSection = `Rich and vibrant color palette based on ${data.paletteName} (${colorStr}) with smooth gradients, depth and dimension`;

  // Assemble the full master prompt
  const prompt = [
    `Vector illustration with hyperrealistic detail, ${data.niche} theme featuring ${nicheTheme}.`,
    illustrationApproach,
    `Bold clean vector outlines combined with photorealistic rendering, sharp shading, intricate textures, dramatic lighting with strong contrast.`,
    colorSection,
    typographySection,
    textContent,
    `${config.compositionSpec}, ${config.productContext}.`,
    backgroundSpec,
    config.qualityMarkers,
  ].join(" ");

  return prompt;
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
