import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useOrganization } from "@/context/OrganizationContext";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Dynamicbreadcrumb() {
  const { breadcrumb, setBreadcrumb } = useOrganization();
  const pathname = usePathname();

  console.log('pathSegments :>> ', pathname);
  useEffect(() => {
    // Split the current URL path to create breadcrumb items
    const pathSegments = pathname?.split("/").filter((segment) => segment);
    // Create breadcrumb data based on the URL
    const updatedBreadcrumb = pathSegments?.map((segment, index) => {
      const link = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { link, name };
    });

    // Update the breadcrumb state
    setBreadcrumb(updatedBreadcrumb);
  }, [pathname, setBreadcrumb]); // Trigger update when the URL changes

  return (
    <BreadcrumbList className="pl-3">
      {breadcrumb.map((item: any, index: any) => (
        <>
          <BreadcrumbItem key={index}>
            <BreadcrumbLink asChild>
              <Link href={item.link}>{item.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </>
      ))}
    </BreadcrumbList>
  );
}
