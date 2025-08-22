import { Lead, LeadStatus } from "./types";

// In-memory store for leads
let leads: Lead[] = [
    {
        id: '1',
        leadNo: 'L-001',
        leadDate: new Date('2024-07-20').toISOString(),
        leadType: 'Seller',
        sellerBuyerName: 'John Doe',
        sellerBuyerContact: '123-456-7890',
        itemDetails: 'Copper Scrap',
        purity: '99%',
        qty: '10 MT',
        sellerBuyerRate: '8000/MT',
        frequency: 'WEEKLY',
        status: 'Regular',
        lastUpdate: new Date().toISOString(),
        warehouse: 'NY',
        sample: 'Available',
        packing: 'Loose',
        marketRate: '8100/MT',
        aikyanRate: '7950/MT',
        note: 'Initial contact made.'
    },
    {
        id: '2',
        leadNo: 'L-002',
        leadDate: new Date('2024-07-18').toISOString(),
        leadType: 'Buyer',
        sellerBuyerName: 'Jane Smith',
        sellerBuyerContact: '987-654-3210',
        itemDetails: 'Aluminum Ingots',
        purity: '99.7%',
        qty: '25 MT',
        sellerBuyerRate: '2500/MT',
        frequency: 'MONTHLY',
        status: 'Regular',
        lastUpdate: new Date().toISOString(),
        warehouse: 'CA',
        sample: 'Not Required',
        packing: 'Bundles',
        marketRate: '2550/MT',
        aikyanRate: '2480/MT',
        note: 'Ready to purchase.'
    },
    {
        id: '3',
        leadNo: 'L-003',
        leadDate: new Date('2024-07-15').toISOString(),
        leadType: 'Seller',
        sellerBuyerName: 'Scrap Kings Inc.',
        sellerBuyerContact: '555-555-5555',
        itemDetails: 'Steel Coils',
        purity: 'Grade A',
        qty: '50 MT',
        sellerBuyerRate: '600/MT',
        frequency: 'Once',
        status: 'Negotiation',
        lastUpdate: new Date().toISOString(),
        warehouse: 'TX',
        sample: 'Sent',
        packing: 'Coils',
        marketRate: '620/MT',
        aikyanRate: '590/MT',
        note: 'Negotiating price.'
    },
    {
        id: '4',
        leadNo: 'L-004',
        leadDate: new Date('2024-07-12').toISOString(),
        leadType: 'Buyer',
        sellerBuyerName: 'MetalWorks',
        sellerBuyerContact: '111-222-3333',
        itemDetails: 'Brass Rods',
        purity: 'C360',
        qty: '5 MT',
        sellerBuyerRate: '5500/MT',
        frequency: 'Once',
        status: 'Dead',
        lastUpdate: new Date().toISOString(),
        warehouse: 'FL',
        sample: 'Rejected',
        packing: 'Crates',
        marketRate: '5600/MT',
        aikyanRate: '5450/MT',
        note: 'Price too high.'
    }
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getLeads(filter?: { status?: LeadStatus, isRegular?: boolean }): Promise<Lead[]> {
  await delay(500);
  let filteredLeads = leads;

  if (filter?.status) {
    filteredLeads = filteredLeads.filter(lead => lead.status === filter.status);
  }
  
  if (filter?.isRegular) {
    const regularFrequencies = ["WEEKLY", "MONTHLY", "1-2 M"];
    filteredLeads = filteredLeads.filter(lead => regularFrequencies.includes(lead.frequency || ''));
  }

  return [...filteredLeads].sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
}

export async function addLead(leadData: Omit<Lead, 'id' | 'leadNo' | 'lastUpdate'>): Promise<Lead> {
  await delay(500);
  const newLead: Lead = {
    ...leadData,
    id: (leads.length + 1).toString(),
    leadNo: `L-${(leads.length + 1).toString().padStart(3, '0')}`,
    lastUpdate: new Date().toISOString(),
  };
  leads.unshift(newLead);
  return newLead;
}

export async function getLeadStats() {
    await delay(300);
    const total = leads.length;
    const negotiation = leads.filter(l => l.status === 'Negotiation').length;
    const dead = leads.filter(l => l.status === 'Dead').length;
    const regular = leads.filter(l => ["WEEKLY", "MONTHLY", "1-2 M"].includes(l.frequency || '')).length;
    return { total, negotiation, regular, dead };
}

export async function getLeadsByType() {
    await delay(300);
    const buyer = leads.filter(l => l.leadType === 'Buyer').length;
    const seller = leads.filter(l => l.leadType === 'Seller').length;
    const other = leads.length - buyer - seller;
    
    return [
        { name: 'Buyers', value: buyer, fill: 'hsl(var(--chart-1))' },
        { name: 'Sellers', value: seller, fill: 'hsl(var(--chart-2))' },
        { name: 'Other', value: other, fill: 'hsl(var(--chart-5))' },
    ];
}
