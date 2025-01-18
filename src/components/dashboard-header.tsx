import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { BreadcrumbClient } from "./breadcrumb-client";

export async function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbClient />
      </div>
    </header>
  );
}
