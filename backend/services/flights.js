import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Search flights using Amadeus API
 */
export const searchFlights = async ({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  adults = 1,
  currencyCode = "INR",
  nonStop = false,
  travelClass = "ECONOMY"
}) => {

  try {

    // ---------------- VALIDATION ----------------

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      console.error("❌ Flight search missing params:", {
        originLocationCode,
        destinationLocationCode,
        departureDate
      });

      return { data: [] }; // prevent crash
    }

    console.log("✈ Searching Flights:", {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults
    });

    // ---------------- TOKEN ----------------

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

    // ---------------- FLIGHT SEARCH ----------------

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode,
          destinationLocationCode,
          departureDate,
          adults,
          currencyCode,
          nonStop,
          travelClass,
          max: 20
        },
      }
    );

    console.log("✅ Flights Found:", response.data?.data?.length || 0);

    // IMPORTANT: Return only the useful part
    return {
      data: response.data?.data || []
    };

  } catch (error) {

    console.error(
      "❌ Flight API Error:",
      error.response?.data || error.message
    );

    // Return empty array instead of crashing
    return { data: [] };
  }
};
