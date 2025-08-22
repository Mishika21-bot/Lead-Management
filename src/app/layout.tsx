import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'LeadFlow',
  description: 'An intelligent lead management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={cn('font-body antialiased')} suppressHydrationWarning>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <MainSidebar />
            <main className="flex-1">{children}</main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
