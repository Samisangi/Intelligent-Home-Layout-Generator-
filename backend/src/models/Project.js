import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["draft", "generated", "finalized"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);