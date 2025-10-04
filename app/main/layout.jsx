import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarMain } from './_components/SidebarMain';
export default function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <SidebarMain />
      <main>
        {children}
      </main>
    </SidebarProvider>
  );
}
