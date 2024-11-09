import { Button } from "@/components/ui/button";
import React from "react";
import { Separator } from "@/components/ui/separator";
const page = () => {
  return (
    <div className="m-4">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none mb-2">Flexi Queue</h4>
        <p className="text-sm text-muted-foreground">
          A Platform to manage monitor and control queues/desks
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <a href="/dashboard/desks">
          <Button variant="default" size="sm" className="gap-4">
            Desks
          </Button>
        </a>
        <Separator orientation="vertical" />
        <a href="/dashboard/users">
          <Button variant="default" size="sm" className="gap-4">
            Users
          </Button>
        </a>
        <Separator orientation="vertical" />
        <a href="/dashboard/settings">
          <Button variant="default" size="sm" className="gap-4">
            Setting
          </Button>
        </a>
      </div>
    </div>
  );
};
export default page;
