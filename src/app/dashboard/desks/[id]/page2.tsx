"use client";
import { File, ListFilter, PlusCircle } from "lucide-react";

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

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useReducer } from "react";

import AddCustomerForm from "@/components/custom/customers/AddCustomerForm";
import Usermodel from "@/interfaces/Usermodel";

import { DashboardTabsContent } from "@/components/custom/dashboard/table/DashboardTabsContent";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useOrganization } from "@/context/OrganizationContext";

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
  orgId: ""
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
      return {
        ...state,
        users: [...state.users, action.payload],
        displayUsers:
          state.displayUsers.length < 10
            ? [...state.displayUsers, action.payload]
            : state.displayUsers
      };
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

export default function QueueCustomers() {
  const { session } = useOrganization();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { users, displayUsers, isLoading, openAddCustomerPanel, orgId } = state;
  const totalUsersBatch = [];
  for (let index = 0; index < users.length; index += 10) {
    totalUsersBatch.push(
      users.length > index + 10 ? `${index + 10}` : `${users.length.toString()}`
    );
  }

  useEffect(() => {
    // const checkAuth = async () => {
    //   const getOrgResponse = await fetch(
    //     "/api/organizations/?name=" + session?.user?.email,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json"
    //       }
    //     }
    //   );
    //   const data = await getOrgResponse.json();
    //   console.log("Organization data :>> ", data);
    //   if (getOrgResponse.ok) {
    //     console.log("data :>> ", data);
    //     dispatch({ type: "SET_ORG_ID", payload: data._id });
    //   }
    // };
    async function fetchCustomersData() {
      const fetchAPI = await fetch("/api/customers/?organization=" + session.user.name);
      const data = await fetchAPI.json();
      dispatch({ type: "FETCH_USERS", payload: data });
    }
    dispatch({ type: "SET_LOADING", payload: true });
    // checkAuth();
    fetchCustomersData();
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  function handleLimitUser(limit: string) {
    console.log("limit :>> ", limit);
    dispatch({ type: "SET_DISPLAY_USERS", payload: users.slice(0, Number(limit)) });
  }

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
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
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
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
          <AddCustomerForm dispatch={dispatch} queueId ={param} />
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
              users={displayUsers.filter((user: Usermodel) => user.status === "pending")}
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
                    <DropdownMenuItem key={index} onClick={() => handleLimitUser(batch)}>
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
  );
}
