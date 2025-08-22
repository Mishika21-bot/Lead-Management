import { type ParseLeadDataOutput } from "@/ai/flows/parse-lead-data";

export type LeadStatus = "New" | "Negotiation" | "Dead" | "Regular" | "Follow-up needed" | "GC Sent" | "Visit" | "Seller to send sample";

export type SampleStatus = "Sent" | "Received" | "Tested" | "Approved" | "Rejected";

export type LeadPriority = "High" | "Medium" | "Low";

export interface Lead extends ParseLeadDataOutput {
  id: string;
  leadNo: string;
  status: LeadStatus;
  lastUpdate: string;
  sampleStatus?: SampleStatus;
  gcImage?: string;
  clipboard?: string;
  priority?: LeadPriority;
}
