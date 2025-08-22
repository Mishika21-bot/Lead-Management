'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { LeadStatus } from '@/lib/types';

type LeadFunnelChartProps = {
  data: {
    status: LeadStatus;
    count: number;
    fill: string;
  }[];
};

export function LeadFunnelChart({ data }: LeadFunnelChartProps) {
  const chartConfig = data.reduce((acc, cur) => {
    acc[cur.status] = {
      label: cur.status,
      color: cur.fill,
    };
    return acc;
  }, {} as any);

  return (
    <div className="w-full h-[250px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={{
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="status"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => chartConfig[value]?.label}
          />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Bar dataKey="count" layout="vertical" radius={5} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
