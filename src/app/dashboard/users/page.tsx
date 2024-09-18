"use client";
import React, { useEffect, useState } from "react";
import { useOrganization } from "@/context/OrganizationContext";
import { OrgUserInterface } from "@/interfaces/interface";
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
import { TableHead } from "@/components/ui/table";
import OrganizationUserTabsRowContent from "@/components/custom/dashboard/table/OrganizationUsersContent";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import EditForm from "@/components/custom/editform/Editform";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Users = () => {
  const [users, setUsers] = useState<OrgUserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const roles = ["Admin", "User"];

  const TriggerButton = (
    <Button onClick={() => setIsCreateFormOpen(true)} className="mb-3 right-0 ml-4">
      Create User
    </Button>
  );
  useEffect(() => {
    const fetchOrgUsers = async () => {
      const response = await fetch(
        "/api/organizationusers?organization=" + session?.user?.organization?._id
      );
      const data = await response.json();
      console.log(data);
      setUsers(data);
      setIsLoading(false);
    };
    setIsLoading(true);
    fetchOrgUsers();
  }, []);
  const { session } = useOrganization();
  console.log("session :>> inside Users ", session?.user?.role);

  const handleCreateUser = async (user: any) => {
    const response = await fetch("/api/organizationusers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();
    if (response.ok) {
      setUsers([...users, data]);
      toast({
        title: "Organization User Creation",
        description: "Organization User created successfully"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Organization User Creation",
        description: "Failed to create Organization User"
      });
    }
    setIsCreateFormOpen(false);

    setEditUsername("");
    setEditRole("");
    setEditPassword("");
  };

  const handleDeleteUser = async (id: string) => {
    const deletedUserResponse = await fetch(`/api/organizationusers?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const res = await deletedUserResponse.json();
    if (deletedUserResponse.ok && deletedUserResponse.status === 200) {
      console.log("User deleted successfully");
      toast({
        title: "Deletion Process",
        description: "User deleted successfully"
      });
      setUsers(users.filter((user: OrgUserInterface) => user._id !== id));
    } else {
      toast({
        variant: "destructive",
        title: "Deletion Process",
        description: "User deletion failed" + res.message
      });
    }
  };

  return (
    <Tabs defaultValue="users">
      {session?.user?.role === "Admin" ? (
        <EditForm
          openStatus={isCreateFormOpen}
          setOpenStatus={setIsCreateFormOpen}
          cardTitle="Create User"
          triggerButton={TriggerButton}
          Icon={<Pencil2Icon />}
          cardDescription="Create User"
          cardFormContent={
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  onChange={(e) => setEditName(e.target.value)}
                  id="name"
                  placeholder=""
                  required
                  name="name"
                  value={editName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  onChange={(e) => setEditUsername(e.target.value)}
                  id="username"
                  placeholder=""
                  required
                  name="username"
                  value={editUsername}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization">Role</Label>
                <Select name="role" required onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role: any) => (
                      <SelectItem value={role} key={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={(e) => setEditPassword(e.target.value)}
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  name="password"
                  value={editPassword}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  placeholder=""
                  required
                  name="organization"
                  value={session?.user?.organization?.name}
                  disabled
                />
              </div>
            </>
          }
          onSave={() =>
            handleCreateUser({
              name: editName,
              username: editUsername,
              role: editRole,
              password: editPassword,
              organization: session?.user?.organization?.name
            })
          }
        />
      ) : null}

      <TabsContent value="users">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage your Organization Users.</CardDescription>
            {session?.user?.role !== "Admin" ? 
              <CardDescription>
                For More Actions, Please Contact Your Admin
              </CardDescription>
            : null}
          </CardHeader>
          <CardContent>
            {!isLoading ? (
              <CustomTable
                headerColumns={
                  <>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>UserName</TableHead>
                    <TableHead>
                      <div className="grid gap-2">
                        <Label htmlFor="organization">Role</Label>
                      </div>
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </>
                }
              >
                {users.map((user: OrgUserInterface) => (
                  <OrganizationUserTabsRowContent
                    key={user._id}
                    organizationUserRecord={user}
                    handleDeleteUser={() => handleDeleteUser(user._id)}
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

export default Users;
