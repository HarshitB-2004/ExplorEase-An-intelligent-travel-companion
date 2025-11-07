import express from "express";
import amadeus from "../amadeusClient.js"; // your initialized Amadeus instance

const router = express.Router();

router.get("/search", async (req, res) => {
  const { cityCode, checkInDate, checkOutDate, adults } = req.query;

  try {
    const response = await amadeus.shopping.hotelOffersSearch.get({
      cityCode, // e.g. "PAR"
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity: 1,
      currency: "INR",
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
