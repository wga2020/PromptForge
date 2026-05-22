const docx = require("docx");
const fs = require("fs");
const path = require("path");

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  ImageRun, PageBreak, Tab, TabStopPosition, TabStopType,
  ShadingType, TableOfContents, StyleLevel, Header, Footer,
  PageNumber, NumberFormat, SectionType, convertInchesToTwip,
  LevelFormat, UnderlineType
} = docx;

const coverImg = fs.readFileSync("/home/z/my-project/download/cover_tipografias_manual.png");

// Helper functions
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: "Calibri", color: "1B2A4A" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Calibri", color: "2C3E6B" })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Calibri", color: "3D5A99" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 21, font: "Calibri", ...opts })]
  });
}

function boldPara(label, text) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({ text: label, bold: true, size: 21, font: "Calibri" }),
      new TextRun({ text, size: 21, font: "Calibri" })
    ]
  });
}

function bulletItem(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60, line: 340 },
    children: [new TextRun({ text, size: 21, font: "Calibri" })]
  });
}

function fontFamilyTable(families) {
  const headerCells = ["Familia / Conjunto", "Fuente Principal", "Fuente Secundaria", "Fuente Acento", "Uso Recomendado"].map(t =>
    new TableCell({
      shading: { fill: "1B2A4A", type: ShadingType.CLEAR },
      width: { size: 20, type: WidthType.PERCENTAGE },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, bold: true, color: "FFFFFF", size: 18, font: "Calibri" })] })]
    })
  );
  const rows = [new TableRow({ children: headerCells })];
  families.forEach(f => {
    const cells = [f.nombre, f.principal, f.secundaria, f.acento, f.uso].map(t =>
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [new TextRun({ text: t, size: 18, font: "Calibri" })] })]
      })
    );
    rows.push(new TableRow({ children: cells }));
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows });
}

function simpleTable(headers, data) {
  const headerCells = headers.map(t =>
    new TableCell({
      shading: { fill: "1B2A4A", type: ShadingType.CLEAR },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, bold: true, color: "FFFFFF", size: 18, font: "Calibri" })] })]
    })
  );
  const rows = [new TableRow({ children: headerCells })];
  data.forEach(row => {
    const cells = row.map(t =>
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [new TextRun({ text: String(t), size: 18, font: "Calibri" })] })]
      })
    );
    rows.push(new TableRow({ children: cells }));
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ============================================================
// CONTENT
// ============================================================

const content = [];

// --- COVER ---
content.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new ImageRun({ data: coverImg, transformation: { width: 400, height: 700 } })]
}));
content.push(new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "MANUAL PREMIUM", size: 44, bold: true, font: "Calibri", color: "1B2A4A" })] }));
content.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TIPOGRAFÍAS Y FUENTES PARA", size: 36, bold: true, font: "Calibri", color: "2C3E6B" })] }));
content.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PERSONALIZACIÓN DE PRODUCTOS", size: 40, bold: true, font: "Calibri", color: "C4960C" })] }));
content.push(new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Guía Definitiva de Familias Tipográficas por Producto, Nicho y Temática", size: 24, italics: true, font: "Calibri", color: "555555" })] }));
content.push(new Paragraph({ spacing: { before: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Con Nombres Exactos de Fuentes y Combinaciones Profesionales", size: 22, font: "Calibri", color: "777777" })] }));
content.push(new Paragraph({ spacing: { before: 300 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "2026", size: 24, font: "Calibri", color: "1B2A4A" })] }));
content.push(pageBreak());

// --- TOC ---
content.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "ÍNDICE DE CONTENIDOS", size: 32, bold: true, font: "Calibri", color: "1B2A4A" })] }));
content.push(new TableOfContents("Índice", {
  hyperlink: true,
  headingStyleRange: "1-3",
}));
content.push(pageBreak());

// ============================================================
// CAPÍTULO 1: FUNDAMENTOS DE TIPOGRAFÍA PARA PERSONALIZACIÓN
// ============================================================
content.push(heading1("Capítulo 1: Fundamentos de Tipografía para Personalización de Productos"));

content.push(heading2("1.1 Introducción a la Tipografía en el Diseño de Productos"));
content.push(para("La tipografía es uno de los elementos más poderosos y determinantes en el diseño de productos personalizados. Cuando un cliente adquiere una camiseta, una taza, un póster o una funda de teléfono, el texto que porta ese producto comunica no solo un mensaje literal, sino también una personalidad, una emoción y una identidad visual completa. La elección de la fuente correcta puede transformar un diseño ordinario en una pieza de comunicación visual extraordinaria que conecte profundamente con el público objetivo. En el contexto de la personalización masiva de productos, donde se ofrecen miles de combinaciones de diseños en múltiples plataformas de impresión bajo demanda como Printful, Printify, Merch by Amazon, Redbubble o Etsy, dominar la tipografía se convierte en una competencia estratégica fundamental que marca la diferencia entre un diseño que vende y uno que pasa inadvertido."));
content.push(para("A diferencia del diseño editorial o el diseño web, donde la tipografía se lee en contextos estáticos y predecibles, la tipografía en productos personalizados debe funcionar en superficies tridimensionales, texturas variadas, tamaños reducidos y condiciones de visualización impredecibles. Una camiseta se arruga, una taza se sostiene en ángulo, un póster se observa a distancia, una funda de teléfono se manipula constantemente. Cada uno de estos contextos impone restricciones tipográficas únicas que el diseñador debe comprender y dominar para garantizar que el mensaje sea siempre legible, impactante y estéticamente coherente con la propuesta de valor del producto."));

content.push(heading2("1.2 Clasificación de Fuentes: Las Grandes Familias Tipográficas"));
content.push(para("Para seleccionar fuentes con criterio profesional es imprescindible conocer la clasificación tipográfica tradicional y contemporánea. Cada familia tipográfica posee características estructurales que la hacen más adecuada para determinados productos, nichos de mercado y temáticas de diseño. A continuación se presenta una clasificación detallada con las familias más relevantes para la personalización de productos."));

content.push(heading3("1.2.1 Serif"));
content.push(para("Las fuentes serif se caracterizan por tener terminaciones o remates en los extremos de los trazos. Proyectan elegancia, tradición, autoridad y sofisticación. Son ideales para productos premium, temáticas clásicas, diseños vintage y cualquier contexto donde se busque comunicar confianza y distinción. Las serif se subdividen en varias categorías: las Old Style o estilo antiguo como Garamond, Caslon y Janson, que transmiten calidez y tradición; las Transitional o de transición como Baskerville y Times New Roman, que equilibran tradición y modernidad; las Didone o modernas como Bodoni, Didot y Playfair Display, que proyectan lujo y alta moda; y las Slab Serif o serif de bloque como Rockwell, Archer y Museo Slab, que combinan solidez con personalidad."));

content.push(heading3("1.2.2 Sans Serif"));
content.push(para("Las fuentes sin remate o sans serif se distinguen por sus trazos limpios y sin terminaciones. Comunican modernidad, limpieza, simplicidad y accesibilidad. Son extraordinariamente versátiles y funcionan bien en casi cualquier producto y nicho de mercado. Dentro de las sans serif encontramos las Grotesque como Helvetica, Akzidenz-Grotesk y Franklin Gothic, de apariencia neutra y funcional; las Neo-Grotesque como Univers, Arial y Roboto, que refinan la tradición grotesca; las Humanist como Gill Sans, Myriad y Lato, que conservan cierta calidez orgánica; y las Geometric como Futura, Avenir y Montserrat, basadas en formas geométricas puras que proyectan modernidad y minimalismo."));

content.push(heading3("1.2.3 Script y Caligráficas"));
content.push(para("Las fuentes script emulan la escritura a mano o la caligrafía. Aportan elegancia, romanticismo, personalidad y un sentido de artesanalidad que es muy valorado en productos personalizados como invitaciones, camisetas de eventos especiales, tazas conmemorativas y productos de regalo. Se dividen en Formal Script como Edwardian Script, Zapfino y Bickham Script, que replican la caligrafía de pluma metálica; Casual Script como Lobster, Pacifico y KAUSHAN Script, que simulan una escritura a mano relajada y amigable; y Brush Script como Allura, Great Vibes y Sacramento, que emulan la pintura con pincel y proyectan energía y movimiento."));

content.push(heading3("1.2.4 Display y Decorativas"));
content.push(para("Las fuentes display están diseñadas específicamente para usarse en tamaños grandes y llamar la atención. Son la opción ideal para títulos de camisetas, textos destacados en pósters, y cualquier situación donde la tipografía sea el elemento central del diseño. Estas fuentes tienen personalidad marcada y no deben usarse en textos largos. Ejemplos notables incluyen Bebas Neue y Impact para titulares potentes; Cooper Black y Gumbo Block para un estilo retro contundente; Bungee y Stretch PRO para diseños urbanos y contemporáneos; y Milkshake, Kaushan Script y Satisfy para títulos con personalidad artesanal."));

content.push(heading3("1.2.5 Monospace"));
content.push(para("Las fuentes monoespaciadas asignan el mismo ancho a cada carácter, creando una apariencia técnica y sistemática. Son muy utilizadas en diseños con temática tecnológica, hacking, programación y estética retro digital. Ejemplos clave incluyen Courier New, Source Code Pro, Fira Code, IBM Plex Mono y Space Mono. En productos personalizados, las monospace aportan un aire de autenticidad digital que funciona muy bien en camisetas para desarrolladores, pegatinas tech, y productos de nicho tecnológico."));

content.push(heading2("1.3 Principios de Combinación Tipográfica"));
content.push(para("El arte de combinar fuentes es una de las habilidades más valiosas en el diseño de productos personalizados. Una combinación tipográfica bien lograda crea jerarquía visual, contraste armónico y coherencia estilística, mientras que una combinación deficiente genera confusión, ruido visual y un aspecto amateur. Existen varios principios fundamentales que guían la creación de familias tipográficas complementarias para cualquier producto y nicho."));

content.push(para("El primer principio es el contraste: las fuentes combinadas deben ser claramente diferentes entre sí para crear distinción visual, pero no tanto como para entrar en conflicto. Un ejemplo clásico es combinar una serif elegante para el título con una sans serif limpia para el texto secundario. El segundo principio es la concordancia: aunque las fuentes deben contrastar, deben compartir alguna cualidad subyacente, como la proporción, el peso o la estructura, que las una visualmente. El tercer principio es la jerarquía: en todo diseño personalizado debe haber una fuente dominante que capture la atención y una o dos fuentes subordinadas que complementen sin competir."));

content.push(para("La regla práctica más utilizada por diseñadores profesionales es la regla de las tres fuentes: una fuente display o de titular para el elemento principal del diseño, una fuente de cuerpo o secundaria para textos complementarios, y una fuente de acento para detalles, fechas, subtítulos o elementos decorativos. Esta estructura de tres niveles garantiza variedad sin caos, y es la base de todas las familias tipográficas que se presentan en este manual para cada producto y nicho."));

content.push(heading2("1.4 Factores Técnicos: Legibilidad, Tamaño y Soporte"));
content.push(para("La legibilidad en productos impresos depende de factores que van más allá de la elección estética. El tipo de superficie de impresión, la técnica de impresión empleada, el tamaño del producto y la distancia de visualización esperada son todos factores que condicionan la selección tipográfica. En serigrafía, por ejemplo, las fuentes con trazos muy finos pueden no reproducirse correctamente, mientras que en sublimación los detalles finos se capturan con mayor precisión. En DTG, la absorción de la tela afecta la nitidez de las fuentes pequeñas, y en impresión láser sobre tazas, el tamaño mínimo legible es mayor que en impresión sobre papel."));

content.push(para("Como regla general, para camisetas el tamaño mínimo de fuente recomendado es de 12 puntos para sans serif y 14 puntos para serif, aunque esto varía según la técnica de impresión. Para tazas, se recomienda un mínimo de 10 puntos en impresión directa y 8 puntos en sublimación. Para pósters, la legibilidad a distancia implica que las fuentes de titular deben estar entre 24 y 72 puntos según el tamaño del póster. Para fundas de teléfono y productos pequeños, las fuentes display con trazos gruesos y generosos funcionan mejor que las fuentes delicadas con detalles finos."));

