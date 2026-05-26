import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRODUCT_PROMPT_CONFIG, STYLE_FONT_AESTHETIC, STYLE_ILLUSTRATION_MAP, NICHE_THEME_MAP, selectChromaColor } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { aiEngine, product, niche, style, primaryText, secondaryText, accentText, fonts, colors, aiTool, currentPrompt, garmentTone } = await req.json();

    const config = PRODUCT_PROMPT_CONFIG[product] || PRODUCT_PROMPT_CONFIG["T-Shirt"];
    const fontAesthetic = STYLE_FONT_AESTHETIC[style] || STYLE_FONT_AESTHETIC["Modern Bold"];
    const illustrationApproach = STYLE_ILLUSTRATION_MAP[style] || STYLE_ILLUSTRATION_MAP["Modern Bold"];
    const nicheTheme = NICHE_THEME_MAP[niche] || niche;

    const systemInstruction = `You are an expert prompt engineer for AI image generation tools specializing in print-on-demand product design. Your prompts must follow this master template structure:

1. ILLUSTRATION STYLE: Vector illustration with hyperrealistic detail
2. THEME: Rich thematic description
3. RENDERING: Bold clean vector outlines + photorealistic rendering, sharp shading, intricate textures, dramatic lighting
4. COLOR: Rich vibrant palette with smooth gradients, depth and dimension
5. TYPOGRAPHY: Bold text in ENGLISH, perfectly legible, correctly spelled, clean kerning, high contrast
6. COMPOSITION: Centered, product-optimized for FLAT PRINT FILE
7. BACKGROUND: Solid chroma key for easy removal (or full artistic for posters/cards)
8. QUALITY: Ultra detailed, 4K, professional, trending on Behance

ANTI-MOCKUP RULES — VIOLATIONS DESTROY THE OUTPUT:
- NEVER describe or reference a physical 3D product in the prompt (no ceramic mug, no cup, no t-shirt on mannequin, no phone in hand)
- NEVER use words: mockup, product photo, photography, lifestyle shot, on a mug, on a shirt, wrapped around, cylindrical, 3D render of
- ALWAYS describe a FLAT 2D ARTWORK / PRINT FILE — the artwork that will be applied to the product later by the printer
- The image generator must output a FLAT DESIGN FILE, not a product render
- Think of it as: "what would the design look like laid flat on a table as a piece of paper?"

CRITICAL RULES:
- All text in the design MUST be in ENGLISH
- Text must be perfectly legible and correctly spelled — every letter visible and uncut
- Include specific font name references
- Include print specifications (DPI, resolution, technique)
- Include chroma key background for removal when appropriate
- You MUST include the requested Aspect Ratio instruction in the composition section
- The prompt MUST END exactly with the aspect ratio flag (e.g., "--ar 3:4")
- The prompt must be a single continuous paragraph
- Return ONLY the prompt text, no explanations or formatting`;

    let garmentRule = "";
    if (garmentTone === 'dark') {
      garmentRule = "MANDATORY: Use LIGHT, BRIGHT colors for typography and main elements. The design will be printed on a BLACK/DARK garment, so high contrast is essential. Avoid dark texts.";
    } else if (garmentTone === 'light') {
      garmentRule = "MANDATORY: Use DARK colors for typography and main elements. The design will be printed on a WHITE/LIGHT garment, so high contrast is essential. Avoid white texts.";
    }

    const userPrompt = `Enhance and improve this print-on-demand prompt for ${aiTool}. The current prompt is:

"${currentPrompt}"

Context: This is for a ${product} design, "${niche}" niche (${nicheTheme}), ${style} style.
Font aesthetic: ${fontAesthetic}
Illustration approach: ${illustrationApproach}
Product context: ${config.productContext}
Background spec: ${config.backgroundSpec}
Quality markers: ${config.qualityMarkers}
Fonts specified: Primary "${fonts.principal}", Secondary "${fonts.secundaria}", Accent "${fonts.acento}"
Color palette: ${colors.join(', ')}
${garmentRule}

IMPORTANT: Improve this prompt ensuring it describes a FLAT 2D PRINT FILE ARTWORK, NOT a 3D product render or mockup. Ensure all text references are in ENGLISH. 
MANDATORY: You must include the aspect ratio constraint (e.g. REQUIRED ASPECT RATIO: ${config.aspectRatio}) in the text, and YOU MUST end the entire prompt with the exact string: --ar ${config.aspectRatio}

Return ONLY the enhanced prompt.`;

    if (aiEngine === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
        systemInstruction
      });

      const result = await model.generateContent(userPrompt);
      const generatedPrompt = result.response.text();
      return NextResponse.json({ prompt: generatedPrompt });
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert prompt engineer for AI image generation tools specializing in print-on-demand product design. Your prompts must follow this master template structure:

