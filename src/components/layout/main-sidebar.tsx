'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, ClipboardList, Package, Archive, Repeat, Workflow, Settings, CheckSquare, CalendarClock, DollarSign, Contact } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const menuItems = [
  { href: '/', label: 'AI Ingestion', icon: Bot },
  { href: '/leads', label: 'All Leads', icon: ClipboardList },
  { href: '/leads/regular', label: 'Regular', icon: Repeat },
  { href: '/leads/negotiation', label: 'Negotiation', icon: Workflow },
  { href: '/leads/follow-up', label: 'Follow Up', icon: CalendarClock },
  { href: '/leads/sample-updates', label: 'Sample Updates', icon: CheckSquare },
  { href: '/rates', label: 'Rates', icon: DollarSign },
  { href: '/phonebook', label: 'Phonebook', icon: Contact },
  { href: '/leads/bin', label: 'Bin', icon: Archive },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Package className="w-8 h-8 text-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">LeadFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
