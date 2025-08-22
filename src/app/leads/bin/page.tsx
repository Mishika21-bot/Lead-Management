import { getLeads } from "@/lib/data";
import { LeadsTable } from "@/components/leads/leads-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BinPage() {
  const leads = await getLeads({ status: "Dead" });

  return (
    <>
      <header className="border-b bg-card p-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
            <Archive className="h-6 w-6 text-primary" />
            Archived Leads (Bin)
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
            Leads that have been marked as 'Dead' or archived.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Dead Lead List</CardTitle>
            </CardHeader>
            <CardContent>
                <LeadsTable leads={leads} />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
