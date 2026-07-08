import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },      // "bedroom2", "kitchen", etc.
    x: Number, y: Number,                          // top-left corner (ft)
    width: Number, height: Number,
  },
  { _id: false }
);

const layoutSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    variant: { type: String, enum: ["A", "B", "C"], required: true },
    rooms: [roomSchema],
    score: {
      areaUtilization: Number,
      adjacencySatisfaction: Number,
      total: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Layout", layoutSchema);