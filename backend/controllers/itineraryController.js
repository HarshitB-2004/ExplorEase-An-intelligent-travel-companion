import { buildItineraryWithGemini } from "../services/itineraryAI.js";
import { getWeatherForecast } from "../services/weather.js";
import { getPlaceImage } from "../services/placeImages.js";

export async function generateItinerary(req, res) {
  try {
    const prefs = req.body;

    console.log("Generating itinerary for:", prefs.destinationName);

    // Weather fetch
    const weather = await getWeatherForecast(
      prefs.destinationName,
      prefs.startDate,
      prefs.endDate
    );

    // AI text generation ONLY
    const itinerary = await buildItineraryWithGemini({
      prefs,
      weather,
    });

    // Inject Google images per activity
    for (const day of itinerary.days) {
      for (const item of day.plan) {
        const image = await getPlaceImage(
          item.title,
          prefs.destinationName
        );

        item.image = image;
      }
    }

    return res.json({
      success: true,
      itinerary,
      weather,
    });

  } catch (err) {
    console.error("Itinerary ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Itinerary generation failed",
    });
  }
}
