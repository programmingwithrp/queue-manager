import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { LoopIcon } from "@radix-ui/react-icons";
import { QueueInterface } from "@/interfaces/interface";

const QueueTabsRowContent = ({
  queueRecord,
//   dispatch
}: {
    queueRecord: QueueInterface;
//   dispatch: any;
}) => {
  const handleDeleteUser = async () => {
    console.log("Delete user" + queueRecord._id);
    const payload = {
      userId: queueRecord._id
    };
    const deletedUserResponse = await fetch(`/api/customers/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const res = await deletedUserResponse.json();
    console.log("deletedUserResponse" + res.deletedCount);
    if (
      deletedUserResponse.ok &&
      deletedUserResponse.status === 200 &&
      res.deletedCount === 1
    ) {
      //dispatch({ type: "DELETE_USER", payload: queueRecord._id });
      console.log("User deleted successfully");
    }
  };

  const { _id, desk } = queueRecord;
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <LoopIcon />
      </TableCell>
      <TableCell>{desk}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
                <Link href={`/dashboard/desks/${desk}/queue/${_id}`}>
                    View Customers
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteUser}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default QueueTabsRowContent;
