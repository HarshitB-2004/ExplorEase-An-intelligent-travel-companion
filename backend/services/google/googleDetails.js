import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getPlaceDetails(place_id) {
  if (!place_id) throw new Error("Place ID required");

  const url = `https://maps.googleapis.com/maps/api/place/details/json`;

  const { data } = await axios.get(url, {
    params: {
      place_id,
      key: process.env.GOOGLE_API_KEY,
      fields: [
        "name",
        "formatted_address",
        "geometry",
        "rating",
        "user_ratings_total",
        "reviews",
        "photos",
        "opening_hours",
        "formatted_phone_number",
        "website"
      ].join(","),
    },
  });

  return data.result || {};
}
