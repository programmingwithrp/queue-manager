"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import { useToast  } from "@/components/ui/use-toast";
import { Textarea } from "./textarea";

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

export function AddUserInputForm({ orgranizationName }: { orgranizationName: any }) {
    const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "pending",
      desk: "2",
      queue: 3,
      organization: orgranizationName,
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
    console.log(addUser);
    if (!addUser.ok) {
      console.error(addUser.statusText);
      toast({
        title: "Error",
        description: "Failed to add user"
      });
    } else {
      const data = await addUser.json();
      console.log(data);
      toast({
        title: "Success",
        description: "User added successfully"
      });
        form.reset();
    }
  }

  return (
    <Card className= "mt-2">
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
