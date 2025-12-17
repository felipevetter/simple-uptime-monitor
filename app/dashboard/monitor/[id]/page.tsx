import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ResponseTimeChart from '@/components/ResponseTimeChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const monitor = await prisma.monitor.findUnique({
    where: { id },
  });

  if (!monitor) {
    notFound();
  }

  const pings = await prisma.ping.findMany({
    where: { monitorId: id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const chartData = pings.reverse();

  const isUp = monitor.status === 'UP';
  const statusColor = !monitor.active
    ? 'bg-slate-500'
    : isUp
    ? 'bg-green-500'
    : 'bg-red-500';

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{monitor.name}</h1>
            <Badge className={statusColor}>
              {monitor.active ? monitor.status : 'PAUSED'}
            </Badge>
          </div>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground flex items-center mt-1 hover:underline"
          >
            <Globe className="mr-1 h-3 w-3" />
            {monitor.url}
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ResponseTimeChart data={chartData} />
        </div>
        
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Latest Latency</h3>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {monitor.lastLatency ? `${monitor.lastLatency}ms` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last checked at {monitor.lastCheck ? monitor.lastCheck.toLocaleTimeString() : 'Never'}
            </p>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Configuration</h3>
            </div>
            <dl className="grid gap-2 text-sm mt-4">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Interval</dt>
                <dd className="font-medium">{monitor.interval} seconds</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium">{monitor.active ? 'Active' : 'Paused'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono text-xs text-muted-foreground truncate max-w-[100px]">
                  {monitor.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}