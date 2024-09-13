"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import React from "react";
import { useOrganization } from "@/context/OrganizationContext";
import { useRouter } from "next/navigation";
const SettingLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = useOrganization();
  const router = useRouter();
  if (!session) {
    router.push("/login");
    return;
  }
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="#" className="font-semibold text-primary">
            General
          </Link>
          <Link href="/dashboard/settings/desks">Manage desks</Link>
          <Link href="#">Integrations</Link>
          <Link href="#">Support</Link>
          <Link href="#">Organizations</Link>
          <Link href="#">Advanced</Link>
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </main>
  );
};


export default SettingLayout;