// backend/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import Product from "../models/Product.js";


const router = express.Router();

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    // filename: timestamp-originalname
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage });

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch (err) {
    console.error("GET /api/products/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE product (supports image upload + sizes)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;
    // sizes may come as JSON string from FormData
    let sizes = [];
    if (req.body.sizes) {
      try { sizes = JSON.parse(req.body.sizes); } catch (e) { sizes = []; }
    }

    let finalImageUrl = imageUrl || "";
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const product = new Product({
      name,
      price: price ? Number(price) : 0,
      description: description || "",
      imageUrl: finalImageUrl,
      sizes: Array.isArray(sizes) ? sizes : []
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("POST /api/products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE product (supports image + sizes)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;
    let sizes;
    if (req.body.sizes !== undefined) {
      try { sizes = JSON.parse(req.body.sizes); } catch (e) { sizes = undefined; }
    }

    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: "Not found" });

    // handle image replacement
    if (req.file) {
      if (prod.imageUrl && prod.imageUrl.startsWith("/uploads/")) {
        const oldName = path.basename(prod.imageUrl);
        try { await fs.unlink(path.join(process.cwd(), "uploads", oldName)); } catch (e) { /* ignore */ }
      }
      prod.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      prod.imageUrl = imageUrl;
    }

    if (name !== undefined) prod.name = name;
    if (price !== undefined) prod.price = Number(price || 0);
    if (description !== undefined) prod.description = description;
    if (sizes !== undefined && Array.isArray(sizes)) {
      prod.sizes = sizes.map(s => ({
        label: s.label || "",
        price: Number(s.price || 0),
        dimension: s.dimension || ""
      }));
    }

    await prod.save();
    res.json(prod);
  } catch (err) {
    console.error("PUT /api/products/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// DELETE product (and delete uploaded image file if present)
router.delete("/:id", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: "Not found" });

    // delete uploaded file if exists
    if (prod.imageUrl && prod.imageUrl.startsWith("/uploads/")) {
      const filename = path.basename(prod.imageUrl);
      try {
        await fs.unlink(path.join(process.cwd(), "uploads", filename));
      } catch (e) {
        // ignore if already missing
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted", id: req.params.id });
  } catch (err) {
    console.error("DELETE /api/products/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
