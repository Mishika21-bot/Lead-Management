'use client';

import { MoreHorizontal, Phone, MessageSquareText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Lead } from "@/lib/types";
import { useLeadsTable } from "./leads-table-context";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
)

export function LeadsTableRowActions({ lead }: { lead: Lead }) {
    const contact = lead.sellerBuyerContact?.replace(/[^0-9]/g, '');
    const { onEdit, onDelete } = useLeadsTable();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(lead)}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(lead)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={`https://wa.me/${contact}`} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`sms:${contact}`}>
            <MessageSquareText />
            SMS
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`tel:${contact}`}>
            <Phone />
            Call
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
