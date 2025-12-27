// routes/tripRoutes.js
import express from "express";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// 🔹 Save a new itinerary
router.post("/", async (req, res) => {
  try {
    const { userId, itinerary } = req.body;
    if (!userId || !itinerary) {
      return res.status(400).json({ error: "Missing userId or itinerary" });
    }

    const newItem = new Itinerary({ userId, itinerary });
    await newItem.save();
    res.json({ message: "Itinerary saved" });
  } catch (error) {
    console.error("Error saving itinerary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Get user’s saved itineraries
router.get("/:userId", async (req, res) => {
  try {
    const data = await Itinerary.find({ userId: req.params.userId });
    res.json(data);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE itinerary
router.delete("/:id", async (req, res) => {
  try {
    await Itinerary.findByIdAndDelete(req.params.id);
    res.json({ message: "Itinerary deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
});


export default router;
