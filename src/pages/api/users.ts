import { NextApiRequest, NextApiResponse } from "next";
import { QueueUser } from "@/model/QueueUser";
import connectToDatabase from "@/lib/mongodb";
import { Organization } from "@/model/Organization";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("URI@@" + process.env.MONGODB_URI);
  await connectToDatabase();

  if (req.method === "GET") {
    console.log('req.query.organization'  + req.query.organization);
    try {
      const existOrg = await Organization.findOne({
        name: req.query.organization
      });
      if (!existOrg) {
        res.status(500).json({ error: "Organization not exist" });
        return;
      }
      const users = await QueueUser.find({
        organization: existOrg._id
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users from organizations" });
    }
  } else if (req.method === "POST") {
    const { name,desk, queue, organization, status, description, createdDate } = req.body;

    // find Org exist or not
    const orgExist = await Organization.findOne({
      name: organization
    });
    if (!orgExist) {
      res.status(500).json({ error: "Organization not exist" });
      return;
    }

    try {
      const newQueueUser = new QueueUser({
        name,
        queue,
        desk,
        organization: orgExist._id,
        status,
        description,
        createdDate
      });
      await newQueueUser.save();
      
      res.status(201).json(newQueueUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create newQueueUser " + error });
    }
  } else if (req.method === "PUT") {
    const { _id, name, desk, queue, status, description } = req.body;
    try {
      const updatedQueueUser = await QueueUser.updateOne(
        { _id },
        { $set: { name, desk, queue, status, description } }
      );
      res.status(200).json(updatedQueueUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update QueueUser"  + error });
    }
  } else if (req.method === "DELETE") {
    const { userId } = req.body;
    try {
      const deletedQueueUser = await QueueUser.deleteOne({  _id: userId });
      res.status(200).json(deletedQueueUser);
    }
    catch (error) {
      res.status(500).json({ error: "Failed to delete QueueUser" });
    }
  }
   else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
