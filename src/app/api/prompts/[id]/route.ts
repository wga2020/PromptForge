import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const prompt = await db.prompt.findUnique({ where: { id }, include: { project: true, session: true } });
    if (!prompt) return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const prompt = await db.prompt.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.product !== undefined && { product: body.product }),
        ...(body.niche !== undefined && { niche: body.niche }),
        ...(body.theme !== undefined && { theme: body.theme }),
        ...(body.fontFamily !== undefined && { fontFamily: body.fontFamily }),
        ...(body.fontAccent !== undefined && { fontAccent: body.fontAccent }),
        ...(body.fontSecondary !== undefined && { fontSecondary: body.fontSecondary }),
        ...(body.colorPalette !== undefined && { colorPalette: JSON.stringify(body.colorPalette) }),
        ...(body.style !== undefined && { style: body.style }),
        ...(body.aiTool !== undefined && { aiTool: body.aiTool }),
        ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
        ...(body.projectId !== undefined && { projectId: body.projectId }),
        ...(body.sessionId !== undefined && { sessionId: body.sessionId }),
      },
    });
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.prompt.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
  }
}
