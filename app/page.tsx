import { prisma } from '@/lib/db';
import MonitorForm from '@/components/MonitorForm';
import MonitorCard from '@/components/MonitorCard';
import { Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const monitors = await prisma.monitor.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time uptime monitoring for your services.
          </p>
        </div>
        <MonitorForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.map((monitor) => (
          <MonitorCard key={monitor.id} monitor={monitor} />
        ))}
      </div>
      
      {monitors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-xl bg-muted/30">
          <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
            <Activity className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-1">No monitors yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm text-center">
            Add your first monitor to start tracking uptime and latency metrics in real-time.
          </p>
        </div>
      )}
    </div>
  );
}