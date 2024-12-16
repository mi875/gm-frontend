"use client";
import { fetchSpacesData } from "@/components/api/methos";
import AddSpace from "@/components/app/add-space";
import NavUser from "@/components/app/navi-user";
import { SpaceData } from "@/components/types/space";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const cookieStore = useCookies();
  const router = useRouter();
  const sidebarMenuItemData = [
    { label: "ホーム", link: "/dashboard", icon: Home },
    { label: "スペース一覧", link: "/dashboard/spaces", icon: List },
    { label: "履歴", link: "/dashboard/history", icon: History },
  ];
  const [spacesData, setSpacesData] = useState<SpaceData[] | undefined>(
    undefined
  );

  function breadcrumbList() {
    const breadcrumbItemList: { label: string; link: string; isLast: boolean }[] =
      [];
    // make breadcrumb list
    sidebarMenuItemData.forEach((element) => {
      if (pathname.includes(element.link)) {
        breadcrumbItemList.push({
          label: element.label,
          link: element.link,
          isLast: false,
        });
      }
    });
    if (spacesData !== undefined) {
      spacesData.forEach((element) => {
        if (pathname.includes(element.id)) {
          breadcrumbItemList.push({
            label: element.space_name,
            link: "/dashboard/spaces/" + element.id,
            isLast: false,
          });
        }
      });
    }
    breadcrumbItemList.slice(-1)[0].isLast = true;
    return breadcrumbItemList;
  }
  const fetchSpaces = async () => {
    fetchSpacesData(cookieStore, router).then((data) => {
      setSpacesData(data);
    });
  };

  useEffect(() => {
    // const fetchSpaces = async () => {
    //   fetchSpacesData(cookieStore, router).then((data) => {
    //     console.log(data);
    //     setSpacesData(data);
    //   });
    // };
    fetchSpaces();
  }, []);

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {sidebarMenuItemData.map((element) => (
                <SidebarMenuItem key={element.link}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === element.link}
                  >
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
              {spacesData &&
                spacesData.map((element) => (
                  <SidebarMenuItem key={element.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.split("/").slice(-1)[0] === element.id}
                    >
                      <Link href={"/dashboard/spaces/" + element.id}>
                        <span>{element.space_name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <AddSpace
            cookieStore={cookieStore}
            useRouter={router}
            fetchSpaces={fetchSpaces}
          />
          <NavUser />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbList().map((element) => {
                  return element.isLast ? (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbPage> {element.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  ) : (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink asChild>
                          <Link href={element.link}> {element.label}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                    </>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
