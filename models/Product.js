// backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, default: 0 },
  description: { type: String, trim: true, default: "" },
  imageUrl: { type: String, trim: true, default: "" } // e.g. "/uploads/12345-file.png"
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
