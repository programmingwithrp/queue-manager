interface CustomersInterface {
  _id: string;
  name: string;
  email: string;
  organization: string;
  queue: string;
  status: string;
  deskNumber: string;
  createdDate: string;
  description: string;
  [key: string]: any;
}
interface QueueInterface {
  _id: string;
  desk: string;
  date: string;
  customers: CustomersInterface[];
}

interface DeskInterface {
  _id: string;
  organization: string;
  deskDescription: string;
  number: number;
  queues: string[];
}

interface OrgUserInterface {
  _id: string;
  username: string;
  role: string;
  organization: string;
}

interface OrganizationInterface {
  _id: string;
  name: string;
  email: string;
  organizationType: string;
  desks: DeskInterface[];
  contactInfo: string;
}

export type { DeskInterface, QueueInterface, CustomersInterface, OrgUserInterface, OrganizationInterface };
