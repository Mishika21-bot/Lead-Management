
import { collection, getDocs, addDoc, query, where, getCountFromServer, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Lead, LeadStatus } from "./types";

// In-memory data as a fallback
let inMemoryLeads: Lead[] = [];
let isFirestoreDisabled = false;

const leadsCollection = collection(db, 'leads');

function handleFirestoreError(error: any, context: string) {
    console.error(`Error in ${context}:`, error);
    if (error.code === 'permission-denied' || error.code === 'unimplemented' || error.code === 'not-found' || error.code === 'failed-precondition') {
        if (!isFirestoreDisabled) {
            console.warn(`Firebase permission denied or Firestore not set up in ${context}. Switching to in-memory data fallback. Please ensure your Firestore database is created, security rules are deployed, and any required indexes are created. Error: ${error.message}`);
            isFirestoreDisabled = true;
        }
    } else {
      console.error(`An unexpected Firestore error occurred in ${context}: ${error.message}`);
    }
}


export async function getLeads(filter?: { status?: LeadStatus | LeadStatus[], isRegular?: boolean, needsFollowUp?: boolean, needsSampleUpdate?: boolean }): Promise<Lead[]> {
  if (isFirestoreDisabled) {
    // Basic filtering for in-memory data
    const leads = inMemoryLeads.filter(lead => {
        if (filter?.status && !((Array.isArray(filter.status) && filter.status.includes(lead.status)) || lead.status === filter.status)) return false;
        if (filter?.isRegular && !["WEEKLY", "MONTHLY", "1-2 M"].includes(lead.frequency || '')) return false;
        if (filter?.needsFollowUp && lead.status !== 'Follow-up needed') return false;
        if (filter?.needsSampleUpdate && lead.status !== 'Seller to send sample') return false;
        return true;
    });
    return leads.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
  }
  try {
    const conditions: any[] = [];
    if (filter?.status) {
      const statusFilter = Array.isArray(filter.status) ? where('status', 'in', filter.status) : where('status', '==', filter.status);
      conditions.push(statusFilter);
    }
    if (filter?.isRegular) {
      conditions.push(where('frequency', 'in', ["WEEKLY", "MONTHLY", "1-2 M"]));
    }
    if (filter?.needsFollowUp) {
      conditions.push(where('status', '==', 'Follow-up needed'));
    }
    if (filter?.needsSampleUpdate) {
        conditions.push(where('status', '==', 'Seller to send sample'));
    }
    
    const q = conditions.length > 0 ? query(leadsCollection, ...conditions) : query(leadsCollection);

    const querySnapshot = await getDocs(q);
    const leads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
    
    // Sort in memory after fetching, as Firestore requires an index for this.
    return leads.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
  } catch (error) {
    handleFirestoreError(error, 'getLeads');
    // After handling the error, isFirestoreDisabled might be true, so we return the in-memory fallback.
    return getLeads(filter);
  }
}

export async function addLead(leadData: Omit<Lead, 'id' | 'leadNo' | 'lastUpdate'>): Promise<Lead> {
    const leadNo = `L-${(inMemoryLeads.length + 1).toString().padStart(3, '0')}`;
    const lastUpdate = new Date().toISOString();
    const newLeadData = {
        ...leadData,
        leadNo,
        lastUpdate,
    };

    if (isFirestoreDisabled) {
        const leadWithId = { ...newLeadData, id: `mem-${Date.now()}` } as Lead;
        inMemoryLeads.push(leadWithId);
        return leadWithId;
    }
    try {
        const docRef = await addDoc(leadsCollection, newLeadData);
        return { id: docRef.id, ...newLeadData } as Lead;
    } catch (error) {
        handleFirestoreError(error, 'addLead');
        // Fallback to in-memory if add fails
        const leadWithId = { ...newLeadData, id: `mem-${Date.now()}` } as Lead;
        inMemoryLeads.push(leadWithId);
        return leadWithId;
    }
}

