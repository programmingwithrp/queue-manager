import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CustomersTabsRowContent from "@/components/custom/dashboard/table/CustomersTabsRowContent";
import LoadingWheel from "@/components/ui/loader";
import { CustomTable } from "./CustomTable";
import { TableHead } from "@/components/ui/table";
import { CustomersInterface } from "@/interfaces/interface";
export const DashboardTabsContent = ({
  isLoading,
  users,
  dispatch,
  tabStatus,
  orgId
}: {
  isLoading: boolean;
  users: CustomersInterface[];
  dispatch: any;
  tabStatus: string;
  orgId: string;
}) => {
  return (
    <TabsContent value={tabStatus}>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            Manage your customers and view their current status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading ? (
            <CustomTable
              headerColumns={
                <>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Desk Table</TableHead>
                  <TableHead className="hidden md:table-cell">Queue</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Created at</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </>
              }
            > 
              {tabStatus !== "all"
                ? users
                    .filter((user: CustomersInterface) => user.status === tabStatus)
                    .map((user: CustomersInterface) => (
                      <CustomersTabsRowContent
                        key={user._id}
                        userRecord={user}
                        dispatch={dispatch}
                        orgId={orgId}
                      />
                    ))
                : users.map((user: CustomersInterface) => (
                    <CustomersTabsRowContent
                      key={user._id}
                      userRecord={user}
                      dispatch={dispatch}
                      orgId={orgId}
                    />
                  ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No records found
                    </td>
                  </tr>
                )}
            </CustomTable>
          ) : (
            <LoadingWheel />
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-100</strong> of <strong>{users.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};
