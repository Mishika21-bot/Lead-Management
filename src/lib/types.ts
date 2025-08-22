import { type ParseLeadDataOutput } from "@/ai/flows/parse-lead-data";

export type LeadStatus = "New" | "Negotiation" | "Dead" | "Regular" | "Follow-up needed" | "GC Sent" | "Visit" | "Seller to send sample";

export type SampleStatus = "Sent" | "Received" | "Tested" | "Approved" | "Rejected";

export interface Lead extends ParseLeadDataOutput {
  id: string;
  leadNo: string;
  status: LeadStatus;
  lastUpdate: string;
  sampleStatus?: SampleStatus;
  gcImage?: string;
  clipboard?: string;
}

export interface Rate {
    id: string;
    item: string;
    type: string;
    packing: string;
    marketRate: string;
    rateChange: string;
    vendorName: string;
    vendorRate: string;
    transport: string;
    aikyanRate: string;
}
  
export interface PhonebookEntry {
    id: string;
    name: string;
    contact: string;
    company: string;
}
