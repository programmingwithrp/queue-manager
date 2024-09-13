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
import { Input } from "@/components/ui/input";
import React from "react";
import { useOrganization } from "@/context/OrganizationContext";

const SettingPage = () => {
  const { session } = useOrganization();

  const changeOrganization = async (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const { name } = data;
    console.log("method called" + name);
    console.log("formData" + formData);
    console.log("session from setting page" + session?.user?.email);
    if (!session) {
      console.error("No session found");
      return;
    }
    const updateOrg = await fetch("/api/organizations", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: name, email: session.user.email })
    });
    const updateOrgData = await updateOrg.json();
    console.log(data);
    if (!updateOrg.ok) {
      console.error("Failed to update organization");
      return;
    }
    return updateOrgData;
  };

  return (
    <>
      {" "}
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Organization Name</CardTitle>
          <CardDescription>
            Used to identify your store in the marketplasdasace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={changeOrganization}>
            <Input
              placeholder="Store Name"
              name="name"
              type="text"
              value={session.user.organization.name}
              disabled
            />
          </form>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Plugins Directory</CardTitle>
          <CardDescription>
            The directory within your project, in which your plugins are located.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input placeholder="Project Name" defaultValue="/content/plugins" />
            <div className="flex items-center space-x-2">
              {/* <Checkbox id="include" defaultChecked /> */}
              <label
                htmlFor="include"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow administrators to change the directory.
              </label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default SettingPage;
