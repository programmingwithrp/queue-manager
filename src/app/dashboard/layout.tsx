import React from "react";
import DashboardHeader from "@/components/custom/dashboard/DashboardHeader";
import DashboardAside from "@/components/custom/dashboard/DashboardAside";
import { auth } from "@/auth";
import { OrganizationProvider } from "@/context/OrganizationContext";
import Dynamicbreadcrumb from "@/components/custom/dynamicbreadcrumb/Dynamicbreadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const DashboardLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  console.log("session from dashboard Layout" + JSON.stringify(session));
  if (!session) {
    return <div className="m-5 align-middle">
      <h2>Opps, Looks like you logged out.</h2><Button className="p-1 "><Link href={"/signin"}>Login Again</Link></Button>
    </div>;
  }
  return (
    <OrganizationProvider session={session}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DashboardAside />

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </OrganizationProvider>
  );
};

export default DashboardLayout;
