'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, HardDriveDownload, Loader2 } from "lucide-react";
import { exportAllDataAction } from "@/app/actions";
import { downloadCsv } from "@/lib/csv";
import { useToast } from "@/hooks/use-toast";

function ExportButton() {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        const result = await exportAllDataAction();
        setIsExporting(false);

        if (result.success && result.csv) {
            if (result.csv.length > 0) {
                downloadCsv(result.csv, `leadflow_export_${new Date().toISOString()}.csv`);
                toast({
                    title: 'Export Successful',
                    description: 'Your data has been downloaded as a CSV file.',
                });
            } else {
                toast({
                    title: 'No Data to Export',
                    description: 'There is no data available to export.',
                    variant: 'default',
                });
            }
        } else {
            toast({
                title: 'Export Failed',
                description: result.error || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        }
    };
    
    return (
        <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
            {isExporting ? 'Exporting...' : 'Export All Data to CSV'}
        </Button>
    )
}


export default function ExportPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b bg-card p-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <HardDriveDownload className="h-6 w-6 text-primary" />
          Data Export
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Download all your application data as a single CSV file.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Export Your Data</CardTitle>
                <CardDescription>
                    Click the button below to generate and download a CSV file containing all of your leads.
                    This is useful for backups, analysis, or migrating your data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ExportButton />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}