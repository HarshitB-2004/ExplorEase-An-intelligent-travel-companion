import { useState, useEffect } from "react";
import axios from "axios";

function LatestDeals() {
  const [deals, setDeals] = useState([]);
  const [location, setLocation] = useState("Goa, India");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/deals", {
        params: { location },
      });
      setDeals(res.data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="deals mt-24 flex flex-col items-center gap-4">
      <h1 className="text-[40px] font-bold">🔥 Latest Deals</h1>
      <span className="text-[18px]">
        Handpicked hotel deals from StayAPI
      </span>

      {/* Search Bar */}
      <div className="flex gap-2 mt-6">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g. Paris)"
          className="border p-2 rounded-md w-64"
        />
        <button
          onClick={fetchDeals}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <p className="mt-10">Loading deals...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 w-[80vw]">
          {deals.map((hotel, idx) => (
            <div
              key={idx}
              className="border rounded-xl shadow-md p-4 hover:scale-105 transition-all cursor-pointer"
            >
              <img
                src={hotel.image || "/assets/images/default-hotel.jpg"}
                alt={hotel.name}
                className="w-full h-[180px] object-cover rounded-lg"
              />
              <h2 className="text-lg font-bold mt-3">{hotel.name}</h2>
              <p className="text-sm text-gray-500">{hotel.location}</p>
              <p className="text-blue-600 font-semibold mt-2">
                ₹{hotel.price} / night
              </p>
              <a
                href={hotel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Book Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestDeals;
