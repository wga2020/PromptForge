export interface Color {
  name: string;
  hex: string;
}

export interface Palette {
  name: string;
  colors: Color[];
}

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  recommendedNiches: string;
  palettes: Palette[];
}

export interface ProductDef {
  id: string;
  name: string;
  promptName: string;
  category: string;
  icon: string;
  recommendedStyles: string[]; // IDs of DesignStyle
}

// 1. STYLES DEFINITION (The 20 Styles from Research + Product specific ones)
export const DESIGN_STYLES: Record<string, DesignStyle> = {
  naive: {
    id: 'naive',
    name: 'Naive & Doodle Design',
    description: 'Ilustraciones infantiles imperfectas, trazos temblorosos y garabatos cotidianos. Transmite calidez humana.',
    recommendedNiches: 'Salud mental, amor propio, mascotas, vida cotidiana.',
    palettes: [
      {
        name: 'Pastel Acogedor',
        colors: [{name: 'Amarillo Mantequilla', hex: '#FFF3B0'}, {name: 'Lavanda Apagada', hex: '#D6C7E8'}, {name: 'Verde Menta', hex: '#E2F0D9'}, {name: 'Gris Carbón', hex: '#2F3E46'}]
      }
    ]
  },
  mixed_media: {
    id: 'mixed_media',
    name: 'Mixed Media & Analog Collage',
    description: 'Superposición de texturas rasgadas, fotos retro e ilustraciones botánicas.',
    recommendedNiches: 'Literatura, poesía, arte abstracto, astrología.',
    palettes: [
      {
        name: 'Plum & Gold Intelectual',
        colors: [{name: 'Plum Noir', hex: '#401F30'}, {name: 'Cool Blue', hex: '#B0C4DE'}, {name: 'Amarillo Mostaza', hex: '#E2B13C'}, {name: 'Pergamino', hex: '#D7C4A3'}]
      }
    ]
  },
  retro_varsity: {
    id: 'retro_varsity',
    name: 'Retro Varsity & Sports',
    description: 'Estética de clubes universitarios 80s/90s. Tipografías gruesas y logos de clubes ficticios.',
    recommendedNiches: 'Deportes recreativos, clubes locales, humor universitario.',
    palettes: [
      {
        name: 'Retro Gastronómico / Social',
        colors: [{name: 'Rojo Persimón', hex: '#FF5C34'}, {name: 'Azul Fresco', hex: '#91A3B0'}, {name: 'Cloud Dancer', hex: '#F0EEE9'}, {name: 'Verde Albahaca', hex: '#1E4620'}]
      },
      {
        name: 'Earthy Retro',
        colors: [{name: 'Marrón Arcilla', hex: '#5C4033'}, {name: 'Verde Bosque', hex: '#1A4D2E'}, {name: 'Ocre Mostaza', hex: '#D4A373'}, {name: 'Crema', hex: '#F5F2EB'}]
      }
    ]
  },
  y2k_cyber: {
    id: 'y2k_cyber',
    name: 'Y2K & Cyber Glitch',
    description: 'Diseño tecnológico de finales de los 90s. Tipografías distorsionadas, cromo 3D y estética cyberpunk.',
    recommendedNiches: 'Gamers, tecnología, cultura pop alternativa, streetwear.',
    palettes: [
      {
        name: 'Carbon Mint',
        colors: [{name: 'Antracita', hex: '#2D3436'}, {name: 'Verde Menta', hex: '#00FFC2'}, {name: 'Gris Frío', hex: '#DFE6E9'}, {name: 'Violeta Digital', hex: '#6C5CE7'}]
      },
      {
        name: 'Cyber Bioluminiscente',
        colors: [{name: 'Cyber Rose', hex: '#EF5777'}, {name: 'Chartreuse', hex: '#C4D300'}, {name: 'Azul Eléctrico', hex: '#0A2240'}, {name: 'Blanco Puro', hex: '#FFFFFF'}]
      }
    ]
  },
  cottagecore: {
    id: 'cottagecore',
    name: 'Earthy & Cottagecore',
    description: 'Flora, fauna del bosque, hongos y vida pausada. Bocetos de campo y texturas orgánicas.',
    recommendedNiches: 'Jardinería, botánica, senderismo, ecología.',
    palettes: [
      {
        name: 'Canopy & Moss',
        colors: [{name: 'Verde Musgo', hex: '#4F6D7A'}, {name: 'Marrón Raíz', hex: '#8D6E63'}, {name: 'Oro Viejo', hex: '#CF9F30'}, {name: 'Beige Lino', hex: '#EDE0D4'}]
      },
      {
        name: 'Grounds & Herbs',
        colors: [{name: 'Verde Dosel', hex: '#2E5A44'}, {name: 'Marrón Arcilla', hex: '#D4A373'}, {name: 'Amarillo Trigo', hex: '#E9D8A6'}, {name: 'Cloud Dancer', hex: '#F0EEE9'}]
      }
    ]
  },
  food_art: {
    id: 'food_art',
    name: 'Food Art Nostálgico',
    description: 'Ilustraciones elegantes y juguetonas de alimentos icónicos (vino, cruasanes, pasta).',
    recommendedNiches: 'Cocina, viajeros, sibaritas, estilo de vida.',
    palettes: [
      {
        name: 'Bistró Europeo',
        colors: [{name: 'Rojo Tomate', hex: '#FF5C34'}, {name: 'Azul Cobalto', hex: '#0047AB'}, {name: 'Verde Oliva', hex: '#556B2F'}, {name: 'Base Cruda', hex: '#F0EEE9'}]
      }
    ]
  },
  abstract_organic: {
    id: 'abstract_organic',
    name: 'Abstracto Orgánico / Line Art',
    description: 'Líneas minimalistas fluidas y colores tierra. Decoración escandinava.',
    recommendedNiches: 'Bienestar, yoga, feminismo moderno, decoración.',
    palettes: [
      {
        name: 'Earthy Grounds',
        colors: [{name: 'Plum Noir', hex: '#3A1E29'}, {name: 'Jade Ahumado', hex: '#4B5D53'}, {name: 'Tierra de Siena', hex: '#A0522D'}, {name: 'Arena Suave', hex: '#E5DCD3'}]
      },
      {
        name: 'Clay & Lines',
        colors: [{name: 'Arcilla Terracota', hex: '#C27D56'}, {name: 'Marrón Cacao', hex: '#5C4033'}, {name: 'Arena Suave', hex: '#E5DCD3'}, {name: 'Verde Oliva Pálido', hex: '#A3B19B'}]
      }
    ]
  },
  aura_gradient: {
    id: 'aura_gradient',
    name: 'Aura & Mystic Gradients',
    description: 'Degradados fluidos y etéreos que representan energía y manifestaciones espirituales.',
    recommendedNiches: 'Salud mental, espiritualidad contemporánea, misticismo Gen Z.',
    palettes: [
      {
        name: 'Bioluminiscencia',
        colors: [{name: 'Violeta Profundo', hex: '#2C1A4D'}, {name: 'Rosa Neón', hex: '#FF4A85'}, {name: 'Cyan Brillante', hex: '#00F5FF'}, {name: 'Azul Eléctrico', hex: '#1E2A78'}]
      },
      {
        name: 'Aura Cíber',
        colors: [{name: 'Rosa Orquídea', hex: '#DA70D6'}, {name: 'Peach Fuzz', hex: '#FFBE98'}, {name: 'Azul Nebulosa', hex: '#4A90E2'}, {name: 'Púrpura Profundo', hex: '#2E1A47'}]
      }
    ]
  },
  retro_bauhaus: {
    id: 'retro_bauhaus',
    name: 'Retro Bauhaus / Mid-Century',
    description: 'Diseño geométrico minimalista, colores primarios con contraste histórico.',
    recommendedNiches: 'Arquitectura, interiorismo, diseño clásico.',
    palettes: [
      {
        name: 'Bauhaus Clásico',
        colors: [{name: 'Mostaza Vintage', hex: '#E2B13C'}, {name: 'Siena Tostada', hex: '#A0522D'}, {name: 'Azul Cobalto', hex: '#0047AB'}, {name: 'Crema Bauhaus', hex: '#F5F2EB'}]
      }
    ]
  },
  botanical_vintage: {
    id: 'botanical_vintage',
    name: 'Ilustración Botánica Vintage',
    description: 'Estética de enciclopedias botánicas antiguas, herbolaria y detalles finos a mano.',
    recommendedNiches: 'Plantas de interior, micología, Cottagecore.',
    palettes: [
      {
        name: 'Enciclopedia Antigua',
        colors: [{name: 'Verde Salvia', hex: '#8A9A86'}, {name: 'Marrón Sepia', hex: '#705335'}, {name: 'Amarillo Trigo', hex: '#E8D3A7'}, {name: 'Blanco Pergamino', hex: '#F4EFE6'}]
      }
    ]
  },
  swiss_grid: {
    id: 'swiss_grid',
    name: 'Tipográfico Suizo / Minimalismo Bold',
    description: 'Estructura de grilla estricta, letras grandes (sans-serif) de gran impacto visual.',
    recommendedNiches: 'Música indie, cinéfilos, frases minimalistas, ironía.',
    palettes: [
      {
        name: 'Contraste Suizo',
        colors: [{name: 'Negro Alquitrán', hex: '#1C1C1C'}, {name: 'Rojo Persimón', hex: '#FF5C34'}, {name: 'Azul Ceniza', hex: '#8E9AAF'}, {name: 'Off-White', hex: '#F9F9F9'}]
      }
    ]
  },
  vaporwave: {
    id: 'vaporwave',
    name: 'Paisajes Retro Futuristas (Vaporwave)',
    description: 'Paisajes de grillas láser 80s/90s, soles de neón y colores saturados sintéticos.',
    recommendedNiches: 'Gamers, programación, nostalgia 80s/90s.',
    palettes: [
      {
        name: 'Neon Horizon',
        colors: [{name: 'Fucsia Neón', hex: '#FF007F'}, {name: 'Azul Ciber', hex: '#00F5FF'}, {name: 'Ultravioleta', hex: '#4B0082'}, {name: 'Negro Profundo', hex: '#0D0D0C'}]
      }
    ]
  },
  pixel_art: {
    id: 'pixel_art',
    name: 'Pixel Art / Nostalgia 8-Bit',
    description: 'Diseño retro de videojuegos de 8 bits, bordes rectos y colores limitados de consola.',
    recommendedNiches: 'Desarrollo indie, retro gaming, tecnología clásica.',
    palettes: [
      {
        name: 'Gameboy Clásico',
        colors: [{name: 'Verde LCD', hex: '#9BBC0F'}, {name: 'Púrpura Consola', hex: '#3F238C'}, {name: 'Gris Cartucho', hex: '#8C8C8C'}, {name: 'Negro Sólido', hex: '#000000'}]
      }
    ]
  },
  kawaii: {
    id: 'kawaii',
    name: 'Ilustración Kawaii / Chibi Naíf',
    description: 'Personajes súper tiernos, mejillas sonrosadas y proporciones adorables.',
    recommendedNiches: 'Mascotas, anime, estudiantes, papelería bonita.',
    palettes: [
      {
        name: 'Kawaii Pastel',
        colors: [{name: 'Rosa Bebé', hex: '#FFD1DC'}, {name: 'Amarillo Pastel', hex: '#FFF4B2'}, {name: 'Menta Suave', hex: '#D3F8E2'}, {name: 'Marrón Chocolate', hex: '#4E3629'}]
      }
    ]
  },
  activism: {
    id: 'activism',
    name: 'Tipográfico de Activismo Minimalista',
    description: 'Mensajes directos y urgentes para concienciación con máxima legibilidad.',
    recommendedNiches: 'Derechos sociales, ambientalismo, defensa emocional.',
    palettes: [
      {
        name: 'Alerta y Acción',
        colors: [{name: 'Negro Mate', hex: '#121212'}, {name: 'Blanco Puro', hex: '#FFFFFF'}, {name: 'Verde Wasabi', hex: '#DFFF00'}, {name: 'Rojo Alerta', hex: '#D90429'}]
      }
    ]
  },
  celestial_goth: {
    id: 'celestial_goth',
    name: 'Celestial y Místico Oscuro',
    description: 'Estrellas, lunas, cartas de tarot con una atmósfera elegante y lúgubre.',
    recommendedNiches: 'Astrología, tarot, wicca, gótico elegante.',
    palettes: [
      {
        name: 'Obsidiana y Oro',
        colors: [{name: 'Negro Obsidiana', hex: '#0B0C10'}, {name: 'Oro Metálico', hex: '#D4AF37'}, {name: 'Azul Medianoche', hex: '#1F2833'}, {name: 'Blanco Perlado', hex: '#F5F5F5'}]
      },
      {
        name: 'Witchy Night',
        colors: [{name: 'Ciruela Noir', hex: '#311425'}, {name: 'Morado Obispo', hex: '#5C2751'}, {name: 'Plata Envejecida', hex: '#D2D7DF'}, {name: 'Hueso', hex: '#F4F1EA'}]
      }
    ]
  },
  grunge_tattoo: {
    id: 'grunge_tattoo',
    name: 'Grunge Urbano & Old School Tattoo',
    description: 'Arte clásico de tatuaje, rudeza urbana y bordes desgastados.',
    recommendedNiches: 'Skateboarding, punk indie, arte corporal.',
    palettes: [
      {
        name: 'Ink & Rust',
        colors: [{name: 'Rojo Escarlata', hex: '#9E2A2B'}, {name: 'Amarillo Cromo', hex: '#FFF01F'}, {name: 'Verde Militar', hex: '#3E5C43'}, {name: 'Negro Opaco', hex: '#1A1A1D'}]
      }
    ]
  },
  camp_badge: {
    id: 'camp_badge',
    name: 'Emblema de Viaje Vintage',
    description: 'Logos estilo parche bordado para campamento, con montañas y soles geométricos.',
    recommendedNiches: 'Senderismo, parques nacionales, naturaleza exterior.',
    palettes: [
      {
        name: 'Outdoors Vintage',
        colors: [{name: 'Naranja Teja', hex: '#D66834'}, {name: 'Azul Marino', hex: '#203A43'}, {name: 'Verde Abeto', hex: '#114B3E'}, {name: 'Amarillo Arena', hex: '#E6D5B8'}]
      }
    ]
  },
  watercolor: {
    id: 'watercolor',
    name: 'Acuarela Botánica Fina',
    description: 'Manchas translúcidas de color suave con delicados detalles botánicos.',
    recommendedNiches: 'Bodas, baby showers, eventos de primavera.',
    palettes: [
      {
        name: 'Dusty Rose & Sage',
        colors: [{name: 'Rosa Empolvado', hex: '#DCAE96'}, {name: 'Verde Eucalipto', hex: '#9FAF9C'}, {name: 'Champán', hex: '#F4ECD8'}, {name: 'Gris Cemento', hex: '#7D8489'}]
      }
    ]
  },
  art_deco: {
    id: 'art_deco',
    name: 'Art Decó / Gatsby Glamour',
    description: 'Patrones geométricos dorados de los locos años 20 sobre fondos muy oscuros.',
    recommendedNiches: 'Aniversarios, eventos VIP, lujo clásico.',
    palettes: [
      {
        name: 'Gatsby Gold',
        colors: [{name: 'Negro Ónice', hex: '#1A1A1A'}, {name: 'Oro Metálico', hex: '#C5A059'}, {name: 'Esmeralda Profundo', hex: '#093A3E'}, {name: 'Crema de Seda', hex: '#FDFBF7'}]
      }
    ]
  },
  retro_70s: {
    id: 'retro_70s',
    name: 'Tipográfico Alegre de los 70s',
    description: 'Letras burbujeantes o cursivas fluidas con curvas amplias y colores saturados.',
    recommendedNiches: 'Cumpleaños, invitaciones informales, estilo groovy.',
    palettes: [
      {
        name: 'Groovy Sunset',
        colors: [{name: 'Melocotón Cálido', hex: '#FFADAD'}, {name: 'Naranja Persimón', hex: '#FF5C34'}, {name: 'Amarillo Manteca', hex: '#FDFFB6'}, {name: 'Salvia Apagada', hex: '#CAFFBF'}]
      }
    ]
  },
  editorial_min: {
    id: 'editorial_min',
    name: 'Editorial Minimalista Contemporáneo',
    description: 'Composición limpia como de revista de alta moda, mucho espacio en blanco.',
    recommendedNiches: 'Diseño corporativo, bodas minimalistas, moda.',
    palettes: [
      {
        name: 'Quiet Luxury',
        colors: [{name: 'Gris Topo', hex: '#B8B0A6'}, {name: 'Carbono', hex: '#2A2A2A'}, {name: 'Cloud Dancer', hex: '#F0EEE9'}, {name: 'Oliva Ahumado', hex: '#5B6057'}]
      }
    ]
  },
  storybook: {
    id: 'storybook',
    name: 'Libro de Cuentos Ilustrado',
    description: 'Arte imaginativo que evoca clásicos infantiles, dibujado a mano con textura.',
    recommendedNiches: 'Bautizos, fiestas infantiles, fantasía nostálgica.',
    palettes: [
      {
        name: 'Lullaby Pastels',
        colors: [{name: 'Azul Cielo Suave', hex: '#D8E2DC'}, {name: 'Amarillo Limón', hex: '#FFE5D9'}, {name: 'Marrón Canela', hex: '#9C6644'}, {name: 'Rosa Melón', hex: '#FFCAD4'}]
      }
    ]
  }
};

