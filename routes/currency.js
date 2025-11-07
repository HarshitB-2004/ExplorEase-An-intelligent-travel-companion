import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// GET /api/currency?base=USD&target=INR&amount=100
router.get("/", async (req, res) => {
  const { base = "USD", target = "INR", amount = 1 } = req.query;

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${base}`);
    const rate = response.data.conversion_rates[target];
    const convertedAmount = amount * rate;

    res.json({
      base,
      target,
      rate,
      amount,
      convertedAmount: convertedAmount.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversion rate", error });
  }
});

export default router;
