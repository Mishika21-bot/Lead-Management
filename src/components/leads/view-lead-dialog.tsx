'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Lead } from '@/lib/types';
import { Badge } from '../ui/badge';

type ViewLeadDialogProps = {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
};

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="flex flex-col">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value || 'N/A'}</p>
    </div>
);

function format(date: string | undefined | null) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
}

export function ViewLeadDialog({ lead, isOpen, onClose }: ViewLeadDialogProps) {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center pr-6">
            <span>Lead Details: #{lead.leadNo}</span>
            <Badge variant={lead.status === 'Dead' ? 'destructive' : lead.status === 'Negotiation' ? 'secondary' : 'default'} className="capitalize">
              {lead.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Contact Information</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <DetailItem label="Name" value={lead.sellerBuyerName} />
                    <DetailItem label="Contact" value={lead.sellerBuyerContact} />
                    <DetailItem label="Lead Type" value={lead.leadType} />
                    <DetailItem label="Lead Date" value={format(lead.leadDate)} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Item & Commercials</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <DetailItem label="Item Details" value={lead.itemDetails} />
                    <DetailItem label="Purity" value={lead.purity} />
                    <DetailItem label="Quantity" value={lead.qty} />
                    <DetailItem label="Packing" value={lead.packing} />
                    <DetailItem label="Market Rate" value={lead.marketRate} />
                    <DetailItem label="Offered Rate" value={lead.sellerBuyerRate} />
                    <DetailItem label="Aikyan Rate" value={lead.aikyanRate} />
                    <DetailItem label="Frequency" value={lead.frequency} />
                    <DetailItem label="Warehouse" value={lead.warehouse} />
                </div>
            </div>
          
            <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Additional Info</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <DetailItem label="Sample Details" value={lead.sample} />
                    <DetailItem label="Note" value={lead.note} />
                </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-right">
                Last Updated: {format(lead.lastUpdate, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
