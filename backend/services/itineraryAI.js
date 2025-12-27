// import axios from "axios";

// export async function buildItineraryWithGemini({ prefs, flights, hotels, hotelImages, destImages }) {
//   const prompt = {
//     role: "user",
//     content:
// `Return STRICT JSON only (no markdown). Schema:
// {
//   "summary": string,
//   "days": [
//     {"date": "YYYY-MM-DD","items":[{"time":"HH:mm","title":string,"notes":string,"image":string}]}
//   ],
//   "recommendedHotels": [
//     {"name": string, "notes": string, "image": string}
//   ],
//   "estimatedBudgetINR": number
// }

// UserPreferences: ${JSON.stringify(prefs)}
// TopFlightsSample: ${JSON.stringify(flights.slice(0,3))}
// HotelsSample: ${JSON.stringify(hotels.slice(0,6).map(h=>({name:h.name, id:h.hotelId || h.code})))}
// HotelImagesSample: ${JSON.stringify(hotelImages.slice(0,6).map(h=>({name:h.name, image:h.images?.[0]?.path || h.images?.[0]?.url})))}
// DestinationImages: ${JSON.stringify(destImages)}

// Rules:
// - Use times that are realistic and keep travel distance reasonable.
// - For each day, include 3–5 items.
// - Choose images from hotelImages (if matching by similar name) or destImages fallback.
// - Output valid JSON ONLY.`
//   };

//   const { data } = await axios.post(
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
//     { contents: [prompt] },
//     { params: { key: process.env.GEMINI_API_KEY } }
//   );

//   // Extract JSON (Gemini often wraps content)
//   const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
//   const jsonStart = text.indexOf("{");
//   const jsonEnd = text.lastIndexOf("}");
//   return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
// }


// server/src/services/itineraryAI.js
import axios from "axios";

export async function buildItineraryWithGemini({ prefs, flights, hotels, hotelImages, destImages, weather }) {
  // 🔹 LIMIT SAMPLES (to reduce request size)
  const limitedFlights = flights?.slice(0, 2) ?? [];
  const limitedHotels = hotels?.slice(0, 3) ?? [];
  const limitedImages = hotelImages?.slice(0, 3) ?? [];
  const limitedWeather = weather?.slice(0, 3) ?? [];

  const prompt = `
You are an itinerary planner. Return STRICT JSON only (no markdown). Follow this schema:
{
  "summary": string,
  "days": [
    {
      "date": "YYYY-MM-DD",
      "weather": {"conditions": string, "tempmax": number, "tempmin": number, "precipprob": number},
      "items": [{"time":"HH:mm", "title": string, "notes": string, "image": string}]
    }
  ],
  "recommendedHotels": [{"name": string, "notes": string, "image": string}],
  "estimatedBudgetINR": number
}

UserPreferences: ${JSON.stringify(prefs)}
Weather: ${JSON.stringify(limitedWeather)}
FlightsSample: ${JSON.stringify(limitedFlights)}
HotelsSample: ${JSON.stringify(limitedHotels)}
HotelImagesSample: ${JSON.stringify(limitedImages)}
DestinationImages: ${JSON.stringify(destImages ?? [])}
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const { data } = await axios.post(url, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  } catch (err) {
    console.error("Gemini API ERROR:", err.response?.data || err.message);
    throw err; // Pass to controller
  }
}
