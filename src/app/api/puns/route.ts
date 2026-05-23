import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { PUNS_MASTER_PROMPT } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { language, niche } = await req.json();

    if (!language || !niche) {
      return NextResponse.json(
        { error: 'Language and niche are required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `${PUNS_MASTER_PROMPT}

Return ONLY valid JSON, no other text or explanation.`,
        },
        {
          role: 'user',
          content: `Generate 25 wordplays (puns) in ${language} for the niche/theme: "${niche}".

Distribute them EXACTLY as follows across these 9 POD product categories:

1. T-Shirts (3 puns) - Eye-catching phrases, identity, humor, pride that people want to "wear proudly"
2. Hoodies (3 puns) - Cozy phrases, mindset, weekend vibes, oversized comfort style
3. Mugs (3 puns) - Morning routine, office, coffee/tea, tiredness phrases
4. Tote Bags (3 puns) - Shopping, eco-friendly, outings, relaxed lifestyle phrases
5. Stickers (3 puns) - Very short, visual, direct phrases ideal for laptops, bottles, notebooks
6. Cap/Gorra (2 puns) - Ultra-short, attitude, sports, sun, bad hair day phrases
7. Cushion/Cojín (2 puns) - Home, rest, laziness, decor, coziness phrases
8. Blanket/Manta (2 puns) - Sleep, winter, binge-watching, warmth, extreme laziness phrases
9. MousePad (2 puns) - Office work, gaming, productivity, technology, work stress phrases

Return your response as a JSON array with this exact structure (no markdown, no code fences, just raw JSON):
[
  {
    "icon": "👕",
    "name": "T-Shirts",
    "productKey": "T-Shirt",
    "description": "Eye-catching phrases, identity, humor, pride",
    "items": ["pun 1", "pun 2", "pun 3"]
  },
  {
    "icon": "🧥",
    "name": "Hoodies",
    "productKey": "Hoodie",
    "description": "Cozy phrases, mindset, weekend vibes",
    "items": ["pun 1", "pun 2", "pun 3"]
  },
  {
    "icon": "☕",
    "name": "Mugs",
    "productKey": "Mug/Taza",
    "description": "Morning routine, office, coffee/tea, tiredness",
    "items": ["pun 1", "pun 2", "pun 3"]
  },
  {
    "icon": "🛍️",
    "name": "Tote Bags",
    "productKey": "Tote Bag",
    "description": "Shopping, eco-friendly, relaxed lifestyle",
    "items": ["pun 1", "pun 2", "pun 3"]
  },
  {
    "icon": "🏷️",
    "name": "Stickers",
    "productKey": "Sticker",
    "description": "Very short, visual, direct phrases",
    "items": ["pun 1", "pun 2", "pun 3"]
  },
  {
    "icon": "🧢",
    "name": "Cap/Gorra",
    "productKey": "Cap/Gorra",
    "description": "Ultra-short, attitude, sports, sun",
    "items": ["pun 1", "pun 2"]
  },
  {
    "icon": "🛋️",
    "name": "Cushion/Cojín",
    "productKey": "Cushion/Cojín",
    "description": "Home, rest, laziness, decor, coziness",
    "items": ["pun 1", "pun 2"]
  },
  {
    "icon": "🛌",
    "name": "Blanket/Manta",
    "productKey": "Blanket/Manta",
    "description": "Sleep, winter, binge-watching, warmth",
    "items": ["pun 1", "pun 2"]
  },
  {
    "icon": "🖱️",
    "name": "MousePad",
    "productKey": "Mousepad",
    "description": "Office work, gaming, productivity, stress",
    "items": ["pun 1", "pun 2"]
  }
]`,
        },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content || '';

    // Parse the JSON response - handle potential markdown code fences
    let puns;
    try {
      const cleanedContent = rawContent
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      puns = JSON.parse(cleanedContent);
    } catch (parseErr) {
      console.error('Failed to parse puns JSON:', parseErr);
      console.error('Raw content:', rawContent);
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
