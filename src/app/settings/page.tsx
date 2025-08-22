import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b bg-card p-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your application settings.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                    Configuration options for the application will be available here in the future.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is a placeholder for future settings.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
