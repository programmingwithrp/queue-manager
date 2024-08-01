import React from "react";
import DashboardHeader from "@/components/custom/DashboardHeader";
import DashboardAside from "@/components/custom/DashboardAside";
import { auth } from "@/auth";

const DashboardLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
    const session = await auth();
  if (!session) {
    return null;
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardAside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader session={session} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
