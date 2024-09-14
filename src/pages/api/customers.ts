import { NextApiRequest, NextApiResponse } from "next";
import { Queue } from "@/model/QueueModel";
import connectToDatabase from "@/lib/databaseConnection";
import { Customer } from "@/model/CustomerModel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    if (req.query.id || req.query.queue) {
      if (req.query.id) {
        try {
          const user = await Customer.findById(req.query.id);
          res.status(200).json(user);
        } catch (error) {
          res.status(500).json({ error: "Failed to fetch customer" });
        }
      } else if (req.query.queue) {
        console.log("req.query.queue" + req.query.queue);

        try {
          const existQueue = await Queue.findById(req.query.queue);
          if (!existQueue) {
            res.status(500).json({ error: "Queue not exist" });
            return;
          }
          const users = await Customer.find({
            queue: existQueue._id
          });
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ error: "Failed to fetch customers from queue" });
        }
      }
    } else {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  } else if (req.method === "POST") {
    const { name, email, organization, deskNumber, queueId, status, description } =
      req.body;

    const existQueue = await Queue.findById(queueId);
    if (!existQueue) {
      res.status(500).json({ error: "Queue not exist" });
      return;
    }

    try {
      const newCustomer = new Customer({
        name,
        email,
        deskNumber,
        organization,
        status,
        description,
        createdDate: new Date().toISOString(),
        queue: existQueue._id
      });
      await newCustomer.save();

      existQueue.customers.push(newCustomer._id);
      await existQueue.save();
      res.status(201).json(newCustomer);
    } catch (error) {
      res.status(500).json({ error: "Failed to create newCustomer " + error });
    }
  } else if (req.method === "PUT") {
    const { _id, name, email, status, description, queue, deskNumber } = req.body;

    try {
      const updatedCustomer = await Customer.updateOne(
        { _id },
        {
          $set: {
            name,
            email,
            status,
            description,
            queue,
            deskNumber
          }
        }
      );
      res.status(200).json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update Customer" + error });
    }
  } else if (req.method === "DELETE") {
    const { userId } = req.body;
    try {
      const deletedCustomer = await Customer.deleteOne({ _id: userId });
      res.status(200).json(deletedCustomer);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete Customer" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
