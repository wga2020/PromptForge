import { db } from '@/lib/db';
import { CALENDAR_EVENTS_SEED } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const existingCount = await db.calendarEvent.count();
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Calendar events already seeded', count: existingCount });
    }

    const events = await db.calendarEvent.createMany({
      data: CALENDAR_EVENTS_SEED.map(e => ({
        name: e.name,
        date: e.date,
        type: e.type,
        niche: e.niche,
        description: e.description,
        country: e.country,
        year: 2026,
      })),
    });

    return NextResponse.json({ message: 'Calendar events seeded successfully', count: events.count });
  } catch (error) {
    console.error('Error seeding calendar events:', error);
    return NextResponse.json({ error: 'Failed to seed calendar events' }, { status: 500 });
  }
}
