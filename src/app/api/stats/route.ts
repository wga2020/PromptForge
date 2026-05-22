import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [
      totalPrompts,
      totalProjects,
      totalSessions,
      favoriteCount,
      promptsThisWeek,
      promptsThisMonth,
      recentPrompts,
      promptsByProduct,
      promptsByNiche,
    ] = await Promise.all([
      db.prompt.count(),
      db.project.count(),
      db.session.count(),
      db.prompt.count({ where: { isFavorite: true } }),
      db.prompt.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),
      db.prompt.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      db.prompt.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { project: { select: { name: true } } },
      }),
      db.prompt.groupBy({ by: ['product'], _count: { product: true }, orderBy: { _count: { product: 'desc' } } }),
      db.prompt.groupBy({ by: ['niche'], _count: { niche: true }, orderBy: { _count: { niche: 'desc' } } }),
    ]);

    return NextResponse.json({
      totalPrompts,
      totalProjects,
      totalSessions,
      favoriteCount,
      promptsThisWeek,
      promptsThisMonth,
      recentPrompts,
      promptsByProduct: promptsByProduct.map(p => ({ name: p.product, count: p._count.product })),
      promptsByNiche: promptsByNiche.map(n => ({ name: n.niche, count: n._count.niche })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
