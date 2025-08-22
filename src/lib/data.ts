
import { collection, getDocs, addDoc, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from './firebase';
import type { Lead, LeadStatus, Rate, PhonebookEntry } from "./types";

// In-memory data as a fallback
const inMemoryLeads: Lead[] = [];
const inMemoryRates: Rate[] = [];
const inMemoryPhonebook: PhonebookEntry[] = [];
let isFirestoreDisabled = false;

const leadsCollection = collection(db, 'leads');
const ratesCollection = collection(db, 'rates');
const phonebookCollection = collection(db, 'phonebook');

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
    return inMemoryLeads.filter(lead => {
        if (filter?.status && !((Array.isArray(filter.status) && filter.status.includes(lead.status)) || lead.status === filter.status)) return false;
        if (filter?.isRegular && !["WEEKLY", "MONTHLY", "1-2 M"].includes(lead.frequency || '')) return false;
        if (filter?.needsFollowUp && lead.status !== 'Follow-up needed') return false;
        if (filter?.needsSampleUpdate && lead.status !== 'Seller to send sample') return false;
        return true;
    }).sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
  }
  try {
    const conditions: any[] = [];

    if (filter?.status) {
      if(Array.isArray(filter.status)) {
          conditions.push(where('status', 'in', filter.status));
      } else {
          conditions.push(where('status', '==', filter.status));
      }
    }
    
    if (filter?.isRegular) {
      const regularFrequencies = ["WEEKLY", "MONTHLY", "1-2 M"];
      conditions.push(where('frequency', 'in', regularFrequencies));
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
    
    // Sort in memory after fetching
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
        if (newLeadData.sellerBuyerName && newLeadData.sellerBuyerContact) {
            addPhonebookEntry({
                name: newLeadData.sellerBuyerName,
                contact: newLeadData.sellerBuyerContact,
                company: newLeadData.sellerBuyerName,
            })
        }
        return leadWithId;
    }
    try {
        const docRef = await addDoc(leadsCollection, newLeadData);
        
        if (newLeadData.sellerBuyerName && newLeadData.sellerBuyerContact) {
            const phonebookQuery = query(phonebookCollection, where('contact', '==', newLeadData.sellerBuyerContact));
            const phonebookSnapshot = await getDocs(phonebookQuery);
            if(phonebookSnapshot.empty) {
                addPhonebookEntry({
                    name: newLeadData.sellerBuyerName,
                    contact: newLeadData.sellerBuyerContact,
                    company: newLeadData.sellerBuyerName,
                })
            }
        }

        return { id: docRef.id, ...newLeadData } as Lead;
    } catch (error) {
        handleFirestoreError(error, 'addLead');
        // Fallback to in-memory if add fails
        const leadWithId = { ...newLeadData, id: `mem-${Date.now()}` } as Lead;
        inMemoryLeads.push(leadWithId);
        return leadWithId;
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

// Rates functions
export async function getRates(): Promise<Rate[]> {
    if(isFirestoreDisabled) return inMemoryRates;
    try {
        const querySnapshot = await getDocs(ratesCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rate));
    } catch (error) {
        handleFirestoreError(error, 'getRates');
        return getRates();
    }
}

// Phonebook functions
export async function getPhonebookEntries(): Promise<PhonebookEntry[]> {
    if(isFirestoreDisabled) return inMemoryPhonebook;
    try {
        const querySnapshot = await getDocs(phonebookCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PhonebookEntry));
    } catch (error) {
        handleFirestoreError(error, 'getPhonebookEntries');
        return getPhonebookEntries();
    }
}

export async function addPhonebookEntry(entry: Omit<PhonebookEntry, 'id'>): Promise<PhonebookEntry> {
    if(isFirestoreDisabled) {
        const newEntry = { ...entry, id: `mem-pb-${Date.now()}`};
        inMemoryPhonebook.push(newEntry);
        return newEntry;
    }
    try {
        const docRef = await addDoc(phonebookCollection, entry);
        return { id: docRef.id, ...entry };
    } catch(error) {
        handleFirestoreError(error, 'addPhonebookEntry');
        const newEntry = { ...entry, id: `mem-pb-${Date.now()}`};
        inMemoryPhonebook.push(newEntry);
        return newEntry;
    }
}
    