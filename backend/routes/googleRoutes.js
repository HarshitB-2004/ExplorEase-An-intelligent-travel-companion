// backend/routes/googleRoutes.js
import express from "express";
import { geocodeAddress } from "../services/google/googleGeocode.js";
import { getPlaceDetails } from "../services/google/googleDetails.js";
import { getNearbyPlaces } from "../services/google/googleNearby.js";
import { getPhoto } from "../services/google/googlePhotos.js";

const router = express.Router();

/**
 * GET /api/google/geocode?address=...
 * Returns a single geocoded result:
 * {
 *   place_id,
 *   formatted_address,
 *   geometry: { location: { lat, lng } }
 * }
 */
router.get("/geocode", async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: "address query param is required" });
    }

    const result = await geocodeAddress(address);

    // Support both raw Google response and already-extracted first result
    const geo =
      Array.isArray(result?.results) && result.results.length
        ? result.results[0]
        : result;

    if (!geo?.geometry?.location) {
      return res.status(404).json({ error: "No geocode results found" });
    }

    res.json({
      place_id: geo.place_id,
      formatted_address: geo.formatted_address,
      geometry: geo.geometry,
    });
  } catch (err) {
    console.error("GEOCODE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/google/place-details?place_id=...
 * Returns normalized place details object:
 * name, rating, user_ratings_total, photos, reviews, geometry, etc.
 */
router.get("/place-details", async (req, res) => {
  try {
    const { place_id } = req.query;
    if (!place_id) {
      return res
        .status(400)
        .json({ error: "place_id query param is required" });
    }

    const result = await getPlaceDetails(place_id);
    const details = result?.result || result;

    res.json(details);
  } catch (err) {
    console.error("PLACE DETAILS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/google/nearby?lat=..&lng=..&radius=..&type=lodging|tourist_attraction
 * Returns an array of nearby places.
 */
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type } = req.query;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "lat and lng query params are required" });
    }

    const result = await getNearbyPlaces(lat, lng, radius, type);
    const places = Array.isArray(result)
      ? result
      : Array.isArray(result?.results)
      ? result.results
      : [];

    res.json(
      places.map((p) => ({
        name: p.name,
        rating: p.rating,
        user_ratings_total: p.user_ratings_total,
        vicinity: p.vicinity || p.formatted_address,
        place_id: p.place_id,
        geometry: p.geometry,
        photos: p.photos || [],
      }))
    );
  } catch (err) {
    console.error("NEARBY ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/google/photo?photo_reference=...&maxwidth=...
 * Redirects to the actual Google photo URL.
 */
router.get("/photo", (req, res) => {
  try {
    const { photo_reference, maxwidth = 800 } = req.query;
    if (!photo_reference) {
      return res.status(400).json({ error: "photo_reference is required" });
    }
    const url = getPhoto(photo_reference, maxwidth);
    if (!url) {
      return res.status(404).json({ error: "No photo URL generated" });
    }
    return res.redirect(url);
  } catch (err) {
    console.error("PHOTO ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
