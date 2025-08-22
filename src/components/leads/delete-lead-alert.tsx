'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteLeadAction } from '@/app/actions';
import type { Lead } from '@/lib/types';

type DeleteLeadAlertProps = {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
};

export function DeleteLeadAlert({ lead, isOpen, onClose }: DeleteLeadAlertProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!lead) return;

    setIsDeleting(true);
    const result = await deleteLeadAction(lead.id);
    setIsDeleting(false);

    if (result.success) {
      toast({
        title: 'Lead Deleted',
        description: `Lead #${lead.leadNo} has been successfully deleted.`,
      });
      onClose();
    } else {
      toast({
        title: 'Deletion Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the lead
            <strong> #{lead?.leadNo}</strong> and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            {isDeleting ? 'Deleting...' : 'Yes, delete lead'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
