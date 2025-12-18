import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.WORKER_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const monitors = await prisma.monitor.findMany({
      where: { active: true },
      select: {
        id: true,
        url: true,
      },
    });

    return NextResponse.json(monitors);
  } catch {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}