import { getLeads, getLeadStats, getLeadsByType } from "@/lib/data";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadStats } from "@/components/dashboard/lead-stats";
import { LeadsByTypeChart } from "@/components/dashboard/leads-by-type-chart";
import { LeadFunnelChart } from "@/components/dashboard/lead-funnel-chart";
import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadStatus } from "@/lib/types";

export const dynamic = 'force-dynamic';

const statusColors: Record<LeadStatus, string> = {
    "New": "hsl(var(--chart-1))",
    "Negotiation": "hsl(var(--chart-2))",
    "Follow-up needed": "hsl(var(--chart-3))",
    "Visit": "hsl(var(--chart-4))",
    "GC Sent": "hsl(var(--chart-5))",
    "Seller to send sample": "hsl(var(--chart-1))",
    "Regular": "hsl(var(--chart-2))",
    "Dead": "hsl(var(--destructive))",
};

export default async function AllLeadsPage() {
  const leads = await getLeads();
  const stats = await getLeadStats();
  const leadsByType = await getLeadsByType();

  const funnelData = stats.statusCounts 
    ? Object.entries(stats.statusCounts).map(([status, count]) => ({
        status: status as LeadStatus,
        count,
        fill: statusColors[status as LeadStatus] || 'hsl(var(--muted))'
      }))
    : [];

  return (
    <>
      <header className="border-b bg-card p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              All Leads
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
              The central master table storing all active leads.
          </p>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <LeadStats stats={stats} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Leads by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <LeadsByTypeChart data={leadsByType} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle>Lead Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <LeadFunnelChart data={funnelData} />
                    </CardContent>
                </Card>
            </div>
          <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Lead Details</CardTitle>
            </CardHeader>
            <CardContent>
                <LeadsTable leads={leads} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
