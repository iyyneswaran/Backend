// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/users  -> admin only
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET /api/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id -> admin only (toggle isAdmin or update name)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.isAdmin !== undefined) user.isAdmin = !!req.body.isAdmin;

    await user.save();
    const safe = user.toObject();
    delete safe.password;
    res.json(safe);
  } catch (err) {
    console.error("PUT /api/users/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/:id -> admin only
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted", id: req.params.id });
  } catch (err) {
    console.error("DELETE /api/users/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
