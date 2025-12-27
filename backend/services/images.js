// server/src/services/images.js
import { pexelsGet } from "../config/apiClients.js";

/**
 * Search destination images (existing)
 * query: string
 */
export async function destinationImages(query, perPage = 8) {
  const { data } = await pexelsGet("/search", { query, per_page: perPage, orientation: "landscape" });
  return (data?.photos ?? []).map(p => p.src?.landscape || p.src?.medium || null).filter(Boolean);
}

/**
 * Search single image for a specific query (use for activities)
 * returns first usable URL or null
 */
export async function searchPexels(query) {
  try {
    const { data } = await pexelsGet("/search", { query, per_page: 1, orientation: "landscape" });
    const photo = data?.photos?.[0];
    if (!photo) return null;
    return photo.src?.medium || photo.src?.landscape || null;
  } catch (err) {
    console.error("Pexels search failed for", query, err?.message || err);
    return null;
  }
}

/**
 * Best-effort image for an activity/hotel:
 * Priority: hotelbeds image (if provided) -> pexels search -> first destImage fallback
 */
export async function imageForQuery({ activityName, hotelObj, destImages = [] }) {
  // If hotelObj has images from hotelbeds, return first
  if (hotelObj?.images?.length) {
    // hotelbeds images may be objects with url/path
    const first = hotelObj.images[0];
    const url = first?.url || first?.path || first?.source;
    if (url) return url;
  }

  // Try Pexels with keywords
  const queries = [activityName, `${activityName} city`, `${activityName} landmark`, `${activityName} landscape`].filter(Boolean);
  for (const q of queries) {
    const url = await searchPexels(q);
    if (url) return url;
  }

  // Fallback to provided destination images
  if (destImages?.length) return destImages[0];

  return null;
}
