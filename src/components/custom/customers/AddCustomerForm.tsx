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
import { useToast } from "../../ui/use-toast";
import { useOrganization } from "@/context/OrganizationContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const formSchema = z.object({
  email: z.string().email(),
  name: z.string().nonempty(),
  deskNumber: z.number(),
  queueId: z.string().nonempty(),
  createdDate: z.string().nonempty(),
  status: z.string().nonempty(),
  organization: z.string().nonempty(),
  description: z.string().nonempty()
});

export default function AddCustomerForm({
  dispatch,
  queueId
}: {
  dispatch: any;
  queueId: string;
}) {
  console.log("inside Addcustom f", queueId);
  const { toast } = useToast();
  const { session } = useOrganization();
  const pathname = usePathname();
  const [DeskNumberValue, setDeskNumberValue] = useState<number>(0);

  const handleDeskNumber = async (deskId: string) => {
    const response = await fetch(`/api/desks?deskId=${deskId}`);
    const data = await response.json();
    console.log("Desk Number :>> ", data.number);
    setDeskNumberValue(data?.number);
  };

  // get Desk Id
  console.log("pathname :>> ", pathname);
  var pathSegments = pathname?.split("/");
  // http://localhost:3000/dashboard/desks/66e32de598dfb0d0078621fa/queue/66e33174b2742a817dd12fcd
  pathSegments?.map((segment, index) => {
    console.log("segment :>> ", segment);
    if (segment === "desks") {
      pathSegments ? handleDeskNumber(pathSegments[index + 1]) : "";
    }
  });

  console.log("session :>> inside AddCustomerForm ", session);
  console.log("DeskNumberValue :>> ", DeskNumberValue);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      status: "waiting",
      deskNumber: DeskNumberValue,
      queueId,
      organization: session?.user?.organization?._id || "",
      description: "",
      createdDate: new Date().toISOString()
    }
  });

  // useEffect to update the form values when DeskNumberValue or queueId changes
  useEffect(() => {
    form.reset({
      ...form.getValues(), // Keep the current form values
      deskNumber: DeskNumberValue, // Update deskNumber from the state
      queueId: queueId, // Update queueId from the state.
      organization: session?.user?.organization?._id || ""
    });
  }, [DeskNumberValue, queueId, session]); // Watch for changes to these states

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const {
      name,
      deskNumber,
      queueId,
      createdDate,
      status,
      organization,
      description,
      email
    } = values;
    console.log("values :>> ", values);
    const addUser = await fetch("/api/customers", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        deskNumber,
        queueId,
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
      });
      return;
    }
    const data = await addUser.json();
    console.log("userAdded response" + data._id);
    dispatch({
      type: "ADD_USER",
      payload: { ...data, organization: session?.user?.organization?._id }
    });
    dispatch({
      type: "TOGGLE_ADD_CUSTOMER_PANEL",
      payload: false
    });
    toast({
      title: "success",
      description: "description"
    });
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>You will get notification on mail when your turn comes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deskNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desk</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled />
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
