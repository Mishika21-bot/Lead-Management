import { getLeads } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/lib/types";

export const dynamic = 'force-dynamic';

function format(date: string | undefined | null) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function SampleUpdatesTable({ leads }: { leads: Lead[] }) {
    if (leads.length === 0) {
      return (
          <div className="text-center text-muted-foreground p-8 border rounded-lg">
              No sample updates found.
          </div>
      )
    }
    
    return (
      <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Sample Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-medium">{lead.leadNo}</div>
                    <div className="text-xs text-muted-foreground">{lead.itemDetails}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{lead.sellerBuyerName || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">{lead.sellerBuyerContact}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.sampleStatus === 'Rejected' ? 'destructive' : 'secondary'} className="capitalize">
                      {lead.sampleStatus || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.note}</TableCell>
                  <TableCell>{format(lead.lastUpdate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    );
  }

export default async function SampleUpdatesPage() {
  const leads = await getLeads({ needsSampleUpdate: true });

  return (
    <>
      <header className="border-b bg-card p-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            Sample Updates
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
            Track the status of samples sent to or received from leads.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Sample Status Tracker</CardTitle>
            </CardHeader>
            <CardContent>
                <SampleUpdatesTable leads={leads} />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
