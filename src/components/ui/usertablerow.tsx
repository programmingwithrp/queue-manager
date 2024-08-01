import Image from "next/image";
import { MoreHorizontal, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { PersonIcon } from "@radix-ui/react-icons";
import UserModel from "@/interfaces/user";

const UserTableRow = ({ userRecord, dispatch, orgId }: { userRecord: UserModel, dispatch: any, orgId: string }) => {
  const handleDeleteUser = async () => {
    console.log("Delete user"+ userRecord.organization);
    console.log("Delete user"+ userRecord._id);
    const payload = {
      userId: userRecord._id
    };
    const deletedUserResponse = await fetch(`/api/users/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const res = await deletedUserResponse.json();
    console.log('deletedUserResponse'+ res.deletedCount);
    if (deletedUserResponse.ok && deletedUserResponse.status === 200 && res.deletedCount === 1) {
      dispatch({ type: "DELETE_USER", payload: userRecord._id });
      console.log("User deleted successfully");
    }
  };


  const changeUserStatus = async (status: string) => {
    const payload = userRecord;
    payload.status = status;
    console.log('payload dataa'+ payload);
    const updatedUserResponse = await fetch(`/api/users/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (updatedUserResponse.ok) {
      dispatch({ type: "UPDATE_USER_STATUS", payload });
      console.log("User status updated successfully");
    }
  }

  const { name, status, queue, desk, createdDate, description } = userRecord;
  const userStatus = ["inProgress", "completed", "cancelled"];
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <PersonIcon />
      </TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        <Badge variant="outline">{status}</Badge>
      </TableCell>
      <TableCell>{desk}</TableCell>
      <TableCell className="hidden md:table-cell">{queue}</TableCell>
      <TableCell className="hidden md:table-cell">{description}</TableCell>
      <TableCell className="hidden md:table-cell">{createdDate.split("T")[0]}</TableCell>
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteUser}>Delete</DropdownMenuItem>
            <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {userStatus.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => changeUserStatus(status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
