"use client";
import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import ModeToggle from "@/components/ui/mode-toogle";

import { doLogout } from "@/action/actions";
import { useRouter } from "next/navigation";
import { useOrganization } from "@/context/OrganizationContext";
import Dynamicbreadcrumb from "../dynamicbreadcrumb/Dynamicbreadcrumb";
import DialogCloseButton from "@/components/ui/qrcode-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
const DashboardHeader = () => {
  const router = useRouter();
  const { session, breadcrumb } = useOrganization();
  console.log("session from dashboard header" + session?.user?.name);
  const qrCodeTriggerElement = <h4 className="ml-2 mt-1 cursor-pointer">Qr code</h4>;
  async function handleLogout(e: any) {
    try {
      e.preventDefault();
      console.log("handleLogout :>> called");
      await doLogout();
      router.push("/signin");
      console.log("sign in pushed");
    } catch (e) {
      console.error("Failed to sign out user", e);
    }
  }
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/desks"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Desks
            </Link>
            <Link
              href="/dashboard/users"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Users
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LineChart className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Dynamicbreadcrumb />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <ModeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          ></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{session?.user?.name || "UserName"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={"/dashboard/settings"}>Setting</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>

          <DialogCloseButton
            orgId={session?.user?.organization._id}
            triggerElement={qrCodeTriggerElement}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form onSubmit={handleLogout}>
              <Button variant="outline" type="submit">
                Logout2
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default DashboardHeader;
