import { NextApiRequest, NextApiResponse } from "next";
import { Queue } from "@/model/QueueModel";
import { Desk } from "@/model/DeskModel";

import connectToDatabase from "@/lib/databaseConnection";
import { CustomersInterface } from "@/interfaces/interface";

async function resetCompletedCustomers(req: NextApiRequest, res: NextApiResponse) {
  const { queueId } = req.body;
  console.log("Resetting completed customers with queueId: ", queueId);
  // remove completed customers from the queue
  const existingQueue = await Queue.findById(queueId).populate("customers");
  if (!existingQueue) {
    res.status(400).json({ error: "Queue does not exist" });
    return;
  }

  existingQueue.customers = existingQueue.customers.filter(
    (customer: CustomersInterface) => customer.status !== "completed"
  );
  await existingQueue.save();

  // fetch smallest token from the customers in the queue and set it as next token
  const nextToken = existingQueue.customers.reduce(
    (minToken: number, customer: CustomersInterface) =>
      customer.tokenNumber < minToken ? customer.tokenNumber : minToken,
    Infinity
  );
  console.log("Next token: ", nextToken);
  existingQueue.nextTokenNumber = nextToken;
  await existingQueue.save();


  res.status(200).json(existingQueue);
}


async function handleCreateQueue(req: NextApiRequest, res: NextApiResponse){
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

async function handleGetNextCustomer(req: NextApiRequest, res: NextApiResponse) {
  const { nextCustomerforQueue } = req.query;
  try {
    const queue = await Queue.findById(nextCustomerforQueue).populate("customers");
    if (!queue) {
      res.status(400).json({ error: "Queue does not exist" });
      return;
    }
    var tokenNumber = queue.nextTokenNumber;
    const nextCustomer = queue.customers.find(
      (customer: CustomersInterface) => customer.tokenNumber === tokenNumber
    );
    res.status(200).json(nextCustomer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch next customer" });
  }
}

async function handleGetQueuesByDesk(req: NextApiRequest, res: NextApiResponse) {
  const { deskId } = req.query;
    try {
      const queues = await Queue.find({ desk: deskId });
      res.status(200).json(queues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch desks" });
    }
}

async function handleGetQueuesById(req: NextApiRequest, res: NextApiResponse) {
  const { queueId } = req.query;
    try {
      const queues = await Queue.findById(queueId);
      res.status(200).json(queues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch desks" });
    }
}

const handlerGetAPIMap: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  deskId: handleGetQueuesByDesk,
  queueId: handleGetQueuesById,
  nextCustomerforQueue: handleGetNextCustomer
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    for (const key of Object.keys(req.query)) {
      if (handlerGetAPIMap[key]) {
        return handlerGetAPIMap[key](req, res); // Handle the request using the mapped function
      }
    }
    // No matching query parameter found
    return res
      .status(400)
      .json({ error: "Invalid request, unsupported query parameter" });
    
  }

  // Create Queue
  if (req.method === "POST") {
    const action = req.query.action;
    if (action === "create") {
      return handleCreateQueue(req, res);
    }

    // Check if the path is `/queue/reset`
    if (action === "reset") {
      return resetCompletedCustomers(req, res);
    }
    // No matching query parameter found
    return res
      .status(400)
      .json({ error: "Invalid request, unsupported query parameter" });
    
  }
}
