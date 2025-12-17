import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import MonitorForm from '@/components/MonitorForm';
import MonitorCard from '@/components/MonitorCard';
import { UserAccountNav } from '@/components/user-account-nav';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const monitors = await prisma.monitor.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { id: 'desc' },
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
        <div className="flex items-center gap-4">
          <MonitorForm />
          <UserAccountNav user={session.user} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.map((monitor) => (
          <MonitorCard key={monitor.id} monitor={monitor} />
        ))}
      </div>

      {monitors.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold">No monitors yet</h3>
          <p className="text-muted-foreground">
            Add your first monitor to start tracking.
          </p>
        </div>
      )}
    </div>
  );
}