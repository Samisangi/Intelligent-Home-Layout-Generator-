import mongoose from "mongoose";

const plotSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    shape: {
      type: String,
      enum: ["rectangle", "square"], // L-shape/corner/custom deferred to v2
      default: "rectangle",
    },
    width: { type: Number, required: true },   // ft
    depth: { type: Number, required: true },   // ft
    roadFacing: {
      type: String,
      enum: ["north", "south", "east", "west", "corner", "dual"],
      required: true,
    },
    setback: {
      front: { type: Number, default: 5 },
      back: { type: Number, default: 3 },
      left: { type: Number, default: 3 },
      right: { type: Number, default: 3 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plot", plotSchema);