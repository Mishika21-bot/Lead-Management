'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Lead } from '@/lib/types';
import { EditLeadDialog } from './edit-lead-dialog';
import { DeleteLeadAlert } from './delete-lead-alert';
import { ViewLeadDialog } from './view-lead-dialog';

type LeadsTableContextType = {
  onView: (lead: Lead) => void;
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
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const handleView = useCallback((lead: Lead) => {
    setViewingLead(lead);
  }, []);

  const handleEdit = useCallback((lead: Lead) => {
    setEditingLead(lead);
  }, []);

  const handleDelete = useCallback((lead: Lead) => {
    setDeletingLead(lead);
  }, []);

  const handleCloseViewDialog = useCallback(() => {
    setViewingLead(null);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditingLead(null);
  }, []);
  
  const handleCloseAlert = useCallback(() => {
    setDeletingLead(null);
  }, []);


  return (
    <LeadsTableContext.Provider value={{ onView: handleView, onEdit: handleEdit, onDelete: handleDelete }}>
      {children}
      <ViewLeadDialog
        lead={viewingLead}
        isOpen={!!viewingLead}
        onClose={handleCloseViewDialog}
      />
      <EditLeadDialog
        lead={editingLead}
        isOpen={!!editingLead}
        onClose={handleCloseEditDialog}
      />
      <DeleteLeadAlert
        lead={deletingLead}
        isOpen={!!deletingLead}
        onClose={handleCloseAlert}
      />
    </LeadsTableContext.Provider>
  );
};
