// user
export default interface Usermodel {
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
