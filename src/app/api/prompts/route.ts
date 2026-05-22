import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const product = searchParams.get('product');
    const niche = searchParams.get('niche');
    const favorite = searchParams.get('favorite');
    const projectId = searchParams.get('projectId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (product) where.product = product;
    if (niche) where.niche = niche;
    if (favorite === 'true') where.isFavorite = true;
    if (projectId) where.projectId = projectId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const order: Record<string, string> = {};
    order[sortBy] = sortOrder;

    const [prompts, total] = await Promise.all([
      db.prompt.findMany({
        where,
        orderBy: order,
        take: limit,
        skip: offset,
        include: { project: { select: { name: true } } },
      }),
      db.prompt.count({ where }),
    ]);

    return NextResponse.json({ prompts, total });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = await db.prompt.create({
      data: {
        title: body.title || 'Untitled Prompt',
        content: body.content,
        product: body.product || '',
        niche: body.niche || '',
        theme: body.theme || '',
        fontFamily: body.fontFamily || '',
        fontAccent: body.fontAccent || '',
        fontSecondary: body.fontSecondary || '',
        colorPalette: JSON.stringify(body.colorPalette || []),
        style: body.style || '',
        aiTool: body.aiTool || 'midjourney',
        isFavorite: body.isFavorite || false,
        projectId: body.projectId || null,
        sessionId: body.sessionId || null,
      },
    });
    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
  }
}
