/// backend/routes/hotelRoutes.js

import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { hotelbedsGet } from "../config/apiClients.js";

dotenv.config();

const router = express.Router();


// ================= GOOGLE PLACE IMAGE HELPER =================

async function getGoogleHotelImage(name, lat, lng) {
  try {
    const key = process.env.GOOGLE_API_KEY;
    if (!key || !name) return null;

    const query = encodeURIComponent(name + " hotel");

    const searchUrl =
      `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
      `query=${query}` +
      (lat && lng ? `&location=${lat},${lng}&radius=5000` : "") +
      `&type=lodging&key=${key}`;

    const res = await fetch(searchUrl);
    const data = await res.json();

    const first = data.results?.[0];
    if (!first?.photos?.length) return null;

    const photoRef = first.photos[0].photo_reference;

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${key}`;

  } catch (err) {
    console.log("Google image fetch failed:", err.message);
    return null;
  }
}


// ================= HOTEL SEARCH =================
// GET /api/hotels/search?city=paris&checkInDate=2026-01-22&checkOutDate=2026-01-26&adults=1

router.get("/search", async (req, res) => {
  const { city, checkInDate, checkOutDate, adults = 1 } = req.query;

  if (!city || !checkInDate || !checkOutDate) {
    return res.status(400).json({
      message: "city, checkInDate and checkOutDate are required",
    });
  }

  try {

    // ================= STEP 1 — FIND DESTINATION CODE =================

    const destRes = await hotelbedsGet(
      "/hotel-content-api/1.0/locations/destinations",
      {
        fields: "code,name",
        language: "ENG",
        from: 1,
        to: 500 // IMPORTANT — allow worldwide cities
      }
    );

    const destinations = destRes.data.destinations || [];

    const inputCity = city.trim().toLowerCase();

    const matchedCity = destinations.find(d =>
      d.name?.content?.toLowerCase().includes(inputCity)
    );

    if (!matchedCity) {
      return res.status(404).json({
        message: "City not found in Hotelbeds"
      });
    }

    const destinationCode = matchedCity.code;

    console.log("✅ Hotelbeds Destination Code:", destinationCode);


    // ================= STEP 2 — HOTEL AVAILABILITY =================

    const availabilityRes = await hotelbedsGet(
      "/hotel-api/1.0/hotels",
      {
        destination: destinationCode,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: Number(adults),
        rooms: 1,
        currency: "EUR" // Hotelbeds supports EUR reliably
      }
    );

    const hotelsRaw = availabilityRes.data.hotels?.hotels || [];

    if (!hotelsRaw.length) {
      return res.status(404).json({
        message: "No hotels available"
      });
    }

    console.log("✅ Hotels Found:", hotelsRaw.length);


    // ================= STEP 3 — NORMALIZE =================

    const EUR_TO_INR = 90; // static safe conversion

    const hotels = await Promise.all(

      hotelsRaw.slice(0, 20).map(async (hotel) => {

        const priceEUR = hotel.rooms?.[0]?.rates?.[0]?.net || null;

        const priceINR = priceEUR
          ? Math.round(parseFloat(priceEUR) * EUR_TO_INR)
          : null;

        const hotelName =
          typeof hotel.name === "string"
            ? hotel.name
            : hotel.name?.content || "Hotel";

        const lat = hotel.latitude || null;
        const lon = hotel.longitude || null;

        const image = await getGoogleHotelImage(hotelName, lat, lon);

        return {
          id: hotel.code,
          name: hotelName,
          address: hotel.address?.content || "",
          latitude: lat,
          longitude: lon,
          rating: hotel.categoryCode || null,
          price: priceINR,
          currency: "INR",
          image,
          booking_url: hotel.url || null
        };
      })

    );


    res.json({
      city,
      hotels
    });

  } catch (err) {

    console.error("Hotelbeds API error:",
      err?.response?.data || err.message
    );

    res.status(500).json({
      message: "Failed to fetch hotels"
    });
  }
});


// ================= WEATHER =================

router.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "City is required"
      });
    }

    const url =
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/` +
      `${encodeURIComponent(city)}` +
      `?unitGroup=metric&include=days&key=${process.env.VISUALCROSSING_API_KEY}&contentType=json`;

    const weatherRes = await fetch(url);
    const data = await weatherRes.json();

    res.json({
      address: data.address,
      days: data.days?.slice(0, 4) || []
    });

  } catch (err) {
    console.error("Weather error:", err.message);

    res.status(500).json({
      message: "Weather fetch failed"
    });
  }
});

export default router;
