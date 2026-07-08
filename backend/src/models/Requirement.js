import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    bedrooms: { type: Number, required: true, min: 1, max: 10 },
    bathrooms: { type: Number, required: true, min: 1 },
    kitchenType: { type: String, enum: ["open", "closed", "island"], default: "closed" },
    livingRoomSize: { type: String, enum: ["small", "medium", "large", "luxury"], default: "medium" },
    dining: { type: String, enum: ["separate", "connected", "open"], default: "connected" },
    garageCars: { type: Number, default: 0 },
    floors: { type: String, enum: ["ground", "ground+1", "ground+2"], default: "ground" },
    extras: {
      prayerRoom: { type: Boolean, default: false },
      studyRoom: { type: Boolean, default: false },
      store: { type: Boolean, default: false },
      balcony: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
    },
    priorities: [{ type: String }], // e.g. ["naturalLight", "privacy", "largeLivingRoom"]
  },
  { timestamps: true }
);

export default mongoose.model("Requirement", requirementSchema);