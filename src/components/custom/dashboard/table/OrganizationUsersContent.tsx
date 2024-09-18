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
import { DesktopIcon } from "@radix-ui/react-icons";
import { DeskInterface, OrgUserInterface } from "@/interfaces/interface";
import { useOrganization } from "@/context/OrganizationContext";

const OrganizationUserTabsRowContent = ({
  organizationUserRecord,
  handleDeleteUser,
  handleCreateUser
}: {
  organizationUserRecord: OrgUserInterface;
  handleDeleteUser?: () => void;
  handleCreateUser?: () => void;
}) => {
  const { _id, username, role } = organizationUserRecord;
  const { session } = useOrganization();
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <DesktopIcon />
      </TableCell>
      <TableCell className="font-medium">{_id}</TableCell>
      <TableCell className="font-medium">{username}</TableCell>
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
              <DropdownMenuItem onClick={handleCreateUser} disabled={session?.user?.role !== "Admin"}>Create User</DropdownMenuItem>
            ) : null}
            {handleDeleteUser ? (
              <DropdownMenuItem onClick={handleDeleteUser} disabled={session?.user?.role !== "Admin"}>Delete</DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default OrganizationUserTabsRowContent;
