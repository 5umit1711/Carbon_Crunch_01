import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    fingerprint: { type: String, unique: true },
    rawEvent: Object,
    normalizedEvent: {
      client_id: String,
      metric: String,
      amount: Number,
      timestamp: Date
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
