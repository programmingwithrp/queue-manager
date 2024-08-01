"use client";
import Link from "next/link";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import ModeToggle from "@/components/ui/mode-toogle";

import { useEffect, useReducer } from "react";

import AddCustomers from "@/components/ui/addcustomers";
import Usermodel from "@/interfaces/user";

import { doLogout } from "@/action/actions";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardTabsContent } from "@/components/ui/dashboard-tabscontent";
import DialogCloseButton from "@/components/ui/qrcode-dialog";
import {
  DropdownMenuGroup} from "@radix-ui/react-dropdown-menu";
import {useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface State {
  isLoading: boolean;
  openAddCustomerPanel: boolean;
  session: any;
  users: Usermodel[];
  displayUsers: Usermodel[];
  openQRDialog: boolean;
  orgId: string;
}

const initialState: State = {
  isLoading: true,
  openAddCustomerPanel: false,
  session: null,
  users: [],
  displayUsers: [],
  openQRDialog: false,
  orgId : ''
};

function reducer(state: typeof initialState, action: any) {
  console.log("payload", action.payload);
  switch (action.type) {
    case "FETCH_USERS":
      return {
        ...state,
        users: action.payload,
        displayUsers:
          action.payload.length > 10 ? action.payload.slice(0, 10) : action.payload
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "TOGGLE_ADD_CUSTOMER_PANEL":
      return { ...state, openAddCustomerPanel: action.payload };
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload]
        , displayUsers: state.displayUsers.length < 10 ? [...state.displayUsers, action.payload] : state.displayUsers };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
        displayUsers: state.users.filter((user) => user._id !== action.payload)
      };
    case "UPDATE_USER_STATUS":
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        displayUsers: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        )
      };
    case "OPEN_QR_DIALOG":
      return { ...state, openQRDialog: action.payload };
    case "SET_SESSION":
      return { ...state, session: action.payload };
    case "SET_DISPLAY_USERS":
      return { ...state, displayUsers: action.payload };
    case "SET_ORG_ID":
      return { ...state, orgId: action.payload };
    default:
      return state;
  }
}

export default function Dashboard() {
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, initialState);

  const { users, displayUsers, isLoading, openAddCustomerPanel, session, orgId } = state;
  const totalUsersBatch = [];
  for (let index = 0; index < users.length; index += 10) {
    totalUsersBatch.push(
      users.length > index + 10 ? `${index + 10}` : `${users.length.toString()}`
    );
  }

  async function handleLogout(e: any) {
    try {
      e.preventDefault();
      console.log("handleLogout :>> called");
      await doLogout();
      router.push("/signin");
      console.log('sign in pushed');
      
    } catch (e) {
      console.error("Failed to sign out user", e);
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      console.log("session : from get session>> ", session);
      if (!session) {
        console.log("session :>> hey ", session);
        router.push("/signin");
        return;
      }
      dispatch({ type: "SET_SESSION", payload: session });
        const getOrgResponse = await fetch("/api/organizations/?email=" + session?.user?.email,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });
        const data = await getOrgResponse.json();
        console.log("data :>> ", data);
        if(getOrgResponse.ok){
          console.log("data :>> ", data);
          dispatch({ type: "SET_ORG_ID", payload: data._id });
        }
      
    };

    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!session) {
        return;
      }
      const orgName = session?.user.name;
      dispatch({ type: "SET_LOADING", payload: true });
      const fetchAPI = await fetch("/api/users/?organization=" + orgName);
      const data = await fetchAPI.json();
      dispatch({ type: "FETCH_USERS", payload: data });
      dispatch({ type: "SET_LOADING", payload: false });
      console.log("data.length" + data.length);
      console.log("data.length" + data.slice(0, 10 ? data.length >= 10 : data.length));
    }
    fetchData();
  }, [session]);


  function handleLimitUser(limit: string) {
    console.log("limit :>> ", limit);
    dispatch({ type: "SET_DISPLAY_USERS", payload: users.slice(0, Number(limit)) });
  }

  if (!session) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Orders</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Orders</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Products</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Customers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link href="#" className="flex items-center gap-4 px-2.5 text-foreground">
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
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
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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
              >
              
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session?.user?.name || "UserName"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>

              <DialogCloseButton orgName={session?.user?.name}/>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form onSubmit={handleLogout}>
                  <Button variant="outline" type="submit">
                    Logout
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="inProgress">inProgress</TabsTrigger>
                <TabsTrigger value="completed" className="hidden sm:flex">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="hidden sm:flex">
                  Cancelled
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>all</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>pending</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>inProgress</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>completed</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_ADD_CUSTOMER_PANEL",
                      payload: !openAddCustomerPanel
                    })
                  }
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {openAddCustomerPanel ? "Open Queue" : "Add Customer"}
                  </span>
                </Button>
              </div>
            </div>
            {openAddCustomerPanel ? (
              <AddCustomers dispatch={dispatch}  session={session} orgId={orgId}/>
            ) : (
              <>
                <DashboardTabsContent
                  dispatch={dispatch}
                  users={displayUsers}
                  isLoading={isLoading}
                  tabStatus="all"
                  orgId={orgId}
                />
                <DashboardTabsContent
                  dispatch={dispatch}
                  users={displayUsers.filter(
                    (user: Usermodel) => user.status === "pending"
                  )}
                  isLoading={isLoading}
                  tabStatus="pending"
                  orgId={orgId}
                />
                <DashboardTabsContent
                  dispatch={dispatch}
                  users={displayUsers.filter(
                    (user: Usermodel) => user.status === "inProgress"
                  )}
                  isLoading={isLoading}
                  tabStatus="inProgress"
                  orgId={orgId}
                />
                <DashboardTabsContent
                  dispatch={dispatch}
                  users={displayUsers.filter(
                    (user: Usermodel) => user.status === "completed"
                  )}
                  isLoading={isLoading}
                  tabStatus="completed"
                  orgId={orgId}
                />
                <DashboardTabsContent
                  dispatch={dispatch}
                  users={displayUsers.filter(
                    (user: Usermodel) => user.status === "cancelled"
                  )}
                  isLoading={isLoading}
                  tabStatus="cancelled"
                  orgId={orgId}
                />
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="mt-4 justify-end">
                <Button variant="outline">{displayUsers.length} Records</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-28">
                {/* showing number ofrecords to show 10, 20 30  */}
                {users.length > 0 && (
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Records per page</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                      // dynamic record count depend on user length
                      totalUsersBatch.map((batch: string, index: number) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => handleLimitUser(batch)}
                        >
                          {batch} Records
                        </DropdownMenuItem>
                      ))
                    }
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </Tabs>
        </main>
       
      </div>
    </div>
  );
}
