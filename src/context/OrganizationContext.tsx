"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";

interface OrganizationContextType {
  session: any;
  breadcrumb: any;
  setBreadcrumb: any;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({
  children,
  session
}: {
  children: ReactNode;
  session: any;
}) => {
  const [breadcrumb, setBreadcrumb] = useState([]);
  return (
    <OrganizationContext.Provider value={{ session, breadcrumb, setBreadcrumb }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};

export { OrganizationContext };
