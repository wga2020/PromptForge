import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const niche = searchParams.get('niche');
    const country = searchParams.get('country');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (niche) where.niche = niche;
    if (country) where.country = country;
    if (year) where.year = parseInt(year);
    if (month) {
      where.date = { contains: `-${month.padStart(2, '0')}-` };
    }

    const events = await db.calendarEvent.findMany({
      where,
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}