content.push(heading2("1.5 Licencias y Fuentes Comerciales"));
content.push(para("Un aspecto crítico que muchos diseñadores novatos overlooking es la licencia de las fuentes. No todas las fuentes disponibles en internet son de uso libre para fines comerciales. Utilizar una fuente sin la licencia adecuada puede resultar en demandas legales y la retirada de productos de las plataformas de venta. Las principales categorías de licencias incluyen: fuentes de dominio público que pueden usarse sin restricción; fuentes con licencia SIL Open Font License (OFL) que permiten uso comercial con ciertas condiciones; fuentes freeware para uso personal que requieren licencia comercial para productos; y fuentes premium o de pago que ofrecen licencias comerciales explícitas."));
content.push(para("Las plataformas más confiables para obtener fuentes con licencias claras son Google Fonts, que ofrece todas sus fuentes bajo licencias abiertas; Adobe Fonts, incluidas en la suscripción de Creative Cloud con licencia comercial completa; Font Squirrel, que curate fuentes gratuitas para uso comercial; DaFont, que requiere verificar la licencia individual de cada fuente; MyFonts y Creative Market, que venden fuentes premium con licencias comerciales explícitas. En este manual, todas las fuentes recomendadas son de uso comercial bajo las licencias apropiadas, y se indica cuando una fuente requiere licencia de pago."));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 2: TIPOGRAFÍA PARA CAMISETAS
// ============================================================
content.push(heading1("Capítulo 2: Tipografía para Camisetas"));

content.push(heading2("2.1 Particularidades Tipográficas en Textiles"));
content.push(para("Las camisetas representan el producto más popular en la personalización bajo demanda, y también el que presenta mayores desafíos tipográficos. La tela absorbe la tinta de manera diferente según su composición, el algodón absorbe más que el poliéster, lo que afecta la nitidez de los trazos finos. Las costuras y arrugas del tejido distorsionan las letras, especialmente en zonas cercanas a las sisas, el cuello y los costados. Además, la camiseta es un lienzo en movimiento: el usuario camina, se inclina, gesticula, y el texto debe ser legible desde múltiples ángulos y distancias. Estos factores hacen que la selección tipográfica para camisetas sea un ejercicio de equilibrio entre estética y funcionalidad."));

content.push(para("Las técnicas de impresión más comunes para camisetas incluyen serigrafía, DTG (impresión directa sobre tela), DTF (impresión directa sobre película), sublimación, vinilo textil, bordado y puff print. Cada técnica impone restricciones tipográficas específicas. En serigrafía, las fuentes con serif muy delicadas pueden perder definición, y se recomienda usar fuentes con un grosor mínimo de trazo de 1 punto. En DTG, la resolución es mayor pero la absorción de la tela puede difuminar trazos finos en camisetas de algodón de baja calidad. En sublimación sobre poliéster, la nitidez es excelente pero la paleta de colores se limita a sustratos claros. En bordado, las fuentes script muy elaboradas no son viables y se requieren fuentes de trazos más gruesos."));

content.push(heading2("2.2 Familias Tipográficas por Nicho de Camisetas"));

content.push(heading3("2.2.1 Nicho: Motivacional y Frases Inspiradoras"));
content.push(para("El nicho motivacional es uno de los más rentables en camisetas personalizadas. Las frases inspiradoras, los mensajes de empoderamiento personal y los lemas de superación requieren tipografías que transmitan fuerza, confianza y positividad. La combinación ideal suele ser una fuente display contundente para la frase principal, una sans serif limpia para el nombre del autor o subtítulo, y una script elegante para elementos decorativos como fechas o iniciales."));

content.push(fontFamilyTable([
  { nombre: "Empoderamiento Clásico", principal: "Bebas Neue", secundaria: "Montserrat Light", acento: "Great Vibes", uso: "Frases de superación femenina" },
  { nombre: "Motivación Deportiva", principal: "Impact", secundaria: "Oswald", acento: "Brush Script MT", uso: "Gym, running, atletismo" },
  { nombre: "Mindset Minimalista", principal: "Montserrat Bold", secundaria: "Lato Light", acento: "Dancing Script", uso: "Mentalidad positiva moderna" },
  { nombre: "Fuerza y Resiliencia", principal: "Anton", secundaria: "Roboto Condensed", acento: "Pacifico", uso: "Superación, resiliencia" },
  { nombre: "Inspiración Elegante", principal: "Playfair Display Bold", secundaria: "Source Sans Pro", acento: "Allura", uso: "Frases poéticas, elegancia" },
  { nombre: "Hustle y Emprendimiento", principal: "Bebas Neue", secundaria: "Raleway Bold", acento: "Sacramento", uso: "Emprendedores, hustle culture" },
]));

content.push(heading3("2.2.2 Nicho: Profesiones y Ocupaciones"));
content.push(para("Las camisetas profesionales son un segmento de mercado enorme que abarca desde enfermeras y médicos hasta ingenieros, profesores, chefs y programadores. Cada profesión tiene su cultura visual, su jerga y su estética propia. La tipografía debe reflejar la identidad del gremio: técnica y precisa para ingenieros, cálida y amigable para docentes, audaz y creativa para diseñadores."));

content.push(fontFamilyTable([
  { nombre: "Medicina y Salud", principal: "Myriad Pro Bold", secundaria: "Open Sans", acento: "Satisfy", uso: "Enfermeras, médicos, fisioterapeutas" },
  { nombre: "Ingeniería y Tech", principal: "Roboto Mono", secundaria: "Inter", acento: "Orbitron", uso: "Ingenieros, programadores, devs" },
  { nombre: "Educación y Docencia", principal: "Nunito Bold", secundaria: "Quicksand", acento: "Caveat", uso: "Profesores, maestros, pedagogos" },
  { nombre: "Gastronomía y Cocina", principal: "Playfair Display", secundaria: "Lora", acento: "Lobster", uso: "Chefs, pasteleros, foodies" },
  { nombre: "Diseño y Creatividad", principal: "Futura Bold", secundaria: "Space Grotesk", acento: "Kaushan Script", uso: "Diseñadores, artistas, creativos" },
  { nombre: "Construcción y Oficios", principal: "Rockwell", secundaria: "Archivo Black", acento: "Russo One", uso: "Construcción, plomería, electricidad" },
  { nombre: "Derecho y Legal", principal: "Merriweather Bold", secundaria: "Libre Baskerville", acento: "Cormorant Garamond", uso: "Abogados, notarios, legal" },
  { nombre: "Veterinaria y Animales", principal: "Baloo 2", secundaria: "Nunito", acento: "Indie Flower", uso: "Veterinarios, amantes de animales" },
]));

content.push(heading3("2.2.3 Nicho: Aficiones y Hobbies"));
content.push(para("El nicho de aficiones es infinitamente diverso: desde la fotografía y la jardinería hasta los videojuegos y la astronomía. Cada hobby tiene su comunidad, su estética y su lenguaje visual. Las fuentes elegidas deben resonar con la cultura de esa comunidad, reconociendo sus códigos visuales y hablando su mismo idioma estético."));

