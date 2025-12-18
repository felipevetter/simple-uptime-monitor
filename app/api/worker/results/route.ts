import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface WorkerResult {
  monitorId: string;
  latency: number;
  status: number;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.WORKER_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const results: WorkerResult[] = await req.json();

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ message: 'No data received' });
    }

    const pingsToInsert = results.map((r) => ({
      monitorId: r.monitorId,
      latency: r.latency,
      statusCode: r.status,
    }));

    await prisma.ping.createMany({
      data: pingsToInsert,
    });

    const updatePromises = results.map(async (r) => {
      try {
        const isUp = r.status >= 200 && r.status < 400;
        
        await prisma.monitor.update({
          where: { id: r.monitorId },
          data: {
            status: isUp ? 'UP' : 'DOWN',
            lastCheck: new Date(),
            lastLatency: r.latency,
          },
        });
      } catch (error) {
        // Ignorar erro se o monitor tiver sido deletado nesse meio tempo para não falhar o batch inteiro
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, processed: results.length });
  } catch (error) {
    console.error('Worker Sync Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}