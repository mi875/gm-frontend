"use client";

import NavUser from "@/components/app/navi-user";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { History, Home, List } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarMenuItemData = [
    { label: "ホーム", link: "#" ,icon:Home},
    { label: "スペース", link: "#" ,icon:List},
    { label: "履歴", link: "#" ,icon:History},
  ];
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            {sidebarMenuItemData.map((element)=> 
            <SidebarMenuItem>
              <SidebarMenuButton asChild >
                <Link href={element.link}>
                  <element.icon />
                  <span>{element.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>)}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: "めんま（ずんだ）",
              id: "sinatiku21",
              avatar:
                "https://pbs.twimg.com/profile_images/1662061828980232198/wJM1cTBb_400x400.jpg",
              email: "sinatiku21@sinatiku21.com",
            }}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
