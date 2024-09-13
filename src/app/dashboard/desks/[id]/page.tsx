"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { QueueInterface } from "@/interfaces/interface";
import { TableHead } from "@/components/ui/table";
import { CustomTable } from "@/components/custom/dashboard/table/CustomTable";
import LoadingWheel from "@/components/ui/loader";
import QueueTabsRowContent from "@/components/custom/dashboard/table/QueueTabsRowContent";
import { useOrganization } from "@/context/OrganizationContext";
const Queue = ({ params }: { params: { id: string } }) => {
  const [Queues, setQueues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log("Queue ID" + params.id);
  console.log("queues", Queues);
  useEffect(() => {
    const fetchQueues = async () => {
      const response = await fetch(`/api/queue?deskId=${params.id}`);
      const data = await response.json();
      console.log(data);
      setQueues(data);
      setIsLoading(false);
    };
    setIsLoading(true);
    fetchQueues();
  }, []);
  console.log("Desk ID" + params.id);
  const { breadcrumb, setBreadcrumb } = useOrganization();

  // useEffect(() => {
  //   setBreadcrumb([...breadcrumb, { link: `/dashboard/desks/${params.id}`, name: params.id }]);
  //   return () => {
  //     setBreadcrumb(breadcrumb.filter((item: any) => item.name !== params.id));
  //   };
  // }, []);
  return (
    <div>
      {!isLoading ? (
        <CustomTable
          headerColumns={
            <>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Desk Number</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </>
          }
        >
          {Queues && Queues.map((queue: QueueInterface) => (
            <>
              <QueueTabsRowContent
                key={queue._id}
                queueRecord={queue}
                // dispatch={dispatch}
              />
            </>
          ))}
        </CustomTable>
      ) : (
        <LoadingWheel />
      )}
    </div>
  );
};

export default Queue;
