
import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    status : {
        type: String,
        required: true,
        default: "waiting"
    },
    description : {
        type: String,
        required: true
    },
    createdDate : {
        type: Date,
        required: true
    },

    queue: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true },
    deskNumber: { type: String, required: true }

    });

export const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);