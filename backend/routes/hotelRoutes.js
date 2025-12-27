// backend/routes/hotelRoutes.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";

// 1. get amadeus token
const getAccessToken = async () => {
  const res = await fetch(AMADEUS_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET
    })
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Unable to get Amadeus token");
  }
  return data.access_token;
};

// GET /api/hotels/search?city=delhi&checkInDate=2025-11-06&checkOutDate=2025-11-07&adults=1&currency=INR
router.get("/search", async (req, res) => {
  const {
    city,
    cityCode,
    checkInDate,
    checkOutDate,
    adults = 1,
    currency = "INR"
  } = req.query;

  if (!checkInDate || !checkOutDate) {
    return res.status(400).json({ message: "checkInDate and checkOutDate are required" });
  }

  try {
    const token = await getAccessToken();

    // STEP 1: if user typed "delhi" convert to "DEL"
    let finalCityCode = cityCode;
    let lat = null;
    let lon = null;

    if (!finalCityCode) {
      const locRes = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${encodeURIComponent(
          city
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const locData = await locRes.json();
      const first = locData.data?.[0];
      if (!first) {
        return res.status(404).json({ message: "City not found in Amadeus" });
      }
      finalCityCode = first.iataCode;
      lat = first.geoCode?.latitude;
      lon = first.geoCode?.longitude;
    }

    // STEP 2: get list of hotels in that city
    const listRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${finalCityCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const listData = await listRes.json();
    const hotelIds = listData.data?.slice(0, 15).map((h) => h.hotelId);

    if (!hotelIds || hotelIds.length === 0) {
      return res.status(404).json({ message: "No hotels found in this city" });
    }

    // STEP 3: get offers for those hotelIds
    const offersUrl =
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds.join(",")}` +
      `&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&currency=${currency}`;

    const offersRes = await fetch(offersUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const offersData = await offersRes.json();

    if (offersData.errors) {
      return res.status(400).json({ message: offersData.errors[0].detail });
    }

    // normalize for frontend
    const hotels = (offersData.data || []).map((item) => ({
      id: item.hotel.hotelId,
      name: item.hotel.name,
      address: item.hotel.address?.lines?.join(", "),
      latitude: item.hotel.latitude,
      longitude: item.hotel.longitude,
      rating: item.hotel.rating,
      price: item.offers?.[0]?.price?.total || null,
      currency: item.offers?.[0]?.price?.currency || currency,
      offer: item.offers?.[0] || null
    }));

    res.json({
      cityCode: finalCityCode,
      coords: { lat, lon },
      hotels
    });
  } catch (err) {
    console.error("Hotel API error:", err);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
});

// weather for that city from frontend coords
// GET /api/hotels/weather?lat=28.6139&lon=77.2090
router.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      city
    )}?unitGroup=metric&include=days&key=${process.env.VISUALCROSSING_API_KEY}&contentType=json`;

    const weatherRes = await fetch(url);
    const data = await weatherRes.json();

    if (!data.days) {
      return res.status(404).json({ message: "No weather data found" });
    }

    res.json({
      address: data.address,
      days: data.days.slice(0, 4)
    });
  } catch (err) {
    console.error("Visual Crossing error:", err);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
});

// NEW: Google Hotel Data with Images and Reviews
// GET /api/hotels/google-hotel-data
router.get("/google-hotel-data", async (req, res) => {
  try {
    const { hotelName, lat, lng } = req.query;
    
    if (!hotelName) {
      return res.status(400).json({ error: 'Hotel name is required' });
    }

    const key = process.env.GOOGLE_API_KEY; // Use your existing key
    if (!key) {
      console.warn('GOOGLE_API_KEY not found in environment variables');
      return res.json({ 
        error: 'Google API not configured',
        photos: [],
        reviews: [] 
      });
    }

    console.log(`Searching Google Places for: ${hotelName}`);

    // Search for hotel
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
      `query=${encodeURIComponent(hotelName + ' hotel')}&` +
      `location=${lat},${lng}&` +
      `radius=5000&` +
      `type=lodging&` +
      `key=${key}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status === 'REQUEST_DENIED') {
      console.error('Google API request denied:', searchData.error_message);
      return res.status(500).json({ 
        error: 'Google API access denied',
        details: searchData.error_message 
      });
    }

    if (!searchData.results || searchData.results.length === 0) {
      console.log(`No Google results for: ${hotelName}`);
      return res.json({ 
        error: 'Hotel not found on Google',
        photos: [],
        reviews: [] 
      });
    }

    // Get the best match
    const bestMatch = searchData.results[0]; // Simple - just take first result
    const placeId = bestMatch.place_id;

    // Get detailed information
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&` +
      `fields=name,photos,reviews,rating,user_ratings_total,formatted_address,website,url&` +
      `key=${key}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK') {
      return res.status(500).json({ 
        error: 'Failed to fetch hotel details',
        details: detailsData.error_message 
      });
    }

    const result = detailsData.result || {};

    // Process photos
    const photos = [];
    if (result.photos && result.photos.length > 0) {
      result.photos.slice(0, 3).forEach(photo => {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?` +
          `maxwidth=800&` +
          `photoreference=${photo.photo_reference}&` +
          `key=${key}`;
        
        photos.push({
          url: photoUrl,
          reference: photo.photo_reference
        });
      });
    }

    // Process reviews
    const reviews = result.reviews ? result.reviews.slice(0, 5).map(review => ({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      time: review.time,
      profile_photo_url: review.profile_photo_url
    })) : [];

    res.json({
      place_id: placeId,
      name: result.name,
      formatted_address: result.formatted_address,
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      photos: photos,
      reviews: reviews,
      website: result.website,
      url: result.url
    });

  } catch (error) {
    console.error('Google hotel data error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Google hotel data',
      details: error.message 
    });
  }
});
// Keep existing place-details route as fallback
router.get("/place-details", async (req, res) => {
  try {
    const { name, lat, lon, place_id } = req.query;
   const key = process.env.GOOGLE_API_KEY; // Use existing key
    
    if (!key) {
      console.warn('Google API key not configured');
      return res.json({ 
        photo: null, 
        rating: null, 
        website: null, 
        place_url: null, 
        place_id: null 
      });
    }

    let placeId = place_id;
    
    // If no place_id, try to find it
    if (!placeId) {
      const q = encodeURIComponent(name + (lat && lon ? ` near ${lat},${lon}` : ""));
      const tsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&key=${key}&type=lodging`;
      const tsRes = await fetch(tsUrl);
      const tsData = await tsRes.json();
      
      if (!tsData.results || tsData.results.length === 0) {
        return res.json({ 
          photo: null, 
          rating: null, 
          website: null, 
          place_url: null, 
          place_id: null 
        });
      }
      placeId = tsData.results[0].place_id;
    }

    // Get place details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,rating,website,url,formatted_address&key=${key}`;
    const dRes = await fetch(detailsUrl);
    const dData = await dRes.json();
    const result = dData.result || {};

    // Get photo if exists
    let photo = null;
    if (result.photos && result.photos.length > 0) {
      const photoRef = result.photos[0].photo_reference;
      photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${key}`;
    }

    res.json({
      name: result.name || name,
      place_id: placeId,
      photo,
      rating: result.rating || null,
      website: result.website || null,
      place_url: result.url || null,
      address: result.formatted_address || null
    });
  } catch (err) {
    console.error("Place details error:", err);
    res.status(500).json({ message: "Failed to fetch place details" });
  }
});

export default router;