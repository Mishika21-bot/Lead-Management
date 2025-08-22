'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';

import { createLeadAction, parseLeadAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GridContainer } from '../ui/grid-container';

const FormSchema = z.object({
  rawLeadText: z.string().min(10, 'Please enter more details for the AI to process.'),
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

type FormData = z.infer<typeof FormSchema>;

export function LeadParserForm() {
  const { toast } = useToast();
  const [isParsing, setIsParsing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isParsed, setIsParsed] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rawLeadText: '',
      leadDate: '',
      leadType: '',
      sellerBuyerContact: '',
      frequency: '',
      itemDetails: '',
      purity: '',
      packing: '',
      qty: '',
      warehouse: '',
      sample: '',
      marketRate: '',
      sellerBuyerName: '',
      sellerBuyerRate: '',
      aikyanRate: '',
      note: '',
    },
  });

  const handleParse = async () => {
    const rawText = form.getValues('rawLeadText');
    if (!rawText.trim()) {
      form.setError('rawLeadText', { message: 'Input text cannot be empty.' });
      return;
    }

    setIsParsing(true);
    const result = await parseLeadAction(rawText);
    setIsParsing(false);

    if (result.success && result.data) {
      const { ...parsedData } = result.data;
      for (const [key, value] of Object.entries(parsedData)) {
        form.setValue(key as keyof FormData, value || '');
      }
      setIsParsed(true);
      toast({
        title: 'AI Parsing Successful',
        description: 'Review the extracted data below.',
        variant: 'default',
      });
    } else {
      toast({
        title: 'AI Parsing Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsCreating(true);
    const result = await createLeadAction(data);
    setIsCreating(false);

    if (result.success) {
      toast({
        title: 'Lead Created Successfully',
        description: `Lead #${result.lead?.leadNo} has been added.`,
      });
      form.reset();
      setIsParsed(false);
    } else {
      toast({
        title: 'Failed to Create Lead',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Raw Lead Input</CardTitle>
            <CardDescription>Paste the raw lead text into the box below.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="rawLeadText"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={8}
                      placeholder="e.g., SELLER WEEKLY: Copper Scrap 99% purity, 10 MT qty, ex-warehouse NY. Contact John at 123-456-7890. Rate 8000/MT..."
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={handleParse} disabled={isParsing}>
              {isParsing ? <Loader2 className="animate-spin" /> : <Bot />}
              {isParsing ? 'Processing...' : 'Process with AI'}
            </Button>
          </CardFooter>
        </Card>

        {isParsed && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent" /> AI Parsed Data
              </CardTitle>
              <CardDescription>Review and edit the AI-extracted data before creating the lead.</CardDescription>
            </CardHeader>
            <CardContent>
              <GridContainer>
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
                <FormField name="note" render={({ field }) => <FormItem className="md:col-span-2"><FormLabel>Note</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
              </GridContainer>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Loader2 className="animate-spin" /> : <Send />}
                Create Lead
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </Form>
  );
}
