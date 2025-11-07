// backend/routes/hotelRoutes.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";

// 1. get amadeus token
const getAccessToken = async () => {
  const res = await fetch(AMADEUS_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET
    })
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Unable to get Amadeus token");
  }
  return data.access_token;
};

// GET /api/hotels/search?city=delhi&checkInDate=2025-11-06&checkOutDate=2025-11-07&adults=1&currency=INR
router.get("/search", async (req, res) => {
  const {
    city,
    cityCode, // optional – if frontend already has code
    checkInDate,
    checkOutDate,
    adults = 1,
    currency = "INR"
  } = req.query;

  if (!checkInDate || !checkOutDate) {
    return res.status(400).json({ message: "checkInDate and checkOutDate are required" });
  }

  try {
    const token = await getAccessToken();

    // STEP 1: if user typed "delhi" convert to "DEL"
    let finalCityCode = cityCode;
    let lat = null;
    let lon = null;

    if (!finalCityCode) {
      const locRes = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${encodeURIComponent(
          city
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const locData = await locRes.json();
      const first = locData.data?.[0];
      if (!first) {
        return res.status(404).json({ message: "City not found in Amadeus" });
      }
      finalCityCode = first.iataCode;
      lat = first.geoCode?.latitude;
      lon = first.geoCode?.longitude;
    }

    // STEP 2: get list of hotels in that city
    const listRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${finalCityCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const listData = await listRes.json();
    const hotelIds = listData.data?.slice(0, 15).map((h) => h.hotelId); // limit to 15 for speed

    if (!hotelIds || hotelIds.length === 0) {
      return res.status(404).json({ message: "No hotels found in this city" });
    }

    // STEP 3: get offers for those hotelIds
    const offersUrl =
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds.join(",")}` +
      `&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&currency=${currency}`;

    const offersRes = await fetch(offersUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const offersData = await offersRes.json();

    if (offersData.errors) {
      return res.status(400).json({ message: offersData.errors[0].detail });
    }

    // normalize for frontend
    const hotels = (offersData.data || []).map((item) => ({
      id: item.hotel.hotelId,
      name: item.hotel.name,
      address: item.hotel.address?.lines?.join(", "),
      latitude: item.hotel.latitude,
      longitude: item.hotel.longitude,
      rating: item.hotel.rating,
      price: item.offers?.[0]?.price?.total || null,
      currency: item.offers?.[0]?.price?.currency || currency,
      offer: item.offers?.[0] || null
    }));

    res.json({
      cityCode: finalCityCode,
      coords: { lat, lon },
      hotels
    });
  } catch (err) {
    console.error("Hotel API error:", err);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
});

// weather for that city from frontend coords
// GET /api/hotels/weather?lat=28.6139&lon=77.2090
router.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      city
    )}?unitGroup=metric&include=days&key=${process.env.VISUALCROSSING_API_KEY}&contentType=json`;

    const weatherRes = await fetch(url);
    const data = await weatherRes.json();

    if (!data.days) {
      return res.status(404).json({ message: "No weather data found" });
    }

    res.json({
      address: data.address,
      days: data.days.slice(0, 4) // only 4 days for compact view
    });
  } catch (err) {
    console.error("Visual Crossing error:", err);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
});

export default router;