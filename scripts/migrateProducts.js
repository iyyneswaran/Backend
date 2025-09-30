// scripts/migrateProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js"; // adjust path if needed

// load .env file
dotenv.config();

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing. Check your .env file.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const prods = await Product.find({});
  for (const p of prods) {
    if (!p.sizes || p.sizes.length === 0) {
      p.sizes = [{ label: "Default", price: p.price || 0, dimension: "" }];
      await p.save();
    }
  }
  console.log("✅ migration done");
  process.exit(0);
};

run();
