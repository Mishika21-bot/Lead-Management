import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Workflow, Repeat, Archive } from "lucide-react";
import type { LeadStatus } from "@/lib/types";

type LeadStatsData = {
    total: number;
    negotiation: number;
    regular: number;
    dead: number;
    statusCounts: Record<LeadStatus, number>;
}

export function LeadStats({ stats }: { stats: LeadStatsData }) {
    const statItems = [
        { title: 'Total Leads', value: stats.total, icon: ClipboardList, color: 'text-primary' },
        { title: 'In Negotiation', value: stats.negotiation, icon: Workflow, color: 'text-blue-500' },
        { title: 'Regular Leads', value: stats.regular, icon: Repeat, color: 'text-green-500' },
        { title: 'Dead Leads', value: stats.dead, icon: Archive, color: 'text-red-500' },
    ];
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
                 <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
