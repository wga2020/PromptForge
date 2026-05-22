import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { ids, format } = await req.json();
    const prompts = await db.prompt.findMany({
      where: { id: { in: ids } },
      include: { project: { select: { name: true } } },
    });

    if (format === 'txt') {
      const text = prompts.map(p =>
        `=== ${p.title} ===\nProduct: ${p.product}\nNiche: ${p.niche}\nStyle: ${p.style}\nAI Tool: ${p.aiTool}\n\n${p.content}\n`
      ).join('\n');
      return new NextResponse(text, {
        headers: { 'Content-Type': 'text/plain', 'Content-Disposition': 'attachment; filename=prompts.txt' },
      });
    }

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error exporting prompts:', error);
    return NextResponse.json({ error: 'Failed to export prompts' }, { status: 500 });
  }
}
