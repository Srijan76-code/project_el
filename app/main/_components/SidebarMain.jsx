"use client";

import {
  SidebarProvider,
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
import { useState } from "react";

const items = [
  { title: "My Profile", url: "#", icon: User },
  { title: "Repositories", url: "#", icon: GitBranch },
  { title: "Leaderboard", url: "#", icon: Trophy },
];

export function SidebarMain() {
  const [active, setActive] = useState("My Profile");

  return (
    <SidebarProvider>
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
                        onClick={() => setActive(item.title)}
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
              <SidebarMenuButton asChild>
                <a
                  href="#" onClick={() => setActive("Logout")} 
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    active === "Logout"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-800 hover:text-red-500 text-gray-300"
                  }`}
                >
                  <LogOut
                    className={`w-5 h-5 ${
                      active === "Logout" ? "text-white" : "text-gray-300"
                    }`}
                  />
                  <span className="font-medium">Logout</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