1. ILLUSTRATION STYLE: Vector illustration with hyperrealistic detail
2. THEME: Rich thematic description
3. RENDERING: Bold clean vector outlines + photorealistic rendering, sharp shading, intricate textures, dramatic lighting
4. COLOR: Rich vibrant palette with smooth gradients, depth and dimension
5. TYPOGRAPHY: Bold text in ENGLISH, perfectly legible, correctly spelled, clean kerning, high contrast
6. COMPOSITION: Centered, product-optimized for FLAT PRINT FILE
7. BACKGROUND: Solid chroma key for easy removal (or full artistic for posters/cards)
8. QUALITY: Ultra detailed, 4K, professional, trending on Behance

ANTI-MOCKUP RULES — VIOLATIONS DESTROY THE OUTPUT:
- NEVER describe or reference a physical 3D product in the prompt (no ceramic mug, no cup, no t-shirt on mannequin, no phone in hand)
- NEVER use words: mockup, product photo, photography, lifestyle shot, on a mug, on a shirt, wrapped around, cylindrical, 3D render of
- ALWAYS describe a FLAT 2D ARTWORK / PRINT FILE — the artwork that will be applied to the product later by the printer
- The image generator must output a FLAT DESIGN FILE, not a product render
- Think of it as: "what would the design look like laid flat on a table as a piece of paper?"

CRITICAL RULES:
- All text in the design MUST be in ENGLISH
- Text must be perfectly legible and correctly spelled — every letter visible and uncut
- Include specific font name references
- Include print specifications (DPI, resolution, technique)
- Include chroma key background for removal when appropriate
- The prompt must be a single continuous paragraph
- Return ONLY the prompt text, no explanations or formatting`,
        },
        {
          role: 'user',
          content: `Enhance and improve this print-on-demand prompt for ${aiTool}. The current prompt is:

"${currentPrompt}"

Context: This is for a ${product} design, "${niche}" niche (${nicheTheme}), ${style} style.
Font aesthetic: ${fontAesthetic}
Illustration approach: ${illustrationApproach}
Product context: ${config.productContext}
Background spec: ${config.backgroundSpec}
Quality markers: ${config.qualityMarkers}
Fonts specified: Primary "${fonts.principal}", Secondary "${fonts.secundaria}", Accent "${fonts.acento}"
Color palette: ${colors.join(', ')}

IMPORTANT: Improve this prompt ensuring it describes a FLAT 2D PRINT FILE ARTWORK, NOT a 3D product render or mockup. The prompt must never cause an AI image generator to draw the physical product — only the flat design to be applied to it. Ensure all text references are in ENGLISH, typography specs are clear, every character of text is fully visible, and print quality markers are included. Return ONLY the enhanced prompt.`,
        },
      ],
    });

    if (!completion || !completion.choices || completion.choices.length === 0) {
      console.error('AI API returned an unexpected response or error:', JSON.stringify(completion, null, 2));
      return NextResponse.json(
        { error: 'El servicio de IA no pudo generar el contenido. Por favor intenta de nuevo.' },
        { status: 502 }
      );
    }

    const generatedPrompt = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Error generating AI prompt:', error);
    return NextResponse.json({ error: 'Failed to generate AI prompt' }, { status: 500 });
  }
}
