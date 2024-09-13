import mongoose from "mongoose";
const DeskSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },
  deskDescription: {
    type: String,
    required: true
  },
  number: { type: Number, required: true },

  queues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Queue" }]
});

// Pre-save middleware to assign a desk number
DeskSchema.pre("save", async function (next) {
  console.log("Pre-save middleware to assign a desk number");
  if (!this.isNew) return next();

  try {
    const organization = await mongoose.model("Organization").findById(this.organization);

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Assign the next desk number
    this.number = organization.nextDeskNumber;

    // Increment the next desk number in the organization
    organization.nextDeskNumber += 1;
    await organization.save();

    next();
  } catch (err: any) {
    next(err);
  }
});
export const Desk = mongoose.models?.Desk || mongoose.model("Desk", DeskSchema);
