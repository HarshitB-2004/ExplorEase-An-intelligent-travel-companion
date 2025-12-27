import React from "react";

/**
 * Simple map using an embedded Google map.
 * This keeps ItineraryResult light and avoids extra JS on the client.
 */
const MapView = ({ lat, lng, zoom = 13 }) => {
  if (!lat || !lng) {
    return (
      <div className="w-full h-[260px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
        Map data unavailable
      </div>
    );
  }

  const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div className="w-full h-[260px] rounded-xl overflow-hidden shadow-inner border">
      <iframe
        title="Destination Map"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapView;
