"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { documentationNavigation } from "@/lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export function DocsSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <div className="mobile-sidebar-trigger"><SidebarTrigger aria-label="Abrir navegación de documentación" /> <span>Documentación</span></div>
      <Sidebar collapsible="offcanvas" className="docs-sidebar">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Guías</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {documentationNavigation.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.description}>
                      <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpenMobile(false)}><span>{item.label}</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter><div className="sidebar-version"><span>Contrato API</span><strong>OpenAPI 1.0.0</strong></div></SidebarFooter>
      </Sidebar>
    </>
  );
}
