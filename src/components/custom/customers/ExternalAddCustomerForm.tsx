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
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "../../ui/textarea";
import { useEffect, useState } from "react";
import { DeskInterface } from "@/interfaces/interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Link from "next/link";
import { set } from "mongoose";

const formSchema = z.object({
  name: z.string().nonempty(),
  deskNumber: z.number(),
  queueId: z.string().nonempty(),
  organization: z.string().nonempty(),
  email: z.string().email(),
  status: z.string().nonempty(),
  description: z.string().nonempty()
});

const checkTokenStatusSchema = z.object({
  userId: z.string().nonempty()
});

export function ExternalAddCustomerForm({ orgranizationId }: { orgranizationId: any }) {
  const [desks, setDesks] = useState<DeskInterface[]>([]);
  const [queue, setQueue] = useState("");
  const [deskNumber, setDeskNumber] = useState(0);
  const [formFilled, setFormFilled] = useState(false);
  const [userStatusPopup, setUserStatusPopup] = useState(false);
  const [userStatus, setUserStatus] = useState<any>({});
  const {toast} = useToast();
  useEffect(() => {
    const handleFetchDesks = () => {
      const fetchData = async () => {
        const response = await fetch("/api/desks?organization=" + orgranizationId);
        const data = await response.json();
        if (response.ok && response.status === 200) {
          console.log("desk", data);
          setDesks(data);
        }
      };
      fetchData();
    };
    handleFetchDesks();
  }, [orgranizationId]);

  const updateRequiredDetails = (queueId: string, deskNumber: number) => {
    setQueue(queueId);
    setDeskNumber(deskNumber);
    console.log("queue", queueId);
    console.log("deskNumber", deskNumber);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      deskNumber: deskNumber,
      queueId: queue,
      organization: orgranizationId,
      email: "",
      status: "waiting",
      description: ""
    }
  });

  const checkTokenStatusForm = useForm<z.infer<typeof checkTokenStatusSchema>>({
    resolver: zodResolver(checkTokenStatusSchema),
    defaultValues: {
      userId: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { name, queueId, organization, email, status, description } = values;

    // filter QueueId from desks
    console.log("queueId", queueId);
    console.log("desks", desks);
    const deskNumberValue = desks.filter(
      (desk: DeskInterface) => desk.queues[0] === queueId
    )[0].number;
    const addUser = await fetch("/api/customers?queue=" + queueId, {
      method: "POST",
      body: JSON.stringify({
        name,
        deskNumber: deskNumberValue,
        queueId,
        organization,
        email,
        status,
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
        variant: "destructive",
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
      setFormFilled(true);
      setUserStatus(data);
    }
  }

  async function checkTokenStatus(values: z.infer<typeof checkTokenStatusSchema>) {
    const { userId } = values;
    const response = await fetch("/api/customers?userId=" + userId);
    const data = await response.json();
    console.log("data", data);
    if (response.ok && response.status === 200) {
      console.log("data", data);
      toast({
        variant: "destructive",
        title: "Success",
        description: "User status fetched successfully. Information will be displayed for 10 seconds"
      });
      setUserStatusPopup(true);
      setUserStatus(data);
      setTimeout(() => {
        setUserStatusPopup(false);
      }, 10000);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "UserId is invalid"
      });
    }
  }

  return (
    <div className="grid h-screen place-items-center">
      {userStatusPopup ? (
        <Card className="w-4/5">
          <CardHeader>
            <CardTitle>User Status</CardTitle>
            <CardDescription>User added successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <span className="font-bold">Waiting Time</span>
                  <span>{userStatus.waitingTime} Minutes</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Current Queue Number</span>
                  <span>{userStatus.currentTokenNumber}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Your Number</span>
                <span>{userStatus.yourTokenNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="w-4/5 m-3">
        <>
          <CardHeader>
            <CardTitle>Check Status</CardTitle>
            <CardDescription>User added successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...checkTokenStatusForm}>
              <form
                onSubmit={checkTokenStatusForm.handleSubmit(checkTokenStatus)}
                className="space-y-8"
              >
                <FormField
                  control={checkTokenStatusForm.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UserId</FormLabel>
                      <FormControl>
                        <Input placeholder="UserId" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display UserId.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Check</Button>
              </form>
            </Form>
          </CardContent>
        </>
      </Card>
      {formFilled ? (
        // Success Card popup which will be displayed after form submission
        // should be on the middle of the screen
        <Card className="w-4/5">
          <>
            <CardHeader>
              <CardTitle>Success</CardTitle>
              <CardDescription>User added successfully</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setFormFilled(false)}>Add Another User</Button>
            </CardContent>
          </>
        </Card>
      ) : (
        <Card className="w-4/5">
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Enter Your Details to get in the queue.</CardDescription>
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
                      <FormDescription>This is your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="queueId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desks</FormLabel>
                      {/* on select change call updateRequiredDetails */}
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Desks" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {desks
                            .filter((desk: DeskInterface) => desk.queues.length !== 0)
                            .map((desk: DeskInterface) => (
                              <SelectItem
                                value={desk.queues[0]}
                                key={desk._id}
                                onClick={() => {
                                  updateRequiredDetails(desk.queues[0], desk.number);
                                }}
                              >
                                {desk.deskDescription}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        You can manage email addresses in your{" "}
                        <Link href="/examples/forms">email settings</Link>.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Organization */}
                {/* <FormField
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
            /> */}
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
      )}
    </div>
  );
}
