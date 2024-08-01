import { NextApiRequest, NextApiResponse } from "next";
import { Organization } from "@/model/Organization";
import connectToDatabase from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    const { email } = req.query;
    try {
      const organizations = await Organization?.findOne({
        email
            });
      res.status(200).json(organizations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  } else if (req.method === "POST") {
    const { name, email, password, organization } = req.body;
    try {
      const newOrganization = new Organization({ name, email, password, organization });
      await newOrganization.save();
      res.status(201).json(newOrganization);
    } catch (error) {
      res.status(500).json({ error: "Failed to create organization" });
    }
  } else if (req.method === "PUT") {
    const { name, email, password, organization } = req.body;
    try {
      const updatedOrganization = await Organization.updateOne(
        { email }, // assuming email is unique
        { $set: { name, password, organization } }
      );
      res.status(200).json(updatedOrganization);
    } catch (error) {
      res.status(500).json({ error: "Failed to update organization" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function verifyOrganization(email: string, password: string) {
  console.log(email, password);
  const organization = await Organization?.findOne({
    email,
    password
  });
  console.log("organization :>> ", organization);
  if (!organization) {
    return null;
  }
  return organization;
}
