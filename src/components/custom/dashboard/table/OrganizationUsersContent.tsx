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
import { DesktopIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { OrgUserInterface } from "@/interfaces/interface";
import { useOrganization } from "@/context/OrganizationContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import EditForm from "../../editform/Editform";

const OrganizationUserTabsRowContent = ({
  organizationUserRecord,
  handleDeleteUser,
  handleCreateUser,
  updateUserOnUi
}: {
  organizationUserRecord: OrgUserInterface;
  handleDeleteUser?: () => void;
  handleCreateUser?: () => void;
  updateUserOnUi?: (updatedUser: OrgUserInterface) => void;
}) => {
  const { _id, username, role, name } = organizationUserRecord;
  const { session } = useOrganization();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editUserRecord, setEditUserRecord] = useState<OrgUserInterface>({...organizationUserRecord});
  const labels = ["username", "name", "role"]; // Labels for each input
  const userEntries = [username, name, role];

  const { toast } = useToast();
  const handleSaveCustomers = async () => {
    const updatedPayload = editUserRecord;
    console.log("updatedPayload" + updatedPayload);

    if (
      updatedPayload.username === "" ||
      updatedPayload.name === "" ||
      updatedPayload.role === "" ||
      (updatedPayload.role !== "Admin" && updatedPayload.role !== "User")
    ) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Please fill all the fields and select a valid role"
      });
      return;
    }

    const updatedUserResponse = await fetch(`/api/organizationusers/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPayload)
    });
    console.log("updatedUserResponse" + updatedUserResponse.status);

    if (updatedUserResponse.ok && updatedUserResponse.status === 200) {
      updateUserOnUi ? updateUserOnUi(editUserRecord) : null;
      toast({
        title: "Success",
        description: "User updated successfully"
      });
    } else {
      setEditUserRecord(organizationUserRecord);
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
        <DesktopIcon />
      </TableCell>
      <TableCell className="font-medium">{_id}</TableCell>
      <TableCell className="font-medium">{username}</TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{role}</TableCell>
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
            <DropdownMenuItem disabled>
              <Link href={`/dashboard/users/${organizationUserRecord._id}`}>
                View Activity (Coming Soon)
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Link href={`/dashboard/users/${organizationUserRecord._id}`}>
                Manage Access (Coming Soon)
              </Link>
            </DropdownMenuItem>
            {handleCreateUser ? (
              <DropdownMenuItem
                onClick={handleCreateUser}
                disabled={session?.user?.role !== "Admin"}
              >
                Create User
              </DropdownMenuItem>
            ) : null}
            {handleDeleteUser ? (
              <DropdownMenuItem
                onClick={handleDeleteUser}
                disabled={session?.user?.role !== "Admin"}
              >
                Delete
              </DropdownMenuItem>
            ) : null}
            {handleEditUser ? (
              <DropdownMenuItem
                onClick={handleEditUser}
                disabled={session?.user?.role !== "Admin"}
              >
                Edit
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
        <EditForm
          openStatus={isEditFormOpen}
          setOpenStatus={setIsEditFormOpen}
          cardTitle="Edit User"
          Icon={<Pencil2Icon />}
          cardDescription="Edit User"
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

export default OrganizationUserTabsRowContent;
