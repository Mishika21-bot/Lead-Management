import { getRates } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Rate } from "@/lib/types";
import { ExportButton } from "@/components/ui/export-button";
import { rateColumns } from "@/lib/export-columns";

export const dynamic = 'force-dynamic';

function RateChangeBadge({ change }: { change: string }) {
    const isPositive = change.startsWith('+');
    const isNegative = change.startsWith('-');
    return (
        <Badge variant={isPositive ? 'default' : isNegative ? 'destructive' : 'secondary'}>
            {change}
        </Badge>
    )
}

function RatesTable({ rates }: { rates: Rate[] }) {
    if (rates.length === 0) {
      return (
          <div className="text-center text-muted-foreground p-8 border rounded-lg">
              No rates found.
          </div>
      )
    }
    
    return (
      <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Market Rate</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Vendor Rate</TableHead>
                <TableHead>Aikyan Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    <div className="font-medium">{rate.item}</div>
                    <div className="text-xs text-muted-foreground">{rate.type} / {rate.packing}</div>
                  </TableCell>
                  <TableCell className="font-medium">{rate.marketRate}</TableCell>
                  <TableCell>
                    <RateChangeBadge change={rate.rateChange} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{rate.vendorName}</div>
                  </TableCell>
                  <TableCell>{rate.vendorRate}</TableCell>
                  <TableCell className="font-semibold">{rate.aikyanRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    );
  }

export default async function RatesPage() {
  const rates = await getRates();

  return (
    <div className="flex h-full flex-col">
      <header className="border-b bg-card p-4 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                Market Rates
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
                Live tracking of market and vendor rates for various items.
            </p>
        </div>
        <ExportButton data={rates} columns={rateColumns} filename="rates.csv" />
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Rate Information</CardTitle>
            </CardHeader>
            <CardContent>
                <RatesTable rates={rates} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
