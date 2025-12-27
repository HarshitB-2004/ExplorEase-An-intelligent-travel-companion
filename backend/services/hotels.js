import { amadeusGet, hotelbedsGet } from "../config/apiClients.js";

// Basic hotel list (Amadeus)
export async function searchHotelsAmadeus({ cityCode, checkIn, checkOut }) {
  const { data } = await amadeusGet(
    "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city",
    { cityCode, radius: 20, radiusUnit: "KM", hotelSource: "ALL" }
  );
  // returns hotel IDs; you can follow with offers API if needed
  return data?.data ?? [];
}

// Hotelbeds images by hotel code (needs mapping)
export async function hotelbedsImagesByDestination({ destinationCode, from=1, to=100 }) {
  const { data } = await hotelbedsGet(`/hotel-content-api/1.0/hotels`, {
    destinationCode, fields: "code,name,images", from, to
  });
  return data?.hotels ?? [];
} 
