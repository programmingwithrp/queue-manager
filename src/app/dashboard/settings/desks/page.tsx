"use client";
import { CustomTable } from "@/components/custom/dashboard/table/CustomTable";
import DesksTabsRowContent from "@/components/custom/dashboard/table/DesksTabsRowContent";
import EditForm from "@/components/custom/editform/Editform";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import LoadingWheel from "@/components/ui/loader";
import { TableHead } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from "@/context/OrganizationContext";
import { DeskInterface } from "@/interfaces/interface";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import React, { useEffect, useState } from "react";

export default function desks() {
  const { session } = useOrganization();
  const [desks, setDesks] = useState<DeskInterface[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [description, setDescription] = useState("");
  const TriggerButton = (
    <Button onClick={() => setIsCreateFormOpen(true)} className="mb-3 right-0">
      Create Desk
    </Button>
  );
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

  const handleDeleteDesk = async (id: string) => {
    const deletedDeskResponse = await fetch(`/api/desks?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const res = await deletedDeskResponse.json();
    if (deletedDeskResponse.ok && deletedDeskResponse.status === 200) {
      console.log("Desk deleted successfully");
      toast({
        title: "Deletion Process",
        description: res.message
      });
      setDesks(desks.filter((desk: DeskInterface) => desk._id !== id));
    } else {
      toast({
        variant: "destructive",
        title: "Deletion Process",
        description: "Desk deletion failed" + res.message
      });
    }
  };

  const handleCreateQueue = async (deskId: string) => {
    const response = await fetch("/api/queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deskId: deskId
      })
    });
    if (response.ok) {
      toast({
        title: "Queue Creation",
        description: "Queue created successfully"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Queue Creation",
        description: "Queue creation failed"
      });
    }
  };

  const handleCreateDesk = async (desk: any) => {
    const response = await fetch("/api/desks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(desk)
    });
    const data = await response.json();
    if (response.ok) {
      setDesks([...desks, data]);
      toast({
        title: "Desk Creation",
        description: "Desk created successfully"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Desk Creation",
        description: "Desk creation failed"
      });
    }
    setIsCreateFormOpen(false);
    setDescription("");
  };

  return (
    <Tabs defaultValue="desks">
      <EditForm
        openStatus={isCreateFormOpen}
        setOpenStatus={setIsCreateFormOpen}
        cardTitle="Create Desk"
        triggerButton={TriggerButton}
        Icon={<Pencil2Icon />}
        cardDescription="Create Desk"
        cardFormContent={
          <>
            {["organization", "description"].map((entry, index) => (
              <div key={entry} className="grid grid-cols-4 items-center gap-4">
                <label htmlFor={`entry-${entry}`} className="text-right">
                  {entry}
                </label>
                <input
                  id={`entry-${index}`}
                  value={
                    entry === "organization"
                      ? session?.user?.organization?.name
                      : description
                  }
                  className="col-span-3 ml-2 border-spacing-2 border-black pl-2"
                  onChange={(e) => {
                    console.log("e :>> " + e.target.value);
                    setDescription(e.target.value);
                  }}
                  disabled={entry === "organization"}
                />
              </div>
            ))}
          </>
        }
        onSave={() =>
          handleCreateDesk({
            organization: session?.user?.organization?.name,
            description
          })
        }
      />
      <TabsContent value="desks">
        {/* {TriggerButton} */}
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
                    handleDeleteUser={() => handleDeleteDesk(desk._id)}
                    handleCreateQueue={() => handleCreateQueue(desk._id)}
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
}
