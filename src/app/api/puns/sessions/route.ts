import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const sessions = await db.punSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        puns: true
      }
    });
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching pun sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, niche, language, products, puns } = await req.json();

    if (!name || !niche || !puns || !Array.isArray(puns)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const session = await db.punSession.create({
      data: {
        name,
        niche,
        language,
        products: JSON.stringify(products || []),
        puns: {
          create: puns.map((p: any) => ({
            content: p.content,
            product: p.product
          }))
        }
      }
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error creating pun session:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}
