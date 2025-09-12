// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";

import feedbackRoutes from "./routes/feedbackRoutes.js";
import customProductRoutes from "./routes/customProductRoutes.js";
import productRoutes from "./routes/productRoutes.js"; // if exists
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { verifyTransporter } from "./utils/mailer.js";

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads directory exists (if product images are used)
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// mount API routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/custom-products", customProductRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("Ecopuls backend running"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // verify mailer (non-blocking)
    await verifyTransporter();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
