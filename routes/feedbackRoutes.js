// backend/routes/feedbackRoutes.js
import express from "express";
import Feedback from "../models/Feedback.js";
import { sendFeedbackNotification } from "../utils/mailer.js";

const router = express.Router();

// Create feedback
router.post("/", async (req, res) => {
  try {
    const payload = {
      name: req.body.name || "",
      email: req.body.email || "",
      rating: req.body.rating ? Number(req.body.rating) : undefined,
      message: req.body.message || "",
      product: req.body.product || "",
      experience: req.body.experience || "",
      support: req.body.support || "",
      unresolved: req.body.unresolved || "",
      subscribe: !!req.body.subscribe
    };

    const feedback = new Feedback(payload);
    const saved = await feedback.save();

    // Send notification email (non-blocking)
    sendFeedbackNotification(saved)
      .then(() => console.log(`📩 Feedback email sent for id=${saved._id}`))
      .catch((err) =>
        console.error("❌ Failed to send feedback notification:", err)
      );

    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/feedback error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("GET /api/feedback error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete feedback by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Feedback.findByIdAndDelete(id);
    res.json({ message: "Feedback deleted", id });
  } catch (err) {
    console.error("DELETE /api/feedback/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
