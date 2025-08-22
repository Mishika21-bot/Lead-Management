import { getLeads } from "@/lib/data";
import { LeadsTable } from "@/components/leads/leads-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow } from "lucide-react";
import { ExportButton } from "@/components/ui/export-button";
import { leadColumns } from "@/lib/export-columns";

export const dynamic = 'force-dynamic';

export default async function NegotiationLeadsPage() {
  const leads = await getLeads({ status: "Negotiation" });

  return (
    <>
      <header className="border-b bg-card p-4 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
                <Workflow className="h-6 w-6 text-primary" />
                Negotiation Leads
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
                Leads that are currently in the negotiation phase.
            </p>
        </div>
        <ExportButton data={leads} columns={leadColumns} filename="negotiation_leads.csv" />
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Active Negotiations</CardTitle>
            </CardHeader>
            <CardContent>
                <LeadsTable leads={leads} />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
