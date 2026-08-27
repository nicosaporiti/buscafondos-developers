import { DocsSidebar } from "@/components/docs-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DocumentationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider className="docs-shell">
      <DocsSidebar />
      <SidebarInset id="main-content" className="docs-main"><article className="prose">{children}</article></SidebarInset>
    </SidebarProvider>
  );
}
