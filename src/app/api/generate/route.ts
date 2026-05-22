import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_PROMPT_CONFIG, STYLE_FONT_AESTHETIC, STYLE_ILLUSTRATION_MAP, NICHE_THEME_MAP, selectChromaColor } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { product, niche, style, primaryText, secondaryText, accentText, fonts, colors, aiTool, currentPrompt } = await req.json();

    const config = PRODUCT_PROMPT_CONFIG[product] || PRODUCT_PROMPT_CONFIG["T-Shirt"];
    const fontAesthetic = STYLE_FONT_AESTHETIC[style] || STYLE_FONT_AESTHETIC["Modern Bold"];
    const illustrationApproach = STYLE_ILLUSTRATION_MAP[style] || STYLE_ILLUSTRATION_MAP["Modern Bold"];
    const nicheTheme = NICHE_THEME_MAP[niche] || niche;

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
6. COMPOSITION: Centered, product-optimized
7. BACKGROUND: Solid chroma key for easy removal (or full artistic for posters/cards)
8. QUALITY: Ultra detailed, 4K, professional, trending on Behance

CRITICAL RULES:
- All text in the design MUST be in ENGLISH
- Text must be perfectly legible and correctly spelled
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

Improve this prompt by making it more specific, detailed, and aligned with the master template. Ensure all text references are in ENGLISH, typography specs are clear, and print quality markers are included. Return ONLY the enhanced prompt.`,
        },
      ],
    });

    const generatedPrompt = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Error generating AI prompt:', error);
    return NextResponse.json({ error: 'Failed to generate AI prompt' }, { status: 500 });
  }
}
