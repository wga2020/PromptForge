import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const original = await db.prompt.findUnique({ where: { id } });
    if (!original) return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });

    const copy = await db.prompt.create({
      data: {
        title: `${original.title} (Copy)`,
        content: original.content,
        product: original.product,
        niche: original.niche,
        theme: original.theme,
        fontFamily: original.fontFamily,
        fontAccent: original.fontAccent,
        fontSecondary: original.fontSecondary,
        colorPalette: original.colorPalette,
        style: original.style,
        aiTool: original.aiTool,
        isFavorite: false,
        projectId: original.projectId,
        sessionId: original.sessionId,
      },
    });
    return NextResponse.json(copy);
  } catch (error) {
    console.error('Error copying prompt:', error);
    return NextResponse.json({ error: 'Failed to copy prompt' }, { status: 500 });
  }
}
