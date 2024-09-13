
'use client'
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
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast";

export default function SignUpForm() {
  const router = useRouter();
  const {toast} = useToast();
  async function handleCreateOrg(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    const response = await fetch("/api/organizations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const organization = await response.json();
      console.log(organization);
      router.push('/orguser');
    } else {
      toast({
        variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request."
      })
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
          <form onSubmit={handleCreateOrg}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="Organization-Name">Organization Name</Label>
                  <Input id="Organization-Name" placeholder="Max" required name="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="Organization-Type">Organization Type</Label>
                  <Input
                    id="Organization-Type"
                    placeholder="Robinson"
                    required
                    name="organizationType"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Organization Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Organization Contact Number</Label>
                <Input
                  id="contactInfo"
                  type="number"
                  placeholder="9999999999"
                  required
                  name="contactInfo"
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" />
              </div> */}
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              {/* <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button> */}
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
