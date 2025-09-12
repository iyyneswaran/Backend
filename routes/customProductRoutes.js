// backend/routes/customProductRoutes.js
import express from "express";
import CustomProduct from "../models/CustomProduct.js";

const router = express.Router();

// Create custom product request
router.post("/", async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      contact: req.body.contact,
      size: req.body.size || "",
      quantity: req.body.quantity || "",
      details: req.body.details || ""
    };

    const cp = new CustomProduct(payload);
    await cp.save();
    res.status(201).json(cp);
  } catch (err) {
    console.error("POST /api/custom-products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all custom product requests
router.get("/", async (req, res) => {
  try {
    const list = await CustomProduct.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("GET /api/custom-products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete custom request by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await CustomProduct.findByIdAndDelete(id);
    res.json({ message: "Custom product request deleted", id });
  } catch (err) {
    console.error("DELETE /api/custom-products/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
