import EditPackage from "@/components/dashboard/edit-package";

export async function generateStaticParams() {
  // Mock data
  const packages = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
  ];

  return packages.map((pkg) => ({ id: pkg.id }));
}
export default async function EditPackagePage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return <EditPackage id={params.id} />;
}
