// server/src/routes/itinerary.js
import express from "express";
import { searchFlights } from "../services/flights.js";
import { searchHotelsAmadeus, hotelbedsImagesByDestination } from "../services/hotels.js";
import { destinationImages, imageForQuery } from "../services/images.js";
import { getWeatherForecast } from "../services/weather.js";
import { buildItineraryWithGemini } from "../services/itineraryAI.js";

const router = express.Router();

/**
 * POST /api/itinerary
 * body: { origin, destination, startDate, endDate, prefs }
 */
router.post("/", async (req, res) => {
  const { origin, destination, startDate, endDate, prefs } = req.body;
  if (!destination || !startDate || !endDate) return res.status(400).json({ error: "destination,startDate,endDate required" });

  try {
    // 1) Flights (sample)
    const flights = await searchFlights({ origin: origin || "DEL", destination: "JFK", date: startDate }).catch(() => []);

    // 2) Hotels (search by city code if available - placeholder)
    const hotels = await searchHotelsAmadeus({ cityCode: destination }).catch(() => []);

    // 3) Hotelbeds images (if you have destinationCode)
    const hotelImages = await hotelbedsImagesByDestination({ destinationCode: destination }).catch(() => []);

    // 4) Destination images (Pexels)
    const destImages = await destinationImages(destination).catch(() => []);

    // 5) Weather
    const weather = await getWeatherForecast(destination, startDate, endDate).catch(() => []);

    // 6) Ask Gemini to build itinerary
    let itinerary = await buildItineraryWithGemini({ prefs, flights, hotels, hotelImages, destImages, weather });

    // 7) Fill missing images for activities/hotels using our helper
    // For each day and item, try to ensure image present by calling imageForQuery
    for (const d of (itinerary.days || [])) {
      for (const it of (d.items || [])) {
        if (!it.image) {
          it.image = await imageForQuery({ activityName: it.title, hotelObj: null, destImages });
        }
      }
      // attach the day's weather from our weather data if missing
      if (!d.weather) {
        const w = weather.find(wd => wd.date === d.date);
        if (w) d.weather = w;
      }
    }

    // hotels images fallback
    if (itinerary.recommendedHotels && itinerary.recommendedHotels.length) {
      for (const h of itinerary.recommendedHotels) {
        if (!h.image) {
          const found = hotelImages.find(hb => hb.name?.toLowerCase().includes((h.name||"").toLowerCase()));
          if (found?.images?.[0]) h.image = found.images[0].url || found.images[0].path;
          if (!h.image) h.image = destImages?.[0] ?? null;
        }
      }
    }

    // 8) simple budget normalization (if AI didn't)
    if (!itinerary.estimatedBudgetINR) {
      itinerary.estimatedBudgetINR = 50000; // default/placeholder; you can compute based on flights/hotels if desired
    }

    // Done — send everything to client
    return res.json({ itinerary, flights, hotels: hotelImages || hotels, weather });
  } catch (err) {
    console.error("Itinerary route error:", err);
    return res.status(500).json({ error: "Failed to generate itinerary", details: err?.message || err });
  }
});

export default router;
