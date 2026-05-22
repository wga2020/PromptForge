const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, TableOfContents, LevelFormat, TabStopType, TabStopPosition,
} = require("docx");
const fs = require("fs");

// ============================================================
// PALETTE — DM-1 Deep Cyan (AI / Tech / Design)
// ============================================================
const P = {
  bg: "162235", primary: "FFFFFF", accent: "37DCF2",
  titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078",
  body: "1A2B40", secondary: "6878A0",
  surface: "EDF3F5",
  tableHeaderBg: "1B6B7A", tableHeaderText: "FFFFFF",
  tableAccentLine: "1B6B7A", tableInnerLine: "C8DDE2", tableSurface: "EDF3F5",
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

// ============================================================
// BUILD COVER R1 — Deep Cyan Dark Background
// ============================================================
function buildCover(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 36, 22);
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
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders, children,
      })],
    })],
  })];
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: c(P.primary),
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: c(P.primary),
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 24, color: c(P.primary),
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function p(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [new TextRun({ text, size: 24, color: c(P.body),
      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

function pLeft(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 80, line: 312 },
    children: [new TextRun({ text, size: 24, color: c(P.body),
      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 60 }, children: [] });
}

// Table helpers
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
    h2("Evoluci\u00f3n del dise\u00f1o gr\u00e1fico para camisetas"),
    p("El dise\u00f1o gr\u00e1fico aplicado a la indumentaria ha experimentado una transformaci\u00f3n radical durante las \u00faltimas d\u00e9cadas. Lo que comenz\u00f3 como una simple t\u00e9cnica de estampado textil para identificar equipos deportivos o promover marcas corporativas, ha evolucionado hasta convertirse en una de las formas de expresi\u00f3n visual m\u00e1s poderosas y accesibles del mundo contempor\u00e1neo. Las camisetas gr\u00e1ficas trascienden hoy su funci\u00f3n b\u00e1sica de prenda de vestir para constituirse en lienzos m\u00f3viles de comunicaci\u00f3n, identidad y cultura visual."),
    p("Desde los a\u00f1os 50, cuando la serigraf\u00eda permiti\u00f3 la reproducci\u00f3n masiva de im\u00e1genes sobre tela, hasta la era digital actual donde la inteligencia artificial genera dise\u00f1os completos en segundos, el sector ha recorrido un camino fascinante. En la d\u00e9cada de 1960, el movimiento contracultural adopt\u00f3 la camiseta estampada como s\u00edmbolo de rebeld\u00eda y expresi\u00f3n personal. Los a\u00f1os 70 y 80 vieron nacer a las primeras marcas de streetwear que convirtieron la camiseta en un objeto de deseo. En los 90, la cultura del skateboard y el hip-hop consolidaron la camiseta gr\u00e1fica como elemento central del estilo urbano. Ya en el siglo XXI, la democratizaci\u00f3n del dise\u00f1o digital y las plataformas de impresi\u00f3n bajo demanda revolucionaron por completo el paradigma productivo."),
    p("Hoy en d\u00eda, cualquier persona con acceso a internet puede crear, producir y comercializar camisetas con dise\u00f1os propios, sin necesidad de invertir en inventario ni infraestructura productiva. Este cambio ha abierto las puertas a millones de emprendedores creativos en todo el mundo, generando un ecosistema vibrante y altamente competitivo."),

    h2("Impacto de la IA en la industria textil"),
    p("La inteligencia artificial ha irrumpido en la industria del dise\u00f1o textil con una fuerza transformadora sin precedentes. Herramientas como Midjourney, DALL-E, Leonardo AI, Ideogram y Nano Banana permiten generar ilustraciones, tipograf\u00edas y composiciones gr\u00e1ficas de calidad profesional en cuesti\u00f3n de minutos, reduciendo dr\u00e1sticamente el tiempo y los costos asociados al proceso creativo. Lo que antes requer\u00eda d\u00edas de trabajo manual de un ilustrador experimentado, ahora puede lograrse con un prompt bien estructurado y unos minutos de procesamiento."),
    p("El impacto se extiende m\u00e1s all\u00e1 de la generaci\u00f3n de im\u00e1genes. La IA tambi\u00e9n est\u00e1 transformando la investigaci\u00f3n de mercado, el an\u00e1lisis de tendencias, la optimizaci\u00f3n de listados en marketplaces como Etsy o Amazon, y la personalizaci\u00f3n masiva de productos. Los algoritmos de machine learning analizan millones de datos de b\u00fasqueda y comportamiento del consumidor para identificar nichos emergentes, predecir tendencias estacionales y optimizar el rendimiento comercial de cada dise\u00f1o."),
    p("Sin embargo, la IA no sustituye al dise\u00f1ador: lo potencia. La clave reside en combinar la capacidad generativa de la inteligencia artificial con el criterio est\u00e9tico, la sensibilidad cultural y la visi\u00f3n estrat\u00e9gica del profesional creativo. Quienes dominen esta sinergia tendr\u00e1n una ventaja competitiva decisiva en el mercado del Print on Demand."),

    h2("Tendencias actuales del mercado global POD"),
    p("El mercado global de Print on Demand (POD) ha experimentado un crecimiento exponencial. Seg\u00fan estimaciones del sector, el mercado de personalizaci\u00f3n de productos bajo demanda supera los 8.000 millones de d\u00f3lares anuales, con proyecciones de crecimiento sostenido del 25% anual durante los pr\u00f3ximos cinco a\u00f1os. Las camisetas representan aproximadamente el 35% de todos los productos POD vendidos, consolid\u00e1ndose como la categor\u00eda estrella del modelo."),
    p("Las tendencias m\u00e1s relevantes del mercado POD actual incluyen: el auge del oversized print y las camisetas de corte oversize, la creciente demanda de dise\u00f1os de nicho hipersegmentados, la integraci\u00f3n de TikTok Shop como canal de ventas directo, la sofisticaci\u00f3n del SEO visual en plataformas como Etsy, la expansi\u00f3n de t\u00e9cnicas de impresi\u00f3n premium como DTF y puff print, y la emergencia del mercado de colecciones de marca propia frente a la venta de dise\u00f1os individuales."),

    h2("C\u00f3mo monetizar dise\u00f1os con IA"),
    p("La monetizaci\u00f3n de dise\u00f1os generados con IA para camisetas POD se articula a trav\u00e9s de m\u00faltiples estrategias complementarias. La primera y m\u00e1s directa es la venta en marketplaces como Merch by Amazon, Redbubble, TeePublic y Etsy, donde los dise\u00f1adores pueden subir sus creaciones y recibir regal\u00edas por cada venta sin gestionar inventario ni log\u00edstica. La segunda estrategia implica la creaci\u00f3n de una marca propia en Shopify o WooCommerce, lo que permite mayores m\u00e1rgenes de ganancia pero requiere inversi\u00f3n en marketing y branding."),
    p("Otra v\u00eda de monetizaci\u00f3n es la venta de paquetes de dise\u00f1os digitales, mockups y prompts optimizados a otros dise\u00f1adores y emprendedores. Los creadores que dominan la ingenier\u00eda de prompts pueden comercializar sus plantillas y f\u00f3rmulas como productos en s\u00ed mismos. Adem\u00e1s, la consultor\u00eda especializada en dise\u00f1o textil con IA representa una oportunidad creciente, ya que muchas empresas tradicionales buscan integrar estas herramientas en sus flujos de trabajo."),
    p("Este manual te proporcionar\u00e1 las herramientas, conocimientos y estrategias necesarias para dominar cada uno de estos aspectos y convertirte en un profesional competitivo en la intersecci\u00f3n del dise\u00f1o gr\u00e1fico, la inteligencia artificial y el mercado textil POD."),
  ];
}

function buildChapter1() {
  const content = [
    h1("Cap\u00edtulo 1 \u2014 Investigaci\u00f3n de Nichos en Tendencia"),
    p("La investigaci\u00f3n de nichos constituye el pilar fundamental de cualquier estrategia comercial exitosa en el sector de camisetas POD. Identificar segmentos de mercado con alta demanda y baja competencia permite maximizar el retorno de inversi\u00f3n en cada dise\u00f1o producido. En este cap\u00edtulo analizaremos en profundidad los nichos m\u00e1s rentables y virales del mercado actual, desglosando cada uno seg\u00fan su audiencia objetivo, psicolog\u00eda del comprador, estilos gr\u00e1ficos ideales, paletas de color, tipograf\u00edas, tipo de estampado recomendado y potencial de ventas estimado."),
    p("La metodolog\u00eda de investigaci\u00f3n debe combinar herramientas de an\u00e1lisis de datos como eRank, Marmalead, Merch Informer y Google Trends con la observaci\u00f3n cualitativa de tendencias culturales en redes sociales como TikTok, Instagram y Pinterest. Un nicho rentable se caracteriza por tener una audiencia identificable y apasionada, una demanda estacional o evergreen verificable, baja saturaci\u00f3n de dise\u00f1os de calidad, y productos complementarios que permitan expandir la oferta."),

    // A. FECHAS ESPECIALES
    h2("A. Fechas Especiales"),
    p("Las fechas especiales representan uno de los nichos m\u00e1s predecibles y rentables del mercado POD. Su car\u00e1cter estacional garantiza picos de demanda recurrentes a\u00f1o tras a\u00f1o, lo que permite planificar la producci\u00f3n con anticipaci\u00f3n y optimizar el posicionamiento en los marketplaces. La clave del \u00e9xito en este nicho radica en lanzar los dise\u00f1os entre 6 y 8 semanas antes de la fecha objetivo, aprovechando el per\u00edodo de b\u00fasqueda anticipada que realizan los consumidores."),

    h3("Navidad"),
    p("Audiencia: Familias, parejas, amigos, oficinistas. Psicolog\u00eda del comprador: busca celebrar la festividad con originalidad, regalar algo \u00fanico y personal. Estilos gr\u00e1ficos: vintage navide\u00f1o, kawaii, cartoon, tipograf\u00eda decorativa. Paleta: rojo (#C41E3A), verde (#2D5A27), dorado (#D4AF37), blanco (#FFFFFF), crema (#FFFDD0). Tipograf\u00edas: Script festivas como Pacifico, display navide\u00f1as como Mountains of Christmas. Estampado ideal: DTG para dise\u00f1os multicolor, serigraf\u00eda para producci\u00f3n masiva. Potencial de ventas: muy alto, pico de octubre a diciembre."),

    h3("Halloween"),
    p("Audiencia: J\u00f3venes 18-35, fans del terror, fiesteros. Psicolog\u00eda: buscan impactar, asustar o hacer re\u00edr con dise\u00f1os tem\u00e1ticos. Estilos: grunge, tattoo style, cartoon g\u00f3tico, vintage retro. Paleta: negro (#0A0A0A), naranja (#FF6600), p\u00farpura (#6B3FA0), verde lima (#32CD32). Tipograf\u00edas: g\u00f3ticas como Creepster, horror como Nosifer, display impactantes. Estampado: DTG para detalles, DTF para colores vibrantes. Potencial: alto, pico septiembre-octubre."),

    h3("San Valent\u00edn"),
    p("Audiencia: Parejas, solteros con humor, romanticonos. Psicolog\u00eda: expresar afecto o iron\u00eda sobre el amor. Estilos: minimalista rom\u00e1ntico, kawaii, tipograf\u00eda script, cartoon. Paleta: rosa (#FF69B4), rojo (#DC143C), blanco (#FFFFFF), dorado rose (#B76E79). Tipograf\u00edas: Script elegantes como Great Vibes, sans serif modernas como Montserrat. Estampado: DTG, sublimaci\u00f3n para polos. Potencial: alto, pico enero-febrero."),

    h3("D\u00eda de la Madre / D\u00eda del Padre"),
    p("Audiencia: Hijos buscando regalos significativos. Psicolog\u00eda: emotividad, gratitud, celebraci\u00f3n familiar. Estilos: tipogr\u00e1fico emotivo, ilustraci\u00f3n floral, vintage nost\u00e1lgico. Paleta madre: tonos pastel, lavanda, rosa viejo. Paleta padre: azul marino, marr\u00f3n, verde oliva. Tipograf\u00edas: Script emotivas para madre, sans serif s\u00f3lidas para padre. Estampado: DTG para complejidad crom\u00e1tica, bordado para premium. Potencial: medio-alto, pico 4-6 semanas antes de cada fecha."),

    h3("A\u00f1o Nuevo, Pascua, Black Friday, Independence Day, D\u00eda de Muertos"),
    p("Cada una de estas fechas presenta oportunidades espec\u00edficas. A\u00f1o Nuevo funciona con dise\u00f1os tipogr\u00e1ficos motivacionales y countdown. Pascua destaca por ilustraciones kawaii y pastel. Black Friday requiere tipograf\u00eda bold y agresiva para promociones. Independence Day demanda dise\u00f1os patri\u00f3ticos con banderas y s\u00edmbolos nacionales. D\u00eda de Muertos ofrece un nicho cultural rico con calaveras, flor de cempas\u00fachil y tipograf\u00eda g\u00f3tica decorativa. En todos los casos, el estampado DTG y DTF son los m\u00e1s vers\u00e1tiles, y el potencial de ventas var\u00eda de medio a muy alto seg\u00fan la celebraci\u00f3n."),

    // B. ESTACIONES
    h2("B. Estaciones Clim\u00e1ticas"),
    p("Las estaciones del a\u00f1o condicionan tanto la est\u00e9tica como la funcionalidad de las camisetas. Cada estaci\u00f3n genera emociones, actividades y necesidades visuales espec\u00edficas que los dise\u00f1adores pueden aprovechar para crear colecciones estacionales cohesivas y comercialmente atractivas."),

    makeTable(
      ["Estaci\u00f3n", "Audiencia Clave", "Estilo Gr\u00e1fico", "Paleta Principal", "Tipograf\u00eda", "Estampado", "Potencial"],
      [
        ["Verano", "J\u00f3venes, turistas, deportistas", "Tropical, cartoon, tipogr\u00e1fico", "Coral, turquesa, amarillo, blanco", "Display bold, sans serif", "Sublimaci\u00f3n, DTG", "Muy alto"],
        ["Invierno", "Familias, esquiadores, urbanos", "Cozy, vintage, tipogr\u00e1fico", "Azul oscuro, burdeos, gris, crema", "Script c\u00e1lidas, serif", "DTG, serigraf\u00eda", "Alto"],
        ["Primavera", "Mujeres 25-45, naturaleza lovers", "Bot\u00e1nico, acuarela, minimalista", "Verde sage, rosa pastel, lavanda", "Script elegantes, serif", "DTG", "Medio-alto"],
        ["Oto\u00f1o", "Millennials, coffee lovers, c\u00f3mplice", "Rustic, vintage distressed, tipogr\u00e1fico", "Naranja, marr\u00f3n, mostaza, verde oliva", "Display retro, serif", "DTG, serigraf\u00eda", "Alto"],
      ],
      [14, 16, 16, 16, 14, 12, 12]
    ),
    emptyLine(),

    // C. PROFESIONES
    h2("C. Profesiones"),
    p("El nicho de profesiones es evergreen y enormemente rentable porque las personas se identifican profundamente con su vocaci\u00f3n profesional. Una enfermera, un bombero o un ingeniero no solo ejercen una profesi\u00f3n: la viven como parte esencial de su identidad. Esto genera una disposici\u00f3n natural a adquirir productos que celebren y comuniquen esa pertenencia profesional."),

    makeTable(
      ["Profesi\u00f3n", "Audiencia", "Estilo Ideal", "Paleta Sugerida", "Tipograf\u00eda", "Estampado", "Potencial"],
      [
        ["M\u00e9dicos", "Profesionales de la salud", "Minimalista, anat\u00f3mico", "Azul oscuro, blanco, gris", "Sans serif limpia", "DTG, bordado", "Alto"],
        ["Enfermeras", "Enfermer\u00edas y t\u00e9cnicos", "Tipogr\u00e1fico, heartline", "Rosa, azul claro, blanco", "Script + sans serif", "DTG", "Muy alto"],
        ["Ingenieros", "Ingenier\u00edas todas las ramas", "T\u00e9cnico, blueprint, c\u00f3mic", "Azul, gris, negro", "Monospace, display", "DTG, serigraf\u00eda", "Medio-alto"],
        ["Maestros", "Educadores todos los niveles", "Tipogr\u00e1fico, ilustrado", "Colores primarios, amarillo", "Handlettering, display", "DTG", "Alto"],
        ["Programadores", "Dev, IT, tech", "Geek, c\u00f3digo, retro gaming", "Negro, verde ne\u00f3n, azul", "Monospace, pixel", "DTG, DTF", "Muy alto"],
        ["Abogados", "Profesionales legales", "Cl\u00e1sico, tipogr\u00e1fico", "Azul marino, dorado, blanco", "Serif elegante", "Bordado, DTG", "Medio"],
        ["Bomberos", "Cuerpos de rescate", "Bold, heroico, vintage", "Rojo, negro, amarillo", "Display bold, stencil", "Serigraf\u00eda, DTG", "Alto"],
        ["Polic\u00edas", "Fuerzas del orden", "Heroico, badge style", "Azul marino, dorado, negro", "Serif, stencil", "DTG, serigraf\u00eda", "Alto"],
        ["Veterinarios", "Amantes de animales", "Ilustrado, cute, tipogr\u00e1fico", "Verde, marr\u00f3n, azul cielo", "Script, sans serif", "DTG", "Alto"],
        ["Arquitectos", "Dise\u00f1adores, constructores", "Blueprint, minimalista, t\u00e9cnico", "Blanco, negro, azul print", "Sans serif, serif", "DTG, serigraf\u00eda", "Medio-alto"],
      ],
      [12, 14, 14, 14, 14, 14, 10]
    ),
    emptyLine(),

    // D. HOBBIES
    h2("D. Hobbies y Estilos de Vida"),
    p("Los hobbies constituyen uno de los nichos m\u00e1s amplios y diversos del mercado POD. La pasi\u00f3n que las personas sienten por sus aficiones se traduce directamente en voluntad de compra. Un gamer, un ciclista o un amante de las mascotas no necesita la camiseta: la desea porque representa qui\u00e9n es y qu\u00e9 ama. Esta conexi\u00f3n emocional es el motor comercial m\u00e1s poderoso del sector."),

    makeTable(
      ["Hobby", "Audiencia", "Estilo Gr\u00e1fico", "Paleta", "Tipograf\u00eda", "Estampado", "Potencial"],
      [
        ["Gaming", "Gamers 15-35", "Pixel, cyberpunk, cartoon", "Negro, ne\u00f3n, p\u00farpura", "Pixel, display, futurista", "DTF, DTG", "Muy alto"],
        ["Anime", "Otakus, cosplayers", "Anime, kawaii, manga", "Rosa, azul, negro, ne\u00f3n", "Display, brush japon\u00e9s", "DTG, DTF", "Muy alto"],
        ["Fitness", "Gym lovers, atletas", "Tipogr\u00e1fico bold, motivacional", "Negro, rojo, blanco, gris", "Bold sans, stencil", "DTG, serigraf\u00eda", "Muy alto"],
        ["Ciclismo", "Ciclistas, triatletas", "Minimalista, t\u00e9cnico, retro", "Amarillo, negro, azul", "Sans serif, display", "DTG, sublimaci\u00f3n", "Alto"],
        ["Running", "Corredores todos los niveles", "Tipogr\u00e1fico, motivacional", "Verde fluo, negro, naranja", "Bold sans, script", "DTG, serigraf\u00eda", "Alto"],
        ["Camping", "Naturaleza lovers", "R\u00fastico, vintage, ilustrado", "Verde bosque, marr\u00f3n, crema", "Serif, display r\u00fastico", "DTG", "Medio-alto"],
        ["Pesca", "Pescadores recreativos", "Vintage, cartoon, tipogr\u00e1fico", "Azul, verde, marr\u00f3n", "Script, display", "DTG, serigraf\u00eda", "Medio-alto"],
        ["M\u00fasica", "M\u00fasicos, mel\u00f3manos", "Retro, vintage, tipogr\u00e1fico", "Negro, dorado, rojo", "Display, script", "DTG, serigraf\u00eda", "Alto"],
        ["Viajes", "N\u00f3madas digitales, viajeros", "Tipogr\u00e1fico, ilustraci\u00f3n", "Azul, coral, arena", "Script, sans serif", "DTG, sublimaci\u00f3n", "Alto"],
        ["Mascotas", "Due\u00f1os de perros/gatos", "Ilustrado, kawaii, tipogr\u00e1fico", "Colores pastel, marr\u00f3n", "Script, display", "DTG", "Muy alto"],
      ],
      [12, 14, 14, 14, 14, 14, 10]
    ),
    emptyLine(),

    // E. RELIGIÓN
    h2("E. Religi\u00f3n y Espiritualidad"),
    p("El nicho de religi\u00f3n y espiritualidad es uno de los m\u00e1s s\u00f3lidos y evergreen del mercado POD. Las personas de fe buscan activamente productos que reflejen sus creencias y valores, y la camiseta funciona como un medio de testimonio y pertenencia comunitaria. Es fundamental abordar este nicho con respeto, autenticidad y conocimiento profundo de cada tradici\u00f3n religiosa para evitar ofensas culturales."),

    p("Cristianismo: dise\u00f1os con vers\u00edculos b\u00edblicos, cruces estilizadas, tipograf\u00eda faith-based moderna. Juda\u00edsmo: Estrella de David, Menor\u00e1, letras hebreas. Islam: caligraf\u00eda \u00e1rabe, patrones geom\u00e9tricos, tonos verde y dorado. Budismo: mandalas, loto, tipograf\u00eda zen minimalista. Frases espirituales: dise\u00f1os tipogr\u00e1ficos con mensajes universales de paz, gratitud y conexi\u00f3n. Estilo faith-based moderno: combina tipograf\u00eda serif elegante con ilustraciones bot\u00e1nicas y tonos neutros, alej\u00e1ndose del aspecto anticuado de los dise\u00f1os religiosos tradicionales."),

    // F. FRASES MOTIVACIONALES
    h2("F. Frases Motivacionales"),
    p("Las frases motivacionales constituyen un sub-nicho extremadamente popular dentro del mercado POD. Su atractivo reside en la universalidad del mensaje y la capacidad de conectar emocionalmente con el comprador. Existen seis subcategor\u00edas principales que abarcan desde la motivaci\u00f3n minimalista hasta el mindset emprendedor, cada una con su propia est\u00e9tica y audiencia espec\u00edfica."),

    p("Minimalistas: frases cortas en tipograf\u00eda limpia, mucho espacio negativo, paleta monocrom\u00e1tica. Urbanas: combinaci\u00f3n de tipograf\u00eda bold con elementos de street art, colores contrastantes. Motivacionales fitness: frases de esfuerzo y superaci\u00f3n en tipograf\u00eda stencil o bold, colores intensos. Emprendimiento: mensajes de hustle y crecimiento en tipograf\u00eda sans serif moderna. Mindset: afirmaciones positivas en composiciones tipogr\u00e1ficas creativas. Positividad: mensajes alegres en paletas pastel con tipograf\u00eda script o hand-lettered."),

    // G. CULTURA POP
    h2("G. Cultura Pop y Tendencias"),
    p("La cultura pop es el nicho m\u00e1s din\u00e1mico y cambiante del mercado POD. Las tendencias emergen y se desvanecen con velocidad vertiginosa, impulsadas por las redes sociales y la cultura del meme. Sin embargo, ciertos estilos han demostrado una longevidad notable y se han consolidado como categor\u00edas estables dentro del sector."),

    makeTable(
      ["Estilo", "Descripci\u00f3n", "Paleta Caracter\u00edstica", "Tipograf\u00eda Clave"],
      [
        ["Retro Vintage", "Nostalgia de d\u00e9cadas pasadas, texturas desgastadas", "Tonos sepia, mostaza, naranja apagado", "Serif retro, display vintage"],
        ["Y2K", "Est\u00e9tica a\u00f1os 2000, brillos, futurismo ingenuo", "Rosa chicle, plateado, azul el\u00e9ctrico", "Display futurista, blob"],
        ["Cyberpunk", "Futurismo oscuro, ne\u00f3n, distop\u00eda", "Negro, ne\u00f3n cian, magenta, p\u00farpura", "Futurista, glitch, monospace"],
        ["Vaporwave", "Est\u00e9tica internet surrealista, a\u00f1os 80-90", "Rosa pastel, cian, p\u00farpura, azul", "Serif cl\u00e1sica, display retro"],
        ["Streetwear", "Urbano premium, logos, tipograf\u00eda bold", "Negro, blanco, rojo, verde", "Gothic, display bold, stencil"],
        ["Minimalismo Premium", "Limpio, sofisticado, espacio negativo", "Negro, blanco, gris, beige", "Sans serif geom\u00e9trica"],
        ["Estilo Japon\u00e9s", "Brush strokes, kanji, ukiyo-e", "Negro, rojo, blanco, dorado", "Brush japonesa, kanji"],
        ["Graffiti", "Street art, tags, murales", "Colores vivos sobre fondo oscuro", "Wildstyle, bubble, tag"],
        ["Old School Tattoo", "Traditional tattoo, anchors, roses", "Rojo, negro, amarillo, verde", "Script cl\u00e1sica, display bold"],
        ["Surrealismo Moderno", "Im\u00e1genes on\u00edricas, distorsiones", "Paleta on\u00edrica, degradados", "Display experimental"],
      ],
      [18, 30, 28, 24]
    ),
    emptyLine(),
  ];
  return content;
}

function buildChapter2() {
  return [
    h1("Cap\u00edtulo 2 \u2014 Principios de Dise\u00f1o Gr\u00e1fico para Camisetas"),
    h2("Composici\u00f3n visual"),
    p("La composici\u00f3n visual es la columna vertebral de todo dise\u00f1o gr\u00e1fico exitoso para camisetas. Una composici\u00f3n bien estructurada gu\u00eda la mirada del espectador a trav\u00e9s del dise\u00f1o de manera natural y agradable, creando una experiencia visual que comunica el mensaje de forma efectiva. En el contexto textil, la composici\u00f3n debe considerar el \u00e1rea de impresi\u00f3n disponible, que t\u00edpicamente oscila entre 30x40 cm para estampados frontales est\u00e1ndar y 40x50 cm para oversized prints."),
    p("Los principios fundamentales de composici\u00f3n incluyen la regla de los tercios, la simetr\u00eda y asimetr\u00eda deliberada, el ritmo visual creado por la repetici\u00f3n de elementos, y la profundidad lograda mediante superposiciones y escalas. En camisetas, la composici\u00f3n centrada es la m\u00e1s com\u00fan y segura, ya que el \u00e1rea de impresi\u00f3n es limitada y el dise\u00f1o debe funcionar como punto focal de la prenda."),

    h2("Jerarqu\u00eda visual"),
    p("La jerarqu\u00eda visual determina el orden en que el ojo humano percibe los elementos de un dise\u00f1o. En una camiseta, el espectador debe poder captar el mensaje principal en los primeros dos segundos. Esto se logra mediante la manipulaci\u00f3n deliberada del tama\u00f1o, el peso, el color y la posici\u00f3n de cada elemento. El elemento m\u00e1s importante, ya sea un texto impactante o una ilustraci\u00f3n central, debe dominar la composici\u00f3n, mientras que los elementos secundarios complementan sin competir."),

    h2("Balance y Contraste"),
    p("El balance se refiere a la distribuci\u00f3n del peso visual en la composici\u00f3n. Un balance sim\u00e9trico transmite estabilidad y formalidad, mientras que un balance asim\u00e9trico genera dinamismo y tensi\u00f3n visual. El contraste, por su parte, es la diferencia visual entre elementos y es esencial para la legibilidad y el impacto. En camisetas, el contraste entre el dise\u00f1o y el color de la tela es cr\u00edtico: un dise\u00f1o en tonos oscuros sobre una camiseta negra perder\u00e1 impacto, mientras que el mismo dise\u00f1o sobre una camiseta blanca resaltar\u00e1 con fuerza."),

    h2("Escalabilidad"),
    p("Un dise\u00f1o para camiseta debe funcionar en m\u00faltiples escalas: desde una miniatura en la pantalla de un marketplace hasta la impresi\u00f3n real en la prenda. Los detalles excesivamente finos se pierden en miniatura, mientras que los elementos demasiado simples pueden verse vac\u00edos en la impresi\u00f3n real. La regla general es dise\u00f1ar al tama\u00f1o de impresi\u00f3n final y verificar que el dise\u00f1o mantiene su integridad visual tanto al 25% como al 150% de su tama\u00f1o original."),

    h2("Uso del espacio negativo"),
    p("El espacio negativo, tambi\u00e9n conocido como espacio en blanco, es el \u00e1rea sin elementos gr\u00e1ficos dentro de un dise\u00f1o. Lejos de ser un espacio vac\u00edo, el espacio negativo es una herramienta poderosa que permite respirar al dise\u00f1o, mejora la legibilidad y puede utilizarse creativamente para formar siluetas o mensajes secundarios. Los dise\u00f1os premium de camisetas suelen emplear generosamente el espacio negativo para lograr una est\u00e9tica sofisticada y limpia."),

    h2("Psicolog\u00eda del color"),
    p("Los colores no son meramente decorativos: cada tonalidad evoca respuestas emocionales espec\u00edficas en el espectador. El rojo transmite pasi\u00f3n, energ\u00eda y urgencia. El azul genera confianza, calma y profesionalismo. El amarillo irradia optimismo y creatividad. El verde evoca naturaleza, crecimiento y salud. El negro comunica sofisticaci\u00f3n, poder y misterio. El blanco sugiere pureza, simplicidad y elegancia. Comprender estas asociaciones es fundamental para seleccionar paletas que refuercen el mensaje del dise\u00f1o y conecten emocionalmente con la audiencia objetivo."),

    h2("Dise\u00f1o centrado en impresi\u00f3n textil"),
    p("Dise\u00f1ar para tela implica consideraciones t\u00e9cnicas espec\u00edficas que no existen en otros medios. La tela absorbe la tinta de manera diferente al papel, los colores pueden variar seg\u00fan el tipo de tejido, y la prenda se dobla, se estira y se lava repetidamente. Un dise\u00f1o textil profesional debe anticipar estas condiciones y optimizarse para ellas. Esto incluye evitar bordes excesivamente finos en serigraf\u00eda, mantener una resoluci\u00f3n m\u00ednima de 300 DPI para DTG, y considerar el sangrado de color en sublimaci\u00f3n."),

    h2("Adaptaci\u00f3n para diferentes colores de tela"),
    p("Un mismo dise\u00f1o debe poder adaptarse a m\u00faltiples colores de camiseta para maximizar su potencial de ventas. Esto requiere crear variantes del dise\u00f1o con diferentes combinaciones de color, o dise\u00f1ar con una paleta que funcione tanto sobre fondos claros como oscuros. La t\u00e9cnica m\u00e1s profesional consiste en crear dos versiones de cada dise\u00f1o: una optimizada para telas claras y otra para telas oscuras, ajustando los valores de contraste y las capas de base seg\u00fan sea necesario."),
  ];
}

function buildChapter3() {
  const palettes = [
    ["Streetwear", "#0A0A0A / #FF0000 / #FFFFFF / #333333 / #FF4500", "RGB: 10,10,10 / 255,0,0 / 255,255,255 / 51,51,51 / 255,69,0", "CMYK: 0,0,0,100 / 0,100,100,0 / 0,0,0,0 / 0,0,0,80 / 0,82,100,0", "Uso: logos, tipograf\u00eda bold", "Emoci\u00f3n: rebeld\u00eda, poder"],
    ["Vintage", "#D4A574 / #8B4513 / #F5DEB3 / #556B2F / #CD853F", "RGB: 212,165,116 / 139,69,19 / 245,222,179 / 85,107,47 / 205,133,63", "CMYK: 15,32,48,0 / 0,72,82,40 / 3,10,28,0 / 50,10,85,55 / 12,50,65,10", "Uso: retro, desgastado", "Emoci\u00f3n: nostalgia, calidez"],
    ["Navidad", "#C41E3A / #2D5A27 / #D4AF37 / #FFFFFF / #FFFDD0", "RGB: 196,30,58 / 45,90,39 / 212,175,55 / 255,255,255 / 255,253,208", "CMYK: 0,90,75,15 / 70,10,90,60 / 15,20,80,5 / 0,0,0,0 / 1,0,18,0", "Uso: estampados festivos", "Emoci\u00f3n: celebraci\u00f3n, alegr\u00eda"],
    ["Halloween", "#0A0A0A / #FF6600 / #6B3FA0 / #32CD32 / #8B0000", "RGB: 10,10,10 / 255,102,0 / 107,63,160 / 50,205,50 / 139,0,0", "CMYK: 0,0,0,100 / 0,60,100,0 / 45,70,0,20 / 60,0,100,0 / 0,100,100,40", "Uso: terror, misterio", "Emoci\u00f3n: miedo, diversi\u00f3n"],
    ["Anime", "#FF69B4 / #00BFFF / #0A0A0A / #FF1493 / #7B68EE", "RGB: 255,105,180 / 0,191,255 / 10,10,10 / 255,20,147 / 123,104,238", "CMYK: 0,60,25,0 / 75,0,0,0 / 0,0,0,100 / 0,90,0,0 / 55,55,0,0", "Uso: kawaii, manga", "Emoci\u00f3n: fantas\u00eda, energ\u00eda"],
    ["Minimalista", "#000000 / #FFFFFF / #808080 / #D3D3D3 / #F5F5F5", "RGB: 0,0,0 / 255,255,255 / 128,128,128 / 211,211,211 / 245,245,245", "CMYK: 0,0,0,100 / 0,0,0,0 / 0,0,0,50 / 0,0,0,18 / 2,2,2,0", "Uso: tipogr\u00e1fico, clean", "Emoci\u00f3n: elegancia, calma"],
    ["Gaming", "#0D0D0D / #00FF41 / #9D00FF / #00D4FF / #FF003C", "RGB: 13,13,13 / 0,255,65 / 157,0,255 / 0,212,255 / 255,0,60", "CMYK: 0,0,0,95 / 80,0,95,0 / 40,100,0,0 / 80,0,0,0 / 0,100,80,0", "Uso: pixel, cyberpunk", "Emoci\u00f3n: adrenalina, inmersi\u00f3n"],
    ["Fitness", "#1A1A1A / #FF0000 / #FFFFFF / #FF6600 / #333333", "RGB: 26,26,26 / 255,0,0 / 255,255,255 / 255,102,0 / 51,51,51", "CMYK: 0,0,0,90 / 0,100,100,0 / 0,0,0,0 / 0,60,100,0 / 0,0,0,80", "Uso: motivacional, bold", "Emoci\u00f3n: fuerza, determinaci\u00f3n"],
    ["Luxury", "#0A0A0A / #D4AF37 / #FFFFFF / #1C1C1C / #C0C0C0", "RGB: 10,10,10 / 212,175,55 / 255,255,255 / 28,28,28 / 192,192,192", "CMYK: 0,0,0,100 / 15,20,80,5 / 0,0,0,0 / 0,0,0,90 / 0,0,0,25", "Uso: marcas premium", "Emoci\u00f3n: exclusividad, lujo"],
    ["Naturaleza", "#2E8B57 / #8FBC8F / #DEB887 / #228B22 / #F0E68C", "RGB: 46,139,87 / 143,188,143 / 222,184,135 / 34,139,34 / 240,230,140", "CMYK: 70,15,70,40 / 30,15,55,15 / 10,22,45,5 / 75,10,100,40 / 5,5,45,0", "Uso: outdoor, bot\u00e1nico", "Emoci\u00f3n: paz, frescura"],
    ["Retro 80s", "#FF6EC7 / #00FFFF / #FFFF00 / #FF00FF / #FF4500", "RGB: 255,110,199 / 0,255,255 / 255,255,0 / 255,0,255 / 255,69,0", "CMYK: 0,60,10,0 / 80,0,0,0 / 0,0,100,0 / 0,100,0,0 / 0,82,100,0", "Uso: ne\u00f3n, synthwave", "Emoci\u00f3n: energ\u00eda, diversi\u00f3n"],
    ["Cyberpunk", "#0A0A1A / #00FFFF / #FF00FF / #FFFF00 / #FF0040", "RGB: 10,10,26 / 0,255,255 / 255,0,255 / 255,255,0 / 255,0,64", "CMYK: 95,85,0,70 / 80,0,0,0 / 0,100,0,0 / 0,0,100,0 / 0,100,80,0", "Uso: futurismo, ne\u00f3n", "Emoci\u00f3n: rebeld\u00eda tecnol\u00f3gica"],
    ["Faith-based", "#FFFFFF / #D4AF37 / #2D5A27 / #F5F5DC / #8B4513", "RGB: 255,255,255 / 212,175,55 / 45,90,39 / 245,245,222 / 139,69,19", "CMYK: 0,0,0,0 / 15,20,80,5 / 70,10,90,60 / 2,2,12,0 / 0,72,82,40", "Uso: espiritual, serif", "Emoci\u00f3n: fe, esperanza"],
  ];

  return [
    h1("Cap\u00edtulo 3 \u2014 Paletas de Colores Profesionales"),
    p("La selecci\u00f3n crom\u00e1tica es una de las decisiones m\u00e1s cr\u00edticas en el dise\u00f1o de camisetas. Los colores no solo determinan la est\u00e9tica del dise\u00f1o sino que tambi\u00e9n comunican emociones, definen la identidad del nicho y condicionan la compatibilidad con los distintos tipos de tela y t\u00e9cnicas de impresi\u00f3n. En este cap\u00edtulo presentamos cartas de paleta detalladas organizadas por tem\u00e1tica, incluyendo valores HEX, RGB, CMYK, usos recomendados y la emoci\u00f3n que cada paleta transmite al espectador."),

    makeTable(
      ["Tem\u00e1tica", "HEX", "RGB", "CMYK", "Uso Recomendado", "Emoci\u00f3n"],
      palettes,
      [12, 22, 22, 22, 12, 10]
    ),
    emptyLine(),

    p("Es fundamental recordar que los valores CMYK son referenciales para impresi\u00f3n profesional y pueden variar seg\u00fan el perfil ICC del equipo de impresi\u00f3n y el tipo de tela utilizado. Siempre se recomienda realizar pruebas de color antes de producir tiradas grandes. Para impresi\u00f3n DTG, los colores RGB del archivo digital se convierten a CMYK durante el proceso de impresi\u00f3n, por lo que es importante trabajar en espacio de color RGB y calibrar el monitor para obtener resultados predecibles."),
  ];
}

function buildChapter4() {
  return [
    h1("Cap\u00edtulo 4 \u2014 Tipograf\u00edas y Combinaciones"),
    h2("Familias tipogr\u00e1ficas ideales para camisetas"),
    p("La tipograf\u00eda es uno de los elementos m\u00e1s influyentes en el dise\u00f1o de camisetas, especialmente en el nicho de frases motivacionales, profesiones y fechas especiales donde el texto es el protagonista absoluto. La elecci\u00f3n de la fuente correcta puede determinar el \u00e9xito o fracaso comercial de un dise\u00f1o. En este cap\u00edtulo exploraremos las familias tipogr\u00e1ficas m\u00e1s efectivas para cada estilo y nicho, junto con las combinaciones que generan mayor impacto visual."),

    h3("Serif"),
    p("Las tipograf\u00edas serif se caracterizan por sus remates terminales y transmiten tradici\u00f3n, elegancia y autoridad. Son ideales para dise\u00f1os vintage, faith-based, luxury y acad\u00e9micos. Ejemplos destacados: Playfair Display (elegancia cl\u00e1sica), Merriweather (legibilidad excelente), Libre Baskerville (sofisticaci\u00f3n editorial), Bitter (calidez contempor\u00e1nea). Estas fuentes funcionan excepcionalmente bien en combinaci\u00f3n con sans serif para crear contrastes visuales profesionales."),

    h3("Sans Serif"),
    p("Las sans serif carecen de remates y proyectan modernidad, limpieza y accesibilidad. Son las m\u00e1s vers\u00e1tiles para camisetas: funcionan en casi cualquier nicho y estilo. Ejemplos esenciales: Montserrat (geom\u00e9trica, ideal para display), Poppins (amigable, moderna), Bebas Neue (condensada, impactante), Oswald (bold, deportiva), Raleway (elegante, delgada). La combinaci\u00f3n Montserrat + Open Sans es una de las m\u00e1s utilizadas en dise\u00f1o textil profesional."),

    h3("Script"),
    p("Las tipograf\u00edas script imitan la escritura manual y transmiten personalidad, calidez y exclusividad. Son perfectas para nichos rom\u00e1nticos, femeninos, craft y faith-based. Ejemplos: Great Vibes (caligraf\u00eda elegante), Pacifico (relajada, surf), Dancing Script (casual, amigable), Sacramento (fina, sofisticada). Advertencia cr\u00edtica: las script deben usarse con moderaci\u00f3n y nunca para textos largos, ya que su legibilidad a distancia se reduce dr\u00e1sticamente."),

    h3("Display"),
    p("Las display son tipograf\u00edas decorativas dise\u00f1adas para titulares y elementos de gran tama\u00f1o. Son el alma de los dise\u00f1os tipogr\u00e1ficos de camiseta. Ejemplos: Lobster (vintage divertida), Righteous (retro geom\u00e9trica), Bungee (display urbana), Press Start 2P (pixel gaming), Creepster (horror). Se recomienda combinar una display con una sans serif neutra para mantener la legibilidad del mensaje secundario."),

    h3("Graffiti, Retro, G\u00f3ticas y Futuristas"),
    p("Cada subcategor\u00eda tiene sus tipograf\u00edas emblem\u00e1ticas. Graffiti: Permanent Marker, Streetvertising, Da Font. Retro: Abril Fatface, Yellowtail, Riviera. G\u00f3ticas: UnifrakturMaguntia, MedievalSharp, Cloister Black. Futuristas: Orbitron, Audiowide, Rajdhani. La clave para la legibilidad textil es evitar fuentes con detalles excesivamente finos que se pierden en la impresi\u00f3n, y asegurarse de que el trazo m\u00ednimo sea de al menos 2pt para serigraf\u00eda y 1pt para DTG."),

    h2("Mejores combinaciones tipogr\u00e1ficas"),
    p("Las combinaciones tipogr\u00e1ficas profesionales se basan en el principio de contraste: combinar fuentes que sean lo suficientemente diferentes para crear jerarqu\u00eda visual pero que compartan una armon\u00eda subyacente. Las combinaciones m\u00e1s efectivas para camisetas son: Bebas Neue (t\u00edtulo) + Montserrat (subt\u00edtulo), Playfair Display (t\u00edtulo) + Lato (cuerpo), Lobster (t\u00edtulo) + Open Sans (complemento), Pacifico (t\u00edtulo) + Raleway (subt\u00edtulo), Oswald (t\u00edtulo) + Roboto (cuerpo). Cada una de estas parejas ha sido probada extensivamente en impresi\u00f3n textil y garantiza resultados profesionales."),

    h2("Tipograf\u00edas gratuitas y premium"),
    p("Google Fonts ofrece una biblioteca excepcional de tipograf\u00edas gratuitas con licencia comercial: Montserrat, Bebas Neue, Playfair Display, Oswald, Pacifico, Great Vibes y Lobster son algunas de las m\u00e1s utilizadas en dise\u00f1o POD. Para necesidades premium, Creative Market y MyFonts ofrecen fuentes con caracter\u00edsticas \u00fanicas: Nova Mono, Westfalia, Southern Aire,站立 entre muchas otras. La inversi\u00f3n en tipograf\u00edas premium puede diferenciar significativamente un cat\u00e1logo de dise\u00f1os del resto del mercado."),
  ];
}

function buildChapter5() {
  return [
    h1("Cap\u00edtulo 5 \u2014 Estilos de Dise\u00f1o"),
    p("Los estilos de dise\u00f1o definen la personalidad visual de una camiseta y son el factor determinante para conectar con audiencias espec\u00edficas. Cada estilo tiene sus propias convenciones est\u00e9ticas, paletas de color, texturas y tipograf\u00edas asociadas. Dominar los estilos m\u00e1s demandados del mercado permite crear colecciones cohesivas y comercialmente viables que resuenan con las expectativas visuales de cada nicho."),

    h2("Vintage Distressed"),
    p("El estilo vintage distressed se caracteriza por texturas desgastadas, colores apagados y una est\u00e9tica que evoca la nostalgia de d\u00e9cadas pasadas. Los dise\u00f1os utilizan halftones, texturas de grano y bordes irregulares para simular el desgaste natural del tiempo. Es extremadamente popular en nichos de profesiones, hobbies retro y cultura americana. La t\u00e9cnica de producci\u00f3n ideal es DTG con texturas overlay, o serigraf\u00eda con tintas discharge para un desgaste aut\u00e9ntico."),

    h2("Minimalista"),
    p("El minimalismo en camisetas se basa en la m\u00e1xima de menos es m\u00e1s. Dise\u00f1os con una sola tipograf\u00eda limpia, abundante espacio negativo y paletas monocrom\u00e1ticas o bicrom\u00e1ticas. Este estilo es especialmente efectivo para frases motivacionales, marcas premium y dise\u00f1os tipogr\u00e1ficos. La clave est\u00e1 en la selecci\u00f3n perfecta de cada elemento: una tipograf\u00eda impecable, un color exacto y una composici\u00f3n precisa. El minimalismo premium exige perfecci\u00f3n t\u00e9cnica porque no hay elementos decorativos que disimulen errores."),

    h2("Streetwear"),
    p("El streetwear es el estilo dominante en la cultura urbana contempor\u00e1nea. Se caracteriza por tipograf\u00eda bold y agresiva, composiciones asim\u00e9tricas, referencias al hip-hop, skate y cultura de calle. Los colores suelen ser alto contraste: negro y blanco con acentos de rojo o verde. Los elementos recurrentes incluyen logos tipogr\u00e1ficos, ilustraciones bold, referencias al graffiti y composiciones que rompen con la simetr\u00eda convencional. El estampado ideal es DTF por su capacidad de reproducir colores s\u00f3lidos vibrantes sobre telas oscuras."),

    h2("Retro, Y2K y Cyberpunk"),
    p("El estilo retro abarca desde la est\u00e9tica art dec\u00f3 de los a\u00f1os 20 hasta el pop de los 80. El Y2K revive la est\u00e9tica futurista y optimista del cambio de milenio con brillos, degradados y tipograf\u00edas blob. El cyberpunk representa la cara oscura del futurismo: ne\u00f3n sobre negro, distorsi\u00f3n digital, tipograf\u00edas glitch y paletas de cian-magenta-amarillo sobre fondos ultramarinos. Los tres estilos comparten la nostalgia como motor emocional pero se diferencian radicalmente en su ejecuci\u00f3n visual."),

    h2("Kawaii, Anime y Cartoon"),
    p("El kawaii japon\u00e9s se caracteriza por colores pastel, l\u00edneas suaves y personajes adorables. El estilo anime es m\u00e1s din\u00e1mico con l\u00edneas definidas, sombreado cell-shading y ojos expresivos. El cartoon occidental tiende a ser m\u00e1s grotesco y humor\u00edstico. Los tres estilos son altamente comerciales en el mercado POD, especialmente entre audiencias j\u00f3venes de 15 a 30 a\u00f1os. La producci\u00f3n ideal es DTG para capturar la complejidad crom\u00e1tica, o DTF para colores vibrantes sobre telas oscuras."),

    h2("Tattoo Style, Hand Drawn y Grunge"),
    p("El tattoo style se inspira en la tradici\u00f3n del tatuaje old school con bordes negros gruesos, colores s\u00f3lidos y motivos cl\u00e1sicos como anclas, rosas y calaveras. El hand drawn aporta autenticidad y calidez con texturas de l\u00e1piz, tinta y acuarela. El grunge es crudo, texturizado y deliberadamente imperfecto con manchas, goteos y distorsi\u00f3n. Los tres est\u00e1n especialmente indicados para serigraf\u00eda y DTG con texturas overlay."),

    h2("Luxury Fashion, Oversized Print y Scandinavian"),
    p("El luxury fashion aplica los c\u00e1nones de la alta costura a la camiseta: tipograf\u00eda serif elegante, paletas neutras, composiciones minimalistas y acabados premium como el bordado o el foil. El oversized print rompe con el \u00e1rea de impresi\u00f3n convencional para cubrir toda la prenda, creando un impacto visual extraordinario. El estilo scandinavo combina funcionalismo, minimalismo y naturaleza con paletas de grises, blancos y acentos org\u00e1nicos, ideal para marcas de moda consciente."),
  ];
}

function buildChapter6() {
  return [
    h1("Cap\u00edtulo 6 \u2014 T\u00e9cnicas de Impresi\u00f3n Textil"),
    p("La selecci\u00f3n de la t\u00e9cnica de impresi\u00f3n adecuada es tan importante como el dise\u00f1o mismo. Cada m\u00e9todo tiene sus ventajas, limitaciones, costos y resultados espec\u00edficos que condicionan directamente la calidad final del producto, la rentabilidad del proyecto y la satisfacci\u00f3n del cliente. En este cap\u00edtulo analizaremos en profundidad cada t\u00e9cnica disponible en el mercado actual."),

    makeTable(
      ["T\u00e9cnica", "Ventajas", "Desventajas", "Costo/Unidad", "Calidad", "Durabilidad", "Tela Compatible"],
      [
        ["Serigraf\u00eda", "Alta calidad, rentable en volumen", "Setup costoso, no viable para tiradas cortas", "$1-3 (vol.)", "Excelente", "50+ lavados", "Algod\u00f3n, mezclas"],
        ["DTG", "Sin setup, fotorealista, tiradas cortas", "M\u00e1s lento, costo unitario alto", "$5-12", "Muy buena", "30-40 lavados", "Algod\u00f3n preferiblemente"],
        ["DTF", "Colores vibrantes, telas oscuras, sin pretreatment", "Textura ligeramente pl\u00e1stica", "$3-8", "Buena", "40-50 lavados", "Cualquier tela"],
        ["Sublimaci\u00f3n", "Permanente, colores brillantes", "Solo poli\u00e9ster, limitaci\u00f3n de color de tela", "$2-5", "Excelente", "Permanente", "Poli\u00e9ster 100%"],
        ["Vinilo textil", "Preciso, brillante, f\u00e1cil de aplicar", "No apto para detalles finos, sensaci\u00f3n pl\u00e1stica", "$2-6", "Buena", "30-50 lavados", "Algod\u00f3n, poli\u00e9ster"],
        ["Bordado", "Premium, textura tridimensional", "Costoso, limitado en colores y detalles", "$8-20", "Premium", "Permanente", "Algod\u00f3n, tejidos firmes"],
        ["Puff Print", "Efecto 3D, textura \u00fanica", "Limitado a dise\u00f1os simples", "$3-8", "Buena", "25-35 lavados", "Algod\u00f3n"],
        ["Foil Printing", "Brillo met\u00e1lico, premium", "Se descascara, dif\u00edcil de mantener", "$4-10", "Buena", "15-25 lavados", "Algod\u00f3n"],
        ["UV Printing", "Alta resoluci\u00f3n, vers\u00e1til", "Equipo costoso, limitado en superficie", "$5-12", "Excelente", "20-30 lavados", "Cualquier tela"],
      ],
      [13, 18, 18, 11, 10, 12, 18]
    ),
    emptyLine(),

    h2("Serigraf\u00eda (Screen Printing)"),
    p("La serigraf\u00eda es la t\u00e9cnica de impresi\u00f3n textil m\u00e1s establecida y profesional del mercado. Funciona mediante la transferencia de tinta a trav\u00e9s de una malla tensada sobre un marco, utilizando una racleta que presiona la tinta a trav\u00e9s de las \u00e1reas abiertas del estarcido. Cada color requiere una malla separada, lo que implica un costo de setup que solo se justifica en tiradas de 50 o m\u00e1s unidades. Los equipos necesarios incluyen marcos de serigraf\u00eda, mallas (t\u00edpicamente 110-305 mesh), racletas, tintas (plastisol o water-based), unidad de exposici\u00f3n y horno de curado. Marcas recomendadas: Lawson, M&R, Riley Hopkins."),

    h2("DTG (Direct to Garment)"),
    p("DTG es la tecnolog\u00eda revolucionaria que permite imprimir directamente sobre la prenda como si fuera una impresora de papel. Utiliza tintas a base de agua que se absorben en las fibras textiles, logrando una calidad fotorealista con transiciones de color suaves y detalles finos. Es ideal para Print on Demand porque no requiere setup y permite imprimir una sola unidad de manera rentable. Las impresoras DTG m\u00e1s reconocidas son Epson SureColor F-series, Brother GTX Pro y Kornit. El pretreatment es obligatorio para telas oscuras, y el costo por impresi\u00f3n oscila entre $5 y $12 dependiendo del tama\u00f1o y la complejidad del dise\u00f1o."),

    h2("DTF (Direct to Film)"),
    p("DTF es la tecnolog\u00eda emergente m\u00e1s disruptiva del mercado textil. Imprime el dise\u00f1o sobre una pel\u00edcula especial que luego se transfiere a la prenda mediante calor y presi\u00f3n. A diferencia del DTG, no requiere pretreatment, funciona sobre cualquier tipo de tela y color, y produce colores m\u00e1s vibrantes y s\u00f3lidos. La inversi\u00f3n inicial es significativamente menor que la de DTG: una impresora DTF profesional puede costar entre $3,000 y $8,000, frente a los $15,000-$30,000 de una DTG. Marcas l\u00edderes: Prestige, PnB, Epson con conversi\u00f3n DTF."),

    h2("Sublimaci\u00f3n"),
    p("La sublimaci\u00f3n es un proceso qu\u00edmico donde la tinta se convierte directamente de estado s\u00f3lido a gaseoso al aplicar calor, penetrando las fibras del poli\u00e9ster y convirti\u00e9ndose en parte permanente de la tela. Esto significa que el dise\u00f1o no se siente al tacto, no se agrieta ni se descascara con los lavados, y mantiene sus colores de forma indefinida. La limitaci\u00f3n principal es que solo funciona sobre poli\u00e9ster al 100% o mezclas con alto contenido de poli\u00e9ster, y solo sobre telas claras (preferiblemente blancas). Equipos: impresora de sublimaci\u00f3n (Epson SureColor, Sawgrass), papel de sublimaci\u00f3n y prensa t\u00e9rmica."),

    h2("Flujo de trabajo profesional"),
    p("El flujo de trabajo profesional para producci\u00f3n textil se estructura en cinco fases: (1) Preparaci\u00f3n del arte: vectorizaci\u00f3n o rasterizado a 300 DPI, conversi\u00f3n a perfil de color adecuado, separaci\u00f3n de canales si es serigraf\u00eda. (2) Pre-producci\u00f3n: selecci\u00f3n de tela, pruebas de color, mockups de validaci\u00f3n. (3) Producci\u00f3n: impresi\u00f3n seg\u00fan la t\u00e9cnica seleccionada, control de calidad en tiempo real. (4) Post-producci\u00f3n: curado, lavado de prueba, revisi\u00f3n de defectos. (5) Empaquetado y log\u00edstica: etiquetado, doblado, embalaje y env\u00edo. Cada fase requiere protocolos espec\u00edficos de control de calidad para garantizar consistencia en la producci\u00f3n."),
  ];
}

function buildChapter7() {
  return [
    h1("Cap\u00edtulo 7 \u2014 Materiales y Telas"),
    p("La calidad de la camiseta es tan importante como la calidad del dise\u00f1o. Un dise\u00f1o excepcional sobre una tela de baja calidad genera insatisfacci\u00f3n, devoluciones y da\u00f1o a la marca. Comprender las caracter\u00edsticas de cada tipo de tela, su gramaje, sensaci\u00f3n al tacto, durabilidad y compatibilidad con las t\u00e9cnicas de estampado es fundamental para tomar decisiones informadas que impacten positivamente en la experiencia del cliente final."),

    makeTable(
      ["Tipo de Tela", "Gramaje Ideal", "Tacto", "Durabilidad", "Compatibilidad Estampado", "Costo Relativo", "Nicho Recomendado"],
      [
        ["Algod\u00f3n peinado", "150-180 gsm", "Suave, natural", "Alta", "DTG, serigraf\u00eda, DTF", "Medio", "General, premium"],
        ["Ringspun", "150-180 gsm", "Ultra suave, fino", "Media-alta", "DTG, serigraf\u00eda, sublimaci\u00f3n parcial", "Medio-alto", "Premium, retail"],
        ["Poli\u00e9ster", "140-160 gsm", "Liso, ligero", "Muy alta", "Sublimaci\u00f3n, DTF, vinilo", "Bajo", "Deportes, sublimaci\u00f3n"],
        ["Mezclas 50/50", "160-200 gsm", "Equilibrado", "Alta", "DTG, DTF, serigraf\u00eda", "Medio", "POD, general"],
        ["Oversized tees", "200-250 gsm", "Grueso, estructurado", "Muy alta", "DTF, serigraf\u00eda, DTG", "Alto", "Streetwear, luxury"],
        ["Heavyweight", "220-280 gsm", "Denso, premium", "Excelente", "Serigraf\u00eda, bordado, DTG", "Alto", "Premium, marcas propias"],
        ["Softstyle", "130-150 gsm", "Extremadamente suave", "Media", "DTG, DTF", "Medio-alto", "Femenino, retail"],
        ["French Terry", "280-350 gsm", "Esponjoso, c\u00e1lido", "Excelente", "Serigraf\u00eda, bordado, DTG", "Alto", "Sudaderas, oto\u00f1o/invierno"],
        ["Modal", "120-150 gsm", "Sedoso, fluido", "Media", "Sublimaci\u00f3n, DTG limitado", "Alto", "Luxury, femenino"],
        ["Bamboo fabric", "140-170 gsm", "Suave, antibacterial", "Media-alta", "DTG, serigraf\u00eda water-based", "Alto", "Eco-friendly, premium"],
      ],
      [14, 12, 14, 12, 18, 10, 20]
    ),
    emptyLine(),

    p("La elecci\u00f3n del gramaje es cr\u00edtica: un gramaje inferior a 140 gsm produce camisetas transparentes y de baja percepci\u00f3n de calidad, mientras que un gramaje superior a 250 gsm puede resultar inc\u00f3modo en climas c\u00e1lidos. El rango ideal para la mayor\u00eda de aplicaciones POD se sit\u00faa entre 160 y 200 gsm, ofreciendo un balance \u00f3ptimo entre calidad, comodidad y costo. Para marcas premium que buscan diferenciaci\u00f3n, el ringspun y el heavyweight son las opciones m\u00e1s recomendadas, ya que su tacto superior justifica un precio de venta m\u00e1s elevado."),
  ];
}

function buildChapter8() {
  return [
    h1("Cap\u00edtulo 8 \u2014 Herramientas de Dise\u00f1o y Software"),
    p("El ecosistema de herramientas para dise\u00f1o gr\u00e1fico textil ha evolucionado dram\u00e1ticamente con la integraci\u00f3n de la inteligencia artificial. Hoy coexisten herramientas tradicionales de alto nivel profesional con plataformas emergentes impulsadas por IA que democratizan el acceso al dise\u00f1o de calidad. Conocer las fortalezas y debilidades de cada herramienta permite construir un flujo de trabajo eficiente que combine lo mejor de ambos mundos."),

    makeTable(
      ["Herramienta", "Tipo", "Usos Ideales", "IA Integrada", "Costo", "Nivel"],
      [
        ["Adobe Illustrator", "Vectorial", "Logos, tipograf\u00eda, ilustraciones limpias", "Generative Fill (parcial)", "$22/mes", "Avanzado"],
        ["Photoshop", "Raster", "Edici\u00f3n, texturas, mockups, fotomontaje", "Firefly, Neural Filters", "$22/mes", "Avanzado"],
        ["CorelDRAW", "Vectorial", "Dise\u00f1o textil, serigraf\u00eda, separaci\u00f3n colores", "PowerTRACE", "$26/mes", "Intermedio-Adv"],
        ["Canva", "H\u00edbrido", "Dise\u00f1os r\u00e1pidos, mockups, social media", "Magic Design, Magic Write", "Gratis-Pro", "Principiante"],
        ["Figma", "Vectorial/UI", "Prototipos, colaboraci\u00f3n en equipo", "Plugins de IA", "Gratis-Pro", "Intermedio"],
        ["Procreate", "Raster/Ilustraci\u00f3n", "Ilustraci\u00f3n digital, hand lettering", "No nativa", "$13 \u00fanico", "Intermedio-Adv"],
        ["Midjourney", "IA Generativa", "Ilustraciones, arte conceptual, estilos", "Nativa", "$10-60/mes", "Todos"],
        ["Nano Banana", "IA Generativa", "Dise\u00f1os para camisetas POD", "Nativa", "Freemium", "Todos"],
        ["ChatGPT", "IA Texto", "Generaci\u00f3n de prompts, copy, nombres", "GPT-4, DALL-E", "Gratis-Pro", "Todos"],
        ["Leonardo AI", "IA Generativa", "Arte, personajes, estilos consistentes", "Nativa", "Gratis-Pro", "Intermedio"],
        ["Ideogram", "IA Generativa", "Tipograf\u00eda integrada, dise\u00f1os complejos", "Nativa", "Freemium", "Todos"],
        ["Kittl", "H\u00edbrido", "Dise\u00f1o textil, mockups, plantillas", "Generativa", "Gratis-Pro", "Principiante-Int"],
      ],
      [14, 12, 22, 14, 12, 12]
    ),
    emptyLine(),

    h2("Flujo de trabajo con IA"),
    p("El flujo de trabajo profesional para dise\u00f1o de camisetas con IA se estructura en cuatro fases: (1) Investigaci\u00f3n y conceptualizaci\u00f3n: uso de ChatGPT para generar ideas, analizar nichos, crear descripciones de productos y elaborar prompts detallados. (2) Generaci\u00f3n: uso de Midjourney, Leonardo AI, Ideogram o Nano Banana para crear las ilustraciones base, iterando prompts hasta obtener el resultado deseado. (3) Refinamiento: importaci\u00f3n a Photoshop o Illustrator para limpieza, ajuste de color, adici\u00f3n de tipograf\u00eda y preparaci\u00f3n para impresi\u00f3n. (4) Producci\u00f3n: vectorizaci\u00f3n si es necesaria, generaci\u00f3n de mockups con Kittl o Placeit, y exportaci\u00f3n en los formatos requeridos por cada plataforma POD."),

    h2("Generaci\u00f3n de prompts efectivos"),
    p("La ingenier\u00eda de prompts es la habilidad m\u00e1s valiosa en el dise\u00f1o textil con IA. Un prompt bien estructurado debe incluir: estilo visual preciso, descripci\u00f3n de la composici\u00f3n, paleta de colores espec\u00edfica, tipo de iluminaci\u00f3n, calidad de renderizado, indicaciones de fondo (transparente o chroma), y directrices de formato para impresi\u00f3n. El prompt base proporcionado en este manual es un ejemplo de estructura profesional que puede adaptarse a cualquier nicho reemplazando los campos variables."),
  ];
}

function buildChapter9() {
  return [
    h1("Cap\u00edtulo 9 \u2014 Formatos y Preparaci\u00f3n de Archivos"),
    p("La preparaci\u00f3n correcta de los archivos digitales es el eslab\u00f3n final entre un dise\u00f1o excepcional y un producto impreso de calidad profesional. Un dise\u00f1o brillante puede arruinarse por una resoluci\u00f3n insuficiente, un formato inadecuado o una separaci\u00f3n de colores mal ejecutada. Este cap\u00edtulo detalla las especificaciones t\u00e9cnicas necesarias para garantizar que cada archivo produzca el mejor resultado posible en cualquier t\u00e9cnica de impresi\u00f3n."),

    makeTable(
      ["Formato", "Tipo", "Resoluci\u00f3n", "Transparencia", "Uso Principal", "Plataformas POD"],
      [
        ["PNG", "Raster", "300 DPI m\u00ednimo", "S\u00ed (alpha)", "DTG, DTF, sublimaci\u00f3n", "Todas"],
        ["SVG", "Vectorial", "Infinita", "S\u00ed", "Serigraf\u00eda, cortes l\u00e1ser", "Limitadas"],
        ["EPS", "Vectorial", "Infinita", "S\u00ed", "Serigraf\u00eda profesional", "Imprentas"],
        ["AI", "Vectorial", "Infinita", "S\u00ed", "Archivo maestro editable", "Imprentas"],
        ["PDF", "H\u00edbrido", "300 DPI / Vector", "S\u00ed", "Env\u00edo universal", "Todas"],
        ["PSD", "Raster (capas)", "300 DPI m\u00ednimo", "S\u00ed", "Archivo maestro editable", "Interno"],
        ["TIFF", "Raster", "300 DPI m\u00ednimo", "S\u00ed", "Alta calidad, archivo", "Imprentas"],
      ],
      [10, 12, 16, 14, 24, 24]
    ),
    emptyLine(),

    h2("Resoluciones y DPI"),
    p("La resoluci\u00f3n es el factor m\u00e1s cr\u00edtico para la calidad de impresi\u00f3n. El est\u00e1ndar m\u00ednimo para impresi\u00f3n textil es de 300 DPI (puntos por pulgada) al tama\u00f1o real de impresi\u00f3n. Para DTG, se recomienda trabajar a 300-600 DPI. Para serigraf\u00eda, los archivos vectoriales son ideales, pero si se utiliza raster, 300 DPI es suficiente. Para sublimaci\u00f3n, se recomienda 300-400 DPI. Un error com\u00fan es dise\u00f1ar a 72 DPI (resoluci\u00f3n de pantalla) y escalar despu\u00e9s, lo que produce im\u00e1genes pixeladas e irrecuperables. Siempre se debe dise\u00f1ar a la resoluci\u00f3n final desde el inicio."),

    h2("Preparaci\u00f3n para POD"),
    p("La preparaci\u00f3n de archivos para plataformas POD requiere atenci\u00f3n a especificaciones particulares de cada servicio. Merch by Amazon exige archivos PNG de 4500x5400 p\u00edxeles a 300 DPI con fondo transparente. Redbubble acepta PNG de hasta 4000x4000 p\u00edxeles. TeePublic prefiere PNG de 4500x5400 con fondo transparente. Etsy no impone restricciones de formato pero PNG transparente es el est\u00e1ndar. Printify y Printful aceptan PNG de m\u00ednimo 300 DPI con fondo transparente. En todos los casos, el archivo debe estar en espacio de color RGB, sin capas adicionales, y con el dise\u00f1o centrado en el lienzo."),

    h2("Separaci\u00f3n de colores"),
    p("La separaci\u00f3n de colores es un proceso esencial para la serigraf\u00eda que consiste en descomponer un dise\u00f1o multicolor en capas individuales, una por cada tinta a utilizar. Este proceso se realiza en Illustrator o Photoshop utilizando las herramientas de separaci\u00f3n, o con software especializado como Separation Studio. Para DTG y DTF, la separaci\u00f3n no es necesaria ya que estas t\u00e9cnicas imprimen en proceso CMYK directamente. Sin embargo, es recomendable mantener organizados los canales de color en el archivo maestro PSD para facilitar futuras ediciones y variantes del dise\u00f1o."),
  ];
}

function buildChapter10() {
  return [
    h1("Cap\u00edtulo 10 \u2014 Estrategias Comerciales"),
    p("El dise\u00f1o excepcional solo genera ingresos cuando se acompa\u00f1a de una estrategia comercial s\u00f3lida. En el competitivo mercado del Print on Demand, dominar las t\u00e9cnicas de validaci\u00f3n de nichos, posicionamiento en marketplaces y branding es tan importante como dominar las herramientas de dise\u00f1o. Este cap\u00edtulo proporciona las estrategias probadas para convertir dise\u00f1os en ventas consistentes."),

    h2("Validaci\u00f3n de nichos"),
    p("Antes de invertir tiempo en crear dise\u00f1os para un nicho, es imprescindible validar su viabilidad comercial. La validaci\u00f3n implica cuatro pasos: (1) An\u00e1lisis de volumen de b\u00fasqueda mediante Google Trends, Ahrefs o SEMrush para verificar que existe demanda real. (2) An\u00e1lisis de competencia en los marketplaces objetivo para evaluar la saturaci\u00f3n del nicho y la calidad de los dise\u00f1os existentes. (3) Evaluaci\u00f3n de la disposici\u00f3n de pago mediante la observaci\u00f3n de productos similares vendidos y sus rangos de precio. (4) Prueba de concepto subiendo 3-5 dise\u00f1os iniciales y midiendo la respuesta del mercado durante 2-4 semanas antes de escalar."),

    h2("SEO para Etsy"),
    p("El SEO en Etsy es fundamental para la visibilidad de los productos. Los tres pilares son: (1) T\u00edtulo del listing: debe contener las keywords principales en las primeras 40 palabras, priorizando t\u00e9rminos de b\u00fasqueda de cola larga como \"vintage nurse t-shirt funny saying\" sobre keywords gen\u00e9ricas como \"nurse shirt\". (2) Tags: utilizar los 13 tags disponibles con keywords espec\u00edficas y variaciones, incluyendo sin\u00f3nimos y t\u00e9rminos relacionados. (3) Descripci\u00f3n: redactar descripciones naturales que incluyan keywords en contexto, detallando las caracter\u00edsticas del producto, materiales y ocasiones de uso. Herramientas esenciales: eRank y Marmalead para investigaci\u00f3n de keywords espec\u00edficas de Etsy."),

    h2("Plataformas POD: Merch by Amazon, Redbubble, Shopify, TikTok Shop"),
    p("Merch by Amazon es la plataforma con mayor tr\u00e1fico org\u00e1nico gracias al ecosistema de b\u00fasqueda de Amazon. Requiere solicitud de aprobaci\u00f3n y opera por niveles (Tier system) que limitan la cantidad de designs publicables. Redbubble ofrece la mayor facilidad de entrada sin proceso de aprobaci\u00f3n, pero con menores m\u00e1rgenes de ganancia. Shopify con Printify o Printful proporciona el mayor control y margen (t\u00edpicamente $10-20 por camiseta) pero requiere inversi\u00f3n en marketing y tr\u00e1fico. TikTok Shop es la plataforma emergente con mayor potencial viral, ideal para productos con fuerte componente visual y demostraci\u00f3n."),

    h2("Branding para marcas de camisetas"),
    p("Crear una marca propia de camisetas es la estrategia con mayor potencial de rentabilidad a largo plazo. Una marca fuerte genera precios premium, fidelizaci\u00f3n de clientes y protecci\u00f3n contra la competencia por precio. Los elementos esenciales del branding textil incluyen: un nombre memorable y disponible como dominio, un logo vers\u00e1til que funcione en etiquetas y redes sociales, una paleta de color coherente que identifique la marca, una voz y tono consistentes en todas las comunicaciones, y una propuesta de valor diferencial que justifique la elecci\u00f3n del consumidor."),

    h2("C\u00f3mo crear colecciones"),
    p("Las colecciones son la unidad de venta m\u00e1s efectiva en el mercado textil. En lugar de dise\u00f1os aislados, una colecci\u00f3n ofrece un universo visual cohesivo que invita al comprador a adquirir m\u00faltiples productos. Una colecci\u00f3n profesional debe incluir: 5-8 dise\u00f1os principales con est\u00e9tica unificada, variaciones de color para cada dise\u00f1o, mockups consistentes que muestren la colecci\u00f3n como una familia, descripciones interconectadas que remitan a otros productos de la l\u00ednea, y estrategia de lanzamiento escalonada para maximizar la exposici\u00f3n y generar expectativa."),
  ];
}

function buildAnnex() {
  const prompts = [
    // NAVIDAD (5)
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas holiday theme. Bold clean vector outlines combined with photorealistic rendering, Santa Claus with vintage sleigh and reindeer, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text, slogan or phrase in ENGLISH related to the Christmas theme: MERRY & BRIGHT, integrated naturally into the composition, using a vintage script font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal in Photoshop, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas theme. Bold clean vector outlines combined with photorealistic rendering, decorated Christmas tree with ornaments and glowing star topper, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: HO HO HO, integrated naturally into the composition, using a bold gothic font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma magenta background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas winter theme. Bold clean vector outlines, cozy cabin with snow and Christmas lights, photorealistic rendering, sharp shading, intricate textures, dramatic warm lighting with strong contrast. Rich red green gold palette with smooth gradients. Typography: COZY SEASON in elegant serif font. English only, perfectly legible. Centered composition, chroma green background, clean silhouette separation. T-shirt print design, sticker-style, 4K, professional graphic design."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas ugly sweater theme. Bold clean vector outlines, funny reindeer with ugly sweater pattern, photorealistic rendering, sharp shading, rich red and green palette. Typography: DECK THE HALLS in retro display font. English only, legible. Centered composition, chroma magenta background, clean silhouette. T-shirt print design, 4K, trending on Behance."},
    {cat:"Navidad", prompt:"Vector illustration with hyperrealistic detail, Christmas magic theme. Bold clean vector outlines, nutcracker soldier with candy cane and holly, photorealistic rendering, sharp shading, rich burgundy and gold palette. Typography: BELIEVE IN MAGIC in script font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K, professional graphic design."},

    // HALLOWEEN (5)
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween theme. Bold clean vector outlines combined with photorealistic rendering, terrifying jack-o-lantern with glowing eyes and wicked grin, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette: black, orange, purple, with smooth gradients, depth and dimension. Includes bold typography with short impactful text: TRICK OR TREAT, integrated naturally, using a horror gothic font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween theme. Bold clean vector outlines, creepy skull with cobwebs and bats flying, photorealistic rendering, sharp shading, intricate textures, dramatic dark lighting. Rich black orange green palette. Typography: SPOOKY SEASON in dripping horror font. English only, legible. Centered composition, chroma magenta background, clean silhouette. T-shirt print, sticker-style, 4K, trending on Behance."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween witch theme. Bold clean vector outlines, witch hat with potion bottles and black cat, photorealistic rendering, sharp shading, purple and green palette. Typography: WITCHY VIBES in mystical display font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K, professional graphic design."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween vampire theme. Bold clean vector outlines, vampire coffin with roses and fangs, photorealistic rendering, sharp shading, deep red and black palette. Typography: BITE ME in gothic font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Halloween", prompt:"Vector illustration with hyperrealistic detail, Halloween ghost theme. Bold clean vector outlines, cute ghost with BOO text and stars, photorealistic rendering, sharp shading, white and purple on black palette. Typography: BOO CREW in playful display font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // ANIME (5)
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime warrior theme. Bold clean vector outlines combined with photorealistic rendering, powerful anime warrior with katana and cherry blossom petals, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: WARRIOR SPIRIT, integrated naturally, using a Japanese brush font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime kawaii theme. Bold clean vector outlines, cute anime cat girl with magical stars and sparkles, photorealistic rendering, sharp shading, pink and cyan palette. Typography: KAWAII DREAMS in bubbly display font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime mecha theme. Bold clean vector outlines, giant robot mech with energy sword and explosion, photorealistic rendering, sharp shading, blue and orange palette. Typography: GEAR UP in futuristic font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime dragon theme. Bold clean vector outlines, majestic dragon with flames and kanji-style energy, photorealistic rendering, sharp shading, red and gold palette. Typography: DRAGON SOUL in Japanese brush font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Anime", prompt:"Vector illustration with hyperrealistic detail, anime magical girl theme. Bold clean vector outlines, magical girl with wand and moon crescent, photorealistic rendering, sharp shading, lavender and silver palette. Typography: STAR POWER in sparkly display font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // GAMING (5)
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming theme. Bold clean vector outlines combined with photorealistic rendering, retro arcade machine with pixel art screen and joystick, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: GAME OVER, integrated naturally, using a pixel font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming controller theme. Bold clean vector outlines, gaming controller with neon glow and energy waves, photorealistic rendering, sharp shading, neon cyan and magenta palette on black. Typography: PLAYER ONE in bold futuristic font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming headset theme. Bold clean vector outlines, professional gaming headset with sound waves and digital grid, photorealistic rendering, sharp shading, purple and green palette. Typography: VOICE CHAT in monospace font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, gaming RPG theme. Bold clean vector outlines, warrior helmet with sword and shield pixel art, photorealistic rendering, sharp shading, gold and crimson palette. Typography: LEGENDARY in bold display font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Gaming", prompt:"Vector illustration with hyperrealistic detail, cyberpunk gaming theme. Bold clean vector outlines, cyberpunk character with VR headset and neon city, photorealistic rendering, sharp shading, neon blue and pink palette. Typography: ENTER THE GRID in glitch font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // FITNESS (5)
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness gym theme. Bold clean vector outlines combined with photorealistic rendering, muscular lion lifting weights with chain, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: BEAST MODE, integrated naturally, using a bold stencil font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness motivation theme. Bold clean vector outlines, barbell with wings and lightning bolts, photorealistic rendering, sharp shading, black and red palette. Typography: NO EXCUSES in bold sans serif font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness running theme. Bold clean vector outlines, running shoes with speed lines and fire trail, photorealistic rendering, sharp shading, orange and black palette. Typography: JUST RUN in display font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness strength theme. Bold clean vector outlines, flexed arm with dumbbell and crown, photorealistic rendering, sharp shading, gold and black palette. Typography: STAY STRONG in bold condensed font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Fitness", prompt:"Vector illustration with hyperrealistic detail, fitness warrior theme. Bold clean vector outlines, Spartan helmet with spear and shield silhouette, photorealistic rendering, sharp shading, crimson and bronze palette. Typography: WARRIOR in bold serif font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // RELIGIÓN (5)
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, Christian faith theme. Bold clean vector outlines combined with photorealistic rendering, elegant cross with olive branches and dove, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: FAITH OVER FEAR, integrated naturally, using an elegant serif font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith grace theme. Bold clean vector outlines, crown of thorns with rays of light, photorealistic rendering, sharp shading, gold and white palette. Typography: AMAZING GRACE in script font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith prayer theme. Bold clean vector outlines, folded hands with rosary and candlelight, photorealistic rendering, sharp shading, warm burgundy and cream palette. Typography: PRAY ALWAYS in serif font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith hope theme. Bold clean vector outlines, anchor with Bible and lighthouse, photorealistic rendering, sharp shading, navy and gold palette. Typography: ANCHORED IN HOPE in display serif font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Religi\u00f3n", prompt:"Vector illustration with hyperrealistic detail, faith blessings theme. Bold clean vector outlines, blooming lily with butterfly and sunshine, photorealistic rendering, sharp shading, pastel green and white palette. Typography: BLESSED in hand-lettered font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // STREETWEAR (5)
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear urban theme. Bold clean vector outlines combined with photorealistic rendering, snarling wolf with chain necklace and graffiti splatter, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: SAVAGE MODE, integrated naturally, using a gothic font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear attitude theme. Bold clean vector outlines, skull with sunglasses and gold chain, photorealistic rendering, sharp shading, black and gold palette. Typography: NO RULES in bold display font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear king theme. Bold clean vector outlines, lion head with crown and urban textures, photorealistic rendering, sharp shading, red and black palette. Typography: KING OF THE STREETS in gothic font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear hustle theme. Bold clean vector outlines, money stack with wings and stopwatch, photorealistic rendering, sharp shading, green and black palette. Typography: HUSTLE HARD in stencil font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Streetwear", prompt:"Vector illustration with hyperrealistic detail, streetwear rebel theme. Bold clean vector outlines, eagle with spread wings and lightning bolt, photorealistic rendering, sharp shading, white and black palette. Typography: REBEL in bold condensed font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // VINTAGE (5)
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage retro theme. Bold clean vector outlines combined with photorealistic rendering, classic motorcycle with eagle wings and sunset, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: RIDE FREE, integrated naturally, using a vintage retro font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage outdoor theme. Bold clean vector outlines, retro camping tent with pine trees and mountain, photorealistic rendering, sharp shading, warm orange and brown palette. Typography: ADVENTURE AWAITS in retro display font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage surfing theme. Bold clean vector outlines, retro surfboard with wave and palm tree, photorealistic rendering, sharp shading, teal and coral palette. Typography: SURF VIBES in 70s display font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage music theme. Bold clean vector outlines, classic guitar with amplifier and music notes, photorealistic rendering, sharp shading, warm brown and cream palette. Typography: ROCK ON in retro serif font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Vintage", prompt:"Vector illustration with hyperrealistic detail, vintage diner theme. Bold clean vector outlines, 1950s milkshake with cherry and stars, photorealistic rendering, sharp shading, cherry red and cream palette. Typography: SWEET LIFE in vintage script font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // MOTIVACIONAL (5)
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivation mindset theme. Bold clean vector outlines combined with photorealistic rendering, phoenix rising from flames with stars, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: RISE ABOVE, integrated naturally, using a bold sans serif font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivation grind theme. Bold clean vector outlines, mountain peak with flag and sunrise, photorealistic rendering, sharp shading, deep blue and gold palette. Typography: NEVER QUIT in bold condensed font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivation dream theme. Bold clean vector outlines, rocket launching through clouds with stars, photorealistic rendering, sharp shading, navy and silver palette. Typography: DREAM BIG in display font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivation focus theme. Bold clean vector outlines, arrow hitting bullseye with energy burst, photorealistic rendering, sharp shading, red and black palette. Typography: STAY FOCUSED in stencil font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Motivacional", prompt:"Vector illustration with hyperrealistic detail, motivation growth theme. Bold clean vector outlines, tree growing from concrete with golden leaves, photorealistic rendering, sharp shading, green and gold palette. Typography: GROW THROUGH IT in hand-lettered font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},

    // PROFESIONES (5)
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, nurse healthcare theme. Bold clean vector outlines combined with photorealistic rendering, nurse cap with stethoscope and heartbeat line, sharp shading, intricate textures, dramatic lighting with strong contrast. Rich and vibrant full color palette with smooth gradients, depth and dimension. Includes bold typography with short impactful text: NURSE LIFE, integrated naturally, using a bold sans serif font style. All text must be written exclusively in English, perfectly legible, correctly spelled, with clean kerning and high contrast against the design. Centered composition, isolated on a solid flat chroma green background for easy background removal, no background scenery, no shadows touching the edges, clean silhouette separation. T-shirt print design, crisp edges, sticker-style silhouette. Ultra detailed, 4K, professional graphic design, trending on Behance."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, firefighter hero theme. Bold clean vector outlines, firefighter helmet with axe and flames, photorealistic rendering, sharp shading, red and yellow palette. Typography: BRAVE HEART in bold display font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, programmer coder theme. Bold clean vector outlines, laptop with code and coffee cup, photorealistic rendering, sharp shading, neon green and black palette. Typography: CODE & COFFEE in monospace font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, teacher education theme. Bold clean vector outlines, apple with pencil and books stack, photorealistic rendering, sharp shading, warm red and cream palette. Typography: BEST TEACHER in hand-lettered font. English only. Centered composition, chroma magenta background, clean silhouette. T-shirt print, 4K."},
    {cat:"Profesiones", prompt:"Vector illustration with hyperrealistic detail, architect design theme. Bold clean vector outlines, compass with blueprint and building, photorealistic rendering, sharp shading, navy and white palette. Typography: DESIGN THE FUTURE in serif font. English only. Centered composition, chroma green background, clean silhouette. T-shirt print, 4K."},
  ];

  const content = [
    h1("Anexo Premium \u2014 Biblioteca de 50 Prompts IA"),
    p("Esta biblioteca presenta 50 prompts avanzados y optimizados para herramientas de IA generativa como Midjourney, Nano Banana, Leonardo AI, Ideogram y DALL-E. Cada prompt ha sido dise\u00f1ado siguiendo la estructura profesional validada para generar dise\u00f1os de camiseta de calidad comercial con fondo crom\u00e1tico para f\u00e1cil remoci\u00f3n, tipograf\u00eda integrada en ingl\u00e9s y especificaciones de impresi\u00f3n textil. Los prompts est\u00e1n organizados en 10 categor\u00edas tem\u00e1ticas con 5 prompts cada una."),
    p("Instrucciones de uso: Copia el prompt completo, reemplaza los campos variables si los hay, y p\u00e9galo en tu herramienta de IA generativa preferida. Para obtener mejores resultados, experimenta con diferentes variaciones de estilo, paleta y tipograf\u00eda. Despu\u00e9s de generar la imagen, remueve el fondo crom\u00e1tico en Photoshop, ajusta colores si es necesario, a\u00f1ade o modifica la tipograf\u00eda en Illustrator o Photoshop, y exporta en PNG a 300 DPI con fondo transparente."),
  ];

  // Group by category
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
      // Truncate long prompts for display, show first 200 chars then continue
      const parts = [];
      if (pr.length > 300) {
        // Split into paragraphs for readability
        const sentences = pr.split('. ');
        let current = '';
        for (const s of sentences) {
          if (current.length + s.length > 250) {
            parts.push(current.trim());
            current = s + '. ';
          } else {
            current += s + '. ';
          }
        }
        if (current.trim()) parts.push(current.trim());
      } else {
        parts.push(pr);
      }
      for (const part of parts) {
        content.push(p(part));
      }
      promptIndex++;
    }
  }

  return content;
}

