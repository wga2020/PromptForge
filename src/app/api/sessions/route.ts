import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;

    const sessions = await db.session.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { prompts: true } }, project: { select: { name: true } } },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await db.session.create({
      data: {
        name: body.name,
        projectId: body.projectId,
      },
    });
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
