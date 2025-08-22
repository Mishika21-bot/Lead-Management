"use client";

import { FileDown } from "lucide-react";
import { Button } from "./button";

function convertToCSV(data: any[], columns: { key: string, label: string }[]) {
    if (!data || data.length === 0) {
        return "";
    }

    const header = columns.map(c => c.label).join(',') + '\\n';
    
    const rows = data.map(row => {
        return columns.map(col => {
            let cell = row[col.key] || '';
            if (typeof cell === 'string') {
                cell = `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
        }).join(',');
    }).join('\\n');

    return header + rows;
}


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

type ExportButtonProps = {
    data: any[];
    columns: { key: string, label: string }[];
    filename: string;
};

export function ExportButton({ data, columns, filename }: ExportButtonProps) {
    const handleExport = () => {
        const csv = convertToCSV(data, columns);
        downloadCSV(csv, filename);
    };

    return (
        <Button onClick={handleExport} variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Export to CSV
        </Button>
    );
}
