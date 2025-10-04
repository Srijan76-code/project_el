"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, GitBranch, Trophy, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

const items = [
  { title: "My Profile", url: "/main/profile", icon: User },
  { title: "Repositories", url: "/main/Repositories", icon: GitBranch },
  { title: "Leaderboard", url: "/main/leaderboard", icon: Trophy },
];

export function SidebarMain() {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  // Update active state based on current path
  useEffect(() => {
    const activeItem = items.find(item => item.url === pathname);
    if (activeItem) {
      setActive(activeItem.title);
    } else {
      // Handle nested routes
      if (pathname.startsWith('/main/Repositories/')) {
        setActive('Repositories');
      } else {
        setActive('');
      }
    }
  }, [pathname]);

  return (
      <Sidebar className="bg-[#121212] text-gray-300 w-64 flex flex-col justify-between h-screen">
        <SidebarHeader>
          <div className="flex flex-col items-start justify-center p-4">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="mt-2 text-lg font-bold text-white"></span>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 pt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                          active === item.title
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-800 text-gray-300"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            active === item.title ? "text-white" : "text-gray-300"
                          }`}
                        />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="px-4 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <SidebarMenuButton
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all w-full text-left ${
                      active === "Logout"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <LogOut
                      className={`w-5 h-5 ${
                        active === "Logout" ? "text-white" : "text-gray-300"
                      }`}
                    />
                    <span className="font-medium">Logout</span>
                  </SidebarMenuButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will sign you out of your account. You can always sign back in later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  );
}