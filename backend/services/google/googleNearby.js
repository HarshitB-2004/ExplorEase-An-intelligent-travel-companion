import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getNearbyPlaces(lat, lng, radius = 5000, type = "tourist_attraction") {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

  const { data } = await axios.get(url, {
    params: {
      location: `${lat},${lng}`,
      radius,
      type,
      key: process.env.GOOGLE_API_KEY
    }
  });

  return data.results || [];
}
