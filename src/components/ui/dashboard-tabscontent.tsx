import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UserTableRow from "@/components/ui/usertablerow";
import LoadingWheel from "@/components/ui/loader";
import Usermodel from "@/interfaces/user";
export const DashboardTabsContent = ({
  isLoading,
  users,
  dispatch,
  tabStatus,
  orgId
}: {
  isLoading: boolean;
  users: Usermodel[];
  dispatch: any;
  tabStatus: string;
  orgId: string;
}) => {
  return (
    <TabsContent value={tabStatus}>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Queue</CardTitle>
          <CardDescription>
            Manage your customers and view their current queue status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {tabStatus !== "all"
                  ? users
                      .filter((user: Usermodel) => user.status === tabStatus)
                      .map((user: Usermodel) => (
                        <UserTableRow
                          key={user._id}
                          userRecord={user}
                          dispatch={dispatch}
                          orgId={orgId}
                        />
                      ))
                  : users.map((user: Usermodel) => (
                      <UserTableRow
                        key={user._id}
                        userRecord={user}
                        dispatch={dispatch}
                        orgId={orgId}
                      />
                    ))}
              </TableBody>
            </Table>
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
