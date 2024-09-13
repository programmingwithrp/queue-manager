import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export const CustomTable = ({
  children,
  headerColumns
}: Readonly<{
  children: React.ReactNode;
  headerColumns: React.ReactNode;
}>) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>{headerColumns}</TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
};
