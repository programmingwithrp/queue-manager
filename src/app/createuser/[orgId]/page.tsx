import { ExternalAddCustomerForm } from "@/components/custom/customers/ExternalAddCustomerForm";
import React from "react";

export default function CreateUserPage({ params }: { params: { orgId: string } }) {
  console.log("OrgName" + params.orgId);
  return <ExternalAddCustomerForm orgranizationId ={params.orgId} />;
}
