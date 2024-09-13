import mongoose from "mongoose";

const OrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  organizationType: {
    type: String,
    required: true,
    default: "General"
  },
  desks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Desk"
  },
  nextDeskNumber: { type: Number, default: 1 }
});

export const Organization =
  mongoose.models?.Organization || mongoose.model("Organization", OrgSchema);
