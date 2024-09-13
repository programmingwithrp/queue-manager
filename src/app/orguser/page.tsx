"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { OrganizationInterface } from "@/interfaces/interface";
export default function SignUpOrgUserForm() {
  const [orgs, setOrgs] = useState([]);
  const getAllOrgs = async () => {
    const response = await fetch("/api/organizations");
    const data = await response.json();
    setOrgs(data);
  };
  const roles = ['Admin', 'User'];
  useEffect(() => {
    getAllOrgs();
  }, []);
  const router = useRouter();
  const { toast } = useToast();
  async function handleCreateOrgUser(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    const response = await fetch("/api/organizationusers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const organization = await response.json();
      console.log(organization);
      router.push("/signin");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request."
      });
      console.error("Failed to create organization");
    }
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="mx-auto max-w-sm mt-4">
        <CardHeader>
          <CardTitle className="text-xl">Organization SignUp</CardTitle>
          <CardDescription>Create Organization Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrgUser}>
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Max" required name="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>

                <Select name="organization" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgs.map((org: OrganizationInterface) => (
                        <SelectItem value={org.name} key={org._id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="xyz@org.com"
                    required
                    name="username"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  name="password"
                />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="organization">Role</Label>

                <Select name="role" required>
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
              <Button type="submit" className="w-full">
                Create User under Organization
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an Org account?{" "}
            <Link href="/signin" className="underline">
              Sign in with Organization User
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
