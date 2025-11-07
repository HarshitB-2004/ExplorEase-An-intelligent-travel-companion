// backend/routes/aiRoutes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

// POST /api/ai/itinerary
router.post("/itinerary", async (req, res) => {
  try {
    const { tripName, destination, startDate, endDate, budget, travellers, tripType, interests } =
      req.body;

    const prompt = `
    You are a professional travel planner AI. Generate a personalized travel itinerary for:
    - Trip Name: ${tripName}
    - Destination: ${destination}
    - Duration: ${startDate} to ${endDate}
    - Budget: $${budget}
    - Number of Travellers: ${travellers}
    - Trip Type: ${tripType}
    - Interests: ${interests.join(", ")}

    Include:
    - A short trip overview.
    - Day-wise plan (Day 1 to Day 5).
    - Key attractions, dining, and travel tips.
    - End with a short summary.
    Keep it concise and readable.
    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No itinerary generated. Try again.";

    res.json({ itinerary: text });
  } catch (error) {
  console.error("Gemini API Error:", error.response?.data || error.message);
  res.status(500).json({
    error: "Failed to generate itinerary.",
    details: error.response?.data || error.message,
  });
}
});

export default router;
