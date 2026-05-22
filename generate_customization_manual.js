const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableOfContents, LevelFormat,
} = require("docx");
const fs = require("fs");

// ============================================================
// PALETTE — IG-1 Ink Gold (Luxury / Premium / Customization)
// ============================================================
const P = {
  bg: "1A1A1A", primary: "FFFFFF", accent: "C9A84C",
  titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078",
  body: "2C2C2C", secondary: "6878A0",
  surface: "F5F2E8",
  tableHeaderBg: "C9A84C", tableHeaderText: "1A1A1A",
  tableAccentLine: "C9A84C", tableInnerLine: "DDD5C0", tableSurface: "F5F2E8",
};
const c = (hex) => hex.replace("#","");

// ============================================================
// COVER HELPERS
// ============================================================
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([...'，。、；：！？的与和及之在于为-_—–·/ \t']);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += last;
  }
  return lines;
}

function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  const charWidth = (pt) => pt * 20;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt, lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    lines = splitTitleLines(title, charsPerLine(minPt));
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function calcCoverSpacing(params) {
  const { titleLineCount = 1, titlePt = 36, hasSubtitle = false, hasEnglishLabel = false,
    metaLineCount = 0, fixedHeight = 400, pageHeight = 16838 } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - SAFETY;
  const titleBlock = titleLineCount * titlePt * 23 + (titleLineCount - 1) * 100;
  const subtitleH = hasSubtitle ? 400 : 0;
  const labelH = hasEnglishLabel ? 500 : 0;
  const metaH = metaLineCount * 280;
  const footerH = fixedHeight;
  const totalContent = titleBlock + subtitleH + labelH + metaH + footerH;
  const remaining = usableHeight - totalContent;
  const topSpacing = Math.min(Math.max(Math.floor(remaining * 0.30), 600), 3000);
  const bottomSpacing = Math.min(Math.max(remaining - topSpacing, 400), 3000);
  return { topSpacing, bottomSpacing };
}

function buildCover(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 34, 22);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length, fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 12 };
  const children = [];
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));
  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split("").join("  "),
        size: 18, color: P.accent, font: { ascii: "Calibri", eastAsia: "SimHei" }, characterSpacing: 40 })],
    }));
  }
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({ text: titleLines[i], size: titleSize, bold: true,
        color: P.titleColor, font: { eastAsia: "SimHei", ascii: "Arial" } })],
    }));
  }
  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: P.subtitleColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
    }));
  }
  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({ text: line, size: 24, color: P.metaColor,
        font: { eastAsia: "Microsoft YaHei", ascii: "Arial" } })],
    }));
  }
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
    ],
  }));
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE }, borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({ shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders, children })],
    })],
  })];
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480, after: 200, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" } })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" } })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 280, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 24, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" } })] });
}
function p(text) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120, line: 312 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] });
}
function emptyLine() { return new Paragraph({ spacing: { after: 60 }, children: [] }); }

