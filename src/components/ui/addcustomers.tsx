"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { randomInt } from "crypto";
import { useToast } from "./use-toast";

const formSchema = z.object({
  name: z.string().nonempty(),
  desk: z
    .string()
    .nonempty()
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 1 && num <= 10;
      },
      {
        message: "Desk must be a valid number between 1 and 10."
      }
    ),
  queue: z.number().int().positive(),
  createdDate: z.string().nonempty(),
  status: z.string().nonempty(),
  organization: z.string().nonempty(),
  description: z.string().nonempty()
});

export default function AddCustomers({
  dispatch,
  session,
  orgId
}: {
  dispatch: any;
  session: any;
  orgId: string;
}) {
  const {toast} = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "pending",
      desk: "2",
      queue: Math.floor(Math.random() * 10000000),
      organization: session?.user?.name || "",
      description: "",
      createdDate: new Date().toISOString()
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { name, desk, queue, createdDate, status, organization, description } = values;
    const addUser = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name,
        desk,
        queue,
        createdDate,
        status,
        organization,
        description
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("userAdded response" + addUser);
    if (!addUser.ok) {
      console.error(addUser.statusText);
      // showAlert("error", "Failed to create user");
      toast({
        title: "Failed",
        description: "Failed to create user"
      })
      return;
    }
    const data = await addUser.json();
    console.log("userAdded response" + data._id);
    dispatch({ type: "ADD_USER", payload: { ...data, organization: orgId } });
    dispatch({
      type: "TOGGLE_ADD_CUSTOMER_PANEL",
      payload: false
    });
    toast({
      title: "success",
      description: "description"
    })
    // showAlert("success", data.message);
  }

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desk</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Desk number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Organization */}
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription>Organization name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Describe your issue</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
