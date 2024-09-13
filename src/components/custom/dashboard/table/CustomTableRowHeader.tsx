import { TableRow } from "@/components/ui/table";
import React from "react";

export const CustomTableRowHeader = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <TableRow>{children}</TableRow>;
};
