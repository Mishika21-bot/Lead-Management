'use server';

import { z } from 'zod';
import { parseLeadData } from '@/ai/flows/parse-lead-data';
import { addLead, getLeads, getPhonebookEntries, getRates } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { leadColumns, phonebookColumns, rateColumns } from './export/export-columns';
import { convertDataToCSV } from './export/utils';

const LeadFormSchema = z.object({
  leadDate: z.string().optional(),
  leadType: z.string().optional(),
  sellerBuyerContact: z.string().optional(),
  frequency: z.string().optional(),
  itemDetails: z.string().optional(),
  purity: z.string().optional(),
  packing: z.string().optional(),
  qty: z.string().optional(),
  warehouse: z.string().optional(),
  sample: z.string().optional(),
  marketRate: z.string().optional(),
  sellerBuyerName: z.string().optional(),
  sellerBuyerRate: z.string().optional(),
  aikyanRate: z.string().optional(),
  note: z.string().optional(),
});

type LeadFormData = z.infer<typeof LeadFormSchema>;

export async function parseLeadAction(rawText: string) {
  try {
    if (!rawText.trim()) {
      return { success: false, error: 'Input text cannot be empty.' };
    }
    const parsedData = await parseLeadData({ rawLeadText: rawText });
    return { success: true, data: parsedData };
  } catch (error) {
    console.error('Error parsing lead:', error);
    return { success: false, error: 'Failed to parse lead data with AI.' };
  }
}

export async function createLeadAction(formData: LeadFormData) {
  try {
    const validatedData = LeadFormSchema.parse(formData);
    
    const leadToSave = {
      ...validatedData,
      status: 'New' as const,
    };

    const newLead = await addLead(leadToSave);
    
    // Revalidate paths to update the UI
    revalidatePath('/');
    revalidatePath('/leads');
    
    return { success: true, lead: newLead };
  } catch (error) {
    console.error('Error creating lead:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed.', issues: error.errors };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function exportAllDataAction() {
    try {
        const leads = await getLeads();
        const rates = await getRates();
        const phonebook = await getPhonebookEntries();

        const sections = [
            { title: "LEADS DATA", columns: leadColumns, data: leads },
            { title: "RATES DATA", columns: rateColumns, data: rates },
            { title: "PHONEBOOK DATA", columns: phonebookColumns, data: phonebook },
        ];

        const csvString = convertDataToCSV(sections);
        
        return { success: true, csv: csvString };
    } catch (error) {
        console.error("Failed to export data:", error);
        return { success: false, error: "An unexpected error occurred while exporting data." };
    }
}
