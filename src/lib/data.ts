import { collection, getDocs, addDoc, query, where, getCountFromServer, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Lead, LeadStatus, Rate, PhonebookEntry } from "./types";

const leadsCollection = collection(db, 'leads');
const ratesCollection = collection(db, 'rates');
const phonebookCollection = collection(db, 'phonebook');

function handleFirestoreError(error: any, context: string) {
    console.error(`Error in ${context}:`, error);
    if (error.code === 'permission-denied') {
        throw new Error(`Firebase permission denied in ${context}. Please check your Firestore security rules in the Firebase console and ensure they are deployed correctly.`);
    }
    throw new Error(`An unexpected Firestore error occurred in ${context}: ${error.message}`);
}


export async function getLeads(filter?: { status?: LeadStatus | LeadStatus[], isRegular?: boolean, needsFollowUp?: boolean, needsSampleUpdate?: boolean }): Promise<Lead[]> {
  try {
    let q = query(leadsCollection, orderBy('lastUpdate', 'desc'));
    
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
    
    if(conditions.length > 0) {
      q = query(leadsCollection, ...conditions, orderBy('lastUpdate', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const leads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
    return leads;
  } catch (error) {
    handleFirestoreError(error, 'getLeads');
    return []; // Return empty array as a fallback
  }
}

export async function addLead(leadData: Omit<Lead, 'id' | 'leadNo' | 'lastUpdate'>): Promise<Lead> {
    try {
        const countSnapshot = await getCountFromServer(leadsCollection);
        const leadCount = countSnapshot.data().count;

        const newLeadData = {
            ...leadData,
            leadNo: `L-${(leadCount + 1).toString().padStart(3, '0')}`,
            lastUpdate: new Date().toISOString(),
        };

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
        throw error; // Re-throw to be handled by the action
    }
}

export async function getLeadStats() {
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
        return { total: 0, negotiation: 0, regular: 0, dead: 0 };
    }
}

export async function getLeadsByType() {
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
        return [
            { name: 'Buyers', value: 0, fill: 'hsl(var(--chart-1))' },
            { name: 'Sellers', value: 0, fill: 'hsl(var(--chart-2))' },
            { name: 'Other', value: 0, fill: 'hsl(var(--chart-5))' },
        ];
    }
}

// Rates functions
export async function getRates(): Promise<Rate[]> {
    try {
        const querySnapshot = await getDocs(ratesCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rate));
    } catch (error) {
        handleFirestoreError(error, 'getRates');
        return [];
    }
}

// Phonebook functions
export async function getPhonebookEntries(): Promise<PhonebookEntry[]> {
    try {
        const querySnapshot = await getDocs(phonebookCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PhonebookEntry));
    } catch (error) {
        handleFirestoreError(error, 'getPhonebookEntries');
        return [];
    }
}

export async function addPhonebookEntry(entry: Omit<PhonebookEntry, 'id'>): Promise<PhonebookEntry> {
    try {
        const docRef = await addDoc(phonebookCollection, entry);
        return { id: docRef.id, ...entry };
    } catch(error) {
        handleFirestoreError(error, 'addPhonebookEntry');
        throw error;
    }
}