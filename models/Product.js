import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  label: { type: String, trim: true, default: "" },       // e.g. "4 inch"
  price: { type: Number, default: 0 },                     // variant price
  dimension: { type: String, trim: true, default: "" }     // e.g. "8*11.5 cm"
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, default: 0 },
  description: { type: String, trim: true, default: "" },
  imageUrl: { type: String, trim: true, default: "" }, // e.g. "/uploads/12345-file.png"
  sizes: { type: [sizeSchema], default: [] }           // NEW: array of variants
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
