"use client";
import NavUser from "@/components/app/navi-user";
import { SpaceData } from "@/components/types/space";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { History, Home, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const sidebarMenuItemData = [
    { label: "ホーム", link: "/dashboard", icon: Home },
    { label: "スペース一覧", link: "/dashboard/spaces", icon: List },
    { label: "履歴", link: "/dashboard/history", icon: History },
  ];
  const spaceTestData: SpaceData[] = [
    { id: "1", name: "メンマの部屋" },
    { id: "2", name: "ずんだの部屋" },
    { id: "3", name: "ひよこの部屋" },
  ];
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>

        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
              <SidebarMenu>
            {sidebarMenuItemData.map((element) => (
              <SidebarMenuItem key={element.link}>
                <SidebarMenuButton asChild isActive={pathname === element.link}>
                  <Link href={element.link}>
                    <element.icon />
                    <span>{element.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          </SidebarGroup>
        
          <SidebarGroup>
            <SidebarGroupLabel>スペース</SidebarGroupLabel>
            <SidebarMenu>
              {spaceTestData.map((element) => (
                <SidebarMenuItem key={element.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.split("/").slice(-1)[0] === element.id}
                  >
                    <Link href={"/dashboard/spaces/" + element.id}>
                      <span>{element.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
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
