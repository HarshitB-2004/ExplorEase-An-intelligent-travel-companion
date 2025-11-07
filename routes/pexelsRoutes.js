import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/city", async (req, res) => {
  const { query = "Tokyo" } = req.query;

  try {
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
      {
        headers: { Authorization: process.env.PEXELS_API_KEY },
      }
    );

    const image = response.data.photos?.[0]?.src?.large || null;
    res.json({ image });
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.json({
      image:
        "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=800&q=60",
    });
  }
});

export default router;
