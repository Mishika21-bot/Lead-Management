'use server';

/**
 * @fileOverview This file defines a Genkit flow for parsing raw lead data using AI.
 *
 * The flow takes raw lead text as input and uses an AI model to extract structured data,
 * populating relevant fields for lead creation.
 *
 * @exports {
 *   parseLeadData: (input: ParseLeadDataInput) => Promise<ParseLeadDataOutput>;
 *   ParseLeadDataInput: z.infer<typeof ParseLeadDataInputSchema>;
 *   ParseLeadDataOutput: z.infer<typeof ParseLeadDataOutputSchema>;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseLeadDataInputSchema = z.object({
  rawLeadText: z
    .string()  
    .describe('The raw lead data text to be parsed.'),
});
export type ParseLeadDataInput = z.infer<typeof ParseLeadDataInputSchema>;

const ParseLeadDataOutputSchema = z.object({
  leadDate: z.string().optional().describe('The date of the lead.'),
  leadType: z.string().optional().describe('The type of lead (e.g., buyer, seller).'),
  sellerBuyerContact: z.string().optional().describe('The contact information of the seller or buyer.'),
  frequency: z.string().optional().describe('The frequency of the lead (e.g., weekly, monthly).'),
  itemDetails: z.string().optional().describe('Details about the item in the lead.'),
  purity: z.string().optional().describe('The purity of the item.'),
  packing: z.string().optional().describe('The packing details.'),
  qty: z.string().optional().describe('The quantity of the item.'),
  warehouse: z.string().optional().describe('The warehouse information.'),
  sample: z.string().optional().describe('Sample details.'),
  marketRate: z.string().optional().describe('The market rate.'),
  sellerBuyerName: z.string().optional().describe('The name of the seller or buyer.'),
  sellerBuyerRate: z.string().optional().describe('The rate offered by the seller or buyer.'),
  aikyanRate: z.string().optional().describe('The Aikyan rate.'),
  note: z.string().optional().describe('Any additional notes about the lead.'),
  priority: z.enum(["High", "Medium", "Low"]).optional().describe("The priority of the lead. Determined by factors like quantity, urgency, or explicit priority keywords. Default to 'Medium' if unsure."),
});
export type ParseLeadDataOutput = z.infer<typeof ParseLeadDataOutputSchema>;


export async function parseLeadData(input: ParseLeadDataInput): Promise<ParseLeadDataOutput> {
  return parseLeadDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseLeadDataPrompt',
  input: {schema: ParseLeadDataInputSchema},
  output: {schema: ParseLeadDataOutputSchema},
  prompt: `You are an AI assistant that extracts structured information from raw lead data text.
  Given the raw lead text, extract the following fields if present:

  - leadDate: The date of the lead.
  - leadType: The type of lead (e.g., buyer, seller).
  - sellerBuyerContact: The contact information of the seller or buyer.
  - frequency: The frequency of the lead (e.g., weekly, monthly).
  - itemDetails: Details about the item in the lead.
  - purity: The purity of the item.
  - packing: The packing details.
  - qty: The quantity of the item.
  - warehouse: The warehouse information.
  - sample: Sample details.
  - marketRate: The market rate.
  - sellerBuyerName: The name of the seller or buyer.
  - sellerBuyerRate: The rate offered by the seller or buyer.
  - aikyanRate: The Aikyan rate.
  - note: Any additional notes about the lead.
  - priority: Analyze the text for urgency, large quantities, or direct statements of priority. Classify as 'High', 'Medium', or 'Low'. If no strong signals are present, default to 'Medium'.

  Raw Lead Text: {{{rawLeadText}}}
  \n
  Return the extracted fields in JSON format.
  `,
});

const parseLeadDataFlow = ai.defineFlow(
  {
    name: 'parseLeadDataFlow',
    inputSchema: ParseLeadDataInputSchema,
    outputSchema: ParseLeadDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
