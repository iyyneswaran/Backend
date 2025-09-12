// backend/models/CustomProduct.js
import mongoose from "mongoose";

const customProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  size: { type: String, trim: true },
  quantity: { type: String, trim: true },
  details: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model("CustomProduct", customProductSchema);
