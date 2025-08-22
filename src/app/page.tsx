import { LeadParserForm } from '@/components/leads/lead-parser-form';
import { CirclePlus, Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b bg-card p-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <CirclePlus className="h-6 w-6 text-primary" />
          AI Lead Ingestion
        </h1>
        <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Paste raw lead text below to parse with AI and create a new lead.
        </p>
      </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <LeadParserForm />
        </div>
      </div>
    </div>
  );
}
