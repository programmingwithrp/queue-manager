import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrganizationUser",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  }
});

export const Notification =
  mongoose.models?.Notification || mongoose.model("Notification", NotificationSchema);