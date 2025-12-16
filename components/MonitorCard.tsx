'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { deleteMonitorAction, toggleMonitorAction } from '@/lib/actions';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Activity,
  CheckCircle,
  Clock,
  Globe,
  Trash2,
  XCircle,
  PauseCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Monitor } from '@/app/generated/prisma';

interface MonitorCardProps {
  monitor: Monitor;
}

export default function MonitorCard({ monitor }: MonitorCardProps) {
  const [isPending, startTransition] = useTransition();

  const isUp = monitor.status === 'UP';
  const isPendingStatus = monitor.status === 'PENDING';

  let statusColor = 'bg-slate-500';
  let StatusIcon = Clock;

  if (!monitor.active) {
    statusColor = 'bg-slate-400';
    StatusIcon = PauseCircle;
  } else if (isUp) {
    statusColor = 'bg-green-500 hover:bg-green-600';
    StatusIcon = CheckCircle;
  } else if (!isPendingStatus) {
    statusColor = 'bg-red-500 hover:bg-red-600';
    StatusIcon = XCircle;
  }

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleMonitorAction(monitor.id, monitor.active);
      if (result?.message) {
        toast.error(result.message);
      } else {
        toast.success(`Monitor ${monitor.active ? 'paused' : 'resumed'}`);
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this monitor?')) {
      startTransition(async () => {
        const result = await deleteMonitorAction(monitor.id);
        if (result?.message) {
          toast.error(result.message);
        } else {
          toast.success('Monitor deleted');
        }
      });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium truncate pr-4">
          {monitor.name}
        </CardTitle>
        <Badge className={`${statusColor} transition-colors`}>
          {monitor.active ? monitor.status : 'PAUSED'}
        </Badge>
      </CardHeader>
      <CardContent>
        <Link href={`/monitor/${monitor.id}`} className="hover:underline group block">
          <div className="flex items-center space-x-2 text-2xl font-bold">
            <StatusIcon
              className={`h-6 w-6 transition-colors ${
                monitor.active && isUp
                  ? 'text-green-500'
                  : monitor.active && !isPendingStatus
                  ? 'text-red-500'
                  : 'text-muted-foreground'
              }`}
            />
            <span>{monitor.lastLatency !== null ? `${monitor.lastLatency}ms` : '-'}</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1 truncate">
            <Globe className="mr-1 h-3 w-3" />
            {monitor.url}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="mt-auto flex justify-between pt-2 border-t items-center">
        <div className="text-xs text-muted-foreground flex items-center">
          <Activity className="mr-1 h-3 w-3" />
          {monitor.interval}s
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id={`switch-${monitor.id}`}
              checked={monitor.active}
              onCheckedChange={handleToggle}
              disabled={isPending}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}