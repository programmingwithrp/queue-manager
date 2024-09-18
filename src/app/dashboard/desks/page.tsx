"use client";
import React, { useEffect, useState } from "react";
import { useOrganization } from "@/context/OrganizationContext";
import { DeskInterface } from "@/interfaces/interface";
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
import { CustomTable } from "@/components/custom/dashboard/table/CustomTable";
import DesksTabsRowContent from "@/components/custom/dashboard/table/DesksTabsRowContent";
import { TableHead } from "@/components/ui/table";

const Desks = () => {
  const [desks, setDesks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDesks = async () => {
      const response = await fetch(
        "/api/desks?organization=" + session?.user?.organization?._id
      );
      const data = await response.json();
      console.log(data);
      setDesks(data);
      setIsLoading(false);
    };
    setIsLoading(true);
    fetchDesks();
  }, []);
  const { session } = useOrganization();
  console.log("session :>> inside Desks ", session);
  return (
    <Tabs defaultValue="desks">
      <TabsContent value="desks">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Desks</CardTitle>
            <CardDescription>
              Manage your Desks and view their current queue and customers.
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
                    <TableHead>Description</TableHead>
                    <TableHead>Desk Number</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </>
                }
              >
                {desks.map((desk: DeskInterface) => (
                  <DesksTabsRowContent
                    key={desk._id}
                    deskRecord={desk}
                    // dispatch={dispatch}
                  />
                ))}
              </CustomTable>
            ) : (
              <LoadingWheel />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Desks;
