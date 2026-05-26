import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ZAI from 'z-ai-web-dev-sdk';
import { NICHE_TEXT_EXAMPLES } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { product, niche, style, aiEngine } = await req.json();

    if (!product || !niche) {
      return NextResponse.json({ error: 'product and niche are required' }, { status: 400 });
    }

    // Always return fallback immediately so UI can show something while AI loads
    const fallbackKey = niche as keyof typeof NICHE_TEXT_EXAMPLES;
    const fallback = NICHE_TEXT_EXAMPLES[fallbackKey] || NICHE_TEXT_EXAMPLES['Motivacional'];

    const systemInstruction = `You are a creative copywriter specialized in Print-on-Demand (POD) product text. 
Your task is to suggest short, catchy text phrases for a POD product design.
Rules:
- Return ONLY a JSON array of exactly 6 text suggestion strings
- Each string is a short phrase (1-6 words MAX) suitable for printing on the product
- Write in ENGLISH
- Phrases should be creative, punchy, commercial and relevant to the niche
- No hashtags, no quotes, no punctuation at the end
- Example output format: ["Phrase One", "Another Idea", "Bold Statement", "Cool Concept", "Short Text", "Quick Wit"]`;

    const userPrompt = `Suggest 6 short text phrases for a "${product}" design in the "${niche}" niche with a "${style}" style.
The phrases should feel natural on a ${product} — reflect the niche identity, culture, and personality.
Return ONLY a JSON array of 6 strings.`;

    let suggestions: string[] = fallback.primary;

    try {
      if (aiEngine === 'gemini' && process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
          systemInstruction,
          generationConfig: { responseMimeType: 'application/json' },
        });
        const result = await model.generateContent(userPrompt);
        const raw = result.response.text();
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          suggestions = parsed.slice(0, 6).map(String);
        }
      } else {
        // ZAI path
        const zai = await ZAI.create();
        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt },
          ],
        });
        const raw = completion.choices[0]?.message?.content || '[]';
        // Extract JSON from the response
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            suggestions = parsed.slice(0, 6).map(String);
          }
        }
      }
    } catch (aiError) {
      console.warn('AI suggestion failed, using fallback:', aiError);
      // Return fallback silently
    }

    return NextResponse.json({
      suggestions,
      fallback: fallback.primary,
      secondary: fallback.secondary,
      accent: fallback.accent,
    });
  } catch (error) {
    console.error('Error in suggest-texts:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