export async function updateLead(leadId: string, leadData: Partial<Lead>): Promise<Lead> {
    const lastUpdate = new Date().toISOString();
    const updatedData = { ...leadData, lastUpdate };

    if (isFirestoreDisabled) {
        const index = inMemoryLeads.findIndex(l => l.id === leadId);
        if (index > -1) {
            inMemoryLeads[index] = { ...inMemoryLeads[index], ...updatedData };
            return inMemoryLeads[index];
        }
        throw new Error("Lead not found in memory");
    }
    try {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, updatedData);
        return { id: leadId, ...updatedData } as Lead;
    } catch (error) {
        handleFirestoreError(error, 'updateLead');
        throw new Error("Failed to update lead in Firestore");
    }
}

export async function deleteLead(leadId: string): Promise<void> {
    if (isFirestoreDisabled) {
        inMemoryLeads = inMemoryLeads.filter(l => l.id !== leadId);
        return;
    }
    try {
        const leadRef = doc(db, 'leads', leadId);
        await deleteDoc(leadRef);
    } catch (error) {
        handleFirestoreError(error, 'deleteLead');
        throw new Error("Failed to delete lead in Firestore");
    }
}


export async function getLeadStats() {
    if (isFirestoreDisabled) {
        return { 
            total: inMemoryLeads.length, 
            negotiation: inMemoryLeads.filter(l => l.status === 'Negotiation').length, 
            regular: inMemoryLeads.filter(l => ["WEEKLY", "MONTHLY", "1-2 M"].includes(l.frequency || '')).length, 
            dead: inMemoryLeads.filter(l => l.status === 'Dead').length 
        };
    }
    try {
        const totalSnapshot = await getCountFromServer(query(leadsCollection));
        const negotiationSnapshot = await getCountFromServer(query(leadsCollection, where('status', '==', 'Negotiation')));
        const deadSnapshot = await getCountFromServer(query(leadsCollection, where('status', '==', 'Dead')));
        const regularSnapshot = await getCountFromServer(query(leadsCollection, where('frequency', 'in', ["WEEKLY", "MONTHLY", "1-2 M"])));
        
        return { 
            total: totalSnapshot.data().count, 
            negotiation: negotiationSnapshot.data().count, 
            regular: regularSnapshot.data().count, 
            dead: deadSnapshot.data().count 
        };
    } catch (error) {
        handleFirestoreError(error, 'getLeadStats');
        return getLeadStats();
    }
}

export async function getLeadsByType() {
    if(isFirestoreDisabled) {
        const buyer = inMemoryLeads.filter(l => l.leadType === 'Buyer').length;
        const seller = inMemoryLeads.filter(l => l.leadType === 'Seller').length;
        const other = inMemoryLeads.length - buyer - seller;
        return [
            { name: 'Buyers', value: buyer, fill: 'hsl(var(--chart-1))' },
            { name: 'Sellers', value: seller, fill: 'hsl(var(--chart-2))' },
            { name: 'Other', value: other, fill: 'hsl(var(--chart-5))' },
        ];
    }
    try {
        const buyerSnapshot = await getCountFromServer(query(leadsCollection, where('leadType', '==', 'Buyer')));
        const sellerSnapshot = await getCountFromServer(query(leadsCollection, where('leadType', '==', 'Seller')));
        const totalSnapshot = await getCountFromServer(query(leadsCollection));
        
        const buyer = buyerSnapshot.data().count;
        const seller = sellerSnapshot.data().count;
        const total = totalSnapshot.data().count;
        const other = total - buyer - seller;
        
        return [
            { name: 'Buyers', value: buyer, fill: 'hsl(var(--chart-1))' },
            { name: 'Sellers', value: seller, fill: 'hsl(var(--chart-2))' },
            { name: 'Other', value: other, fill: 'hsl(var(--chart-5))' },
        ];
    } catch (error) {
        handleFirestoreError(error, 'getLeadsByType');
        return getLeadsByType();
    }
}
