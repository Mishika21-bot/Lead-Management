import { getLeads, getLeadStats, getLeadsByType } from "@/lib/data";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadStats } from "@/components/dashboard/lead-stats";
import { LeadsByTypeChart } from "@/components/dashboard/leads-by-type-chart";
import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function AllLeadsPage() {
  const leads = await getLeads();
  const stats = await getLeadStats();
  const leadsByType = await getLeadsByType();

  return (
    <>
      <header className="border-b bg-card p-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            All Leads
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
            The central master table storing all active leads.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <LeadStats stats={stats} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Leads by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadsByTypeChart data={leadsByType} />
            </CardContent>
          </Card>
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
