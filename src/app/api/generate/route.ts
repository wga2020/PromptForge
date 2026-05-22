import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { product, niche, style, primaryText, secondaryText, accentText, fonts, colors, aiTool } = await req.json();

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert prompt engineer for AI image generation tools for print-on-demand products. Generate detailed, specific prompts optimized for the given AI tool. Return ONLY the prompt text, nothing else. The prompt should be in English, detailed, and optimized for the specified AI image generation tool. Include specific details about typography, layout, color, style, and print specifications.',
        },
        {
          role: 'user',
          content: `Generate an image prompt for a ${product} design, ${niche} niche, ${style} style, with primary text "${primaryText}"${secondaryText ? `, secondary text "${secondaryText}"` : ''}${accentText ? `, accent text "${accentText}"` : ''}, using fonts ${fonts.principal}/${fonts.secundaria}/${fonts.acento}, color palette ${colors.join(', ')}, optimized for ${aiTool}. Make it detailed and specific for print-on-demand quality.`,
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
