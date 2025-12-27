// backend/services/flights.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Service function to search flights using Amadeus API
 */
export const searchFlights = async (params) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      children,
      currencyCode,
      nonStop,
      travelClass,
    } = params;

    // 1. GET ACCESS TOKEN
    const tokenRes = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const token = tokenRes.data.access_token;

    // 2. SEARCH FLIGHTS
    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode,
          destinationLocationCode,
          departureDate,
          returnDate: returnDate || undefined,
          adults,
          children: children || undefined,
          currencyCode,
          nonStop,
          travelClass,
          max: 20,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Flight API Error:", error.response?.data || error.message);
    throw new Error("Flight search failed");
  }
};
