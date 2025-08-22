'use client'

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts'
import {
    ChartContainer,
    ChartTooltipContent,
    ChartLegendContent,
  } from "@/components/ui/chart"

type LeadsByTypeChartProps = {
    data: {
        name: string;
        value: number;
        fill: string;
    }[];
}

export function LeadsByTypeChart({ data }: LeadsByTypeChartProps) {
    const chartConfig = {
        value: {
          label: "Leads",
        },
        ...data.reduce((acc, cur) => {
            acc[cur.name] = { label: cur.name };
            return acc;
        }, {} as any)
      }

  return (
    <div className="w-full h-[250px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
            <PieChart>
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Legend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
        </ChartContainer>
    </div>
  )
}
