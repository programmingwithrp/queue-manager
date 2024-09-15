import mongoose, { Schema, Document } from "mongoose";

const QueueSchema: Schema = new Schema({
  desk: { type: Schema.Types.ObjectId, ref: "Desk", required: true },
  date: { type: Date, required: true },
  customers: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
  nextTokenNumber: { type: Number, default: 1 }
});

export const Queue = mongoose.models.Queue || mongoose.model("Queue", QueueSchema);