// ============================================================
// BUILD DOCUMENT
// ============================================================
async function main() {
  const coverImageBuffer = fs.readFileSync("/home/z/my-project/download/cover_tshirt_manual.png");

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
          title: "Manual Premium de Dise\u00f1o Gr\u00e1fico para Camisetas con IA",
          subtitle: "Gu\u00eda Profesional de Dise\u00f1o Textil, Impresi\u00f3n POD y Prompts de IA",
          englishLabel: "PREMIUM T-SHIRT DESIGN MANUAL",
          metaLines: [
            "Edici\u00f3n 2026 \u2014 Print On Demand & AI Design",
            "Nichos, T\u00e9cnicas, Paletas, Tipograf\u00edas y 50 Prompts",
          ],
          footerLeft: "AI-Powered Design",
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
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })],
            })],
          }),
        },
        children: [
          // Cover image
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new ImageRun({
              data: coverImageBuffer,
              transformation: { width: 500, height: 286 },
              type: "png",
            })],
          }),
          // TOC Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 480, after: 360 },
            children: [new TextRun({
              text: "Tabla de Contenido",
              bold: true, size: 32,
              font: { ascii: "Calibri", eastAsia: "SimHei" },
              color: c(P.primary),
            })],
          }),
          // TOC element
          new TableOfContents("Table of Contents", {
            hyperlink: true,
            headingStyleRange: "1-3",
          }),
          // Refresh hint
          new Paragraph({
            spacing: { before: 200 },
            children: [new TextRun({
              text: "Nota: Esta Tabla de Contenido se genera mediante c\u00f3digos de campo. Para asegurar la precisi\u00f3n de los n\u00fameros de p\u00e1gina despu\u00e9s de editar, haga clic derecho en la TOC y seleccione \"Actualizar campo\".",
              italics: true, size: 18, color: "888888",
            })],
          }),
          // PageBreak after TOC
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
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({
                text: "Manual Premium de Dise\u00f1o Gr\u00e1fico para Camisetas con IA",
                size: 16, color: c(P.secondary), italics: true,
              })],
            })],
          }),
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })],
            })],
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
  const outputPath = "/home/z/my-project/download/Manual_Premium_Diseño_Gráfico_Camisetas_IA.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document generated successfully at:", outputPath);
}

main().catch(err => { console.error("Error:", err); process.exit(1); });
