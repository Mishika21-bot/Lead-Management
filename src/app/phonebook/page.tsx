import { getPhonebookEntries } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PhonebookEntry } from "@/lib/types";
import { ExportButton } from "@/components/ui/export-button";
import { phonebookColumns } from "@/lib/export-columns";

export const dynamic = 'force-dynamic';

function PhonebookTable({ entries }: { entries: PhonebookEntry[] }) {
    if (entries.length === 0) {
      return (
          <div className="text-center text-muted-foreground p-8 border rounded-lg">
              No contacts found in the phonebook.
          </div>
      )
    }
    
    return (
      <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>{entry.contact}</TableCell>
                  <TableCell>{entry.company}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    );
  }

export default async function PhonebookPage() {
  const entries = await getPhonebookEntries();

  return (
    <div className="flex h-full flex-col">
      <header className="border-b bg-card p-4 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
                <Contact className="h-6 w-6 text-primary" />
                Phonebook
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
                A central directory of all your business contacts.
            </p>
        </div>
        <ExportButton data={entries} columns={phonebookColumns} filename="phonebook.csv" />
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Contact List</CardTitle>
            </CardHeader>
            <CardContent>
                <PhonebookTable entries={entries} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
