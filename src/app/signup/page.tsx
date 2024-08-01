
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
      router.push('/signin');
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
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrg}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Name</Label>
                  <Input id="first-name" placeholder="Max" required name="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Org Sector</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    name="organization"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
