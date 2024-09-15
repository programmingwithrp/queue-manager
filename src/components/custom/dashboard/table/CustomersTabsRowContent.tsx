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
import { PersonIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import EditForm from "../../editform/Editform";
import { useToast } from "../../../ui/use-toast";
import { CustomersInterface } from "@/interfaces/interface";

const CustomersTabsRowContent = ({
  userRecord,
  dispatch,
  orgId
}: {
  userRecord: CustomersInterface;
  dispatch: any;
  orgId: string;
}) => {
  const { toast } = useToast();
  const { name, status, queue, deskNumber, createdDate, description, tokenNumber,userId } = userRecord;
  const labels = ["name", "queue", "deskNumber", "description"]; // Labels for each input
  const userEntries = [name, queue, deskNumber, description];
  const [editUserRecord, setEditUserRecord] = useState<CustomersInterface>(userRecord);
  const userStatus = ["inProgress", "completed", "cancelled"];
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleDeleteUser = async () => {
    console.log("Delete user" + userRecord.organization);
    console.log("Delete user" + userRecord._id);
    const payload = {
      userId: userRecord._id
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
      dispatch({ type: "DELETE_USER", payload: userRecord._id });
      console.log("User deleted successfully");
    }
  };
  const changeUserStatus = async (status: string) => {
    const payload = userRecord;
    payload.status = status;
    console.log("payload dataa" + payload);
    const updatedUserResponse = await fetch(`/api/customers/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (updatedUserResponse.ok) {
      dispatch({ type: "UPDATE_USER_STATUS", payload: payload });
      toast({
        title: "Success",
        description: "User updated successfully",
        
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Failed to update user : " + updatedUserResponse.statusText,

      });
    }
  };
  const handleSaveCustomers = async () => {
    const updatedPayload = editUserRecord;
    console.log("updatedPayload" + updatedPayload);

    const updatedUserResponse = await fetch(`/api/customers/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPayload)
    });
    console.log("updatedUserResponse" + updatedUserResponse.status);

    if (updatedUserResponse.ok && updatedUserResponse.status === 200) {
      dispatch({ type: "UPDATE_USER_STATUS", payload: updatedPayload });
      toast({
        title: "Success",
        description: "User updated successfully"
      });
    } else {
      setEditUserRecord(userRecord);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Failed to update user : " + updatedUserResponse.statusText
      });
    }
    setIsEditFormOpen(false);
  };
  const handleEditUser = async () => {
    setIsEditFormOpen(!isEditFormOpen);
  };

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <PersonIcon />
      </TableCell>
      <TableCell className="font-medium">{tokenNumber}</TableCell>
      <TableCell className="font-medium">{userId}</TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        <Badge variant="outline">{status}</Badge>
      </TableCell>
      <TableCell>{deskNumber}</TableCell>
      <TableCell className="hidden md:table-cell">{queue}</TableCell>
      <TableCell className="hidden md:table-cell">{description}</TableCell>
      <TableCell className="hidden md:table-cell">{createdDate.split("T")[0]}</TableCell>
      <TableCell className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDeleteUser}>Delete</DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditUser}>Edit</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {userStatus.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => changeUserStatus(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
          <EditForm
            openStatus={isEditFormOpen}
            setOpenStatus={setIsEditFormOpen}
            cardTitle="Edit Customer"
            Icon={<Pencil2Icon />}
            cardDescription="Edit Customer"
            cardFormContent={
              <>
                {userEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={`entry-${index}`} className="text-right">
                      {labels[index]}
                    </label>
                    <input
                      id={`entry-${index}`}
                      value={editUserRecord[labels[index]]}
                      className="col-span-3 ml-2 border-spacing-2 border-black pl-2"
                      onChange={(e) => {
                        console.log("e :>> " + e.target.value);
                        editUserRecord[labels[index]] = e.target.value;
                        setEditUserRecord((editUserRecord) => ({ ...editUserRecord }));
                      }}
                    />
                  </div>
                ))}
              </>
            }
            onSave={handleSaveCustomers}
          />
      </TableCell>
    </TableRow>
  );
};

export default CustomersTabsRowContent;
