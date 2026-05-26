import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PUNS_MASTER_PROMPT } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { aiEngine, language, niche, selectedProducts } = await req.json();

    if (!language || !niche || !selectedProducts || !Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return NextResponse.json(
        { error: 'Language, niche and selectedProducts are required' },
        { status: 400 }
      );
    }

    const productInstructions = selectedProducts.map((p: any, i: number) => `${i + 1}. ${p.name} (25 puns) - ${p.description}`).join('\n');
    const jsonStructure = selectedProducts.map((p: any) => `  {
    "icon": "${p.icon}",
    "name": "${p.name}",
    "productKey": "${p.productKey}",
    "description": "${p.description}",
    "items": ["pun 1", "pun 2", "pun 3", "...", "pun 25"]
  }`).join(',\n');

    const promptBase = PUNS_MASTER_PROMPT.split('Distribution across POD products')[0];

    const prompt = `${promptBase}

Return ONLY valid JSON, no other text or explanation.

Generate 25 wordplays (puns) in ${language} for the niche/theme: "${niche}" FOR EACH of the requested products.

CRITICAL RULE: NEVER append the product name (e.g., "Tote", "Mug", "Shirt") to the end of your puns just to mention the product. The puns must be clever, independent phrases that relate to the niche and the context of using the product, but they MUST NOT literally end with the product name.

Distribute them EXACTLY as follows:

${productInstructions}

Return your response as a JSON array with this exact structure (no markdown, no code fences, just raw JSON):
[
${jsonStructure}
]`;

    if (aiEngine === 'gemini') {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite" });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        }
      });

      const rawContent = result.response.text();
      let puns;
      try {
        puns = JSON.parse(rawContent);
      } catch (parseErr) {
        console.error('Failed to parse puns JSON:', parseErr);
        return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
      }

      if (!Array.isArray(puns) || puns.length === 0) {
        return NextResponse.json({ error: 'Invalid response format from AI. Please try again.' }, { status: 500 });
      }

      return NextResponse.json({ puns });
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `${promptBase}\n\nReturn ONLY valid JSON, no other text or explanation.`,
        },
        {
          role: 'user',
          content: prompt,
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

    const rawContent = completion.choices[0]?.message?.content || '';

    let puns;
    try {
      const cleanedContent = rawContent
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      puns = JSON.parse(cleanedContent);
    } catch (parseErr) {
      console.error('Failed to parse puns JSON:', parseErr);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    if (!Array.isArray(puns) || puns.length === 0) {
      return NextResponse.json(
        { error: 'Invalid response format from AI. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ puns });
  } catch (error) {
    console.error('Error generating puns:', error);
    return NextResponse.json(
      { error: 'Failed to generate puns' },
      { status: 500 }
    );
  }
}
