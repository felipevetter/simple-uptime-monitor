'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  id: number;
  latency: number;
  statusCode: number;
  createdAt: Date;
}

interface ResponseTimeChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Time
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Latency
            </span>
            <span className="font-bold">
              {data.latency} ms
            </span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Status Code
            </span>
            <span className={`font-bold ${data.statusCode >= 400 ? 'text-red-500' : 'text-green-500'}`}>
              {data.statusCode > 0 ? data.statusCode : 'Timeout'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    timeFormatted: new Date(item.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time History</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="timeFormatted"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${value}ms`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#colorLatency)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}