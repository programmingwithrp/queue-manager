import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationUser } from "@/model/OrgUserModel";
import { Organization } from "@/model/OrganizationModel";
import bcrypt from "bcrypt";

import connectToDatabase from "@/lib/databaseConnection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    const { organization } = req.query;
    try {
      const orgUsers = await OrganizationUser.find({
        organization
      });
      res.status(200).json(orgUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization users"+ error });
    }
  }
  if (req.method === "POST") {
    const { name, username, password, role, organization } = req.body;
    try {
      const ExistedOrg = await Organization.findOne({
        name: organization
      });
      if (!ExistedOrg) {
        res.status(400).json({ error: "Organization does not exist" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const orgUser = new OrganizationUser({
        name,
        username,
        password: hashedPassword,
        role,
        organization: ExistedOrg._id
      });
      await orgUser.save();
      res.status(201).json(orgUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create organization user" + error });
    }
  }
  if(req.method === "PUT") {
    const { _id, name, username, role } = req.body;
    try {
      const updatedUser = await OrganizationUser.updateOne(
        { _id },
        {
          name,
          username,
          role,
        }
      );
      res.status(200).json(updatedUser);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to update organization user" + error });
    }
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const deletedUser = await OrganizationUser.deleteOne({ _id: id });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete organization user" + error });
    }
  }
}

export async function verifyOrganizationUser(username: string, password: string) {
  await connectToDatabase();

  try {
    console.log(username, password);
    const orgUser = await OrganizationUser.findOne({ username }).populate("organization");
    if (!orgUser) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, orgUser.password);
    if (!isMatch) {
      return null;
    }
    console.log("organization :>> ", orgUser);
    return orgUser || null;
  } catch (error) {
    console.error("Error verifying organization user:", error);
    return null;
  }
}
