import { searchFlights } from "../services/flights.js";
import { searchHotelsAmadeus, hotelbedsImagesByDestination } from "../services/hotels.js";
import { destinationImages } from "../services/images.js";
import { buildItineraryWithGemini } from "../services/itineraryAI.js";
import { cache } from "../config/apiClients.js";
import { getWeatherForecast } from "../services/weather.js";   // ✅ FIXED

function normalize(s = "") {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function enrichHotelsWithImages(amHotels = [], hbHotels = []) {
  const byName = new Map();
  hbHotels.forEach(h => byName.set(normalize(h.name?.content || h.name), h));
  return amHotels.map(h => {
    const key = normalize(h.name);
    const match = byName.get(key);
    const img = match?.images?.[0]?.path || match?.images?.[0]?.url;
    return { ...h, image: img || null };
  });
}

export async function generateItinerary(req, res) {
  try {
    const prefs = req.body;
    const cacheKey = `it-${JSON.stringify(prefs)}`;

    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const [flights, amHotels, hbHotels, destImgs, weather] = await Promise.all([
      searchFlights({
        origin: prefs.origin,
        destination: prefs.destinationAirport || prefs.destinationCityCode,
        date: prefs.dates.start
      }),
      searchHotelsAmadeus({
        cityCode: prefs.destinationCityCode,
        checkIn: prefs.dates.start,
        checkOut: prefs.dates.end
      }),
      hotelbedsImagesByDestination({
        destinationCode: prefs.hotelbedsDestinationCode
      }),
      destinationImages(prefs.destinationName),
      getWeatherForecast(
        prefs.destinationName,
        prefs.dates.start,
        prefs.dates.end
      )
    ]);

    const hotelsWithImages = enrichHotelsWithImages(amHotels, hbHotels);

    // ✅ FIX: destImages → destImgs
    const ai = await buildItineraryWithGemini({
      prefs,
      flights,
      hotels: hotelsWithImages,
      hotelImages: hbHotels,
      destImages: destImgs,
      weather
    });

    const payload = {
      success: true,
  itinerary: ai,
  flights,
  hotels: hotelsWithImages,
  destinationImages: destImgs,
  weather,
  coordinates: ai?.coordinates || null  // 🆕 PASSING TO FRONTEND
    };

    cache.set(cacheKey, payload, 60 * 10);
    res.json(payload);

  } catch (e) {
    console.error(e?.response?.data || e);
    res.status(500).json({
      success: false,
      message: "Failed to generate itinerary",
      detail: e.message
    });
  }
}