const tMargins = { top: 50, bottom: 50, left: 100, right: 100 };
function makeTable(headers, rows, colWidths) {
  const hRow = new TableRow({
    tableHeader: true, cantSplit: true,
    children: headers.map((h, i) => new TableCell({
      width: colWidths ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
      shading: { type: ShadingType.CLEAR, fill: P.tableHeaderBg },
      margins: tMargins,
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: P.tableHeaderText,
        font: { ascii: "Calibri", eastAsia: "SimHei" } })] })],
    })),
  });
  const dRows = rows.map((row, ri) => new TableRow({
    cantSplit: true,
    children: row.map((cell, ci) => new TableCell({
      width: colWidths ? { size: colWidths[ci], type: WidthType.PERCENTAGE } : undefined,
      shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? P.tableSurface : "FFFFFF" },
      margins: tMargins,
      children: [new Paragraph({ children: [new TextRun({ text: String(cell), size: 20, color: c(P.body),
        font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: P.tableAccentLine },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: P.tableAccentLine },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.tableInnerLine },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [hRow, ...dRows],
  });
}

// ============================================================
// CONTENT SECTIONS
// ============================================================

function buildIntroduction() {
  return [
    h1("Introducci\u00f3n"),
    h2("Evoluci\u00f3n de la personalización masiva de productos"),
    p("La personalización masiva de productos ha recorrido un camino extraordinario desde sus orígenes artesanales hasta convertirse en una industria global multimillonaria impulsada por la tecnología digital y la inteligencia artificial. Lo que comenzó como la adaptación manual de productos individuales —el sastre que medía a su cliente, el joyero que grababa iniciales, el carpintero que ajustaba dimensiones— se ha transformado en un ecosistema productivo capaz de ofrecer millones de variantes únicas sin sacrificar la eficiencia de la producción en serie."),
    p("La revolución industrial del siglo XIX estandarizó la producción para lograr economías de escala, sacrificando la individualidad en aras de la eficiencia. Sin embargo, la tensión entre estándar y personalizado nunca desapareció del todo. En la década de 1990, el concepto de mass customization fue teorizado académicamente por Joseph Pine, quien argumentó que la tecnología permitiría reconciliar la personalización con la escala. La llegada del comercio electrónico, la impresión digital y las plataformas de Print on Demand convirtieron esa teoría en una realidad comercial que hoy mueve más de 30.000 millones de dólares anuales a nivel global."),
    p("En la última década, la convergencia de cinco tecnologías ha acelerado exponencialmente la personalización masiva: la impresión digital de alta resolución, el corte láser controlado por computadora, la inteligencia artificial generativa, las plataformas de comercio electrónico con APIs de personalización, y la logística de fulfillment automatizado. Estas tecnologías han reducido el tiempo de producción de un producto personalizado de semanas a horas, y han eliminado la necesidad de inventario mínimo, permitiendo que cualquier emprendedor ofrezca catálogos de miles de variantes sin inversión en stock."),

    h2("Impacto de la IA en la personalización de productos"),
    p("La inteligencia artificial ha transformado radicalmente cada etapa del proceso de personalización de productos. En la fase de diseño, herramientas como Midjourney, DALL-E, Leonardo AI e Ideogram permiten generar ilustraciones, patrones y composiciones gráficas de calidad profesional en minutos. En la fase de producción, algoritmos de optimización determinan la disposición más eficiente de los diseños en las superficies de impresión, minimizando el desperdicio de material y maximizando la calidad del resultado final."),
    p("Más allá de la generación visual, la IA está revolucionando la experiencia del cliente en la personalización. Los configuradores de productos impulsados por IA permiten a los consumidores visualizar en tiempo real cómo se verá el producto final, recibir sugerencias de diseño basadas en sus preferencias previas, y ajustar colores, tipografías y composiciones de manera intuitiva sin conocimientos de diseño. Los chatbots inteligentes guían al usuario a través del proceso de personalización, resolviendo dudas y ofreciendo recomendaciones contextuales que aumentan la tasa de conversión."),
    p("En el ámbito de la producción, la IA optimiza los flujos de trabajo de fulfillment, predice la demanda para anticipar picos estacionales, automatiza el control de calidad mediante visión por computadora, y gestiona la logística de envío para minimizar tiempos y costos. La sinergia entre diseño generativo, automatización productiva y experiencia personalizada del cliente constituye el núcleo de la nueva economía de la personalización masiva."),

    h2("Tendencias actuales del mercado global de personalización"),
    p("El mercado global de productos personalizados crece a una tasa anual compuesta del 22%, impulsado por la creciente demanda de los consumidores millennials y Gen Z que priorizan la expresión individual y la exclusividad percibida. Las categorías de productos con mayor crecimiento incluyen: ropa y accesorios personalizados (35% del mercado), hogar y decoración (20%), tecnología y fundas (15%), papelería y regalos (12%), y bebidas y alimentación personalizada (8%)."),
    p("Las tendencias más relevantes del mercado actual incluyen: la hiperpersonalización basada en datos del usuario, la personalización en tiempo real mediante configuradores 3D, la integración de realidad aumentada para previsualización de productos, el auge del co-creation donde los consumidores participan activamente en el proceso de diseño, la sostenibilidad como factor diferenciador en productos personalizados, y la expansión de la personalización B2B para merchandising corporativo y eventos."),

    h2("Cómo monetizar la personalización masiva con IA"),
    p("Las estrategias de monetización en la personalización masiva con IA son múltiples y complementarias. La primera y más directa es la venta directa al consumidor (DTC) a través de tiendas propias en Shopify o WooCommerce, donde los márgenes de ganancia oscilan entre el 40% y el 70% gracias a la eliminación de intermediarios. La segunda estrategia es la venta en marketplaces POD como Printful, Printify, Zazzle y Redbubble, que ofrecen infraestructura de producción y logística a cambio de un porcentaje de la venta."),
    p("Otras vías de monetización incluyen: la creación de plataformas de personalización como servicio (PaaS) donde otros negocios pueden ofrecer productos personalizados utilizando tu infraestructura tecnológica, la venta de plantillas de diseño y prompts de IA optimizados para categorías específicas de productos, la consultoría en implementación de flujos de personalización para empresas tradicionales, y el desarrollo de aplicaciones de configuración de productos que se integran con plataformas de e-commerce existentes."),
  ];
}

function buildChapter1() {
  return [
    h1("Cap\u00edtulo 1 \u2014 Investigación de Nichos en Tendencia"),
    p("La investigación de nichos para personalización masiva de productos requiere un enfoque más amplio que el diseño textil, ya que abarca múltiples categorías de productos con dinámicas de mercado, audiencias y requisitos técnicos distintos. En este capítulo analizaremos los nichos más rentables y con mayor potencial de crecimiento, organizados por categorías de productos, con el mismo nivel de detalle que aplicamos a camisetas pero extendido a la gama completa de productos personalizables."),

    h2("A. Fechas Especiales"),
    p("Las fechas especiales representan picos de demanda predecibles que afectan a todas las categorías de productos personalizables. La personalización añade un valor percibido enorme a los productos de regalo, ya que el consumidor busca algo único y significativo para cada ocasión. Navidad lidera con diferencia en volumen de ventas, seguida por San Valentín, Día de la Madre y Halloween. La anticipación de 6-8 semanas es crítica para posicionar los productos en los marketplaces antes del pico de búsqueda."),

    makeTable(
      ["Fecha", "Productos Estrella", "Audiencia", "Estilo Gr\u00e1fico", "Paleta", "Tipograf\u00eda", "Potencial"],
      [
        ["Navidad", "Tazas, ornamentos, gorras, delantales", "Familias, oficinas, parejas", "Vintage, kawaii, tipogr\u00e1fico", "Rojo, verde, dorado, crema", "Script festiva, display", "Muy alto"],
        ["Halloween", "Tatuajes temporales, fundas, stickers", "Jóvenes 18-35, fiesteros", "Grunge, tattoo, cartoon gótico", "Negro, naranja, púrpura", "Gótica, horror display", "Alto"],
        ["San Valent\u00edn", "Tazas, marcos, joyería, tarjetas", "Parejas, amigos, autocuidado", "Rom\u00e1ntico, minimalista, kawaii", "Rosa, rojo, dorado rose", "Script elegante, sans serif", "Alto"],
        ["D\u00eda Madre", "Tazas, toallas, joyer\u00eda, bolsas", "Hijos, familias, empresas", "Floral, emotivo, vintage", "Pastel, lavanda, rosa viejo", "Script emotiva, serif", "Medio-alto"],
        ["D\u00eda Padre", "Tazas, llaveros, gorras, herramientas", "Hijos, familias", "Bold, tipogr\u00e1fico, deportivo", "Azul, marrón, verde oliva", "Sans serif bold, stencil", "Medio-alto"],
        ["A\u00f1o Nuevo", "Agendas, tazas, camisetas, gorras", "Público general, empresas", "Tipogr\u00e1fico, minimalista", "Oro, negro, blanco", "Display bold, serif", "Alto"],
        ["Pascua", "Cestas, tazas, pegatinas, camisetas", "Familias con niños", "Kawaii, ilustrado, pastel", "Amarillo, celeste, rosa", "Redondeada, display", "Medio"],
        ["Black Friday", "Todos los productos con descuento", "Compradores bargain hunters", "Agresivo, bold, tipogr\u00e1fico", "Negro, rojo, amarillo", "Sans serif bold, display", "Muy alto"],
        ["Independence Day", "Banderas, gorras, camisetas, tazas", "Público patriótico", "Patriótico, vintage, tipogr\u00e1fico", "Rojo, blanco, azul", "Serif, display bold", "Medio-alto"],
        ["D\u00eda Muertos", "Calaveras, velas, tazas, camisetas", "Comunidad latina, cultura", "Cultural, ornamental, gótico", "Violeta, naranja, dorado", "Display ornamental, script", "Alto"],
      ],
      [10, 16, 14, 14, 14, 14, 10]
    ),
    emptyLine(),

    h2("B. Estaciones Clim\u00e1ticas"),
    p("Las estaciones condicionan tanto los productos demandados como su estética. En verano, las categorías estrella son toallas de playa, botellas térmicas, gorras y gafas de sol personalizadas. En invierno, los productos de cozy como mantas, tazas térmicas y gorros dominan las ventas. Primavera y otoño ofrecen oportunidades con productos de jardinería, organización y transición estacional."),

    makeTable(
      ["Estaci\u00f3n", "Productos Clave", "Audiencia", "Estilo Gr\u00e1fico", "Paleta", "Potencial"],
      [
        ["Verano", "Toallas, botellas, gorras, bikinis, stickers", "Turistas, jóvenes, deportistas", "Tropical, cartoon, tipográfico", "Coral, turquesa, amarillo", "Muy alto"],
        ["Invierno", "Mantas, tazas, gorros, guantes, velas", "Familias, oficinistas, cozy lovers", "Cozy, vintage, tipográfico", "Azul oscuro, burdeos, crema", "Alto"],
        ["Primavera", "Macetas, delantales, tote bags, agendas", "Mujeres 25-45, naturaleza lovers", "Botánico, acuarela, minimalista", "Verde sage, rosa pastel, lavanda", "Medio-alto"],
        ["Oto\u00f1o", "Tazas, velas, mantas, delantales, stickers", "Millennials, coffee lovers", "Rustic, vintage, tipográfico", "Naranja, marrón, mostaza", "Alto"],
      ],
      [10, 18, 18, 18, 18, 10]
    ),
    emptyLine(),

    h2("C. Profesiones"),
    p("El nicho profesional es especialmente poderoso en personalización masiva porque las personas no solo compran para sí mismas sino también como regalos para colegas, jefes y empleados. Los productos más vendidos por profesión incluyen tazas motivacionales, ID badge holders, ratones personalizados, cuadernos, y merchandising de oficina."),

    makeTable(
      ["Profesi\u00f3n", "Productos Top", "Estilo Ideal", "Paleta Sugerida", "Tipograf\u00eda", "Potencial"],
      [
        ["M\u00e9dicos", "Tazas, badge holders, estetoscopio tags", "Minimalista, anatómico", "Azul oscuro, blanco, gris", "Sans serif limpia", "Alto"],
        ["Enfermeras", "Tazas, tote bags, steth covers, pins", "Tipográfico, heartline", "Rosa, azul claro, blanco", "Script + sans serif", "Muy alto"],
        ["Ingenieros", "Tazas, mousepads, cuadernos, rulers", "Técnico, blueprint, cómic", "Azul, gris, negro", "Monospace, display", "Medio-alto"],
        ["Maestros", "Tazas, cuadernos, tote bags, lapiceros", "Tipográfico, ilustrado", "Colores primarios, amarillo", "Handlettering, display", "Alto"],
        ["Programadores", "Mousepads, tazas, stickers, desk mats", "Geek, código, retro gaming", "Negro, verde neón, azul", "Monospace, pixel", "Muy alto"],
        ["Abogados", "Portafolios, plumas, cuadernos, tazas", "Clásico, tipográfico", "Azul marino, dorado, blanco", "Serif elegante", "Medio"],
        ["Bomberos", "Tazas, stickers, gorras, llaveros", "Bold, heroico, vintage", "Rojo, negro, amarillo", "Display bold, stencil", "Alto"],
        ["Polic\u00edas", "Placas, tazas, gorras, llaveros", "Heroico, badge style", "Azul marino, dorado, negro", "Serif, stencil", "Alto"],
        ["Veterinarios", "Tazas, scrubs, pins, tote bags", "Ilustrado, cute, tipográfico", "Verde, marrón, azul cielo", "Script, sans serif", "Alto"],
        ["Arquitectos", "Cuadernos, rulers, tazas, desk mats", "Blueprint, minimalista", "Blanco, negro, azul print", "Sans serif, serif", "Medio-alto"],
      ],
      [12, 20, 14, 14, 14, 10]
    ),
    emptyLine(),

    h2("D. Hobbies y Estilos de Vida"),
    p("Los hobbies generan pasión, y la pasión genera ventas. En personalización masiva, cada hobby puede abordarse con múltiples productos: el gamer necesita mousepad y skin para consola; el ciclista requiere botella y jersey; el amante de mascotas desea taza y marco de foto personalizado. La clave está en ofrecer ecosistemas de productos coordinados por hobby, no diseños aislados."),

    makeTable(
      ["Hobby", "Productos Personalizables", "Estilo Gr\u00e1fico", "Paleta", "Tipograf\u00eda", "Potencial"],
      [
        ["Gaming", "Mousepads, skins, tazas, stickers, desk mats", "Pixel, cyberpunk, cartoon", "Negro, neón, púrpura", "Pixel, display, futurista", "Muy alto"],
        ["Anime", "Funda móvil, posters, tazas, body pillow", "Anime, kawaii, manga", "Rosa, azul, negro, neón", "Display, brush japonés", "Muy alto"],
        ["Fitness", "Botellas, bolsas, toallas, guantes, headbands", "Tipográfico bold, motivacional", "Negro, rojo, blanco", "Bold sans, stencil", "Muy alto"],
        ["Ciclismo", "Botellas, jerseys, cascos, bolsas sillín", "Minimalista, técnico, retro", "Amarillo, negro, azul", "Sans serif, display", "Alto"],
        ["Running", "Botellas, gorras, brazaletes, camisetas", "Tipográfico, motivacional", "Verde fluo, negro, naranja", "Bold sans, script", "Alto"],
        ["Camping", "Tazas, cantimploras, navajas, gorras", "Rústico, vintage, ilustrado", "Verde bosque, marrón, crema", "Serif, display rústico", "Medio-alto"],
        ["Pesca", "Tazas, gorras, cajas aparejos, stickers", "Vintage, cartoon, tipográfico", "Azul, verde, marrón", "Script, display", "Medio-alto"],
        ["M\u00fasica", "Funda guitarra, púas, tazas, posters", "Retro, vintage, tipográfico", "Negro, dorado, rojo", "Display, script", "Alto"],
        ["Viajes", "Pasaportes, tags, bolsas, botellas, mapas", "Tipográfico, ilustración", "Azul, coral, arena", "Script, sans serif", "Alto"],
        ["Mascotas", "Tazas, marcos, camisetas, tags, camas", "Ilustrado, kawaii, tipográfico", "Colores pastel, marrón", "Script, display", "Muy alto"],
      ],
      [10, 22, 14, 14, 14, 10]
    ),
    emptyLine(),

    h2("E. Religi\u00f3n y Espiritualidad"),
    p("El nicho de religión y espiritualidad en personalización masiva abarca productos como tazas con versículos, marcos con citas, velas personalizadas, joyería con símbolos religiosos, tote bags con mensajes de fe y decoración del hogar espiritual. La demanda es evergreen y la audiencia muestra alta lealtad y disposición de compra. Es fundamental abordar cada tradición con respeto y autenticidad, evitando la apropiación cultural y los clichés superficiales."),

    h2("F. Frases Motivacionales"),
    p("Las frases motivacionales funcionan en prácticamente todas las categorías de productos personalizables. Una frase poderosa puede aplicarse a tazas, camisetas, marcos, tote bags, stickers, fundas de móvil y docenas de productos más, multiplicando el retorno de cada concepto creativo. Las subcategorías más rentables son: minimalistas para productos de escritorio y hogar, urbanas para streetwear y accesorios, fitness para botellas y ropa deportiva, emprendimiento para cuadernos y merch de oficina, mindset para productos de autoayuda, y positividad para regalos y decoración."),

    h2("G. Cultura Pop y Tendencias"),
    p("La cultura pop impulsa la personalización masiva en todas sus categorías. Los estilos retro vintage, Y2K, cyberpunk y vaporwave dominan los diseños para fundas de móvil, stickers, mousepads y posters. El streetwear y el minimalismo premium son los estilos más solicitados en ropa y accesorios. El estilo japonés, el graffiti y el old school tattoo funcionan excepcionalmente en tazas, botellas y cueros. El surrealismo moderno gana tracción en posters y lienzos."),

    makeTable(
      ["Estilo", "Productos Recomendados", "Paleta Caracter\u00edstica", "Tipograf\u00eda Clave"],
      [
        ["Retro Vintage", "Tazas, camisetas, posters, tote bags", "Sepia, mostaza, naranja apagado", "Serif retro, display vintage"],
        ["Y2K", "Funda móvil, stickers, camisetas, pins", "Rosa chicle, plateado, azul eléctrico", "Display futurista, blob"],
        ["Cyberpunk", "Mousepads, desk mats, skins, posters", "Negro, neón cian, magenta, púrpura", "Futurista, glitch, monospace"],
        ["Vaporwave", "Stickers, posters, tazas, camisetas", "Rosa pastel, cian, púrpura", "Serif clásica, display retro"],
        ["Streetwear", "Camisetas, gorras, bolsas, stickers", "Negro, blanco, rojo, verde", "Gothic, display bold, stencil"],
        ["Minimalismo Premium", "Todos los productos, especial hogar", "Negro, blanco, gris, beige", "Sans serif geométrica"],
        ["Estilo Japon\u00e9s", "Funda móvil, posters, camisetas, mugs", "Negro, rojo, blanco, dorado", "Brush japonesa, kanji"],
        ["Graffiti", "Camisetas, stickers, gorras, skate decks", "Colores vivos sobre fondo oscuro", "Wildstyle, bubble, tag"],
        ["Old School Tattoo", "Tazas, camisetas, stickers, patches", "Rojo, negro, amarillo, verde", "Script clásica, display bold"],
        ["Surrealismo Moderno", "Posters, lienzos, fundas, camisetas", "Paleta onírica, degradados", "Display experimental"],
      ],
      [16, 24, 28, 22]
    ),
    emptyLine(),
  ];
}

function buildChapter2() {
  return [
    h1("Cap\u00edtulo 2 \u2014 Principios de Dise\u00f1o para Personalización Masiva"),
    h2("Composición visual multi-producto"),
    p("El diseño para personalización masiva introduce un desafío único que no existe en el diseño de un solo producto: cada diseño debe adaptarse a múltiples superficies con formas, dimensiones y proporciones radicalmente diferentes. Un mismo concepto visual puede aplicarse a la superficie plana de una camiseta, la curva cilíndrica de una taza, el rectángulo compacto de un mousepad y la superficie pequeña de un llavero. Esto exige un enfoque de diseño modular donde los elementos se organizan en capas independientes que pueden reorganizarse, escalar y recortar manteniendo la integridad visual del concepto."),
    p("La composición modular se basa en tres principios: (1) Separación de elementos: el diseño se construye como un sistema de componentes independientes —ilustración central, tipografía principal, elementos decorativos, fondo— que pueden reorganizarse según el producto. (2) Zonas seguras: cada producto tiene un área de impresión segura donde los elementos críticos no serán recortados ni distorsionados. (3) Escalabilidad jerárquica: al reducir el tamaño del diseño para productos pequeños como stickers o llaveros, se eliminan primero los elementos decorativos, manteniendo la ilustración central y la tipografía principal como prioritarios."),

    h2("Jerarquía visual adaptativa"),
    p("En la personalización masiva, la jerarquía visual debe ser lo suficientemente robusta para funcionar en productos de diferentes tamaños. En una camiseta de 40x50 cm, se pueden incluir múltiples niveles de información: ilustración, texto principal, texto secundario y elementos decorativos. En un sticker de 5x5 cm, solo sobrevive el texto principal y una versión simplificada de la ilustración. La regla práctica es diseñar siempre para el producto más pequeño del catálogo: si funciona ahí, funcionará en todos los demás."),

    h2("Balance y contraste entre sustratos"),
    p("Cada sustrato —cerámica, tela, plástico, papel, metal— refleja la luz y absorbe la tinta de manera diferente. Un diseño que luce vibrante sobre papel puede verse apagado sobre tela oscura, y un contraste perfecto sobre fondo blanco puede desaparecer sobre fondo transparente. El diseñador debe crear variantes de cada diseño optimizadas para los principales sustratos: versión de alto contraste para superficies oscuras, versión de bajo contraste para superficies claras, y versión simplificada para materiales que absorben excesivamente la tinta como el algodón sin tratar."),

    h2("Escalabilidad multidimensional"),
    p("La escalabilidad en personalización masiva no es solo de tamaño sino de formato: un diseño debe funcionar en proporciones 1:1 (sticker, mousepad cuadrado), 3:4 (camiseta frontal), 4:3 (poster), 16:9 (funda de portátil), y dimensiones cilíndricas (taza, botella). La técnica profesional consiste en crear el diseño maestro en formato cuadrado de alta resolución y derivar las variantes proporcionales mediante recortes inteligentes que preserven los elementos esenciales en cada formato."),

    h2("Espacio negativo y zonas seguras"),
    p("El espacio negativo adquiere una importancia crítica en la personalización masiva porque funciona como amortiguador visual que protege la integridad del diseño cuando se aplica a diferentes productos. Las zonas seguras de impresión varían por producto: una taza típicamente tiene un área segura de 8x9 cm, un mousepad de 25x20 cm, una camiseta de 30x40 cm. Diseñar con márgenes generosos garantiza que ningún elemento crítico sea recortado en la producción."),

    h2("Psicología del color aplicada a productos"),
    p("Los colores evocan respuestas emocionales que varían según el contexto del producto. El rojo que transmite pasión en una camiseta puede sugerir peligro en una señal de seguridad. El azul que comunica confianza en un cuaderno corporativo puede percibirse como frío en un regalo romántico. Comprender estas variaciones contextuales es esencial para seleccionar paletas que refuercen el mensaje del diseño en el contexto específico de cada producto y ocasión de uso."),

    h2("Adaptación para múltiples sustratos"),
    p("Cada tipo de superficie requiere ajustes específicos en el diseño. Las superficies curvas como tazas y botellas distorsionan las líneas rectas y los textos horizontales, requiriendo compensación de curvatura. Los materiales transparentes como fundas de móvil exigen diseños que funcionen tanto sobre fondos claros como oscuros. Las superficies texturizadas como lienzo y madera absorben la tinta de manera irregular, requiriendo bordes más gruesos y colores más saturados para mantener la legibilidad. La preparación profesional incluye crear guías de adaptación para cada tipo de sustrato en el catálogo de productos."),
  ];
}

function buildChapter3() {
  return [
    h1("Cap\u00edtulo 3 \u2014 Paletas de Colores Profesionales"),
    p("En la personalización masiva, la selección cromática debe considerar no solo la emoción que transmite sino también su comportamiento en diferentes sustratos y técnicas de impresión. Un mismo color HEX se reproduce de manera diferente en sublimación sobre poliéster, en DTG sobre algodón, en impresión UV sobre cerámica y en serigrafía sobre papel. Este capítulo presenta cartas de paleta optimizadas para la producción multi-producto con valores de referencia para las principales técnicas."),

    makeTable(
      ["Tem\u00e1tica", "HEX", "RGB", "CMYK", "Uso Recomendado", "Emoci\u00f3n"],
      [
        ["Streetwear", "#0A0A0A / #FF0000 / #FFFFFF / #333333 / #FF4500", "10,10,10 / 255,0,0 / 255,255,255 / 51,51,51 / 255,69,0", "0,0,0,100 / 0,100,100,0 / 0,0,0,0 / 0,0,0,80 / 0,82,100,0", "Ropa, gorras, stickers", "Rebeldía, poder"],
        ["Vintage", "#D4A574 / #8B4513 / #F5DEB3 / #556B2F / #CD853F", "212,165,116 / 139,69,19 / 245,222,179 / 85,107,47 / 205,133,63", "15,32,48,0 / 0,72,82,40 / 3,10,28,0 / 50,10,85,55 / 12,50,65,10", "Tazas, posters, tote bags", "Nostalgia, calidez"],
        ["Navidad", "#C41E3A / #2D5A27 / #D4AF37 / #FFFFFF / #FFFDD0", "196,30,58 / 45,90,39 / 212,175,55 / 255,255,255 / 255,253,208", "0,90,75,15 / 70,10,90,60 / 15,20,80,5 / 0,0,0,0 / 1,0,18,0", "Ornamentos, tazas, tarjetas", "Celebración, alegría"],
        ["Halloween", "#0A0A0A / #FF6600 / #6B3FA0 / #32CD32 / #8B0000", "10,10,10 / 255,102,0 / 107,63,160 / 50,205,50 / 139,0,0", "0,0,0,100 / 0,60,100,0 / 45,70,0,20 / 60,0,100,0 / 0,100,100,40", "Stickers, tatuajes, decoración", "Misterio, diversión"],
        ["Anime", "#FF69B4 / #00BFFF / #0A0A0A / #FF1493 / #7B68EE", "255,105,180 / 0,191,255 / 10,10,10 / 255,20,147 / 123,104,238", "0,60,25,0 / 75,0,0,0 / 0,0,0,100 / 0,90,0,0 / 55,55,0,0", "Fundas, posters, body pillows", "Fantasía, energía"],
        ["Minimalista", "#000000 / #FFFFFF / #808080 / #D3D3D3 / #F5F5F5", "0,0,0 / 255,255,255 / 128,128,128 / 211,211,211 / 245,245,245", "0,0,0,100 / 0,0,0,0 / 0,0,0,50 / 0,0,0,18 / 2,2,2,0", "Hogar, escritorio, papelería", "Elegancia, calma"],
        ["Gaming", "#0D0D0D / #00FF41 / #9D00FF / #00D4FF / #FF003C", "13,13,13 / 0,255,65 / 157,0,255 / 0,212,255 / 255,0,60", "0,0,0,95 / 80,0,95,0 / 40,100,0,0 / 80,0,0,0 / 0,100,80,0", "Mousepads, skins, desk mats", "Adrenalina, inmersión"],
        ["Fitness", "#1A1A1A / #FF0000 / #FFFFFF / #FF6600 / #333333", "26,26,26 / 255,0,0 / 255,255,255 / 255,102,0 / 51,51,51", "0,0,0,90 / 0,100,100,0 / 0,0,0,0 / 0,60,100,0 / 0,0,0,80", "Botellas, bolsas, toallas", "Fuerza, determinación"],
        ["Luxury", "#0A0A0A / #D4AF37 / #FFFFFF / #1C1C1C / #C0C0C0", "10,10,10 / 212,175,55 / 255,255,255 / 28,28,28 / 192,192,192", "0,0,0,100 / 15,20,80,5 / 0,0,0,0 / 0,0,0,90 / 0,0,0,25", "Joyería, marcos, cuero", "Exclusividad, lujo"],
        ["Naturaleza", "#2E8B57 / #8FBC8F / #DEB887 / #228B22 / #F0E68C", "46,139,87 / 143,188,143 / 222,184,135 / 34,139,34 / 240,230,140", "70,15,70,40 / 30,15,55,15 / 10,22,45,5 / 75,10,100,40 / 5,5,45,0", "Macetas, totes, delantales", "Paz, frescura"],
        ["Retro 80s", "#FF6EC7 / #00FFFF / #FFFF00 / #FF00FF / #FF4500", "255,110,199 / 0,255,255 / 255,255,0 / 255,0,255 / 255,69,0", "0,60,10,0 / 80,0,0,0 / 0,0,100,0 / 0,100,0,0 / 0,82,100,0", "Stickers, fundas, posters", "Energía, diversión"],
        ["Cyberpunk", "#0A0A1A / #00FFFF / #FF00FF / #FFFF00 / #FF0040", "10,10,26 / 0,255,255 / 255,0,255 / 255,255,0 / 255,0,64", "95,85,0,70 / 80,0,0,0 / 0,100,0,0 / 0,0,100,0 / 0,100,80,0", "Skins, desk mats, posters", "Rebeldía tecnológica"],
        ["Faith-based", "#FFFFFF / #D4AF37 / #2D5A27 / #F5F5DC / #8B4513", "255,255,255 / 212,175,55 / 45,90,39 / 245,245,222 / 139,69,19", "0,0,0,0 / 15,20,80,5 / 70,10,90,60 / 2,2,12,0 / 0,72,82,40", "Velas, marcos, joyería", "Fe, esperanza"],
      ],
      [12, 22, 22, 22, 12, 10]
    ),
    emptyLine(),

    p("Nota técnica: Los valores CMYK son referenciales para impresión profesional sobre papel y pueden variar significativamente según el sustrato. Para sublimación sobre poliéster, los colores RGB del archivo digital son la referencia más precisa. Para impresión DTG sobre algodón, se recomienda realizar pruebas de color antes de producir tiradas grandes, ya que la absorción de la tinta varía según el gramaje y el tratamiento de la tela."),
  ];
}

function buildChapter4() {
  return [
    h1("Cap\u00edtulo 4 \u2014 Tipograf\u00edas y Combinaciones"),
    h2("Familias tipogr\u00e1ficas para productos personalizables"),
    p("La tipografía en personalización masiva enfrenta un desafío adicional frente al diseño textil: debe funcionar en superficies tan diversas como la curva de una taza, la textura de un cuaderno de piel, el plástico de una funda de móvil y la tela de una tote bag. Cada sustrato impone restricciones diferentes a la legibilidad, el tamaño mínimo de trazo y la reproducción de detalles finos."),

    h3("Serif"),
    p("Las serif son ideales para productos premium como cuadernos encuadernados, tarjetas de visita, marcos de foto y productos de escritorio. Su elegancia clásica comunica tradición y calidad. Sin embargo, deben usarse con precaución en productos pequeños donde los remates pueden perderse. Ejemplos destacados: Playfair Display para productos luxury, Merriweather para legibilidad en cuadernos, Libre Baskerville para papelería sofisticada. La combinación serif + sans serif es la más versátil para productos multi-categoría."),

    h3("Sans Serif"),
    p("Las sans serif son las tipografías más seguras para personalización masiva porque mantienen su legibilidad en prácticamente cualquier sustrato y tamaño. Son la opción preferida para productos pequeños como llaveros, pins y pegatinas donde el espacio es limitado. Montserrat es la más versátil del mercado: funciona en camisetas, tazas, fundas y papelería con igual eficacia. Bebas Neue ofrece impacto máximo en espacios reducidos. Poppins añade personalidad amigable para productos de regalo."),

    h3("Script"),
    p("Las script añaden personalidad y calidez a productos de regalo y decoración del hogar. Funcionan especialmente bien en tazas, marcos y tarjetas donde el destinatario valora el toque personal. Great Vibes es la script más utilizada en productos personalizados de regalo. Pacifico funciona para productos de estilo surf y verano. Dancing Script es ideal para productos de boda y baby shower. Advertencia: evitar script en productos pequeños y en superficies que distorsionan el texto como botellas cilíndricas."),

    h3("Display, Graffiti, Góticas y Futuristas"),
    p("Las display son las reinas del impacto en productos de merchandising y cultura pop. Lobster domina en productos retro y vintage. Press Start 2P es insustituible para productos gaming. Creepster lidera en Halloween. Para graffiti: Permanent Marker y Streetvertising. Góticas: UnifrakturMaguntia y MedievalSharp. Futuristas: Orbitron y Audiowide para productos tech y cyberpunk. La regla de oro: una display por diseño, acompañada de una sans serif neutra para textos secundarios."),

    h2("Combinaciones tipogr\u00e1ficas profesionales"),
    p("Las combinaciones más efectivas para productos multi-categoría son: Montserrat (título) + Open Sans (cuerpo) para versatilidad total, Playfair Display (título) + Lato (cuerpo) para elegancia premium, Bebas Neue (título) + Roboto (cuerpo) para impacto en productos pequeños, Oswald (título) + Raleway (cuerpo) para deportes y motivación, Pacifico (título) + Montserrat (cuerpo) para regalo y verano. Cada pareja ha sido probada en al menos 10 categorías de productos diferentes."),

    h2("Legibilidad por tipo de producto"),
    p("La legibilidad varía radicalmente según el producto: una taza se lee a 30-50 cm de distancia, un sticker de portátil a 40-60 cm, un poster a 1-3 metros, y una camiseta a 2-5 metros. El tamaño mínimo de fuente legible es diferente en cada caso. Para tazas: mínimo 14pt para texto secundario, 20pt+ para texto principal. Para stickers: mínimo 10pt para detalles, 16pt+ para texto principal. Para posters: mínimo 24pt para subtítulos, 48pt+ para títulos. Estos mínimos deben ajustarse según la técnica de impresión y el sustrato."),

    h2("Tipograf\u00edas gratuitas y premium para producción"),
    p("Google Fonts ofrece la biblioteca más completa de tipografías gratuitas con licencia comercial. Las más utilizadas en personalización masiva son: Montserrat, Bebas Neue, Playfair Display, Oswald, Poppins y Pacifico. Para necesidades premium, Creative Market y MyFonts ofrecen fuentes con características únicas que diferencian los productos. La inversión en tipografía premium se amortiza rápidamente cuando el mismo diseño se aplica a docenas de productos diferentes."),
  ];
}

function buildChapter5() {
  return [
    h1("Cap\u00edtulo 5 \u2014 Estilos de Dise\u00f1o para Productos Personalizables"),
    p("En la personalización masiva, cada estilo de diseño tiene afinidad natural con ciertas categorías de productos. El vintage distressed funciona excepcionalmente en camisetas y tazas pero pierde detalles en stickers pequeños. El minimalismo premium domina en productos de escritorio y hogar. El cyberpunk es ideal para periféricos gaming y skins. Comprender estas afinidades permite asignar cada estilo a los productos donde genera mayor impacto comercial."),

    h2("Vintage Distressed"),
    p("El vintage distressed aprovecha las texturas desgastadas para crear una estética nostálgica que funciona especialmente bien en productos que evocan tradición y autenticidad: tazas con frases retro, camisetas de bandas ficticias, posters de viajes imaginarios y tote bags con logos anticuados. La textura distressed añade profundidad visual que compensa la relativa simplicidad del concepto. En productos pequeños como stickers y pins, la textura debe simplificarse para mantener la legibilidad, pero el espíritu desgastado se conserva mediante paletas apagadas y bordes irregulares."),

    h2("Minimalista"),
    p("El minimalismo es el estilo más rentable en personalización masiva porque es el más escalable: un diseño minimalista funciona en prácticamente todas las categorías de productos sin necesidad de adaptaciones significativas. Una frase tipográfica limpia en Montserrat bold sobre fondo blanco se ve igualmente profesional en una taza, una camiseta, un cuaderno o una funda de móvil. Esta universalidad reduce los costos de producción y permite lanzar colecciones completas con un solo concepto de diseño."),

    h2("Streetwear y Retro"),
    p("El streetwear se concentra en camisetas oversized, gorras, hoodies y stickers, con expansión hacia skate decks y accesorios urbanos. El retro abarca un espectro más amplio: desde productos de cocina con estética 50s hasta accesorios tech con diseño 80s. La clave del éxito en ambos estilos es la coherencia de la colección: todos los productos deben compartir la misma paleta, tipografía y sistema visual para crear una oferta de marca reconocible."),

    h2("Y2K, Cyberpunk y Vaporwave"),
    p("El Y2K funciona mejor en productos de moda juvenil: fundas de móvil, pins, camisetas cropped y accesorios de belleza. El cyberpunk domina en periféricos de gaming: mousepads XL, desk mats, skins para consolas y teclados. El vaporwave se desempeña mejor en productos de decoración: posters, tazas, stickers para portátiles y fundas. Los tres estilos comparten la estética neón y la nostalgia digital, pero se diferencian en su aplicación práctica."),

    h2("Kawaii, Anime y Cartoon"),
    p("El kawaii lidera en productos de regalo y papelería: washi tape, stickers, tarjetas, agendas y productos de oficina. El anime domina en posters, fundas de móvil, body pillows y figuras coleccionables. El cartoon occidental funciona bien en productos infantiles: mochilas, termos, camisetas y puzzles. Los tres estilos son altamente coleccionables, lo que genera ventas repetidas del mismo cliente cuando se lanzan series temáticas."),

    h2("Tattoo Style, Hand Drawn y Grunge"),
    p("El tattoo style se adapta a productos de lifestyle y cultura alternativa: tazas, camisetas, patches, pins y stickers. El hand drawn funciona mejor en productos artesanales y eco-friendly: tote bags de algodón orgánico, tarjetas recicladas, packaging kraft. El grunge domina en productos de música y contracultura: posters, camisetas de bandas, stickers y accesorios de cuero. Los tres estilos comunican autenticidad y rebeldía."),

    h2("Luxury Fashion, Oversized y Scandinavian"),
    p("El luxury se aplica a productos premium: marcos de foto con acabado mate, cuadernos de piel, joyería personalizada y accesorios de escritorio. El oversized print se limita principalmente a prendas textiles donde la cobertura total genera impacto. El estilo scandinavo lidera en productos de hogar y decoración: cojines, mantas, tazas de cerámica y organizadores. La sofisticación silenciosa de estos estilos justifica precios premium y fideliza clientes que valoran la calidad sobre la novedad."),
  ];
}

function buildChapter6() {
  return [
    h1("Cap\u00edtulo 6 \u2014 T\u00e9cnicas de Impresi\u00f3n y Producción"),
    p("La personalización masiva requiere dominar un espectro más amplio de técnicas de impresión que el diseño textil convencional. Cada categoría de producto tiene sus técnicas óptimas, y un productor profesional debe conocer las fortalezas, limitaciones y costos de cada una para tomar decisiones informadas que maximicen la calidad y la rentabilidad."),

    makeTable(
      ["T\u00e9cnica", "Productos Ideales", "Ventajas", "Desventajas", "Costo/Unidad", "Calidad", "Durabilidad"],
      [
        ["Serigraf\u00eda", "Camisetas, tote bags, posters", "Alta calidad, rentable en volumen", "Setup costoso, no viable para tiradas cortas", "$1-3 (vol.)", "Excelente", "50+ lavados"],
        ["DTG", "Camisetas, tote bags de algod\u00f3n", "Sin setup, fotorealista", "Solo algod\u00f3n, costo unitario alto", "$5-12", "Muy buena", "30-40 lavados"],
        ["DTF", "Camisetas, bolsas, cualquier tela", "Colores vibrantes, cualquier tela", "Textura ligeramente pl\u00e1stica", "$3-8", "Buena", "40-50 lavados"],
        ["Sublimaci\u00f3n", "Tazas, botellas, camisetas poli\u00e9ster", "Permanente, colores brillantes", "Solo poli\u00e9ster/telas claras", "$2-5", "Excelente", "Permanente"],
        ["UV Printing", "Tazas, botellas, fundas, llaveros", "Alta resoluci\u00f3n, vers\u00e1til", "Equipo costoso, superficie limitada", "$3-10", "Excelente", "1-3 a\u00f1os"],
        ["Impresi\u00f3n l\u00e1ser", "Llaveros, tags, placas, trofeos", "Extremadamente precisa, permanente", "Solo materiales grabables", "$2-8", "Premium", "Permanente"],
        ["Transfer t\u00e9rmico", "Camisetas, bolsas, delantales", "F\u00e1cil de aplicar, vers\u00e1til", "Sensaci\u00f3n pl\u00e1stica, se agrieta", "$1-4", "Buena", "20-30 lavados"],
        ["Bordado", "Gorras, camisetas, toallas, bolsas", "Premium, textura 3D", "Costoso, limitado en colores", "$8-20", "Premium", "Permanente"],
        ["Vinilo textil", "Camisetas, bolsas, gorras", "Preciso, brillante", "No apto para detalles finos", "$2-6", "Buena", "30-50 lavados"],
        ["Hot stamping", "Cajas, tarjetas, cuero, madera", "Acabado met\u00e1lico premium", "Setup costoso, limitado a una capa", "$3-12", "Premium", "Permanente"],
      ],
      [12, 16, 18, 18, 10, 10, 12]
    ),
    emptyLine(),

    h2("Sublimación: la técnica estrella de la personalización"),
    p("La sublimación es la técnica más importante en la personalización masiva de productos no textiles. Funciona en tazas, botellas, platos, puzzles, cojines, camisetas de poliéster y cualquier producto con recubrimiento de sublimación. El proceso convierte la tinta en gas que penetra permanentemente en la superficie del sustrato, creando una unión molecular que no se decolora, no se descascara y no se siente al tacto. Los equipos necesarios incluyen una impresora de sublimación (Epson SureColor o Sawgrass), papel de sublimación, cinta térmica y una prensa de calor específica para cada tipo de producto."),

    h2("UV Printing: versatilidad sin límites"),
    p("La impresión UV es la técnica más versátil del mercado de personalización porque puede imprimir sobre prácticamente cualquier superficie: cerámica, vidrio, metal, plástico, madera y cuero. Utiliza tintas curadas por luz ultravioleta que se solidifican instantáneamente sobre la superficie, lo que permite imprimir sobre objetos tridimensionales como tazas, botellas, llaveros y fundas de móvil. La inversión en equipos es significativa ($5,000-$20,000) pero la versatilidad productiva justifica la inversión para operaciones de mediana escala."),

    h2("Grabado láser: personalización permanente"),
    p("El grabado láser elimina material de la superficie para crear diseños permanentes e indelebles. Es ideal para productos de madera, cuero, metal, vidrio y acrílico donde la permanencia es un atributo de valor. Los productos estrella del láser incluyen llaveros grabados, tarjetas de visita de metal, trofeos personalizados, cajas de madera y productos de cuero como carteras y portafolios. La precisión del láser permite detalles extremadamente finos que serían imposibles con otras técnicas, y el resultado tiene una percepción de calidad premium que justifica precios elevados."),

    h2("Flujo de trabajo multi-producto"),
    p("La gestión eficiente de un flujo de trabajo multi-producto requiere un sistema centralizado de gestión de archivos que mantenga las variantes de cada diseño organizadas por producto, técnica de impresión y especificaciones técnicas. El flujo profesional incluye: (1) Recepción y validación del pedido con especificaciones de producto. (2) Selección automática de la variante de diseño correcta según el producto y técnica. (3) Pre-producción con pruebas de color y verificación de zonas seguras. (4) Producción simultánea de múltiples productos del mismo pedido cuando es posible. (5) Control de calidad con verificación visual y empacado personalizado. (6) Envío con tracking y notificación al cliente."),
  ];
}

function buildChapter7() {
  return [
    h1("Cap\u00edtulo 7 \u2014 Materiales y Sustratos"),
    p("El conocimiento profundo de los materiales y sustratos es lo que diferencia un productor amateur de un profesional en personalización masiva. Cada material tiene sus propias características de absorción, reflejo, durabilidad y compatibilidad con técnicas de impresión que condicionan directamente la calidad del producto final y la satisfacción del cliente."),

    makeTable(
      ["Sustrato", "Productos", "T\u00e9cnica Ideal", "Gramaje/Espesor", "Tacto", "Durabilidad", "Costo"],
      [
        ["Algod\u00f3n peinado", "Camisetas, tote bags, delantales", "DTG, serigraf\u00eda, DTF", "150-180 gsm", "Suave, natural", "Alta", "Medio"],
        ["Poli\u00e9ster", "Camisetas deportivas, botellas, mochilas", "Sublimaci\u00f3n, DTF", "140-160 gsm", "Liso, ligero", "Muy alta", "Bajo"],
        ["Cer\u00e1mica", "Tazas, platos, tazones", "Sublimaci\u00f3n, UV printing", "3-5 mm pared", "Lisa, rígida", "Excelente", "Bajo-medio"],
        ["Acero inoxidable", "Botellas, termos, llaveros", "Sublimaci\u00f3n, grabado l\u00e1ser", "0.3-0.8 mm", "Lisa, fría", "Excelente", "Medio"],
        ["Vidrio", "Tazas, ornamentas, placas", "UV printing, grabado l\u00e1ser", "2-5 mm", "Lisa, transparente", "Alta", "Medio"],
        ["Madera", "Llaveros, cajas, trofeos, ornaments", "Grabado l\u00e1ser, UV printing", "3-10 mm", "Cálida, texturada", "Alta", "Medio-alto"],
        ["Cuero / PU", "Carteras, portafolios, tags", "Grabado l\u00e1ser, hot stamping", "1-2 mm", "Suave, premium", "Excelente", "Alto"],
        ["Acr\u00edlico", "Llaveros, placas, decoraci\u00f3n", "UV printing, grabado l\u00e1ser", "2-5 mm", "Lisa, brillante", "Alta", "Medio"],
        ["Silicona", "Pulseras, llaveros, mugs plegables", "Serigraf\u00eda, tampograf\u00eda", "1-3 mm", "Suave, flexible", "Media-alta", "Bajo-medio"],
        ["Papel/Kraft", "Cajas, tags, tarjetas, packaging", "Impresi\u00f3n digital, hot stamping", "200-400 gsm", "Mate, natural", "Media", "Bajo"],
      ],
      [12, 18, 16, 12, 12, 12, 10]
    ),
    emptyLine(),

    p("La selección del sustrato correcto es una decisión estratégica que afecta la calidad percibida, el costo de producción, la técnica de impresión viable y el precio de venta final. Para operaciones de personalización masiva, se recomienda estandarizar un catálogo de 10-15 sustratos base que cubran todas las categorías principales, permitiendo ofrecer un rango amplio de productos sin dispersar excesivamente la operación productiva."),
  ];
}

function buildChapter8() {
  return [
    h1("Cap\u00edtulo 8 \u2014 Herramientas de Dise\u00f1o y Software"),
    p("El ecosistema de herramientas para personalización masiva es más amplio y complejo que el del diseño textil puro, ya que debe cubrir no solo la generación de diseños sino también la gestión de plantillas multi-producto, la automatización de variantes y la integración con plataformas de producción y e-commerce."),

    makeTable(
      ["Herramienta", "Tipo", "Usos Ideales", "IA Integrada", "Costo", "Nivel"],
      [
        ["Adobe Illustrator", "Vectorial", "Plantillas multi-producto, logos, tipografía", "Generative Fill (parcial)", "$22/mes", "Avanzado"],
        ["Photoshop", "Raster", "Mockups, texturas, preparación de archivos", "Firefly, Neural Filters", "$22/mes", "Avanzado"],
        ["CorelDRAW", "Vectorial", "Diseño textil, separación de colores", "PowerTRACE", "$26/mes", "Intermedio-Adv"],
        ["Canva", "Híbrido", "Diseños rápidos, mockups, social media", "Magic Design, Magic Write", "Gratis-Pro", "Principiante"],
        ["Figma", "Vectorial/UI", "Configuradores de producto, colaboración", "Plugins de IA", "Gratis-Pro", "Intermedio"],
        ["Procreate", "Raster/Ilustración", "Ilustración, hand lettering", "No nativa", "$13 único", "Intermedio-Adv"],
        ["Midjourney", "IA Generativa", "Ilustraciones, arte, estilos variados", "Nativa", "$10-60/mes", "Todos"],
        ["Nano Banana", "IA Generativa", "Diseños para productos POD", "Nativa", "Freemium", "Todos"],
        ["ChatGPT", "IA Texto", "Prompts, copy, nombres, descripciones", "GPT-4, DALL-E", "Gratis-Pro", "Todos"],
        ["Leonardo AI", "IA Generativa", "Arte, personajes, consistencia de estilo", "Nativa", "Gratis-Pro", "Intermedio"],
        ["Ideogram", "IA Generativa", "Tipografía integrada, diseños complejos", "Nativa", "Freemium", "Todos"],
        ["Kittl", "Híbrido", "Diseño textil, mockups, plantillas", "Generativa", "Gratis-Pro", "Principiante-Int"],
        ["Placeit", "Mockups", "Mockups de producto, videos marketing", "No", "$8-15/mes", "Todos"],
        ["Printify/Printful", "Plataforma POD", "Producción, fulfillment, integración", "Generador de diseño", "Gratis-Pro", "Todos"],
      ],
      [12, 12, 22, 14, 12, 12]
    ),
    emptyLine(),

    h2("Flujo de trabajo con IA para multi-producto"),
    p("El flujo profesional para personalización masiva con IA se estructura en cinco fases: (1) Investigación y conceptualización: ChatGPT para análisis de nichos, generación de ideas y elaboración de prompts detallados para cada categoría de producto. (2) Generación de arte: Midjourney o Leonardo AI para ilustraciones base, iterando hasta obtener resultados que funcionen en múltiples formatos. (3) Adaptación multi-producto: Photoshop para crear variantes de cada diseño optimizadas para las dimensiones y especificaciones de cada producto en el catálogo. (4) Mockup y validación: Placeit o Kittl para generar mockups realistas que permitan evaluar el diseño en contexto antes de la producción. (5) Producción y distribución: Printify o Printful para fulfillment automatizado, o producción propia con control de calidad manual."),

    h2("Automatización de variantes de diseño"),
    p("La clave de la rentabilidad en personalización masiva es la automatización. Cada concepto de diseño debe generar automáticamente variantes para todos los productos del catálogo: diferentes tamaños, formatos, colores de fondo y adaptaciones de sustrato. Photoshop Actions e Illustrator Scripts permiten automatizar la generación de variantes, reduciendo horas de trabajo manual a minutos de procesamiento automático. Combinado con los outputs de IA generativa, un diseñador puede producir un ecosistema completo de 20-30 variantes de producto a partir de un solo concepto en menos de una hora."),
  ];
}

function buildChapter9() {
  return [
    h1("Cap\u00edtulo 9 \u2014 Formatos y Preparaci\u00f3n de Archivos"),
    p("La preparación de archivos para personalización masiva es significativamente más compleja que para un solo tipo de producto porque cada categoría tiene sus propias especificaciones de resolución, tamaño, espacio de color y zonas seguras. Un sistema organizado de gestión de archivos es esencial para mantener la calidad y eficiencia en la producción multi-producto."),

    makeTable(
      ["Formato", "Tipo", "Resoluci\u00f3n", "Transparencia", "Uso Principal", "Plataformas POD"],
      [
        ["PNG", "Raster", "300 DPI mínimo", "Sí (alpha)", "DTG, DTF, sublimación, UV", "Todas"],
        ["SVG", "Vectorial", "Infinita", "Sí", "Serigrafía, láser, corte", "Limitadas"],
        ["EPS", "Vectorial", "Infinita", "Sí", "Serigrafía profesional", "Imprentas"],
        ["AI", "Vectorial", "Infinita", "Sí", "Archivo maestro editable", "Interno"],
        ["PDF", "Híbrido", "300 DPI / Vector", "Sí", "Envío universal", "Todas"],
        ["PSD", "Raster (capas)", "300 DPI mínimo", "Sí", "Archivo maestro con capas", "Interno"],
        ["TIFF", "Raster", "300 DPI mínimo", "Sí", "Alta calidad, archivo", "Imprentas"],
        ["JPEG", "Raster", "300 DPI mínimo", "No", "Sublimación, fotos", "Algunas"],
      ],
      [10, 12, 16, 14, 24, 24]
    ),
    emptyLine(),

    h2("Especificaciones por categoría de producto"),
    p("Cada categoría de producto tiene especificaciones de archivo únicas. Camisetas: 4500x5400 px PNG a 300 DPI con fondo transparente. Tazas: 2700x1200 px para impresión completa, 10x20 cm área de impresión segura. Botellas térmicas: 2400x900 px para wrap-around. Mousepads: 3600x3600 px para formato XL. Stickers: 1200x1200 px mínimo con línea de corte. Fundas de móvil: varía por modelo, 1500x2800 px promedio. Posters: 6000x8000 px para A2, 4000x6000 px para A3. La estandarización de tamaños de lienzo acelera enormemente el flujo de producción."),

    h2("Preparación para plataformas POD"),
    p("Cada plataforma tiene requisitos específicos. Printify acepta PNG de mínimo 300 DPI con fondo transparente. Printful exige PNG de 200-300 DPI con zonas seguras respetadas. Zazzle permite PNG, JPEG y SVG con resolución mínima de 150 DPI. Redbubble acepta PNG y JPEG hasta 4000x4000 px. Merch by Amazon requiere PNG de 4500x5400 px. La práctica profesional es mantener archivos maestros en PSD a 600 DPI y exportar las variantes específicas para cada plataforma desde el archivo maestro."),

    h2("Gestión de archivos multi-producto"),
    p("Un sistema de gestión de archivos eficiente es crítico para la personalización masiva. La estructura de carpetas recomendada es: NombreDelDiseño / originals / camisetas / tazas / stickers / posters / fundas / otros, con convenciones de nomenclatura consistentes como: [Diseño]_[Producto]_[Variante]_[Tamaño].[formato]. Los archivos maestros PSD deben mantener las capas organizadas: ilustración, tipografía, fondos y máscaras como grupos separados, facilitando la edición y derivación de variantes."),
  ];
}

function buildChapter10() {
  return [
    h1("Cap\u00edtulo 10 \u2014 Estrategias Comerciales"),
    p("La personalización masiva abre oportunidades comerciales que van mucho más allá de la venta de productos individuales. Las estrategias más rentables combinan la venta directa al consumidor con modelos de suscripción, marketplace y B2B que maximizan el valor de cada diseño y cada cliente."),

    h2("Validación de nichos multi-producto"),
    p("La validación de nichos para personalización masiva debe considerar no solo la demanda del concepto sino también la viabilidad de aplicarlo a múltiples categorías de productos. Un nicho válido para camisetas puede no funcionar en tazas o mousepads. La metodología incluye: (1) Análisis de volumen de búsqueda por categoría de producto en Google Trends y Amazon. (2) Evaluación de la competencia en cada marketplace y categoría. (3) Prueba de concepto con 3-5 productos de diferentes categorías. (4) Medición de la tasa de conversión y el ticket promedio por categoría. (5) Escalamiento priorizando las categorías con mejor rendimiento."),

    h2("SEO para Etsy y marketplaces"),
    p("El SEO en marketplaces de personalización requiere una estrategia diferente al SEO textil porque la competencia es más amplia y las categorías más diversas. En Etsy, los títulos deben incluir producto + tema + estilo + ocasión: Vintage Nurse Coffee Mug Funny Gift. Los tags deben cubrir variaciones de producto (coffee mug, ceramic cup, tea cup) y tema (nurse gift, medical, healthcare). Las descripciones deben detallar dimensiones, materiales, técnicas de impresión y opciones de personalización. Herramientas esenciales: eRank para análisis de keywords, Marmalead para tendencias de Etsy."),

    h2("Plataformas y modelos de negocio"),
    p("Los cuatro modelos principales de negocio en personalización masiva son: (1) Marketplace POD: Merch by Amazon, Redbubble, Zazzle — bajo riesgo, bajos márgenes ($2-8 por venta). (2) Tienda propia con fulfillment POD: Shopify + Printify/Printful — control total, márgenes medios ($8-20 por venta). (3) Producción propia: inversión en equipos, control de calidad total, márgenes altos ($15-40 por venta). (4) Plataforma de personalización como servicio: licenciar la tecnología de personalización a otras empresas — modelo B2B con ingresos recurrentes. La estrategia óptima combina múltiples modelos simultáneamente."),

    h2("Branding para marcas de personalización"),
    p("Crear una marca de personalización requiere definir una identidad visual coherente que se mantenga a través de todas las categorías de producto. Los elementos esenciales incluyen: un nombre que comunique personalización y exclusividad, un logo que funcione tanto en una etiqueta de camiseta como en una caja de envío, una paleta de color consistente, un sistema tipográfico reconocible, y un estilo de fotografía y mockup que diferencie la marca de la competencia genérica."),

    h2("Creación de colecciones multi-producto"),
    p("Las colecciones multi-producto son la unidad de venta más poderosa en la personalización masiva. Una colección bien diseñada ofrece al cliente un universo coordinado de productos que invita a compras múltiples: la taza que combina con la camiseta, el mousepad que complementa el sticker, el poster que completa la decoración. La estrategia de lanzamiento incluye: diseño de 5-8 conceptos base, derivación a 3-5 categorías de producto cada uno, mockups consistentes de la colección completa, estrategia de bundling con descuentos por compra combinada, y lanzamiento escalonado para mantener la atención del público durante semanas."),

    h2("Estrategias B2B y merchandising corporativo"),
    p("El mercado B2B de personalización corporativa es significativamente más rentable que el B2C: las empresas compran en volumen, pagan precios premium por calidad y servicio, y generan pedidos recurrentes. Los productos más demandados en B2B incluyen: kits de onboarding para nuevos empleados, merchandising para eventos y conferencias, regalos corporativos para clientes, uniformes personalizados, y material de oficina branded. La clave del éxito B2B es ofrecer un portal de personalización propio donde el cliente pueda gestionar sus pedidos, visualizar productos y aprobar diseños de manera autónoma."),
  ];
}

function buildAnnex() {
  const prompts = [
    // NAVIDAD (5)
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas holiday personalized gift theme. Bold clean vector outlines combined with photorealistic rendering, festive ornament with name plate and holly berries, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text, slogan or phrase in ENGLISH related to the Christmas theme: BEST GIFT EVER, integrated naturally into the composition, using a festive script font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal in Photoshop, no background scenery, no shadows touching the edges, clean silhouette separation. Product customization design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas mug customization theme. Bold clean vector outlines, Christmas tree mug wrap design with candy canes and snowflakes, photorealistic rendering, sharp shading, rich red green and white palette. Typography: SANTA'S FAVORITE in bold display font. English only. Centered composition, chroma magenta background, clean silhouette. Product customization design, 4K, professional graphic design."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas ornament personalization theme. Bold clean vector outlines, decorative bauble with gift bow and stars, photorealistic rendering, sharp shading, gold and burgundy palette. Typography: MAKING SPIRITS BRIGHT in elegant serif font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas gift tag theme. Bold clean vector outlines, holiday gift tag with reindeer and bell, photorealistic rendering, sharp shading, cream and red palette. Typography: TO: ___ FROM: ___ in clean sans serif font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas wrapping paper theme. Bold clean vector outlines, seamless pattern of snowflakes and gingerbread men, photorealistic rendering, sharp shading, warm cream and red palette. Typography: HAPPY HOLIDAYS in retro display font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // HALLOWEEN (5)
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween custom tumbler theme. Bold clean vector outlines combined with photorealistic rendering, spooky ghost with BOO text and spider web pattern, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich black purple and orange palette with smooth gradients. Typography: SPOOKY SIPS in dripping horror font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, professional graphic design, trending on Behance."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween sticker sheet theme. Bold clean vector outlines, collection of cute monster stickers with pumpkins and bats, photorealistic rendering, sharp shading, vibrant orange and purple palette. Typography: TRICK OR TREAT in playful display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween phone case theme. Bold clean vector outlines, skull with roses and candle pattern, photorealistic rendering, sharp shading, deep purple and black palette. Typography: DARK VIBES in gothic font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween candy bag theme. Bold clean vector outlines, trick-or-treat bag with witch hat and cat silhouette, photorealistic rendering, sharp shading, green and orange palette. Typography: FRIGHT NIGHT in display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween door sign theme. Bold clean vector outlines, haunted house door hanger with bats and moon, photorealistic rendering, sharp shading, midnight blue and yellow palette. Typography: BEWARE in stencil font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // ANIME (5)
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime phone case customization theme. Bold clean vector outlines combined with photorealistic rendering, anime warrior princess with cherry blossoms and katana, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich pink cyan and gold palette with smooth gradients. Typography: WARRIOR PRINCESS in Japanese brush font style. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime desk mat theme. Bold clean vector outlines, kawaii cat cafe scene with pastries and stars, photorealistic rendering, sharp shading, pastel pink and mint palette. Typography: KAWAII CAFE in bubbly display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime poster theme. Bold clean vector outlines, dragon summoner with magical circle and energy, photorealistic rendering, sharp shading, crimson and gold palette. Typography: DRAGON SUMMONER in bold display font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime sticker pack theme. Bold clean vector outlines, chibi characters collection with food and magical items, photorealistic rendering, sharp shading, rainbow pastel palette. Typography: CHIBI SQUAD in cute display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime laptop skin theme. Bold clean vector outlines, mecha robot with cityscape and hologram interface, photorealistic rendering, sharp shading, blue and orange palette. Typography: MECHA FORCE in futuristic font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // GAMING (5)
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming mousepad XL theme. Bold clean vector outlines combined with photorealistic rendering, gaming warrior with energy sword and neon cityscape, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich neon cyan magenta and black palette with smooth gradients. Typography: LEGENDARY PLAYER in bold futuristic font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming controller skin theme. Bold clean vector outlines, controller with pixel art dragon and fire, photorealistic rendering, sharp shading, red and black palette. Typography: FIRE BREATH in pixel font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming desk mat theme. Bold clean vector outlines, cyberpunk cityscape with gaming headset silhouette, photorealistic rendering, sharp shading, purple and green palette. Typography: NEXT LEVEL in glitch font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming tumbler theme. Bold clean vector outlines, loot box with gems and gold coins explosion, photorealistic rendering, sharp shading, gold and purple palette. Typography: EPIC LOOT in bold display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming keycap set theme. Bold clean vector outlines, RPG character classes icons with sword and shield, photorealistic rendering, sharp shading, silver and blue palette. Typography: CHOOSE YOUR CLASS in monospace font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // FITNESS (5)
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness water bottle theme. Bold clean vector outlines combined with photorealistic rendering, muscular arm curling dumbbell with lightning energy, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich black red and gold palette with smooth gradients. Typography: BEAST MODE in bold stencil font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness gym bag theme. Bold clean vector outlines, kettlebell with wings and motivational fire, photorealistic rendering, sharp shading, black and orange palette. Typography: NO EXCUSES in bold sans serif font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness yoga mat theme. Bold clean vector outlines, lotus pose silhouette with mandala and energy waves, photorealistic rendering, sharp shading, teal and purple palette. Typography: FIND YOUR ZEN in elegant script font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness towel theme. Bold clean vector outlines, running shoes with speed lines and mountain trail, photorealistic rendering, sharp shading, green and black palette. Typography: TRAIL RUNNER in display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness protein shaker theme. Bold clean vector outlines, flexed bicep with crown and stars, photorealistic rendering, sharp shading, gold and black palette. Typography: STAY STRONG in bold condensed font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // RELIGIÓN (5)
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith candle customization theme. Bold clean vector outlines combined with photorealistic rendering, cross with rays of light and olive branch, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich gold cream and white palette with smooth gradients. Typography: FAITH OVER FEAR in elegant serif font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith journal cover theme. Bold clean vector outlines, open Bible with lighthouse and ocean waves, photorealistic rendering, sharp shading, navy and gold palette. Typography: GUIDING LIGHT in serif font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith tote bag theme. Bold clean vector outlines, praying hands with dove and sunburst, photorealistic rendering, sharp shading, warm cream and burgundy palette. Typography: PRAY WITHOUT CEASING in script font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith keychain theme. Bold clean vector outlines, ichthys fish symbol with cross and water, photorealistic rendering, sharp shading, silver and blue palette. Typography: BELIEVE in sans serif font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith photo frame theme. Bold clean vector outlines, ornate frame with angel wings and halo, photorealistic rendering, sharp shading, white and gold palette. Typography: BLESSED in hand-lettered font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // STREETWEAR (5)
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear hoodie customization theme. Bold clean vector outlines combined with photorealistic rendering, snarling panther with gold chain and urban graffiti, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich black red and gold palette with smooth gradients. Typography: SAVAGE MODE in gothic font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear cap theme. Bold clean vector outlines, crown with wings and city skyline, photorealistic rendering, sharp shading, black and gold palette. Typography: KINGPIN in bold display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear backpack theme. Bold clean vector outlines, skull with headphones and spray can, photorealistic rendering, sharp shading, neon green and black palette. Typography: STREET KINGS in stencil font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear phone grip theme. Bold clean vector outlines, dollar sign with flames and dice, photorealistic rendering, sharp shading, red and black palette. Typography: HUSTLE in bold condensed font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear sticker pack theme. Bold clean vector outlines, collection of urban icons: boombox, sneakers, crown, diamond, photorealistic rendering, sharp shading, multicolor on black palette. Typography: O.G. VIBES in display font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // VINTAGE (5)
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage mug customization theme. Bold clean vector outlines combined with photorealistic rendering, classic motorcycle with eagle wings and mountain sunset, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich warm brown and cream palette with smooth gradients. Typography: RIDE FREE in vintage retro font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage tote bag theme. Bold clean vector outlines, retro camping scene with tent and pine trees, photorealistic rendering, sharp shading, forest green and orange palette. Typography: ADVENTURE AWAITS in retro display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage notebook cover theme. Bold clean vector outlines, old typewriter with coffee cup and plant, photorealistic rendering, sharp shading, cream and burgundy palette. Typography: WRITE YOUR STORY in serif font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage poster theme. Bold clean vector outlines, classic car with route 66 sign and desert, photorealistic rendering, sharp shading, teal and rust palette. Typography: ROAD TRIP in retro script font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage coaster set theme. Bold clean vector outlines, retro diner elements: milkshake jukebox and records, photorealistic rendering, sharp shading, cherry red and cream palette. Typography: SWEET MEMORIES in vintage display font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // MOTIVACIONAL (5)
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivational desk accessories theme. Bold clean vector outlines combined with photorealistic rendering, phoenix rising from flames with stars and light rays, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich deep blue and gold palette with smooth gradients. Typography: RISE ABOVE in bold sans serif font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivational notebook theme. Bold clean vector outlines, mountain peak with sunrise and flag, photorealistic rendering, sharp shading, navy and gold palette. Typography: NEVER QUIT in bold condensed font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivational water bottle theme. Bold clean vector outlines, rocket launching through clouds with stars, photorealistic rendering, sharp shading, silver and blue palette. Typography: DREAM BIG in display font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivational mousepad theme. Bold clean vector outlines, arrow hitting bullseye with energy burst, photorealistic rendering, sharp shading, red and black palette. Typography: STAY FOCUSED in stencil font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivational phone case theme. Bold clean vector outlines, tree growing from concrete with golden leaves, photorealistic rendering, sharp shading, green and gold palette. Typography: GROW THROUGH IT in hand-lettered font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},

    // PROFESIONES (5)
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, nurse custom tumbler theme. Bold clean vector outlines combined with photorealistic rendering, nurse cap with stethoscope and heartbeat line, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich pink blue and white palette with smooth gradients. Typography: NURSE LIFE in bold sans serif font. English only. Centered composition, chroma green background, clean silhouette. Product customization design, 4K, trending on Behance."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, firefighter badge theme. Bold clean vector outlines, firefighter helmet with axe and flames, photorealistic rendering, sharp shading, red and yellow palette. Typography: BRAVE HEART in bold display font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, programmer desk mat theme. Bold clean vector outlines, laptop with code rain and coffee cup, photorealistic rendering, sharp shading, green and black palette. Typography: CODE & COFFEE in monospace font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, teacher appreciation mug theme. Bold clean vector outlines, apple with pencil and stack of books, photorealistic rendering, sharp shading, red and cream palette. Typography: BEST TEACHER in hand-lettered font. English only. Centered composition, chroma magenta background, clean silhouette. Product design, 4K."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, architect portfolio theme. Bold clean vector outlines, compass with blueprint and modern building, photorealistic rendering, sharp shading, navy and white palette. Typography: DESIGN THE FUTURE in serif font. English only. Centered composition, chroma green background, clean silhouette. Product design, 4K."},
  ];

  const content = [
    h1("Anexo Premium \u2014 Biblioteca de 50 Prompts IA"),
    p("Esta biblioteca presenta 50 prompts avanzados y optimizados para generar dise\u00f1os de productos personalizados utilizando herramientas de IA generativa como Midjourney, Nano Banana, Leonardo AI, Ideogram y DALL-E. Cada prompt ha sido dise\u00f1ado para producir dise\u00f1os aplicables a categor\u00edas espec\u00edficas de productos personalizables, con fondo crom\u00e1tico para f\u00e1cil remoci\u00f3n, tipograf\u00eda integrada en ingl\u00e9s y especificaciones de producci\u00f3n."),
    p("Instrucciones de uso: Copia el prompt completo, reemplaza los campos variables si los hay, y p\u00e9galo en tu herramienta de IA generativa. Despu\u00e9s de generar la imagen, remueve el fondo crom\u00e1tico en Photoshop, adapta las dimensiones al producto espec\u00edfico, ajusta colores si es necesario, a\u00f1ade o modifica tipograf\u00eda, y exporta en el formato y resoluci\u00f3n requeridos por cada plataforma de producci\u00f3n."),
  ];

  const categories = {};
  for (const item of prompts) {
    if (!categories[item.cat]) categories[item.cat] = [];
    categories[item.cat].push(item.prompt);
  }

  let promptIndex = 1;
  for (const [cat, catPrompts] of Object.entries(categories)) {
    content.push(h2(cat));
    for (const pr of catPrompts) {
      content.push(h3(`Prompt ${promptIndex}`));
      const parts = [];
      if (pr.length > 300) {
        const sentences = pr.split('. ');
        let current = '';
        for (const s of sentences) {
          if (current.length + s.length > 250) { parts.push(current.trim()); current = s + '. '; }
          else { current += s + '. '; }
        }
        if (current.trim()) parts.push(current.trim());
      } else { parts.push(pr); }
      for (const part of parts) { content.push(p(part)); }
      promptIndex++;
    }
  }
  return content;
}

// ============================================================
// BUILD DOCUMENT
// ============================================================
async function main() {
  const coverImageBuffer = fs.readFileSync("/home/z/my-project/download/cover_customization_manual.png");

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 24, color: c(P.body) },
          paragraph: { spacing: { line: 312 } },
        },
        heading1: {
          run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) },
          paragraph: { spacing: { before: 480, after: 200, line: 312 } },
        },
        heading2: {
          run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) },
          paragraph: { spacing: { before: 360, after: 160, line: 312 } },
        },
        heading3: {
          run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 24, bold: true, color: c(P.primary) },
          paragraph: { spacing: { before: 280, after: 120, line: 312 } },
        },
      },
    },
    numbering: { config: [] },
    sections: [
      // SECTION 1: COVER
      {
        properties: {
          page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
        },
        children: buildCover({
          title: "Manual Premium de Personalización Masiva de Productos con IA",
          subtitle: "Guía Profesional de Diseño, Producción y Comercialización de Productos Personalizables",
          englishLabel: "PREMIUM MASS CUSTOMIZATION MANUAL",
          metaLines: [
            "Edición 2026 — Print On Demand & AI Product Design",
            "Nichos, Técnicas, Materiales, Paletas, Tipografías y 50 Prompts",
          ],
          footerLeft: "AI-Powered Customization",
          footerRight: "2026 Edition",
          palette: {
            bg: P.bg, accent: P.accent,
            titleColor: P.titleColor, subtitleColor: P.subtitleColor,
            metaColor: P.metaColor, footerColor: P.footerColor,
          },
        }),
      },
      // SECTION 2: FRONT MATTER (TOC)
      {
        properties: {
          type: "nextPage",
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
            pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
          },
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({ alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })] })],
          }),
        },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
            children: [new ImageRun({ data: coverImageBuffer, transformation: { width: 500, height: 286 }, type: "png" })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480, after: 360 },
            children: [new TextRun({ text: "Tabla de Contenido", bold: true, size: 32,
              font: { ascii: "Calibri", eastAsia: "SimHei" }, color: c(P.primary) })] }),
          new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
          new Paragraph({ spacing: { before: 200 },
            children: [new TextRun({
              text: "Nota: Esta Tabla de Contenido se genera mediante códigos de campo. Para asegurar la precisión de los números de página después de editar, haga clic derecho en la TOC y seleccione \"Actualizar campo\".",
              italics: true, size: 18, color: "888888",
            })] }),
          new Paragraph({ children: [new TextRun({ text: ' ' }), new PageBreak()] }),
        ],
      },
      // SECTION 3: BODY
      {
        properties: {
          type: "nextPage",
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
          },
        },
        headers: {
          default: new Header({
            children: [new Paragraph({ alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: "Manual Premium de Personalización Masiva de Productos con IA",
                size: 16, color: c(P.secondary), italics: true })] })],
          }),
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({ alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })] })],
          }),
        },
        children: [
          ...buildIntroduction(),
          ...buildChapter1(),
          ...buildChapter2(),
          ...buildChapter3(),
          ...buildChapter4(),
          ...buildChapter5(),
          ...buildChapter6(),
          ...buildChapter7(),
          ...buildChapter8(),
          ...buildChapter9(),
          ...buildChapter10(),
          ...buildAnnex(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/download/Manual_Premium_Personalizacion_Masiva_Productos_IA.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated successfully at:", outputPath);
}

main().catch(err => { console.error("Error:", err); process.exit(1); });
