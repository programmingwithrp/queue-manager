import { NextApiRequest, NextApiResponse } from "next";
import { Queue } from "@/model/QueueModel";
import connectToDatabase from "@/lib/databaseConnection";
import { Customer } from "@/model/CustomerModel";
import { Desk } from "@/model/DeskModel";

async function updateDeskAverageTime(
  queueId: string,
  deskId: string,
  newServiceTime: number
) {
  const customers = await Customer.find({
    queue: queueId,
    status: "completed",
    endTime: { $ne: null }
  })
    .sort({ endTime: -1 })
    .limit(10);

  let totalServiceTime = 0;
  customers.forEach((customer) => {
    totalServiceTime += (customer.endTime - customer.startTime) / (1000 * 60); // Convert ms to minutes
  });
  console.log("totalServiceTime in updateDeskAverageTime" + totalServiceTime);
  console.log('newServiceTime in updateDeskAverageTime' + newServiceTime);
  // Include the new service time in the calculation
  totalServiceTime += newServiceTime;
  const averageServiceTime = totalServiceTime / (customers.length + 1);

  // Update desk with the new average service time
  await Desk.findByIdAndUpdate(deskId, { averageServiceTime });
}

async function handleGetCustomerById(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await Customer.findById(req.query.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
}

async function handleGetCustomersByQueue(req: NextApiRequest, res: NextApiResponse) {
  try {
    const existQueue = await Queue.findById(req.query.queue).populate("customers");
    if (!existQueue) {
      res.status(500).json({ error: "Queue not exist" });
      return;
    }
    res.status(200).json(existQueue.customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers from queue" });
  }
}

async function handleGetCustomerQueueStatus(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;
    if (!userId) {
      res.status(400).json({ error: "Invalid request, missing query parameter" });
      return;
    }
    const customer = await Customer.findOne
      ({ userId: userId });
    const customerTokennumber = customer.tokenNumber;

    const queue = await Queue.findById(customer.queue);
    const nextTokenNumber = queue.nextTokenNumber;

    const desk = await Desk.findById(queue.desk);
    const deskAverageTime = desk.averageServiceTime;
    console.log("deskAverageTime" + deskAverageTime);
    const waitingTime = (customerTokennumber - nextTokenNumber) * deskAverageTime;
    console.log("waitingTime" + waitingTime);
    const waitingStatus = {
      'waitingTime': waitingTime,
      'currentTokenNumber': nextTokenNumber,
      'yourTokenNumber': customerTokennumber
    }

    res.status(200).json(waitingStatus);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" + error });
  }
}

function generateNumericToken() {
  // Get current timestamp in milliseconds
  const timestamp = Date.now();  // Example: 1694783827056
  
  // Generate a random number between 1000 and 9999 (to append for uniqueness)
  const randomPart = Math.floor(1000 + Math.random() * 9000);  // Example: 4587
  
  // Combine the timestamp and random number to form the token
  const numericToken = timestamp.toString() + randomPart.toString();  // Example: '16947838270564587'
  
  // Optionally, truncate the token to a fixed length (e.g., first 12 digits)
  const truncatedToken = numericToken.slice(0, 12);  // Example: '169478382705'
  
  return truncatedToken;
}
const handlerAPIMap: {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
} = {
  id: handleGetCustomerById,
  queue: handleGetCustomersByQueue,
  userId: handleGetCustomerQueueStatus
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    for (const key of Object.keys(req.query)) {
      if (handlerAPIMap[key]) {
        return handlerAPIMap[key](req, res); // Handle the request using the mapped function
      }
    }
    // No matching query parameter found
    return res
      .status(400)
      .json({ error: "Invalid request, unsupported query parameter" });
  } else if (req.method === "POST") {
    const {
      name,
      email,
      organization,
      deskNumber,
      queueId,
      status,
      description
    } = req.body;

    const existQueue = await Queue.findById(queueId);
    if (!existQueue) {
      res.status(500).json({ error: "Queue not exist" });
      return;
    }
    var newTokenNumber = 1;
    var lastCustomer = await Customer.findOne({ queue: queueId }).sort({
      tokenNumber: -1
    });

    if (lastCustomer) {
      newTokenNumber = lastCustomer.tokenNumber + 1;
      console.log("lastCustomer.tokenNumber" + lastCustomer.tokenNumber);
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
        queue: existQueue._id,
        tokenNumber: newTokenNumber,
        userId: generateNumericToken()
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
    if (status == "inProgress") {
      // get Existing Customer
      const existingCustomer = await Customer.findById(_id);
      if (existingCustomer.status == "waiting") {
        existingCustomer.startTime = new Date().toISOString();
        await existingCustomer.save();
      }
    }
    if (status == "completed") {
      // get Existing Customer
      const existingCustomer = await Customer.findById(_id);
      if (existingCustomer.status == "inProgress") {
        existingCustomer.endTime = new Date().toISOString();

        const serviceTime =
          new Date(existingCustomer.endTime).getTime() -
          new Date(existingCustomer.startTime).getTime();
        console.log("serviceTime" + serviceTime);
          // in minutes
        existingCustomer.serviceTime = serviceTime / (1000 * 60); // Convert ms to minutes
        console.log("serviceTime in minutes" + existingCustomer.serviceTime);
        await existingCustomer.save();

        // Update average service time for the desk
        const currentQueue = await Queue.findById(existingCustomer.queue);
        const currentDesk = await Desk.findById(currentQueue.desk);
        if (currentDesk) {
          await updateDeskAverageTime(currentQueue._id, currentDesk._id, existingCustomer.serviceTime);
        }
      }

      // update queue nextTokenNumber
      const existingQueue = await Queue.findById(queue);
      if (existingQueue) {
        existingQueue.nextTokenNumber = existingQueue.nextTokenNumber + 1;
        await existingQueue.save();
      }
    }
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
      
      // remove from the queue
      const customer = await Customer.findById(userId);
      const queue = await Queue.findById(customer.queue);
      queue.customers = queue.customers.filter(
        (customerId: string) => customerId.toString() !== userId
      );
      const deletedCustomer = await Customer.deleteOne({ _id: userId });
      await queue.save();
      res.status(200).json(deletedCustomer);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete Customer" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
