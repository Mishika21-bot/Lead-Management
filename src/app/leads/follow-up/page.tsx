import { getLeads } from "@/lib/data";
import { LeadsTable } from "@/components/leads/leads-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function FollowUpPage() {
  const leads = await getLeads({ needsFollowUp: true });

  return (
    <>
      <header className="border-b bg-card p-4 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
                <CalendarClock className="h-6 w-6 text-primary" />
                Follow Up
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
                Leads that require a follow-up action.
            </p>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Leads for Follow Up</CardTitle>
            </CardHeader>
            <CardContent>
                <LeadsTable leads={leads} />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