content.push(fontFamilyTable([
  { nombre: "Gaming y Videojuegos", principal: "Press Start 2P", secundaria: "Orbitron", acento: "Bungee Shade", uso: "Gamers, streamers, esports" },
  { nombre: "Fotografía", principal: "Josefin Sans", secundaria: "Raleway", acento: "Mr De Haviland", uso: "Fotógrafos, entusiastas" },
  { nombre: "Música y Bandas", principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt", uso: "Músicos, fans de bandas" },
  { nombre: "Jardinería y Plantas", principal: "Playfair Display", secundaria: "Lora Italic", acento: "Great Vibes", uso: "Plant lovers, jardinería" },
  { nombre: "Astronomía y Espacio", principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide", uso: "Astronomía, ciencia espacial" },
  { nombre: "Pesca y Aire Libre", principal: "Bungee", secundaria: "Oswald", acento: "Gochi Hand", uso: "Pesca, camping, outdoors" },
  { nombre: "Cerveza Artesanal", principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy", uso: "Cerveceros, craft beer" },
  { nombre: "Lectura y Libros", principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Caveat", uso: "Lectores, escritores, bookworms" },
]));

content.push(heading3("2.2.4 Nicho: Religión y Espiritualidad"));
content.push(para("Las camisetas con mensajes religiosos y espirituales constituyen un mercado muy fuerte y consolidado, especialmente en comunidades cristianas, pero también en el mindfulness, el yoga y las prácticas espirituales contemporáneas. La tipografía en este nicho debe transmitir fe, serenidad, reverencia y conexión con lo trascendente. Las fuentes script caligráficas son especialmente populares para versículos bíblicos, mientras que las sans serif modernas funcionan bien para mensajes de fe contemporáneos."));

content.push(fontFamilyTable([
  { nombre: "Fe Clásica", principal: "Cinzel Decorative", secundaria: "Cormorant Garamond", acento: "Great Vibes", uso: "Versículos bíblicos, fe tradicional" },
  { nombre: "Espiritualidad Moderna", principal: "Montserrat Bold", secundaria: "Lato", acento: "Dancing Script", uso: "Fe contemporánea, iglesia moderna" },
  { nombre: "Misticismo y Yoga", principal: "Cinzel", secundaria: "Raleway", acento: "Allura", uso: "Yoga, meditación, mindfulness" },
  { nombre: "Oración y Devoción", principal: "EB Garamond Italic", secundaria: "Libre Baskerville", acento: "Sacramento", uso: "Oraciones, devocionales" },
  { nombre: "Fe Bold Urbana", principal: "Bebas Neue", secundaria: "Barlow Condensed", acento: "Satisfy", uso: "Juventud cristiana, fe urbana" },
]));

content.push(heading3("2.2.5 Nicho: Pop Culture y Entretenimiento"));
content.push(para("La cultura pop es uno de los nichos más dinámicos y de mayor rotación en camisetas personalizadas. Las tendencias cambian rápidamente, y los diseños deben capturar el espíritu del momento con tipografías que evoquen la estética de cada fenómeno cultural. Desde series de televisión y películas hasta memes y tendencias de TikTok, cada manifestación cultural tiene su lenguaje tipográfico propio."));

content.push(fontFamilyTable([
  { nombre: "Retro 80s", principal: "Arcade Classic", secundaria: "Syncopate", acento: "Monoton", uso: "Estética retro, synthwave, 80s" },
  { nombre: "Noche Discoteca", principal: "Bungee Shade", secundaria: "Righteous", acento: "Lobster", uso: "Disco, funk, noche, fiesta" },
  { nombre: "Grunge 90s", principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt", uso: "Grunge, rock alternativo, 90s" },
  { nombre: "K-Pop y Asia Pop", principal: "Noto Sans KR Bold", secundaria: "Quicksand Bold", acento: "Dancing Script", uso: "K-pop, cultura asiática" },
  { nombre: "Meme Culture", principal: "Impact", secundaria: "Comic Neue", acento: "Permanent Marker", uso: "Memes, humor internet" },
  { nombre: "Anime y Manga", principal: "Bangers", secundaria: "Anton", acento: "Gugi", uso: "Anime, otaku, manga" },
]));

content.push(heading3("2.2.6 Nicho: Fechas Especiales y Estaciones"));
content.push(para("Las camisetas para fechas especiales como Navidad, Halloween, Día de las Madres, San Valentín y Día del Padre representan picos estacionales de ventas masivas. Cada celebración tiene su paleta cromática y su lenguaje tipográfico reconocible que los consumidores asocian inmediatamente con la festividad."));

content.push(fontFamilyTable([
  { nombre: "Navidad Clásica", principal: "Mountains of Christmas", secundaria: "Lora", acento: "Great Vibes", uso: "Navidad tradicional, familia" },
  { nombre: "Halloween Terror", principal: "Creepster", secundaria: "Bangers", acento: "Nosifer", uso: "Halloween, terror, spooky" },
  { nombre: "San Valentín Romance", principal: "Great Vibes", secundaria: "Playfair Display", acento: "Dancing Script", uso: "San Valentín, amor, romance" },
  { nombre: "Día de las Madres", principal: "Sacramento", secundaria: "Cormorant Garamond", acento: "Allura", uso: "Madres, familia, agradecimiento" },
  { nombre: "Día del Padre", principal: "Bebas Neue", secundaria: "Oswald", acento: "Rock Salt", uso: "Padres, fortaleza, familia" },
  { nombre: "Verano y Playa", principal: "Pacifico", secundaria: "Quicksand", acento: "Gochi Hand", uso: "Verano, playa, vacaciones" },
  { nombre: "Año Nuevo", principal: "Playfair Display Bold", secundaria: "Montserrat", acento: "Sacramento", uso: "Año nuevo, celebración" },
  { nombre: "Pascua / Easter", principal: "Fredericka the Great", secundaria: "Nunito", acento: "Indie Flower", uso: "Pascua, primavera, renacimiento" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 3: TIPOGRAFÍA PARA TAZAS Y MUGS
// ============================================================
content.push(heading1("Capítulo 3: Tipografía para Tazas y Mugs"));

content.push(heading2("3.1 El Diseño Tipográfico en Superficies Cilíndricas"));
content.push(para("Las tazas y mugs presentan un desafío tipográfico único: la superficie cilíndrica distorsiona la percepción visual del texto cuando se observa de frente. El diseño debe considerar la curvatura del objeto y cómo esta afecta la legibilidad. A diferencia de una camiseta, donde el lienzo es esencialmente plano, una taza obliga al diseñador a trabajar con una ventana visual limitada, generalmente un rectángulo de aproximadamente 8 por 10 centímetros en la zona frontal, donde el texto debe ser inmediatamente legible e impactante."));
content.push(para("Además, la taza es un objeto de uso cotidiano e íntimo: se sostiene con las manos, se lleva a los labios, se observa de cerca durante la mañana. Esta proximidad física crea una conexión emocional entre el usuario y el texto que porta la taza, lo que hace que las frases motivacionales, los mensajes de humor y las dedicatorias personales sean especialmente efectivos en este formato. La tipografía para tazas debe ser legible a distancia de lectura cercana, resistente al lavado repetido, y capaz de comunicar en un espacio reducido."));

content.push(heading2("3.2 Familias Tipográficas por Nicho de Tazas"));

content.push(heading3("3.2.1 Nicho: Oficina y Trabajo"));
content.push(para("Las tazas de oficina son un clásico del merchandising corporativo y los regalos de empresa. Los mensajes sarcásticos sobre el trabajo, las frases de motivación laboral y los lemas corporativos son algunos de los diseños más vendidos. La tipografía debe ser profesional pero con personalidad, legible a primera vista y memorable."));

content.push(fontFamilyTable([
  { nombre: "Sarcasmo Corporativo", principal: "Bebas Neue", secundaria: "Montserrat", acento: "Caveat", uso: "Frases sarcásticas de oficina" },
  { nombre: "Motivación Laboral", principal: "Montserrat Bold", secundaria: "Open Sans", acento: "Satisfy", uso: "Motivación, liderazgo, trabajo" },
  { nombre: "Coffee Lover", principal: "Pacifico", secundaria: "Lora", acento: "Kaushan Script", uso: "Amantes del café, cafeína" },
  { nombre: "Boss Lady / Girl Boss", principal: "Playfair Display Bold", secundaria: "Lato", acento: "Great Vibes", uso: "Mujeres emprendedoras, líderes" },
  { nombre: "Programador / Dev", principal: "Source Code Pro", secundaria: "Fira Code", acento: "Press Start 2P", uso: "Desarrolladores, IT, tech" },
]));

content.push(heading3("3.2.2 Nicho: Regalos Personales y Familia"));
content.push(para("Las tazas son uno de los regalos más populares del mundo: para mamá, para papá, para el abuelo, para la mejor amiga, para la pareja. En este nicho, la tipografía debe transmitir calidez, afecto y personalización. Las fuentes script son las reinas indiscutibles de este segmento, combinadas con sans serif amigables para los nombres y serif clásicas para los mensajes sentimentales."));

content.push(fontFamilyTable([
  { nombre: "Para Mamá", principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Dancing Script", uso: "Día de la madre, regalos mamá" },
  { nombre: "Para Papá", principal: "Oswald", secundaria: "Merriweather", acento: "Rock Salt", uso: "Día del padre, regalos papá" },
  { nombre: "Mejor Amiga", principal: "Dancing Script", secundaria: "Quicksand Bold", acento: "Pacifico", uso: "Amistad, BFF, sisterhood" },
  { nombre: "Pareja y Aniversario", principal: "Allura", secundaria: "Playfair Display", acento: "Sacramento", uso: "Aniversario, boda, amor" },
  { nombre: "Abuelos", principal: "EB Garamond", secundaria: "Lora", acento: "Satisfy", uso: "Abuelos, familia, legado" },
  { nombre: "Navidad Familiar", principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Great Vibes", uso: "Regalos navideños familiares" },
]));

content.push(heading3("3.2.3 Nicho: Humor y Memes"));
content.push(para("El humor es el motor de ventas más potente en tazas personalizadas. Los chistes sobre el café, los mensajes políticamente incorrectos con humor, y las frases que solo se atreven a decir en la privacidad de su cocina venden millones de unidades cada año. La tipografía para humor debe ser directa, descarada y visualmente impactante."));

content.push(fontFamilyTable([
  { nombre: "Humor Seco", principal: "Impact", secundaria: "Comic Neue Bold", acento: "Permanent Marker", uso: "Humor seco, sarcasmo" },
  { nombre: "Noches sin Dormir", principal: "Bebas Neue", secundaria: "Raleway", acento: "Gochi Hand", uso: "Insomnio, cansancio, humor" },
  { nombre: "Cafeína Adicta", principal: "Lobster", secundaria: "Oswald", acento: "Rock Salt", uso: "Adictos al café, humor café" },
  { nombre: "Lenguaje Moderno", principal: "Bangers", secundaria: "Barlow Condensed", acento: "Caveat", uso: "Humor generacional, gen Z" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 4: TIPOGRAFÍA PARA PÓSTERS Y LÁMINAS
// ============================================================
content.push(heading1("Capítulo 4: Tipografía para Pósters y Láminas"));

content.push(heading2("4.1 La Tipografía como Protagonista en Pósters"));
content.push(para("En los pósters y láminas decorativas, la tipografía suele ser el elemento principal del diseño, no un complemento. A diferencia de las camisetas o tazas, donde el texto comparte espacio con ilustraciones y otros elementos gráficos, en los pósters tipográficos la fuente es la estrella. Esto otorga una libertad creativa enorme pero también una responsabilidad mayor: la fuente debe ser capaz de sostener toda la composición visual por sí misma, comunicando el mensaje con impacto emocional y coherencia estética."));
content.push(para("Los pósters se observan a mayor distancia que otros productos personalizados, lo que significa que la jerarquía tipográfica debe ser aún más pronunciada. El titular debe captar la atención desde al menos dos metros de distancia, el subtítulo debe ser legible desde un metro, y el texto complementario debe revelarse al acercarse. Esta gradación de lectura es fundamental para crear pósters que funcionen tanto como elementos decorativos de impacto como piezas de comunicación efectivas."));

content.push(heading2("4.2 Familias Tipográficas por Estilo de Póster"));

content.push(heading3("4.2.1 Estilo Minimalista Escandinavo"));
content.push(para("El estilo escandinavo domina las tendencias de decoración de interiores y los pósters minimalistas son uno de los productos más vendidos en plataformas como Etsy y Society6. La tipografía en este estilo debe ser extremadamente limpia, con abundante espacio en blanco, pesos sutiles y una paleta cromática restringida. Las fuentes geométricas sans serif son la elección natural, combinadas con serif elegantes para contraste refinado."));

content.push(fontFamilyTable([
  { nombre: "Nórdico Puro", principal: "Montserrat Thin", secundaria: "Playfair Display", acento: "Cormorant Garamond", uso: "Pósters minimalistas nórdicos" },
  { nombre: "Hygge Acogedor", principal: "Lora", secundaria: "Raleway Light", acento: "Dancing Script", uso: "Pósters hogareños, acogedores" },
  { nombre: "Escandinavo Geométrico", principal: "Futura Light", secundaria: "Avenir Next", acento: "Didot", uso: "Geometría pura, líneas limpias" },
  { nombre: "Wabi-Sabi", principal: "EB Garamond", secundaria: "Nunito Light", acento: "Caveat", uso: "Imperfección bella, zen" },
]));

content.push(heading3("4.2.2 Estilo Vintage y Retro"));
content.push(para("Los pósters vintage evocan la estética de décadas pasadas y tienen un encanto nostálgico que atrae a amplios segmentos de mercado. Desde el estilo Art Deco de los años 20 hasta el psicodélico de los 70, cada época tiene su lenguaje tipográfico distintivo que los diseñadores deben dominar para crear autenticidad visual."));

content.push(fontFamilyTable([
  { nombre: "Art Deco 1920s", principal: "Poiret One", secundaria: "Playfair Display", acento: "Cinzel Decorative", uso: "Gatsby, jazz, años locos" },
  { nombre: "Mid-Century 1950s", principal: "Lobster", secundaria: "Josefin Sans", acento: "Pacifico", uso: "Mid-century, retro americano" },
  { nombre: "Groovy 1970s", principal: "Righteous", secundaria: "Fredoka One", acento: "Satisfy", uso: "Psicodelia, 70s, peace & love" },
  { nombre: "Neon 1980s", principal: "Bungee Shade", secundaria: "Syncopate", acento: "Monoton", uso: "Neón, synthwave, 80s" },
  { nombre: "Grunge 1990s", principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt", uso: "Grunge, alternativo, 90s" },
  { nombre: "Y2K 2000s", principal: "Audiowide", secundaria: "Orbitron", acento: "Press Start 2P", uso: "Y2K, cyber, early digital" },
]));

content.push(heading3("4.2.3 Estilo Motivacional y Quotes"));
content.push(para("Los pósters con frases motivacionales, citas célebres y aforismos filosóficos son un producto estrella en la decoración de hogares, oficinas y espacios de coworking. La tipografía debe ser legible, inspiradora y estéticamente coherente con el ambiente donde se exhibirá. Las combinaciones serif-sans serif son las más efectivas, proporcionando elegancia y claridad simultáneamente."));

content.push(fontFamilyTable([
  { nombre: "Quote Elegante", principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Great Vibes", uso: "Citas célebres, poesía" },
  { nombre: "Motivación Bold", principal: "Bebas Neue", secundaria: "Raleway", acento: "Sacramento", uso: "Frases de superación" },
  { nombre: "Filosofía Contemplativa", principal: "Cormorant Garamond", secundaria: "Lora", acento: "Allura", uso: "Filosofía, reflexión, sabiduría" },
  { nombre: "Emprendimiento Moderno", principal: "Montserrat Black", secundaria: "Source Sans Pro", acento: "Dancing Script", uso: "Startups, emprendimiento" },
  { nombre: "Wellness y Self-Care", principal: "Nunito", secundaria: "Quicksand", acento: "Caveat", uso: "Bienestar, autocuidado, mindfulness" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 5: TIPOGRAFÍA PARA FUNDAS Y ACCESORIOS TECH
// ============================================================
content.push(heading1("Capítulo 5: Tipografía para Fundas de Teléfono y Accesorios Tech"));

content.push(heading2("5.1 Desafíos Tipográficos en Pequeños Formatos"));
content.push(para("Las fundas de teléfono, las carcasas de laptop, los mousepads y los stickers tech representan una categoría de productos donde el espacio disponible para el diseño es extremadamente limitado. Una funda de iPhone típica ofrece un área imprimible de apenas 6 por 12 centímetros, y parte de esa superficie está ocupada por la cámara y otros elementos estructurales. Esto significa que la tipografía debe ser ultraconcisa, de alto impacto y extremadamente legible en tamaños pequeños. Las fuentes con trazos gruesos, generosos contadores y amplio interletraje son las únicas que funcionan consistentemente en estos formatos."));

content.push(para("En el caso de los stickers y pegatinas, el desafío se intensifica porque los stickers más populares miden entre 3 y 8 centímetros en su dimensión mayor. Las fuentes display con personalidad fuerte y trazos gruesos son las únicas viables, ya que las fuentes delicadas o con detalles finos se vuelven ilegibles a estos tamaños. La regla de oro para accesorios tech es: menos texto, fuentes más gruesas, mayor contraste."));

content.push(heading2("5.2 Familias Tipográficas para Productos Tech"));

content.push(fontFamilyTable([
  { nombre: "Tech Minimalista", principal: "SF Pro Display", secundaria: "Inter", acento: "JetBrains Mono", uso: "Fundas minimal, Apple style" },
  { nombre: "Hacker / Cyberpunk", principal: "Orbitron", secundaria: "Source Code Pro", acento: "Audiowide", uso: "Hacking, cyberpunk, matrix" },
  { nombre: "Retro Gaming", principal: "Press Start 2P", secundaria: "VT323", acento: "Silkscreen", uso: "Pixel art, retro gaming" },
  { nombre: "Código y Dev Life", principal: "Fira Code", secundaria: "IBM Plex Mono", acento: "Space Mono", uso: "Desarrolladores, programación" },
  { nombre: "Gen Z Aesthetic", principal: "Space Grotesk", secundaria: "Outfit", acento: "Syne", uso: "Estética Gen Z, futuro" },
  { nombre: "Neon Glow", principal: "Bungee Shade", secundaria: "Righteous", acento: "Monoton", uso: "Neón, nocturno, synthwave" },
  { nombre: "Stickers Kawaii", principal: "Fredoka One", secundaria: "Nunito Bold", acento: "Indie Flower", uso: "Kawaii, cute, adorable" },
  { nombre: "Stickers Sarcásticos", principal: "Bebas Neue", secundaria: "Impact", acento: "Permanent Marker", uso: "Humor, sarcasmo, actitud" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 6: TIPOGRAFÍA PARA TOTE BAGS Y BOLSAS
// ============================================================
content.push(heading1("Capítulo 6: Tipografía para Tote Bags y Bolsas de Tela"));

content.push(heading2("6.1 Consideraciones para Diseño en Tela de Tote Bags"));
content.push(para("Las tote bags de tela de algodón o lona se han convertido en un producto de personalización extremadamente popular, tanto por su utilidad ecológica como por su valor como lienzo de expresión personal. La tela de las tote bags es generalmente más rugosa que la de las camisetas, lo que afecta la nitidez de la impresión, especialmente en serigrafía. Los trazos finos de las fuentes serif delicadas pueden perderse, mientras que las fuentes de trazos gruesos y las sans serif de peso medio a bold funcionan excepcionalmente bien. Además, las tote bags se observan a distancia media, como cuando alguien camina por la calle con la bolsa al hombro, lo que requiere que la tipografía sea legible a un metro o más de distancia."));

content.push(heading2("6.2 Familias Tipográficas por Nicho de Tote Bags"));

content.push(heading3("6.2.1 Nicho: Eco y Sostenibilidad"));
content.push(para("Las tote bags son el producto estrella del movimiento ecológico y sostenible. Los mensajes sobre cuidado del medio ambiente, reducción de plásticos y consumo responsable son los más populares en este formato. La tipografía debe transmitir naturalidad, conciencia y compromiso, optando por fuentes orgánicas y amigables."));

content.push(fontFamilyTable([
  { nombre: "Eco Natural", principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat", uso: "Medio ambiente, sostenibilidad" },
  { nombre: "Verde Urbano", principal: "Montserrat Bold", secundaria: "Nunito", acento: "Indie Flower", uso: "Eco urbano, zero waste" },
  { nombre: "Earth Tones", principal: "Cormorant Garamond", secundaria: "Raleway Light", acento: "Dancing Script", uso: "Naturaleza, orgánico, earthy" },
  { nombre: "Activismo Climático", principal: "Bebas Neue", secundaria: "Oswald", acento: "Rock Salt", uso: "Protesta, activismo, urgencia" },
]));

content.push(heading3("6.2.2 Nicho: Librerías y Lectura"));
content.push(para("Las tote bags para librerías y amantes de la lectura son un mercado enorme y fiel. Las frases sobre libros, lectura y literatura funcionan especialmente bien en tote bags porque el producto es utilizado frecuentemente para llevar libros. Las tipografías literarias y editoriales son la elección natural."));

content.push(fontFamilyTable([
  { nombre: "Bookworm Clásico", principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Great Vibes", uso: "Amantes de libros, clásicos" },
  { nombre: "Bibliophile Moderno", principal: "Playfair Display", secundaria: "Source Serif Pro", acento: "Caveat", uso: "Lectores contemporáneos" },
  { nombre: "Libros y Café", principal: "Lora", secundaria: "Quicksand", acento: "Pacifico", uso: "Books + coffee aesthetic" },
  { nombre: "Feminista Literario", principal: "Bodoni Moda", secundaria: "Libre Baskerville", acento: "Allura", uso: "Feminismo, literatura de mujeres" },
]));

content.push(heading3("6.2.3 Nicho: Moda y Estilo Personal"));
content.push(para("Las tote bags de moda funcionan como accesorios de estilo tanto como productos funcionales. Los mensajes de empoderamiento, las frases sobre moda y los lemas de actitud personal son los más vendidos. La tipografía debe reflejar tendencia y sofisticación."));

content.push(fontFamilyTable([
  { nombre: "Fashion Forward", principal: "Didot", secundaria: "Futura", acento: "Sacramento", uso: "Moda, estilo, pasarela" },
  { nombre: "Street Style", principal: "Bebas Neue", secundaria: "Anton", acento: "Brush Script MT", uso: "Streetwear, urbano, hype" },
  { nombre: "Chic Parisino", principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Allura", uso: "Elegancia francesa, chic" },
  { nombre: "Girl Power", principal: "Montserrat Black", secundaria: "Dancing Script", acento: "Satisfy", uso: "Empoderamiento femenino" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 7: TIPOGRAFÍA PARA HOODIES Y SUDADERAS
// ============================================================
content.push(heading1("Capítulo 7: Tipografía para Hoodies y Sudaderas"));

content.push(heading2("7.1 Tipografía en Gran Formato Textil"));
content.push(para("Los hoodies y las sudaderas ofrecen el lienzo textil más grande entre los productos de personalización populares. Mientras que una camiseta estándar ofrece un área de impresión frontal de aproximadamente 30 por 35 centímetros, un hoodie puede albergar diseños de hasta 40 por 50 centímetros en el frontal, además de la zona de la espalda que es aún más amplia. Este formato generoso permite tipografías de mayor escala, diseños tipográficos más complejos y combinaciones de múltiples fuentes que en camisetas resultarían saturadas."));
content.push(para("Sin embargo, el tejido de los hoodies es típicamente más grueso que el de las camisetas, con una superficie interior afelpada que puede afectar la definición de la impresión, especialmente en DTG. Las técnicas más recomendadas para tipografía nítida en hoodies son la serigrafía para producciones medianas y grandes, el DTF para producciones pequeñas con alta calidad, y el bordado para elementos tipográficos de impacto como logos y títulos cortos."));

content.push(heading2("7.2 Familias Tipográficas por Estilo de Hoodie"));

content.push(fontFamilyTable([
  { nombre: "Streetwear Urbano", principal: "Bebas Neue", secundaria: "Anton", acento: "Permanent Marker", uso: "Streetwear, urbano, hip-hop" },
  { nombre: "Skater Culture", principal: "Bangers", secundaria: "Rock Salt", acento: "Gochi Hand", uso: "Skate, surf, board sports" },
  { nombre: "Universitario / College", principal: "College Block", secundaria: "Futura Bold", acento: "Russo One", uso: "Universidades, fraternidades" },
  { nombre: "Gothic / Dark Aesthetic", principal: "UnifrakturMaguntia", secundaria: "Cinzel", acento: "Nosifer", uso: "Gótico, dark, alternative" },
  { nombre: "Cozy / Comfort", principal: "Nunito Bold", secundaria: "Quicksand", acento: "Dancing Script", uso: "Confort, acogedor, hygge" },
  { nombre: "Techwear / Cyberpunk", principal: "Orbitron", secundaria: "Share Tech Mono", acento: "Audiowide", uso: "Techwear, futurista, cyber" },
  { nombre: "Vintage Sports", principal: "Russo One", secundaria: "Oswald", acento: "Bungee", uso: "Deporte vintage, retro athletic" },
  { nombre: "Music / Band", principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt", uso: "Bandas, música, conciertos" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 8: TIPOGRAFÍA PARA PRODUCTOS DE HOGAR
// ============================================================
content.push(heading1("Capítulo 8: Tipografía para Productos de Hogar"));

content.push(heading2("8.1 Cojines, Mantas y Decoración Textil"));
content.push(para("Los productos de decoración del hogar personalizados, como cojines, mantas, cortinas y manteles, representan un segmento de mercado en crecimiento acelerado. La tipografía para productos de hogar debe integrarse armónicamente con la decoración existente del espacio, lo que significa que debe ser más sutil, elegante y versátil que la tipografía para productos de uso personal como camisetas o tazas. Los consumidores buscan tipografías que complementen la estética de su hogar, no que la dominen."));

content.push(heading2("8.2 Familias Tipográficas para Cojines"));

content.push(fontFamilyTable([
  { nombre: "Cojín Elegante", principal: "Playfair Display", secundaria: "Lora", acento: "Great Vibes", uso: "Salón, dormitorio elegante" },
  { nombre: "Cojín Boho", principal: "Cormorant Garamond", secundaria: "Raleway", acento: "Caveat", uso: "Bohemio, indie, artístico" },
  { nombre: "Cojín Kids", principal: "Fredoka One", secundaria: "Nunito", acento: "Indie Flower", uso: "Infantil, niños, guardería" },
  { nombre: "Cojín Navideño", principal: "Mountains of Christmas", secundaria: "Crimson Text", acento: "Sacramento", uso: "Navidad, festivo, acogedor" },
  { nombre: "Cojín Minimalista", principal: "Montserrat Thin", secundaria: "Futura Light", acento: "Didot", uso: "Minimalismo, escandinavo" },
]));

content.push(heading2("8.3 Familias Tipográficas para Mantas y Textiles de Hogar"));

content.push(fontFamilyTable([
  { nombre: "Manta Familiar", principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Dancing Script", uso: "Family, hogar, apellidos" },
  { nombre: "Manta Bohemia", principal: "Sacramento", secundaria: "Lora Italic", acento: "Allura", uso: "Boho, artesanal, tejido" },
  { nombre: "Manta Deportiva", principal: "Bebas Neue", secundaria: "Oswald", acento: "Russo One", uso: "Equipos, deportes, afición" },
  { nombre: "Manta Personalizada", principal: "Playfair Display", secundaria: "Montserrat", acento: "Satisfy", uso: "Nombres, fechas, regalos" },
]));

content.push(heading2("8.4 Tipografía para Alfombras y Decoración de Pared"));
content.push(para("Las alfombras personalizadas y los cuadros decorativos representan productos de mayor valor y ticket medio en el mercado de personalización. La tipografía en estos productos debe ser especialmente cuidadosa ya que son elementos de decoración semipermanentes que el cliente vivirá con ellos durante años. Las combinaciones tipográficas deben ser atemporales, elegantes y versátiles."));

content.push(fontFamilyTable([
  { nombre: "Letrero Decorativo", principal: "Bebas Neue", secundaria: "Montserrat Light", acento: "Dancing Script", uso: "Letreros, señales decorativas" },
  { nombre: "Cuadro Inspiracional", principal: "Cormorant Garamond", secundaria: "EB Garamond", acento: "Allura", uso: "Cuadros, láminas, quotes" },
  { nombre: "Alfombra Vintage", principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy", uso: "Alfombras, decoración retro" },
  { nombre: "Wall Art Moderno", principal: "Futura Bold", secundaria: "Avenir Next", acento: "Didot", uso: "Arte mural, moderno, galería" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 9: TIPOGRAFÍA PARA PRODUCTOS DE OFICINA Y ESCUELA
// ============================================================
content.push(heading1("Capítulo 9: Tipografía para Productos de Oficina y Escuela"));

content.push(heading2("9.1 Cuadernos, Agendas y Material Escolar"));
content.push(para("Los cuadernos personalizados, las agendas, los planificadores y el material escolar representan un mercado estacional con picos masivos durante la temporada de vuelta a clases. La tipografía para estos productos debe ser funcional, inspiradora y apropiada para la edad del público objetivo. Los cuadernos para niños usan fuentes redondeadas y amigables, mientras que las agendas profesionales requieren tipografías limpias y sofisticadas."));

content.push(heading2("9.2 Familias Tipográficas por Tipo de Producto"));

content.push(fontFamilyTable([
  { nombre: "Agenda Profesional", principal: "Montserrat", secundaria: "Lora", acento: "Playfair Display", uso: "Agendas ejecutivas, planner" },
  { nombre: "Cuaderno Creativo", principal: "Quicksand Bold", secundaria: "Nunito", acento: "Caveat", uso: "Cuadernos de arte, creativos" },
  { nombre: "Planificador Bullet", principal: "Raleway", secundaria: "Source Sans Pro", acento: "Dancing Script", uso: "Bullet journal, planner" },
  { nombre: "Cuaderno Infantil", principal: "Fredoka One", secundaria: "Baloo 2", acento: "Gochi Hand", uso: "Niños, escuela primaria" },
  { nombre: "Libreta Universitaria", principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Sacramento", uso: "Universitarios, gradación" },
  { nombre: "Sticker Planner", principal: "Lobster", secundaria: "Pacifico", acento: "Indie Flower", uso: "Stickers para agenda, planner" },
]));

content.push(heading2("9.3 Tipografía para Material Escolar por Edad"));

content.push(simpleTable(
  ["Rango de Edad", "Fuente Principal", "Fuente Secundaria", "Fuente Acento", "Características"],
  [
    ["3-5 años (Preescolar)", "Fredoka One", "Baloo 2", "Gochi Hand", "Redondeada, gruesa, amigable"],
    ["6-8 años (Primaria baja)", "Nunito Bold", "Quicksand", "Indie Flower", "Legible, divertida, clara"],
    ["9-12 años (Primaria alta)", "Nunito", "Raleway", "Caveat", "Más madura, aún divertida"],
    ["13-17 años (Secundaria)", "Montserrat", "Lato", "Dancing Script", "Moderna, cool, identitaria"],
    ["18-25 años (Universidad)", "Playfair Display", "Montserrat Light", "Sacramento", "Elegante, aspiracional"],
  ]
));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 10: TIPOGRAFÍA PARA ACCESORIOS Y PRODUCTOS ESPECIALES
// ============================================================
content.push(heading1("Capítulo 10: Tipografía para Accesorios y Productos Especiales"));

content.push(heading2("10.1 Gorras, Sombreros y Accesorios de Moda"));
content.push(para("Las gorras y sombreros personalizados son productos de alto valor en el mercado de merchandising, especialmente para marcas, eventos deportivos y música. El área de impresión o bordado en una gorra es muy limitada, generalmente un rectángulo de 5 por 10 centímetros en el panel frontal, lo que exige fuentes ultracondensadas, de alto impacto y excelente legibilidad en pequeño formato. El bordado es la técnica dominante en gorras, lo que descarta fuentes con detalles excesivamente finos."));

content.push(fontFamilyTable([
  { nombre: "Gorra Deportiva", principal: "College Block", secundaria: "Futura Bold", acento: "Russo One", uso: "Deportes, equipos, athletic" },
  { nombre: "Gorra Streetwear", principal: "Bebas Neue", secundaria: "Anton", acento: "Impact", uso: "Urbano, streetwear, hype" },
  { nombre: "Gorra Vintage", principal: "Russo One", secundaria: "Oswald", acento: "Bungee", uso: "Retro, vintage sports" },
  { nombre: "Gorra Music / Band", principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt", uso: "Bandas, conciertos, festivos" },
]));

content.push(heading2("10.2 Imanes, Llaveros y Mini Productos"));
content.push(para("Los imanes de nevera, los llaveros y otros productos miniatura tienen áreas de impresión diminutas, a menudo menores a 5 centímetros cuadrados. La tipografía para estos productos debe ser extremadamente simple y contundente: una o dos palabras máximo, fuentes de peso bold o black, y altísimo contraste con el fondo. Cualquier sutileza tipográfica se pierde a estos tamaños."));

content.push(fontFamilyTable([
  { nombre: "Imán Recuerdo", principal: "Pacifico", secundaria: "Montserrat Bold", acento: "Satisfy", uso: "Recuerdos, souvenirs, viajes" },
  { nombre: "Llavero Divertido", principal: "Bebas Neue", secundaria: "Impact", acento: "Comic Neue Bold", uso: "Humor, regalos, llaveros" },
  { nombre: "Imán Navideño", principal: "Mountains of Christmas", secundaria: "Lora", acento: "Great Vibes", uso: "Navidad, adornos, festivo" },
  { nombre: "Mini Sticker", principal: "Bangers", secundaria: "Fredoka One", acento: "Gochi Hand", uso: "Stickers pequeños, pegatinas" },
]));

content.push(heading2("10.3 Pines, Parches y Bordados"));
content.push(para("Los pines esmaltados, los parches de tela bordados y las insignias son productos donde la tipografía debe simplificarse a su expresión más esencial. En un pin de 2.5 centímetros, las letras deben tener un mínimo de 3 milímetros de altura para ser legibles, y los trazos deben tener al menos 0.5 milímetros de grosor. Las fuentes sans serif de peso bold son las más adecuadas, y los textos deben limitarse a 1-3 palabras."));

content.push(fontFamilyTable([
  { nombre: "Pin Esencial", principal: "Futura Bold", secundaria: "Montserrat Black", acento: "Bebas Neue", uso: "Pines, insignias, badges" },
  { nombre: "Parche Bordado", principal: "College Block", secundaria: "Russo One", acento: "Bungee", uso: "Parches, military style" },
  { nombre: "Pin Vintage", principal: "Cooper Black", secundaria: "Rockwell", acento: "Rye", uso: "Pines retro, vintage" },
  { nombre: "Parche Music", principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt", uso: "Bandas, música, festivales" },
]));

content.push(heading2("10.4 Tarjetas, Invitaciones y Papelería"));
content.push(para("Las tarjetas de visita personalizadas, las invitaciones, los save-the-date y la papelería de eventos son productos donde la tipografía alcanza su máxima expresión de sofisticación y detalle. El soporte de papel de alta calidad permite reproducción tipográfica de extrema fidelidad, lo que habilita el uso de fuentes delicadas con detalles finos que en otros productos serían inviables."));

content.push(fontFamilyTable([
  { nombre: "Boda Clásica", principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Allura", uso: "Invitaciones de boda clásicas" },
  { nombre: "Boda Moderna", principal: "Montserrat Thin", secundaria: "Playfair Display", acento: "Sacramento", uso: "Bodas modernas, minimalistas" },
  { nombre: "Invitación Fiesta", principal: "Lobster", secundaria: "Quicksand Bold", acento: "Pacifico", uso: "Fiestas, cumpleaños, celebración" },
  { nombre: "Tarjeta Corporativa", principal: "Helvetica Neue", secundaria: "Garamond", acento: "Futura", uso: "Corporativo, networking" },
  { nombre: "Baby Shower", principal: "Dancing Script", secundaria: "Nunito", acento: "Indie Flower", uso: "Baby shower, nacimiento" },
  { nombre: "Graduation", principal: "Playfair Display", secundaria: "Montserrat", acento: "Satisfy", uso: "Graduación, logro académico" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 11: TIPOGRAFÍA PARA PRODUCTOS DE SUBIMACIÓN
// ============================================================
content.push(heading1("Capítulo 11: Tipografía para Productos de Sublimación"));

content.push(heading2("11.1 Ventajas de la Sublimación para Tipografía"));
content.push(para("La sublimación es la técnica de impresión que ofrece la mayor fidelidad de reproducción tipográfica entre todos los métodos disponibles para personalización de productos. Al transferir la tinta directamente al sustrato polimérico mediante calor, la sublimación produce bordes nítidos, gradientes suaves y colores vibrantes que hacen justicia incluso a las fuentes más delicadas y detalladas. Esto la convierte en la técnica ideal para productos que requieren tipografía fina, script caligráficas elaboradas y texto de pequeño tamaño con alta legibilidad."));

content.push(para("Los productos de sublimación más populares incluyen tazas de cerámica con recubrimiento polimérico, camisetas de poliéster, puzzle personalizados, alfombrillas de ratón, placas de metal decorativas, cojines de poliéster y tablas de cortar. Cada uno de estos productos tiene características de superficie diferentes que influyen en la selección tipográfica óptima."));

content.push(heading2("11.2 Familias Tipográficas para Productos de Sublimación"));

content.push(fontFamilyTable([
  { nombre: "Taza Sublimada Premium", principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Great Vibes", uso: "Tazas de alta calidad, fotos" },
  { nombre: "Puzzle Personalizado", principal: "Cormorant Garamond", secundaria: "Raleway", acento: "Allura", uso: "Puzzles con nombres, fechas" },
  { nombre: "Alfombrilla Mouse", principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide", uso: "Gaming, oficina, tech" },
  { nombre: "Placa Metal Decorativa", principal: "Cinzel", secundaria: "EB Garamond", acento: "Sacramento", uso: "Placas, premios, conmemorativos" },
  { nombre: "Camiseta Poliéster", principal: "Montserrat Bold", secundaria: "Lato", acento: "Dancing Script", uso: "Sublimación textil, deporte" },
  { nombre: "Tabla de Cortar", principal: "Playfair Display", secundaria: "Lora", acento: "Satisfy", uso: "Cocina, gastronomía, chef" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 12: COMBINACIONES TIPOGRÁFICAS POR TEMÁTICA DE DISEÑO
// ============================================================
content.push(heading1("Capítulo 12: Combinaciones Tipográficas por Temática de Diseño"));

content.push(heading2("12.1 Temática: Amor y Romance"));
content.push(para("Los diseños de temática amorosa y romántica son vendidos durante todo el año pero experimentan picos masivos en San Valentín, aniversarios y temporadas de bodas. La tipografía romántica se caracteriza por el uso predominante de fuentes script caligráficas, combinadas con serif elegantes para crear una estética sofisticada y emocional. Las claves del éxito en este nicho son la elegancia sin ostentación, la legibilidad emocional y la capacidad de transmitir intimidad."));

content.push(fontFamilyTable([
  { nombre: "Amor Eterno", principal: "Great Vibes", secundaria: "Cormorant Garamond", acento: "Sacramento", uso: "Bodas, aniversarios, amor eterno" },
  { nombre: "Romance Moderno", principal: "Playfair Display", secundaria: "Montserrat Light", acento: "Dancing Script", uso: "Parejas modernas, San Valentín" },
  { nombre: "Love Vintage", principal: "Allura", secundaria: "Lora", acento: "Satisfy", uso: "Vintage, retro love, nostalgia" },
  { nombre: "Cute Love", principal: "Pacifico", secundaria: "Quicksand Bold", acento: "Indie Flower", uso: "Kawaii love, adorable, teen" },
  { nombre: "Passionate Bold", principal: "Bebas Neue", secundaria: "Raleway", acento: "Great Vibes", uso: "Amor intenso, pasión, bold" },
]));

content.push(heading2("12.2 Temática: Naturaleza y Aire Libre"));
content.push(para("Los diseños inspirados en la naturaleza, el montañismo, el senderismo y las actividades al aire libre requieren tipografías que transmitan aventura, libertad y conexión con el entorno natural. Las fuentes con personalidad rústica, orgánica o aventurera son las más efectivas, combinadas con sans serif robustas que resistan la test del estilo de vida activo."));

content.push(fontFamilyTable([
  { nombre: "Montaña y Aventura", principal: "Bebas Neue", secundaria: "Oswald", acento: "Rock Salt", uso: "Montañismo, hiking, outdoors" },
  { nombre: "Naturaleza Orgánica", principal: "Playfair Display", secundaria: "Lora Italic", acento: "Caveat", uso: "Naturaleza, botánica, orgánico" },
  { nombre: "Camping Rústico", principal: "Rye", secundaria: "Archer", acento: "Gochi Hand", uso: "Camping, cabaña, rústico" },
  { nombre: "Ocean y Surf", principal: "Pacifico", secundaria: "Quicksand", acento: "Lobster", uso: "Surf, playa, océano" },
  { nombre: "Wildlife", principal: "Bungee", secundaria: "Anton", acento: "Permanent Marker", uso: "Fauna, vida silvestre, safaris" },
]));

content.push(heading2("12.3 Temática: Ciencia y Tecnología"));
content.push(para("La temática científica y tecnológica abarca desde la astronomía y la física hasta la programación y la inteligencia artificial. Las fuentes para este nicho deben comunicar precisión, innovación y conocimiento. Las sans serif geométricas y las monospace son las protagonistas indiscutibles, complementadas con fuentes display futuristas para títulos de impacto."));

content.push(fontFamilyTable([
  { nombre: "Ciencia Pura", principal: "Futura", secundaria: "Avenir Next", acento: "Didot", uso: "Ciencia, laboratorio, investigación" },
  { nombre: "Espacio y Astronomía", principal: "Orbitron", secundaria: "Exo 2", acento: "Audiowide", uso: "Espacio, NASA, astronomía" },
  { nombre: "IA y Futuro", principal: "Space Grotesk", secundaria: "Inter", acento: "Syne", uso: "Inteligencia artificial, futuro" },
  { nombre: "Código y Dev", principal: "JetBrains Mono", secundaria: "Fira Code", acento: "Source Code Pro", uso: "Programación, developers, code" },
  { nombre: "Robótica", principal: "Audiowide", secundaria: "Orbitron", acento: "Share Tech Mono", uso: "Robótica, automatización, meca" },
]));

content.push(heading2("12.4 Temática: Deportes y Fitness"));
content.push(para("Los diseños deportivos y de fitness necesitan tipografías que transmitan energía, fuerza, velocidad y determinación. Las fuentes condensed sans serif de peso bold son las más efectivas, ya que su compactación horizontal evoca velocidad y su grosor transmite potencia. Las fuentes display con personalidad atlética complementan perfectamente los diseños de equipos y competiciones."));

content.push(fontFamilyTable([
  { nombre: "Gym y Fitness", principal: "Bebas Neue", secundaria: "Oswald", acento: "Anton", uso: "Gimnasio, pesas, CrossFit" },
  { nombre: "Running y Maratón", principal: "Montserrat Black", secundaria: "Roboto Condensed", acento: "Russo One", uso: "Carreras, maratones, running" },
  { nombre: "Fútbol / Soccer", principal: "College Block", secundaria: "Futura Bold", acento: "Bungee", uso: "Fútbol, equipos, hinchada" },
  { nombre: "Basketball", principal: "Impact", secundaria: "Anton", acento: "Bebas Neue", uso: "Baloncesto, NBA style" },
  { nombre: "Yoga y Pilates", principal: "Cormorant Garamond", secundaria: "Raleway Light", acento: "Allura", uso: "Yoga, pilates, serenidad" },
  { nombre: "Surf y Board", principal: "Pacifico", secundaria: "Quicksand", acento: "Lobster", uso: "Surf, skateboard, board" },
]));

content.push(heading2("12.5 Temática: Comida y Bebida"));
content.push(para("La temática gastronómica es increiblemente diversa, desde la repostería artesanal hasta la cultura del café, desde la cerveza artesanal hasta la alta cocina. Cada sub-nicho tiene su lenguaje tipográfico propio, pero todos comparten la necesidad de despertar el apetito visual y transmitir la personalidad del producto o experiencia culinaria."));

content.push(fontFamilyTable([
  { nombre: "Café y Baristas", principal: "Playfair Display", secundaria: "Lora", acento: "Pacifico", uso: "Cafeterías, baristas, coffee" },
  { nombre: "Repostería y Bakery", principal: "Lobster", secundaria: "Quicksand Bold", acento: "Satisfy", uso: "Pasteles, cupcakes, bakery" },
  { nombre: "Cerveza Artesanal", principal: "Rye", secundaria: "Playfair Display", acento: "Great Vibes", uso: "Craft beer, cerveza, brew" },
  { nombre: "Vino y Enoturismo", principal: "Cinzel", secundaria: "Cormorant Garamond", acento: "Allura", uso: "Vino, viñedos, enología" },
  { nombre: "BBQ y Grill", principal: "Bebas Neue", secundaria: "Rockwell", acento: "Rock Salt", uso: "Barbacoa, grill, ahumado" },
  { nombre: "Vegano y Orgánico", principal: "Nunito", secundaria: "Raleway Light", acento: "Caveat", uso: "Vegano, orgánico, plant-based" },
]));

content.push(heading2("12.6 Temática: Viajes y Aventura"));
content.push(para("Los diseños de viajes y aventuras evocan la emoción de explorar nuevos destinos, la libertad de la carretera y la nostalgia de los recuerdos de viaje. La tipografía viajera combina elementos de letrería vintage de aeropuertos y estaciones con script caligráficas que evocan diarios de viaje y postales escritas a mano."));

content.push(fontFamilyTable([
  { nombre: "Travel Vintage", principal: "Rye", secundaria: "Playfair Display", acento: "Satisfy", uso: "Viajes retro, postales vintage" },
  { nombre: "Road Trip", principal: "Bebas Neue", secundaria: "Oswald", acento: "Rock Salt", uso: "Carretera, road trip, USA" },
  { nombre: "Wanderlust", principal: "Great Vibes", secundaria: "Montserrat Light", acento: "Caveat", uso: "Wanderlust, explorar, mundo" },
  { nombre: "Aviación y Vuelos", principal: "Futura Bold", secundaria: "Avenir Next", acento: "Orbitron", uso: "Aviación, aeropuertos, vuelos" },
  { nombre: "Mapas y Cartografía", principal: "Cinzel", secundaria: "EB Garamond", acento: "Sacramento", uso: "Mapas, cartografía, exploración" },
]));

content.push(heading2("12.7 Temática: Arte y Cultura"));
content.push(para("Los diseños artísticos y culturales abarcan desde el arte clásico y la historia del arte hasta los movimientos contemporáneos, la street art y la cultura urbana. La tipografía para este nicho debe ser culta, expresiva y visualmente sofisticada, capaz de dialogar con el contenido artístico del diseño."));

content.push(fontFamilyTable([
  { nombre: "Galería y Arte Clásico", principal: "Didot", secundaria: "Garamond", acento: "Cormorant Garamond", uso: "Museos, galerías, arte clásico" },
  { nombre: "Street Art / Graffiti", principal: "Permanent Marker", secundaria: "Bebas Neue", acento: "Rock Salt", uso: "Graffiti, urbano, street art" },
  { nombre: "Art Nouveau", principal: "Cinzel Decorative", secundaria: "Playfair Display", acento: "Great Vibes", uso: "Art Nouveau, modernismo" },
  { nombre: "Art Deco", principal: "Poiret One", secundaria: "Josefin Sans", acento: "Cinzel", uso: "Art Deco, años 20, Gatsby" },
  { nombre: "Pop Art", principal: "Bangers", secundaria: "Impact", acento: "Comic Neue Bold", uso: "Pop art, Warhol, cómic" },
  { nombre: "Minimalismo Artístico", principal: "Futura Light", secundaria: "Helvetica Neue", acento: "Didot", uso: "Arte minimal, contemporáneo" },
]));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 13: GUÍA DE COMBINACIONES UNIVERSALES
// ============================================================
content.push(heading1("Capítulo 13: Guía de Combinaciones Universales"));

content.push(heading2("13.1 Las 20 Combinaciones Tipográficas Más Efectivas"));
content.push(para("Después de analizar cientos de combinaciones tipográficas aplicadas a productos personalizados, hemos identificado las veinte combinaciones más versátiles, efectivas y comerciales. Estas combinaciones funcionan en múltiples productos, nichos y temáticas, y constituyen un arsenal tipográfico que todo diseñador de productos personalizados debería dominar. Cada combinación incluye una fuente display para titulares, una fuente secundaria para textos complementarios, y una fuente de acento para detalles decorativos."));

content.push(simpleTable(
  ["#", "Combinación", "Titular", "Secundaria", "Acento", "Mejor Para"],
  [
    ["1", "Clásica Elegante", "Playfair Display Bold", "Montserrat Light", "Great Vibes", "Bodas, lujo, premium"],
    ["2", "Moderna Bold", "Bebas Neue", "Montserrat", "Sacramento", "Motivación, hustle, deportes"],
    ["3", "Minimalista Refinada", "Montserrat Thin", "Playfair Display", "Cormorant Garamond", "Diseño, decoración, arte"],
    ["4", "Vintage Cálida", "Rye", "Lora", "Satisfy", "Retro, artesanal, nostalgia"],
    ["5", "Tech Futurista", "Orbitron", "Inter", "Audiowide", "Tecnología, gaming, IA"],
    ["6", "Romántica Clásica", "Great Vibes", "Cormorant Garamond", "Sacramento", "Bodas, San Valentín, amor"],
    ["7", "Urbana Contundente", "Anton", "Oswald", "Rock Salt", "Streetwear, hip-hop, urbano"],
    ["8", "Natural Orgánica", "Playfair Display", "Lora Italic", "Caveat", "Eco, naturaleza, orgánico"],
    ["9", "Deportiva Dinámica", "Bebas Neue", "Roboto Condensed", "Russo One", "Deportes, gym, competición"],
    ["10", "Divertida Amigable", "Fredoka One", "Nunito Bold", "Gochi Hand", "Niños, kawaii, diversión"],
    ["11", "Literaria Sofisticada", "Cormorant Garamond", "EB Garamond", "Allura", "Libros, poesía, editorial"],
    ["12", "Retro Gaming", "Press Start 2P", "VT323", "Silkscreen", "Gaming, pixel, retro digital"],
    ["13", "Art Deco Lujo", "Poiret One", "Josefin Sans", "Cinzel Decorative", "Años 20, Gatsby, lujo"],
    ["14", "Grunge Rebelde", "Permanent Marker", "Bebas Neue", "Rock Salt", "Rock, grunge, alternativa"],
    ["15", "Boho Artesanal", "Sacramento", "Raleway Light", "Indie Flower", "Boho, artesanal, handmade"],
    ["16", "Corporate Profesional", "Helvetica Neue", "Merriweather", "Montserrat", "Empresa, corporativo, B2B"],
    ["17", "Festiva Navideña", "Mountains of Christmas", "Crimson Text", "Great Vibes", "Navidad, fiestas, invierno"],
    ["18", "Halloween Terror", "Creepster", "Bangers", "Nosifer", "Halloween, terror, spooky"],
    ["19", "Feminista Empoderada", "Montserrat Black", "Playfair Display", "Dancing Script", "Girl power, feminismo"],
    ["20", "Code Developer", "JetBrains Mono", "Inter", "Space Mono", "Programación, dev, IT"],
  ]
));

content.push(heading2("13.2 Reglas de Combinación"));
content.push(para("Para crear combinaciones tipográficas efectivas que funcionen en productos personalizados, es fundamental seguir un conjunto de reglas probadas por diseñadores profesionales. La primera regla es el contraste claro: nunca combines dos fuentes de la misma categoría. Si el titular es serif, la secundaria debe ser sans serif, y viceversa. Combinar dos serif o dos sans serif similares genera monotonia visual y falta de jerarquía."));
content.push(para("La segunda regla es la proporción: la fuente titular debe ser al menos el doble de grande que la secundaria, y la secundaria al menos un 50 por ciento más grande que la de acento. Esta proporción 4:2:1 garantiza una jerarquía visual clara. La tercera regla es la coherencia de personalidad: aunque las fuentes deben contrastar en estructura, deben compartir una cualidad emocional. Una fuente Playfair Display y una Montserrat comparten la modernidad a pesar de ser de categorías diferentes, mientras que Playfair Display y Impact comparten la contundencia pero chocan en elegancia."));
content.push(para("La cuarta regla es la limitación: nunca uses más de tres fuentes en un diseño de producto personalizado. La abundancia tipográfica genera caos visual y diluye el impacto del mensaje. Si necesitas más variedad, trabaja con variaciones de peso de las mismas fuentes: regular, bold, italic, condensed. La quinta regla es la prueba en contexto: siempre verifica la combinación tipográfica en el producto final, no solo en pantalla. La misma combinación que funciona perfectamente en un mockup digital puede perder legibilidad impresa sobre tela oscura o perder elegancia en una taza de cerámica."));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 14: TIPOGRAFÍA Y COLOR
// ============================================================
content.push(heading1("Capítulo 14: Tipografía y Color en Productos Personalizados"));

content.push(heading2("14.1 La Interacción entre Fuente y Color"));
content.push(para("La selección tipográfica y la paleta cromática no son decisiones independientes: interactúan profundamente para determinar la legibilidad, el impacto emocional y la coherencia visual de un diseño de producto personalizado. Una fuente elegante como Playfair Display puede parecer sofisticada en dorado sobre negro, pretenciosa en rojo sobre blanco, o invisible en gris claro sobre blanco. El color transforma la percepción de la tipografía tanto como la tipografía transforma la percepción del color."));
content.push(para("El contraste entre el color del texto y el color del fondo es el factor más crítico para la legibilidad. El estándar WCAG 2.1 recomienda una ratio de contraste mínima de 4.5:1 para texto normal y 3:1 para texto grande. En productos personalizados, donde las condiciones de iluminación son impredecibles, se recomienda apuntar a contrastes aún mayores. Las combinaciones de alto contraste como blanco sobre negro, negro sobre blanco, y amarillo sobre azul oscuro son las más seguras y efectivas."));

content.push(heading2("14.2 Paletas Cromáticas por Familia Tipográfica"));

content.push(simpleTable(
  ["Familia Tipográfica", "Color Titular", "Color Secundario", "Color Acento", "Fondo Recomendado"],
  [
    ["Clásica Elegante", "Dorado #C4960C", "Negro #1B1B1B", "Burdeos #722F37", "Crema #F5F0E8"],
    ["Moderna Bold", "Blanco #FFFFFF", "Gris claro #E0E0E0", "Rojo #E74C3C", "Negro #1B1B1B"],
    ["Romántica", "Rosa #E8A0BF", "Burdeos #722F37", "Dorado #C4960C", "Blanco roto #FFF5F5"],
    ["Tech Futurista", "Cian #00D4FF", "Blanco #FFFFFF", "Neón verde #39FF14", "Negro #0A0A0A"],
    ["Vintage Cálida", "Marrón #8B4513", "Crema #D2B48C", "Terracota #CC5500", "Beige #F5F0E8"],
    ["Natural Orgánica", "Verde oscuro #2D5016", "Marrón #6B4423", "Mostaza #DAA520", "Blanco natural #FEFDF8"],
    ["Urbana", "Blanco #FFFFFF", "Amarillo #FFD700", "Rojo #FF0000", "Negro #1B1B1B"],
    ["Festiva Navideña", "Rojo #CC0000", "Verde #006600", "Dorado #FFD700", "Blanco / Crema"],
  ]
));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 15: RECURSOS Y HERRAMIENTAS
// ============================================================
content.push(heading1("Capítulo 15: Recursos y Herramientas Tipográficas"));

content.push(heading2("15.1 Plataformas de Fuentes Gratuitas con Licencia Comercial"));

content.push(simpleTable(
  ["Plataforma", "URL", "Fuentes Disponibles", "Licencia Típica", "Destacado"],
  [
    ["Google Fonts", "fonts.google.com", "1500+", "SIL OFL / Apache", "Montserrat, Playfair Display"],
    ["Font Squirrel", "fontsquirrel.com", "2000+", "Variadas (100% comercial)", "Bebas Neue, Kaushan Script"],
    ["DaFont", "dafont.com", "40000+", "Revisar individualmente", "Impact, Creepster"],
    ["1001 Fonts", "1001fonts.com", "30000+", "Variadas", "Pacifico, Lobster"],
    ["Font Space", "fontspace.com", "75000+", "Variadas", "Bangers, Gochi Hand"],
    ["The League of Moveable Type", "theleagueofmoveabletype.com", "50+", "SIL OFL", "League Gothic, Ostrich Sans"],
  ]
));

content.push(heading2("15.2 Plataformas de Fuentes Premium"));

content.push(simpleTable(
  ["Plataforma", "URL", "Rango de Precio", "Licencia", "Destacado"],
  [
    ["Adobe Fonts", "fonts.adobe.com", "Incluido en CC", "Comercial completa", "Futura, Helvetica Neue"],
    ["MyFonts", "myfonts.com", "$15-$200/fuente", "Comercial específica", "Bodoni, Didot"],
    ["Creative Market", "creativemarket.com", "$10-$50/fuente", "Comercial específica", "Packs de familias completas"],
    ["Fontspring", "fontspring.com", "$10-$200/fuente", "Comercial específica", "Fuentes de alta calidad"],
    ["Envato Elements", "elements.envato.com", "Suscripción mensual", "Comercial con suscripción", "Miles de fuentes incluidas"],
  ]
));

content.push(heading2("15.3 Herramientas de Combinación y Prueba Tipográfica"));

content.push(simpleTable(
  ["Herramienta", "URL", "Función", "Gratuito"],
  [
    ["Google Fonts Pairing", "fonts.google.com", "Combinaciones sugeridas por Google", "Sí"],
    ["Fontjoy", "fontjoy.com", "Combinaciones por IA con contraste", "Sí"],
    ["Typ.io", "typ.io", "Fuentes usadas en sitios reales", "Sí"],
    ["Type Scale", "typescale.com", "Calculadora de escala tipográfica", "Sí"],
    ["Wordmark.it", "wordmark.it", "Vista previa de tus fuentes instaladas", "Sí"],
    ["Font Pair", "fontpair.co", "Combinaciones de Google Fonts", "Sí"],
    ["Canva Font Combinations", "canva.com/font-combinations", "Combinaciones por estilo", "Freemium"],
    ["Coolors Font Pair", "coolors.co", "Combinaciones tipográficas + paletas", "Sí"],
  ]
));

content.push(heading2("15.4 Extensiones y Plugins Útiles"));
content.push(para("Para agilizar el flujo de trabajo tipográfico en el diseño de productos personalizados, existen varias extensiones y plugins que permiten identificar fuentes, probar combinaciones y mantener bibliotecas organizadas. La extensión WhatFont para Chrome permite identificar cualquier fuente en una página web con un solo clic. Font Identifier de Adobe captura fuentes de imágenes. Nexus Font organiza las fuentes instaladas en el sistema. Extensis Suitcase gestiona bibliotecas tipográficas profesionales con activación selectiva para no sobrecargar la memoria del sistema."));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 16: ANEXO - DIRECTORIO COMPLETO DE FUENTES
// ============================================================
content.push(heading1("Capítulo 16: Anexo - Directorio Completo de Fuentes por Categoría"));

content.push(heading2("16.1 Fuentes Serif Recomendadas"));

content.push(simpleTable(
  ["Fuente", "Categoría", "Licencia", "Pesos Disponibles", "Mejor Uso"],
  [
    ["Playfair Display", "Didone", "Google Fonts (OFL)", "Regular, Bold, Black, Italic", "Lujo, bodas, editorial"],
    ["Cormorant Garamond", "Garalde", "Google Fonts (OFL)", "300-700 + Italic", "Editorial, literatura, elegancia"],
    ["EB Garamond", "Garalde", "Google Fonts (OFL)", "Regular, Medium, Bold, Italic", "Clásico, literario, editorial"],
    ["Lora", "Transitional", "Google Fonts (OFL)", "Regular, Bold, Italic", "Cuerpo de texto, lectura, blogs"],
    ["Merriweather", "Transitional", "Google Fonts (OFL)", "300-900 + Italic", "Lectura en pantalla, artículos"],
    ["Libre Baskerville", "Transitional", "Google Fonts (OFL)", "Regular, Bold, Italic", "Web, editorial clásico"],
    ["Crimson Text", "Garalde", "Google Fonts (OFL)", "Regular, SemiBold, Bold, Italic", "Libros, academia, largo texto"],
    ["Bodoni Moda", "Didone", "Google Fonts (OFL)", "Regular, Bold, Italic", "Moda, lujo, alta costura"],
    ["Cinzel", "Display Serif", "Google Fonts (OFL)", "Regular, Bold, Black", "Premios, conmemorativos, clásicos"],
    ["Rye", "Slab Display", "Google Fonts (OFL)", "Regular", "Vintage, occidental, rústico"],
  ]
));

content.push(heading2("16.2 Fuentes Sans Serif Recomendadas"));

content.push(simpleTable(
  ["Fuente", "Categoría", "Licencia", "Pesos Disponibles", "Mejor Uso"],
  [
    ["Montserrat", "Geometric", "Google Fonts (OFL)", "100-900 + Italic", "Versátil, titulares, moderno"],
    ["Lato", "Humanist", "Google Fonts (OFL)", "100-900 + Italic", "Cuerpo de texto, UI, web"],
    ["Raleway", "Geometric", "Google Fonts (OFL)", "100-900 + Italic", "Elegante, minimalista, lujo"],
    ["Open Sans", "Humanist", "Google Fonts (OFL)", "300-800 + Italic", "Web, UI, legibilidad máxima"],
    ["Source Sans Pro", "Humanist", "Google Fonts (OFL)", "200-900 + Italic", "UI, web, Adobe ecosystem"],
    ["Quicksand", "Geometric", "Google Fonts (OFL)", "300-700", "Amigable, infantil, tech"],
    ["Nunito", "Geometric", "Google Fonts (OFL)", "200-1000 + Italic", "Redondeada, amigable, UI"],
    ["Inter", "Neo-Grotesque", "Google Fonts (OFL)", "100-900 + Italic", "UI, web, tech, código"],
    ["Space Grotesk", "Grotesque", "Google Fonts (OFL)", "300-700", "Futurista, tech, moderno"],
    ["Outfit", "Geometric", "Google Fonts (OFL)", "100-900", "Moderno, versátil, Gen Z"],
  ]
));

content.push(heading2("16.3 Fuentes Display y Condensadas Recomendadas"));

content.push(simpleTable(
  ["Fuente", "Categoría", "Licencia", "Pesos Disponibles", "Mejor Uso"],
  [
    ["Bebas Neue", "Condensed Sans", "Google Fonts (OFL)", "Regular", "Titulares, deportes, urbano"],
    ["Oswald", "Condensed Sans", "Google Fonts (OFL)", "200-700", "Titulares, periódicos, bold"],
    ["Anton", "Condensed Sans", "Google Fonts (OFL)", "Regular", "Impacto, titulares, deportes"],
    ["Impact", "Condensed Sans", "Sistema", "Regular", "Memes, humor, titulares"],
    ["Bangers", "Comic Display", "Google Fonts (OFL)", "Regular", "Cómic, pop art, divertido"],
    ["Bungee", "Display", "Google Fonts (OFL)", "Regular + Shade", "Urbano, decorativo, impacto"],
    ["Russo One", "Display", "Google Fonts (OFL)", "Regular", "Deportes, Rusia, industrial"],
    ["Archivo Black", "Grotesque Display", "Google Fonts (OFL)", "Regular", "Titulares, periódicos, web"],
    ["Futura Bold", "Geometric", "Premium (Adobe)", "Bold, Black", "Moderna, icónica, premium"],
    ["College Block", "Display", "Varios", "Regular", "Universitario, deportivo"],
  ]
));

content.push(heading2("16.4 Fuentes Script y Caligráficas Recomendadas"));

content.push(simpleTable(
  ["Fuente", "Categoría", "Licencia", "Estilo", "Mejor Uso"],
  [
    ["Great Vibes", "Formal Script", "Google Fonts (OFL)", "Caligráfica elegante", "Bodas, lujo, premium"],
    ["Sacramento", "Casual Script", "Google Fonts (OFL)", "Elegante ligera", "Femenino, delicado, notas"],
    ["Allura", "Brush Script", "Google Fonts (OFL)", "Pincel elegante", "Invitaciones, elegante"],
    ["Dancing Script", "Casual Script", "Google Fonts (OFL)", "Amigable moderna", "Social, amigable, informal"],
    ["Pacifico", "Brush Script", "Google Fonts (OFL)", "Relajada surf", "Playa, surf, verano"],
    ["Lobster", "Script Display", "Google Fonts (OFL)", "Retro moderna", "Títulos, retro, diversión"],
    ["Satisfy", "Brush Script", "Google Fonts (OFL)", "Cursiva suave", "Elegante casual, personal"],
    ["Kaushan Script", "Brush Script", "Google Fonts (OFL)", "Energética", "Creativo, dinámico, arte"],
    ["Caveat", "Handwritten", "Google Fonts (OFL)", "Mano escrita", "Notas, personal, informal"],
    ["Rock Salt", "Handwritten", "Google Fonts (OFL)", "Rotulador", "Casual, boceto, artístico"],
    ["Indie Flower", "Handwritten", "Google Fonts (OFL)", "Doodle", "Juvenil, craft, kawaii"],
    ["Gochi Hand", "Handwritten", "Google Fonts (OFL)", "Pizarra", "Casual, pizarra, informal"],
    ["Mr De Haviland", "Formal Script", "Google Fonts (OFL)", "Caligráfica fina", "Elegancia máxima, lujo"],
  ]
));

content.push(heading2("16.5 Fuentes Temáticas y Especiales Recomendadas"));

content.push(simpleTable(
  ["Fuente", "Categoría", "Licencia", "Estilo", "Mejor Uso"],
  [
    ["Press Start 2P", "Pixel / Gaming", "Google Fonts (OFL)", "Pixel art 8-bit", "Gaming retro, arcade"],
    ["VT323", "Terminal / Retro", "Google Fonts (OFL)", "Terminal antigua", "Código retro, DOS"],
    ["Orbitron", "Futurista", "Google Fonts (OFL)", "Sci-fi geométrica", "Espacio, tech, futuro"],
    ["Audiowide", "Futurista", "Google Fonts (OFL)", "Tech redondeada", "Audio, tech, electrónica"],
    ["Creepster", "Terror", "Google Fonts (OFL)", "Horror goteante", "Halloween, terror, spooky"],
    ["Nosifer", "Terror", "Google Fonts (OFL)", "Horror extremo", "Terror, sangre, horror"],
    ["Mountains of Christmas", "Navideña", "Google Fonts (OFL)", "Festiva decorativa", "Navidad, fiestas"],
    ["Poiret One", "Art Deco", "Google Fonts (OFL)", "Deco geométrica", "Años 20, Gatsby, lujo"],
    ["Monoton", "Neón", "Google Fonts (OFL)", "Neón display", "Neón, letreros, 80s"],
    ["Bungee Shade", "3D Display", "Google Fonts (OFL)", "Sombra tridimensional", "Urbano, letreros, impacto"],
    ["Fredoka One", "Rounded Display", "Google Fonts (OFL)", "Redondeada gruesa", "Kids, kawaii, adorable"],
    ["Silkscreen", "Pixel", "Google Fonts (OFL)", "Pixel pequeña", "UI pixel, mini texto"],
    ["Righteous", "Groovy", "Google Fonts (OFL)", "70s psicodélica", "Funk, 70s, groovy"],
    ["UnifrakturMaguntia", "Blackletter", "Google Fonts (OFL)", "Gótica fraktur", "Gótico, medieval, dark"],
    ["Cinzel Decorative", "Display Serif", "Google Fonts (OFL)", "Decorativa clásica", "Premios, conmemorativos"],
    ["Fredericka the Great", "Display", "Google Fonts (OFL)", "Esbozo irregular", "Arte, primavera, pascua"],
  ]
));

content.push(heading2("16.6 Fuentes Monospace Recomendadas"));

content.push(simpleTable(
  ["Fuente", "Licencia", "Ligaduras", "Pesos", "Mejor Uso"],
  [
    ["Source Code Pro", "Google Fonts (OFL)", "No", "200-900", "Código general, UI dev"],
    ["Fira Code", "Google Fonts (OFL)", "Sí", "300-700", "Código con ligaduras, dev"],
    ["JetBrains Mono", "Google Fonts (OFL)", "Sí", "100-800", "IDE, programación premium"],
    ["IBM Plex Mono", "Google Fonts (OFL)", "No", "100-600 + Italic", "Corporate tech, IBM style"],
    ["Space Mono", "Google Fonts (OFL)", "No", "Regular, Bold + Italic", "Tech, retro-futurista"],
    ["Roboto Mono", "Google Fonts (OFL)", "No", "100-700 + Italic", "Android, web, Google style"],
    ["Share Tech Mono", "Google Fonts (OFL)", "No", "Regular", "Terminal, retro tech"],
    ["VT323", "Google Fonts (OFL)", "No", "Regular", "Retro terminal, DOS"],
  ]
));

content.push(pageBreak());

// ============================================================
// CAPÍTULO 17: CHECKLIST Y GUÍA RÁPIDA
// ============================================================
content.push(heading1("Capítulo 17: Checklist y Guía Rápida de Selección Tipográfica"));

content.push(heading2("17.1 Checklist de Selección Tipográfica"));
content.push(para("Antes de finalizar cualquier diseño de producto personalizado, verifica cada uno de los siguientes puntos para garantizar que la selección tipográfica es óptima. Este checklist resume las mejores prácticas presentadas a lo largo de todo el manual y debe convertirse en una rutina de calidad para cada diseño que publiques en plataformas de impresión bajo demanda."));

content.push(bulletItem("¿La fuente principal es legible en el tamaño y la superficie del producto?"));
content.push(bulletItem("¿Las fuentes combinadas contrastan claramente entre sí (serif + sans serif)?"));
content.push(bulletItem("¿La jerarquía visual es evidente: titular, secundario, acento?"));
content.push(bulletItem("¿Se usan máximo tres fuentes diferentes en el diseño?"));
content.push(bulletItem("¿El contraste de color entre texto y fondo es suficiente (ratio mínimo 4.5:1)?"));
content.push(bulletItem("¿La fuente tiene licencia comercial para el uso previsto?"));
content.push(bulletItem("¿La tipografía refleja la personalidad del nicho y la temática?"));
content.push(bulletItem("¿Se ha verificado la legibilidad en un mockup del producto real, no solo en pantalla?"));
content.push(bulletItem("¿Los tamaños de fuente son apropiados para la técnica de impresión seleccionada?"));
content.push(bulletItem("¿El interletraje y el interlineado son adecuados para el formato del producto?"));
content.push(bulletItem("¿Las fuentes script o caligráficas mantienen la legibilidad en el tamaño impreso?"));
content.push(bulletItem("¿Se ha considerado la distorsión por la curvatura del producto (tazas, gorras)?"));
content.push(bulletItem("¿La combinación tipográfica es coherente con la paleta cromática?"));
content.push(bulletItem("¿Se ha probado el diseño en diferentes colores de producto (camiseta clara/oscura)?"));

content.push(heading2("17.2 Guía Rápida: Qué Fuente Elegir Según el Producto"));

content.push(simpleTable(
  ["Producto", "Fuente Titular Recomendada", "Fuente Secundaria", "Fuente Acento", "Nota Clave"],
  [
    ["Camiseta", "Bebas Neue / Montserrat Bold", "Montserrat / Oswald", "Great Vibes / Sacramento", "Trazos gruesos, alto contraste"],
    ["Taza / Mug", "Playfair Display / Pacifico", "Lora / Montserrat", "Great Vibes / Satisfy", "Texto centrado, área limitada"],
    ["Póster", "Playfair Display / Futura", "Montserrat / Lora", "Cormorant / Sacramento", "Jerarquía pronunciada"],
    ["Funda teléfono", "Bebas Neue / Bangers", "Inter / Space Grotesk", "Caveat / Gochi Hand", "Ultra legible en pequeño"],
    ["Tote Bag", "Montserrat Bold / Rye", "Raleway / Lora", "Caveat / Dancing Script", "Trazos gruesos para lona"],
    ["Hoodie", "Bebas Neue / Anton", "Oswald / Impact", "Permanent Marker / Rock Salt", "Formato grande, bold"],
    ["Cojín", "Playfair Display / Great Vibes", "Lora / Nunito", "Sacramento / Allura", "Elegancia decorativa"],
    ["Cuaderno", "Montserrat / Quicksand", "Raleway / Nunito", "Caveat / Dancing Script", "Funcional y bonita"],
    ["Gorra", "College Block / Bebas Neue", "Futura Bold / Oswald", "Russo One / Bungee", "Condensada, bordado"],
    ["Sticker", "Bangers / Fredoka One", "Nunito / Impact", "Gochi Hand / Rock Salt", "Ultra bold, legible mini"],
    ["Tarjeta", "Great Vibes / Montserrat Thin", "Cormorant / Playfair", "Allura / Sacramento", "Alta fidelidad, detalles finos"],
    ["Imán", "Pacifico / Bebas Neue", "Montserrat Bold", "Satisfy / Lobster", "Simple, 1-3 palabras"],
  ]
));

content.push(heading2("17.3 Tabla de Resumen: Fuentes por Nicho"));

content.push(simpleTable(
  ["Nicho", "Titular Estrella", "Secundaria Ideal", "Acento Perfecto"],
  [
    ["Motivacional", "Bebas Neue", "Montserrat Light", "Great Vibes"],
    ["Profesiones", "Myriad Pro / Roboto Mono", "Open Sans / Inter", "Satisfy / Caveat"],
    ["Hobbies", "Permanent Marker / Press Start 2P", "Raleway / Quicksand", "Rock Salt / Indie Flower"],
    ["Religión", "Cinzel Decorative", "Cormorant Garamond", "Great Vibes"],
    ["Pop Culture", "Bangers / Impact", "Bebas Neue / Anton", "Lobster / Gochi Hand"],
    ["Fechas Especiales", "Mountains of Christmas / Creepster", "Lora / Crimson Text", "Sacramento / Great Vibes"],
    ["Amor y Romance", "Great Vibes", "Cormorant Garamond", "Sacramento"],
    ["Naturaleza", "Playfair Display", "Lora Italic", "Caveat"],
    ["Ciencia y Tech", "Orbitron / Space Grotesk", "Inter / Exo 2", "Audiowide / JetBrains Mono"],
    ["Deportes", "Bebas Neue / College Block", "Oswald / Roboto Condensed", "Russo One / Bungee"],
    ["Comida y Bebida", "Playfair Display / Rye", "Lora / Lobster", "Pacifico / Satisfy"],
    ["Viajes", "Rye / Bebas Neue", "Playfair Display / Oswald", "Satisfy / Rock Salt"],
    ["Arte y Cultura", "Didot / Permanent Marker", "Garamond / Bebas Neue", "Cormorant / Rock Salt"],
    ["Eco y Sostenibilidad", "Playfair Display / Montserrat Bold", "Lora / Nunito", "Caveat / Indie Flower"],
    ["Moda y Estilo", "Didot / Futura Bold", "Montserrat Light / Avenir", "Sacramento / Allura"],
  ]
));

// ============================================================
// BUILD DOCUMENT
// ============================================================

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { size: 21, font: "Calibri" }
      },
      heading1: {
        run: { size: 32, bold: true, font: "Calibri", color: "1B2A4A" },
        paragraph: { spacing: { before: 400, after: 200 } }
      },
      heading2: {
        run: { size: 26, bold: true, font: "Calibri", color: "2C3E6B" },
        paragraph: { spacing: { before: 300, after: 150 } }
      },
      heading3: {
        run: { size: 22, bold: true, font: "Calibri", color: "3D5A99" },
        paragraph: { spacing: { before: 200, after: 100 } }
      }
    }
  },
  numbering: {
    config: [{
      reference: "default-bullet",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } }
      }]
    }]
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) }
        }
      },
      children: content
    }
  ]
});

// Generate
Packer.toBuffer(doc).then(buffer => {
  const outPath = "/home/z/my-project/download/Manual_Tipografias_Fuentes_Personalizacion_Productos.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("SUCCESS: Document generated at " + outPath);
  console.log("File size: " + (buffer.length / 1024 / 1024).toFixed(2) + " MB");
}).catch(err => {
  console.error("ERROR:", err.message);
  console.error(err.stack);
});
