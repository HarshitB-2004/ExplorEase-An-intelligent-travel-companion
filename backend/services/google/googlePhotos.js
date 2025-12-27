export function getPhoto(photo_reference, maxwidth = 800) {
  if (!photo_reference) return null;

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photo_reference}&key=${process.env.GOOGLE_API_KEY}`;
}
