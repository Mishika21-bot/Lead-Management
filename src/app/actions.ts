'use server';

import { z } from 'zod';
import { parseLeadData } from '@/ai/flows/parse-lead-data';
import { addLead, updateLead, deleteLead } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const LeadFormSchema = z.object({
  id: z.string().optional(),
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
  status: z.string().optional(),
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
    const { id, ...dataToSave } = LeadFormSchema.parse(formData);
    
    const leadToSave = {
      ...dataToSave,
      status: 'New' as const,
    };

    const newLead = await addLead(leadToSave);
    
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

export async function updateLeadAction(formData: LeadFormData) {
    try {
        const validatedData = LeadFormSchema.parse(formData);
        const { id, ...dataToUpdate } = validatedData;

        if (!id) {
            return { success: false, error: 'Lead ID is missing.' };
        }

        await updateLead(id, dataToUpdate);

        revalidatePath('/');
        revalidatePath('/leads', 'layout');

        return { success: true };
    } catch (error) {
        console.error('Error updating lead:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'Validation failed.', issues: error.errors };
        }
        return { success: false, error: 'An unexpected error occurred while updating the lead.' };
    }
}

export async function deleteLeadAction(leadId: string) {
    try {
        if (!leadId) {
            return { success: false, error: 'Lead ID is missing.' };
        }

        await deleteLead(leadId);

        revalidatePath('/');
        revalidatePath('/leads', 'layout');

        return { success: true };
    } catch (error) {
        console.error('Error deleting lead:', error);
        return { success: false, error: 'An unexpected error occurred while deleting the lead.' };
    }
}
