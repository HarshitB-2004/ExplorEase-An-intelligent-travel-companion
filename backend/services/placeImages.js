// server/src/services/placeImages.js

import axios from "axios";

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;

// Fetch best image for a place name using Google Places API
export async function getPlaceImage(placeName, city) {
  try {
    const query = `${placeName} ${city}`;

    const searchRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query,
          key: GOOGLE_KEY,
        },
      }
    );

    const place = searchRes.data.results?.[0];

    if (!place || !place.photos || place.photos.length === 0) {
      return null;
    }

    const photoRef = place.photos[0].photo_reference;

    const photoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photo_reference=${photoRef}&key=${GOOGLE_KEY}`;

    return photoURL;
  } catch (err) {
    console.error("❌ Google Place Image Error:", placeName);
    return null;
  }
}
