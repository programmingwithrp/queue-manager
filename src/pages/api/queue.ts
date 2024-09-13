import { NextApiRequest, NextApiResponse } from "next";
import { Queue } from "@/model/QueueModel";
import { Desk } from "@/model/DeskModel";

import connectToDatabase from "@/lib/databaseConnection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    // Queue from Desk
    const { deskId } = req.query;
    try {
      const queues = await Queue.find({ desk: deskId });
      res.status(200).json(queues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch desks" });
    }
  }

  // Create Queue
  if (req.method === "POST") {
    const { deskId } = req.body;
    try {
      const desk = await Desk.findById(deskId);
      if (!desk) {
        res.status(400).json({ error: "Desk does not exist" });
        return;
      }
      const newQueue = new Queue({
        desk: desk._id,
        date: new Date(),
        customers: []
      });
      await newQueue.save();

      desk.queues.push(newQueue._id);
        await desk.save();
      res.status(201).json(newQueue);
    } catch (error) {
      res.status(500).json({ error: "Failed to create queue" });
    }
  }
}
