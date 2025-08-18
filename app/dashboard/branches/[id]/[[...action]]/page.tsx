import Branchsfrom from "@/components/forms/branchs-from";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { Permission } from "@/components/types";
import { Building2 } from "lucide-react";

interface BranchPageProps {
  params: {
    id: string;
    action?: string[];
  };
}

export default async function RestaurantPage({ params }: BranchPageProps) {
  const { id, action } = await params;
  const isCreate = id === Permission.CREATE;  
  const mode = isCreate ? Permission.CREATE : (action?.[0] ?? Permission.VIEW);

  const getPageTitle = (mode: string) => (
    mode === Permission.EDIT ? "Edit Branch" :
    mode === Permission.VIEW ? "View Branch" :
    mode === Permission.CREATE ? "Create Branch" : ""
  );

  const breadcrumbItems = [
    { label: "Branches", href: "/dashboard/branches", icon: <Building2 className="h-4 w-4" /> },
    { label: getPageTitle(mode) },
  ];

  return (
    <div className="space-y-6">
      <PageBreadcrumb items={breadcrumbItems} />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getPageTitle(mode)}</h1>
        <p className="text-muted-foreground">
          Manage your restaurant information, opening hours, and images.
        </p>
      </div>
      <Branchsfrom branchId={id} mode={mode} />
    </div>
  );
}
