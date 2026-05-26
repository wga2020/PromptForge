import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await db.punSession.findUnique({
      where: { id: params.id },
      include: { puns: true }
    });

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const updated = await db.punSession.update({
      where: { id: params.id },
      data: { name }
    });

    return NextResponse.json({ session: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.punSession.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