// 2. CATEGORIES AND PRODUCTS (Taxonomy)
export const PRODUCT_CATEGORIES = [
  {
    id: 'wearables',
    name: 'Textil & Ropa Urbana (Wearables)',
    icon: '👕',
    description: 'Identidad, expresión social y tendencias rápidas.',
    products: [
      { id: 'tshirt', name: 'T-Shirts', promptName: 'T-Shirt', category: 'wearables', icon: '👕', recommendedStyles: ['retro_varsity', 'food_art', 'abstract_organic', 'swiss_grid'] },
      { id: 'hoodie', name: 'Hoodies', promptName: 'Hoodie', category: 'wearables', icon: '🧥', recommendedStyles: ['y2k_cyber', 'aura_gradient', 'swiss_grid', 'grunge_tattoo'] },
      { id: 'cap', name: 'Caps (Gorras)', promptName: 'Cap', category: 'wearables', icon: '🧢', recommendedStyles: ['retro_varsity', 'camp_badge', 'swiss_grid', 'grunge_tattoo'] },
      { id: 'tote', name: 'Tote Bags', promptName: 'Tote Bag', category: 'wearables', icon: '🛍️', recommendedStyles: ['food_art', 'retro_bauhaus', 'naive', 'botanical_vintage'] },
    ]
  },
  {
    id: 'home',
    name: 'Hogar & Confort (Home & Living)',
    icon: '🛋️',
    description: 'Decoración que busca calidez y habitabilidad.',
    products: [
      { id: 'cushion', name: 'Cushions (Cojines)', promptName: 'Cushion', category: 'home', icon: '🛋️', recommendedStyles: ['cottagecore', 'abstract_organic', 'retro_bauhaus'] },
      { id: 'blanket', name: 'Blankets (Mantas)', promptName: 'Blanket', category: 'home', icon: '🛌', recommendedStyles: ['cottagecore', 'aura_gradient', 'naive'] },
      { id: 'mug', name: 'Mugs (Tazas)', promptName: 'Mug', category: 'home', icon: '☕', recommendedStyles: ['naive', 'botanical_vintage', 'food_art'] },
    ]
  },
  {
    id: 'stationery',
    name: 'Papelería & Arte Gráfico',
    icon: '🖼️',
    description: 'Planificación, arte coleccionable y eventos.',
    products: [
      { id: 'poster', name: 'Posters (Wall Art)', promptName: 'Poster', category: 'stationery', icon: '🖼️', recommendedStyles: ['retro_bauhaus', 'aura_gradient', 'botanical_vintage', 'swiss_grid', 'vaporwave', 'abstract_organic'] },
      { id: 'cards', name: 'Cards / Invitaciones', promptName: 'Greeting Card', category: 'stationery', icon: '💌', recommendedStyles: ['watercolor', 'art_deco', 'retro_70s', 'editorial_min', 'storybook', 'celestial_goth'] },
      { id: 'notebook', name: 'Notebooks', promptName: 'Notebook', category: 'stationery', icon: '📓', recommendedStyles: ['mixed_media', 'cottagecore', 'botanical_vintage', 'abstract_organic'] },
      { id: 'sticker', name: 'Stickers', promptName: 'Sticker', category: 'stationery', icon: '🏷️', recommendedStyles: ['y2k_cyber', 'naive', 'pixel_art', 'kawaii'] },
    ]
  },
  {
    id: 'tech',
    name: 'Accesorios & Tecnología',
    icon: '📱',
    description: 'Micro-nichos, hobbies y dispositivos personales.',
    products: [
      { id: 'pin', name: 'Pines / Badges', promptName: 'Enamel Pin', category: 'tech', icon: '📌', recommendedStyles: ['pixel_art', 'kawaii', 'activism', 'celestial_goth', 'grunge_tattoo', 'camp_badge'] },
      { id: 'phone', name: 'Phone Cases', promptName: 'Phone Case', category: 'tech', icon: '📱', recommendedStyles: ['naive', 'y2k_cyber', 'aura_gradient'] },
      { id: 'mousepad', name: 'Mouse Pads', promptName: 'Mouse Pad', category: 'tech', icon: '🖱️', recommendedStyles: ['y2k_cyber', 'aura_gradient', 'vaporwave', 'swiss_grid'] },
      { id: 'ebook', name: 'Ebook Covers', promptName: 'Book Cover', category: 'tech', icon: '📖', recommendedStyles: ['mixed_media', 'botanical_vintage', 'editorial_min'] },
    ]
  }
];
