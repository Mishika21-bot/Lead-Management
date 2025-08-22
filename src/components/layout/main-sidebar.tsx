'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, ClipboardList, Archive, Repeat, Workflow, Settings, CheckSquare, CalendarClock, HardDriveDownload } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/', label: 'AI Ingestion', icon: Bot },
  { href: '/leads', label: 'All Leads', icon: ClipboardList },
  { href: '/leads/regular', label: 'Regular', icon: Repeat },
  { href: '/leads/negotiation', label: 'Negotiation', icon: Workflow },
  { href: '/leads/follow-up', label: 'Follow Up', icon: CalendarClock },
  { href: '/leads/sample-updates', label: 'Sample Updates', icon: CheckSquare },
  { href: '/leads/bin', label: 'Bin', icon: Archive },
  { href: '/export', label: 'Data Export', icon: HardDriveDownload },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M12.22 2h-4.44l-2 10h-2l-2 10h20l-2-10h-2l-2-10z"></path><path d="M12 2l2 10h-4l2-10z"></path></svg>
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
