'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Loader2 } from "lucide-react";
import { exportAllDataAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

function downloadCSV(csvString: string, filename: string) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default function ExportPage() {
    const [isExporting, setIsExporting] = useState(false);
    const { toast } = useToast();

    const handleExport = async () => {
        setIsExporting(true);
        const result = await exportAllDataAction();
        setIsExporting(false);

        if (result.success && result.csv) {
            downloadCSV(result.csv, 'leadflow_export.csv');
            toast({
                title: "Export Successful",
                description: "Your data has been downloaded as a CSV file.",
            });
        } else {
            toast({
                title: "Export Failed",
                description: result.error,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex h-full flex-col">
          <header className="border-b bg-card p-4">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileDown className="h-6 w-6 text-primary" />
              Data Export
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
                Download all of your application data in a single file.
            </p>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Export All Data</CardTitle>
                        <CardDescription>
                            Click the button below to download a single CSV file containing all your leads, market rates, and phonebook contacts. 
                            The file will have separate sections for each data type.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleExport} disabled={isExporting}>
                            {isExporting ? <Loader2 className="animate-spin" /> : <FileDown />}
                            {isExporting ? "Exporting..." : "Download Consolidated CSV"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      );
}
