'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Lead } from '@/lib/types';
import { EditLeadDialog } from './edit-lead-dialog';
import { DeleteLeadAlert } from './delete-lead-alert';

type LeadsTableContextType = {
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

const LeadsTableContext = createContext<LeadsTableContextType | undefined>(undefined);

export const useLeadsTable = () => {
  const context = useContext(LeadsTableContext);
  if (!context) {
    throw new Error('useLeadsTable must be used within a LeadsTableProvider');
  }
  return context;
};

export const LeadsTableProvider = ({ children }: { children: React.ReactNode }) => {
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const handleEdit = useCallback((lead: Lead) => {
    setEditingLead(lead);
  }, []);

  const handleDelete = useCallback((lead: Lead) => {
    setDeletingLead(lead);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setEditingLead(null);
  }, []);
  
  const handleCloseAlert = useCallback(() => {
    setDeletingLead(null);
  }, []);


  return (
    <LeadsTableContext.Provider value={{ onEdit: handleEdit, onDelete: handleDelete }}>
      {children}
      <EditLeadDialog
        lead={editingLead}
        isOpen={!!editingLead}
        onClose={handleCloseDialog}
      />
      <DeleteLeadAlert
        lead={deletingLead}
        isOpen={!!deletingLead}
        onClose={handleCloseAlert}
      />
    </LeadsTableContext.Provider>
  );
};
