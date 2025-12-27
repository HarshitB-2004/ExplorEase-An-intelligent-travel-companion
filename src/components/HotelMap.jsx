// src/components/HotelMap.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const HotelMap = ({ hotels = [], center }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        center ? [center.lat, center.lon] : [20.5937, 78.9629],
        center ? 11 : 4
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(mapInstance.current);
    } else if (center) {
      mapInstance.current.setView([center.lat, center.lon], 11);
    }
  }, [center]);

  // add markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // clear existing layers except tile
    mapInstance.current.eachLayer((layer) => {
      if (!layer._url) {
        mapInstance.current.removeLayer(layer);
      }
    });

    hotels.forEach((h) => {
      if (h.latitude && h.longitude) {
        L.marker([h.latitude, h.longitude]).addTo(mapInstance.current).bindPopup(h.name);
      }
    });
  }, [hotels]);

  return <div id="hotelMap" ref={mapRef} className="w-full h-full" />;
};

export default HotelMap;
