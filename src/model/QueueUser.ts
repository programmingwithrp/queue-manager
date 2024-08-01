
import mongoose from "mongoose";

const QueueUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    queue: {
        type: Number,
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
    desk: {
        type: Number,
        required: true
    }
    });

export const QueueUser = mongoose.models.QueueUser || mongoose.model("QueueUser", QueueUserSchema);