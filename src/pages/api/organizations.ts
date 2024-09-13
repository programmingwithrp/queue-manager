import { NextApiRequest, NextApiResponse } from "next";
import { Organization } from "@/model/OrganizationModel";

import connectToDatabase from "@/lib/databaseConnection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    // if name not in req.query then return all organizations else return organization with name
    if(!req.query.name) {
      try {
        const organizations = await Organization?.find();
        res.status(200).json(organizations);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch organizations" });
      }
      return;
    }
    console.log('req.query.name', req.query.name);
    const { name } = req.query;
    try {
      const organizations = await Organization?.findOne({
        name
      }).populate('desks').exec();
      res.status(200).json(organizations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  } else if (req.method === "POST") {
    const { name, email, contactInfo, organizationType } = req.body;
    try {
      const newOrganization = new Organization({
        name,
        email,
        contactInfo,
        organizationType
      });
      await newOrganization.save();
      res.status(201).json(newOrganization);
    } catch (error) {
      res.status(500).json({ error: "Failed to create organization "+ error });
    }
  } else if (req.method === "PUT") {
    const { name, email, contactInfo, organization } = req.body;
    try {
      const updatedOrganization = await Organization.updateOne(
        { name }, // assuming email is unique
        { $set: { name, email, contactInfo, organization } }
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
