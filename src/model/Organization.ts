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
  password: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true,
    default: "General"
  },
  desks : {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Desk"
  },
});

const DeskSchema = new mongoose.Schema({
    desk: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    deskDescription : {
        type: String,
        required: true
    },

});



export const Organization = mongoose.models?.Organization || mongoose.model("Organization", OrgSchema);
export const Desk = mongoose.models?.Desk || mongoose.model("Desk", DeskSchema);
