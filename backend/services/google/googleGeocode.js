import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json`;

  const { data } = await axios.get(url, {
    params: {
      address,
      key: process.env.GOOGLE_API_KEY
    }
  });

  return data.results?.[0] || null;
}
