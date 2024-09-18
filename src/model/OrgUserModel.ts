import mongoose from "mongoose";

const OrgUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "User"]
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  }
});

export const OrganizationUser =
  mongoose.models?.OrganizationUser || mongoose.model("OrganizationUser", OrgUserSchema);
