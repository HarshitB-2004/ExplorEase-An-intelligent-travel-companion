import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/* ===================== 🧭 1. FLIGHT SEARCH ===================== */
router.get("/", async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      currencyCode,
    } = req.query;

    // 🪙 Get access token
    const tokenResponse = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const token = tokenResponse.data.access_token;

    // ✈️ Get flight offers
    const flightResponse = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode,
          destinationLocationCode,
          departureDate,
          adults,
          currencyCode,
          max: 20,
        },
      }
    );

    res.json(flightResponse.data);
  } catch (error) {
    console.error("Flight search error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching flight data" });
  }
});

/* ===================== 🌆 2. CITY AUTOCOMPLETE ===================== */
router.get("/locations", async (req, res) => {
  try {
    const { keyword } = req.query;

    const tokenResponse = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const token = tokenResponse.data.access_token;

    const response = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          subType: "CITY",
          keyword,
          "page[limit]": 5,
        },
      }
    );

    const cities = response.data.data.map((c) => ({
      name: c.name,
      iataCode: c.iataCode,
      country: c.address.countryName,
      lat: c.geoCode.latitude,
      lon: c.geoCode.longitude,
    }));

    res.json(cities);
  } catch (error) {
    console.error("City autocomplete error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching city list" });
  }
});

/* ===================== ✈️ 3. AIRLINE NAMES ===================== */
router.get("/airlines", async (req, res) => {
  try {
    const { airlineCodes } = req.query;

    const tokenResponse = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const token = tokenResponse.data.access_token;

    const response = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/airlines",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { airlineCodes },
      }
    );

    res.json(response.data.data);
  } catch (error) {
    console.error("Airline name fetch error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching airline info" });
  }
});

/* ===================== 🌤 4. WEATHER FORECAST ===================== */
router.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const response = await axios.get("https://api.openweathermap.org/data/3.0/onecall", {
      params: {
        lat,
        lon,
        exclude: "minutely,hourly,alerts",
        units: "metric",
        appid: process.env.OPENWEATHER_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

/* ===================== 📸 5. DESTINATION IMAGE (PEXELS) ===================== */
router.get("/pexels", async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get("https://api.pexels.com/v1/search", {
      headers: { Authorization: process.env.PEXELS_API_KEY },
      params: { query, per_page: 1 },
    });

    const photo = response.data.photos?.[0]?.src?.landscape || null;
    res.json({ photo });
  } catch (error) {
    console.error("Pexels API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching destination image" });
  }
});

export default router;
