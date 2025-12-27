// src/components/HotelCard.jsx
import React, { useEffect, useState } from "react";

const currencySymbol = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ"
};

const HotelCard = ({ hotel, currency = "INR" }) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Try multiple queries to get unique images
        const queries = [
          `${hotel.name} hotel ${hotel.city || ''}`,
          `${hotel.name} hotel exterior`,
          `${hotel.name} ${hotel.city || ''}`,
          `hotel ${hotel.city || ''} luxury`
        ];

        for (const query of queries) {
          try {
            const res = await fetch(
              `http://localhost:5000/api/pexels?query=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            if (data.photo) {
              setImage(data.photo);
              setLoading(false);
              return;
            }
          } catch (err) {
            continue;
          }
        }

        // Final fallback
        setImage("https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setImage("https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg");
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [hotel.name, hotel.city]);

  const formattedPrice = hotel.price
    ? `${currencySymbol[currency] || ""}${Number(hotel.price).toLocaleString("en-IN")}`
    : "Price not available";

  const address = hotel.address || "Address not available";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all flex gap-4 overflow-hidden group">
      <div className="relative w-40 h-40 flex-shrink-0">
        {loading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-l-xl flex items-center justify-center">
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        )}
        <img
          src={image}
          alt={hotel.name}
          className={`w-full h-full object-cover rounded-l-xl group-hover:scale-105 transition-transform ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{address}</p>
          {hotel.rating && (
            <p className="text-xs inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded mt-2">
              ⭐ {hotel.rating}
            </p>
          )}
          {hotel.booking_sources && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Available on:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {hotel.booking_sources.map((source, idx) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-blue-700 font-semibold text-base">
            {formattedPrice} <span className="text-xs text-gray-400">/ night</span>
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name + " hotel booking")}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
          >
            Compare Prices
          </a>
        </div>
      </div>
    </div>
  );
};

export default