'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Lead, LeadPriority } from "@/lib/types";
import { LeadsTableRowActions } from "./leads-table-row-actions";
import { LeadsTableProvider } from "./leads-table-context";
import { cn } from "@/lib/utils";

function format(date: string | undefined | null, options?: Intl.DateTimeFormatOptions) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

const priorityVariant: Record<LeadPriority, "destructive" | "secondary" | "default"> = {
    High: "destructive",
    Medium: "secondary",
    Low: "default",
}


function LeadsTableComponent({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
        <div className="text-center text-muted-foreground p-8 border rounded-lg">
            No leads found.
        </div>
    )
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Item Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.leadNo}</TableCell>
                <TableCell>
                  <div className="font-medium">{lead.sellerBuyerName || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{lead.sellerBuyerContact}</div>
                </TableCell>
                <TableCell>
                  <div>{lead.itemDetails}</div>
                  <div className="text-xs text-muted-foreground">{lead.qty} / {lead.purity}</div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1.5">
                        <Badge variant={lead.status === 'Dead' ? 'destructive' : lead.status === 'Negotiation' ? 'secondary' : 'default'} className="capitalize">
                            {lead.status}
                        </Badge>
                        {lead.priority && (
                            <Badge variant={priorityVariant[lead.priority] || 'default'} className="capitalize w-fit">
                                {lead.priority} Priority
                            </Badge>
                        )}
                    </div>
                </TableCell>
                <TableCell>{format(lead.lastUpdate)}</TableCell>
                <TableCell className="text-right">
                  <LeadsTableRowActions lead={lead} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
    return (
        <LeadsTableProvider>
            <LeadsTableComponent leads={leads} />
        </LeadsTableProvider>
    )
}
