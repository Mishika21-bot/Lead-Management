import { type ParseLeadDataOutput } from "@/ai/flows/parse-lead-data";

export type LeadStatus = "New" | "Negotiation" | "Dead" | "Regular";

export interface Lead extends ParseLeadDataOutput {
  id: string;
  leadNo: string;
  status: LeadStatus;
  lastUpdate: string;
}
