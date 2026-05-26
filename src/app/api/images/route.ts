import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, mode } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is missing. Please update your .env file.' }, { status: 500 });
    }

    // Anti-mockup guard: remove any words that trigger 3D product renders
    const MOCKUP_TRIGGER_WORDS = [
      /\bon a mug\b/gi, /\bon a cup\b/gi, /\bon a t-shirt\b/gi, /\bon a shirt\b/gi,
      /\bproduct mockup\b/gi, /\bmockup\b/gi, /\bproduct photo\b/gi, /\blifestyle shot\b/gi,
      /\bwrapped around\b/gi, /\bcylindrical surface\b/gi, /\b3D render of\b/gi,
      /\bvisible from front viewing angle\b/gi, /\bsoft shadows acceptable\b/gi,
    ];
    const cleanPrompt = MOCKUP_TRIGGER_WORDS.reduce((p, re) => p.replace(re, ''), prompt);

    const flatDesignPrefix = `FLAT 2D PRINT-READY ARTWORK — NOT a product photo, NOT a mockup, NOT a 3D render. This is the ARTWORK FILE that will be applied to the product by the printer. The image must show only the flat design on a neutral background, as if it were a piece of paper lying flat. `;

    const engineeredPrompt = mode === 'mockup' 
      ? `Realistic photography, mockup of a product. ${prompt}`
      : `${flatDesignPrefix}${cleanPrompt}`;

    // =========================================================================
    // 🧠 Conexión con Gemini Image Model
    // =========================================================================
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview',
    });

    let finalPrompt = engineeredPrompt;
    let extractedAspectRatio = "1:1";
    const arMatch = finalPrompt.match(/--ar\s+(\d+:\d+)/i);
    if (arMatch) {
      extractedAspectRatio = arMatch[1];
      finalPrompt = finalPrompt.replace(/--ar\s+\d+:\d+/i, '').trim();
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
      generationConfig: {
        // @ts-ignore
        imageConfig: {
          aspectRatio: extractedAspectRatio
        }
      }
    });
    
    // Parse response for image data
    const candidate = result.response?.candidates?.[0];
    const parts = candidate?.content?.parts;
    
    let base64Image = null;
    let mimeType = 'image/jpeg';

    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/jpeg';
          break;
        }
      }
    }

    // Fallback in case the API returns the base64 payload as text
    if (!base64Image && result.response.text) {
      const text = result.response.text();
      if (text.length > 1000) {
        base64Image = text;
      }
    }

    if (!base64Image) {
      throw new Error('El modelo de IA de Gemini no retornó ninguna información visual válida.');
    }

    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      engineeredPrompt
    });

  } catch (error: any) {
    console.error('Image Generation Error:', error);
    
    // Check if the error is due to exhausted credits
    if (error.message && error.message.includes('429')) {
      return NextResponse.json({ error: 'Los créditos de tu API de Gemini se han agotado (Error 429). Por favor recarga saldo en Google AI Studio.' }, { status: 429 });
    }
    
    return NextResponse.json({ error: error.message || 'Failed to generate image' }, { status: 500 });
  }
}
