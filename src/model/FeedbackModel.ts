import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  customers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  queue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Queue",
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

export const Feedback =
  mongoose.models?.Feedback || mongoose.model("Feedback", FeedbackSchema);
