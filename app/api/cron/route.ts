import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const monitors = await prisma.monitor.findMany({
        where: { active: true },
        select: { id: true, url: true },
    });

    if (monitors.length === 0) {
        return NextResponse.json({ message: 'No active monitors to check.' });
    }

    const checkResults = await Promise.allSettled(
        monitors.map(async (monitor: { id: string; url: string }) => {
            const start = performance.now();
            try {
                const response = await fetch(monitor.url, {
                    signal: AbortSignal.timeout(5000),
                    cache: 'no-store',
                });

                const latency = Math.round(performance.now() - start);

                return {
                    monitorId: monitor.id,
                    statusCode: response.status,
                    latency: latency,
                };
            } catch (error) {
                return {
                    monitorId: monitor.id,
                    statusCode: 0,
                    latency: 0,
                };
            }
        })
    );

    const pingsToInsert = [];
    const monitorUpdates = [];
    for (const result of checkResults) {
        if (result.status === 'fulfilled') {
            const data = result.value;
            pingsToInsert.push({
                monitorId: data.monitorId,
                latency: data.latency,
                statusCode: data.statusCode,
            });

            const isUp = data.statusCode >= 200 && data.statusCode < 400;

            monitorUpdates.push(
                prisma.monitor.update({
                    where: { id: data.monitorId },
                    data: {
                        status: isUp ? 'UP' : 'DOWN',
                        lastCheck: new Date(),
                        lastLatency: data.latency,
                    },
                })
            );
        }
    }

    if (pingsToInsert.length > 0) {
        await prisma.ping.createMany({
            data: pingsToInsert,
        });
    }

    // Atualização dos Monitores (Estado Atual)
    // Necessário loop pois os dados variam por linha
    await Promise.all(monitorUpdates);

    return NextResponse.json({
        monitorsChecked: monitors.length,
        timestamp: new Date().toISOString(),
    });
}