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

// server/src/services/itineraryAI.js

// server/services/itineraryAI.js

// server/services/itineraryAI.js

// server/services/itineraryAI.js

import axios from "axios";

export async function buildItineraryWithGemini({ prefs, weather }) {

  const prompt = `
Generate a professional multi-day travel itinerary.

RULES:
- Return ONLY valid JSON
- No markdown
- No comments
- No trailing commas
- Use detailed descriptions
- Hour based format

FORMAT:

{
 "destinationDescription": "3-4 line city description",
 "days":[
   {
     "date":"YYYY-MM-DD",
     "weather":"short weather text",
     "plan":[
        {
         "time":"09:00",
         "title":"Place or Activity Name",
         "description":"2-3 sentence professional description"
        }
     ]
   }
 ]
}

INPUT DATA:
Destination: ${prefs.destinationName}
Start Date: ${prefs.startDate}
End Date: ${prefs.endDate}
Travel Pace: ${prefs.travelPace}
Trip Type: ${prefs.tripType}
Weather: ${JSON.stringify(weather)}

Generate FULL itinerary for ALL days between start and end date.
`;

  try {

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ]
      }
    );

    const text =
      response.data.candidates[0].content.parts[0].text;

    const cleanJSON = text.substring(
      text.indexOf("{"),
      text.lastIndexOf("}") + 1
    );

    return JSON.parse(cleanJSON);

  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    throw new Error("Gemini itinerary generation failed");
  }
}
