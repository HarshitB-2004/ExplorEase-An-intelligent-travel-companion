import express from "express";
import protect from "../middleware/authMiddleware.js";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// Save trip
router.post("/save", protect, async (req, res) => {
  const trip = await Itinerary.create({
    ...req.body,
    userId: req.userId,
  });
  res.json(trip);
});

// Get user trips
router.get("/my-trips", protect, async (req, res) => {
  const trips = await Itinerary.find({ userId: req.userId });
  res.json(trips);
});

export default router;
