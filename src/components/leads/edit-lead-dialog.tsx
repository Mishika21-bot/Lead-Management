'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';

import { updateLeadAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GridContainer } from '../ui/grid-container';
import type { Lead, LeadStatus } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const leadStatuses: LeadStatus[] = ["New", "Negotiation", "Dead", "Regular", "Follow-up needed", "GC Sent", "Visit", "Seller to send sample"];

const FormSchema = z.object({
  id: z.string(),
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

type FormData = z.infer<typeof FormSchema>;

type EditLeadDialogProps = {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
};

export function EditLeadDialog({ lead, isOpen, onClose }: EditLeadDialogProps) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        id: lead.id,
        leadDate: lead.leadDate ? new Date(lead.leadDate).toISOString().split('T')[0] : '',
        leadType: lead.leadType || '',
        sellerBuyerContact: lead.sellerBuyerContact || '',
        frequency: lead.frequency || '',
        itemDetails: lead.itemDetails || '',
        purity: lead.purity || '',
        packing: lead.packing || '',
        qty: lead.qty || '',
        warehouse: lead.warehouse || '',
        sample: lead.sample || '',
        marketRate: lead.marketRate || '',
        sellerBuyerName: lead.sellerBuyerName || '',
        sellerBuyerRate: lead.sellerBuyerRate || '',
        aikyanRate: lead.aikyanRate || '',
        note: lead.note || '',
        status: lead.status || '',
      });
    }
  }, [lead, form]);

  const onSubmit = async (data: FormData) => {
    const result = await updateLeadAction(data);

    if (result.success) {
      toast({
        title: 'Lead Updated Successfully',
        description: `The lead has been updated.`,
      });
      onClose();
    } else {
      toast({
        title: 'Failed to Update Lead',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Lead #{lead?.leadNo}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-6">
                <GridContainer className="lg:grid-cols-4">
                  <FormField name="sellerBuyerName" render={({ field }) => <FormItem><FormLabel>Seller/Buyer Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="sellerBuyerContact" render={({ field }) => <FormItem><FormLabel>Contact</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="leadDate" render={({ field }) => <FormItem><FormLabel>Lead Date</FormLabel><FormControl><Input {...field} type="date" /></FormControl></FormItem>} />
                  <FormField name="leadType" render={({ field }) => <FormItem><FormLabel>Lead Type</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="frequency" render={({ field }) => <FormItem><FormLabel>Frequency</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="itemDetails" render={({ field }) => <FormItem><FormLabel>Item Details</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="purity" render={({ field }) => <FormItem><FormLabel>Purity</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="qty" render={({ field }) => <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="packing" render={({ field }) => <FormItem><FormLabel>Packing</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="warehouse" render={({ field }) => <FormItem><FormLabel>Warehouse</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="sample" render={({ field }) => <FormItem><FormLabel>Sample</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="marketRate" render={({ field }) => <FormItem><FormLabel>Market Rate</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="sellerBuyerRate" render={({ field }) => <FormItem><FormLabel>Seller/Buyer Rate</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField name="aikyanRate" render={({ field }) => <FormItem><FormLabel>Aikyan Rate</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leadStatuses.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField name="note" render={({ field }) => <FormItem className="md:col-span-4"><FormLabel>Note</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
                </GridContainer>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
