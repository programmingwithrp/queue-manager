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
import { DeskInterface } from "@/interfaces/interface";

const DesksTabsRowContent = ({
  deskRecord,
  handleDeleteUser,
  handleCreateQueue,
}: {
  deskRecord: DeskInterface;
  handleDeleteUser?: () => void;
  handleCreateQueue?: () => void;
}) => {


  const { number, deskDescription } = deskRecord;
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <DesktopIcon />
      </TableCell>
      <TableCell className="font-medium">{deskDescription}</TableCell>
      <TableCell>{number}</TableCell>
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
              <Link href={`/dashboard/desks/${deskRecord._id}`}>View Queue</Link>
            </DropdownMenuItem>
            {handleCreateQueue ? <DropdownMenuItem onClick={handleCreateQueue}>Create Queue</DropdownMenuItem>: null}
            {handleDeleteUser ? <DropdownMenuItem onClick={handleDeleteUser}>Delete</DropdownMenuItem>: null}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default DesksTabsRowContent;
