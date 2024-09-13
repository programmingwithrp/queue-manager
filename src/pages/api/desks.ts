import { NextApiRequest, NextApiResponse } from "next";
import { Organization } from "@/model/OrganizationModel";
import { Desk } from "@/model/DeskModel";

import connectToDatabase from "@/lib/databaseConnection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    // Get Organization Desks
    const { organization } = req.query;
    try {
      const desks = await Desk.find({
        organization
      });
      res.status(200).json(desks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch desks" });
    }
  }
  if (req.method === "POST") {
    const { organization, description } = req.body;
    try {
      const ExistedOrg = await Organization.findOne({
        name: organization
      });
      if (!ExistedOrg) {
        res.status(400).json({ error: "Organization does not exist" });
        return;
      }
      const desk = new Desk({
        organization: ExistedOrg._id,
        deskDescription: description,
        number: 0
      });
      await desk.save();

      ExistedOrg.desks.push(desk._id);
        await ExistedOrg.save();
      res.status(201).json(desk);
    } catch (error) {
      res.status(500).json({ error: "Failed to create desk" + error });
    }
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      await Desk.findByIdAndDelete(id);
      res.status(200).json({ message: "Desk deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete desk" });
    }
  }
}
