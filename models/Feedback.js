// backend/models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, default: "" },
  rating: { type: Number, min: 1, max: 5 },
  message: { type: String, trim: true, default: "" },
  product: { type: String, trim: true, default: "" },
  experience: { type: String, trim: true, default: "" },
  support: { type: String, enum: ["yes", "no", ""], default: "" },
  unresolved: { type: String, trim: true, default: "" },
  subscribe: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
