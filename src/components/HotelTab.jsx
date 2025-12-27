// src/components/HotelTab.jsx
import React, { useState } from "react";
import axios from "axios";
import HotelCard from "./HotelCard";
import HotelMap from "./HotelMap";

const HotelTab = () => {
  const [form, setForm] = useState({
    city: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    currency: "INR"
  });
  const [suggestions, setSuggestions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // city autocomplete (same logic as flights)
  const fetchCitySuggestions = async (val) => {
    setForm((prev) => ({ ...prev, city: val }));
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/flights/locations", {
        params: { keyword: val }
      });
      setSuggestions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCity = (cityObj) => {
    setForm((prev) => ({ ...prev, city: cityObj.name }));
    setSuggestions([]);
    // store coords for weather
    setCoords({ lat: cityObj.lat, lon: cityObj.lon });
  };

  const fetchWeather = async (cityName) => {
  try {
    const res = await axios.get("http://localhost:5000/api/hotels/weather", {
      params: { city: cityName },
    });
    // Visual Crossing returns { address, days: [...] }
    setWeather(res.data);
  } catch (err) {
    console.error("Visual Crossing weather fetch failed", err);
  }
};



  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHotels([]);
    try {
      const res = await axios.get("http://localhost:5000/api/hotels/search", {
        params: {
          city: form.city,
          checkInDate: form.checkInDate,
          checkOutDate: form.checkOutDate,
          adults: form.adults,
          currency: form.currency
        }
      });

      setHotels(res.data.hotels || []);
      if (res.data.coords?.lat && res.data.coords?.lon) {
        setCoords(res.data.coords);
        fetchWeather(form.city);

      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-[80vh] rounded-2xl">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-md p-4 flex flex-wrap gap-4 items-end mb-6"
      >
        <div className="relative flex-1 min-w-[180px]">
          <label className="text-sm font-semibold text-gray-700">Destination / City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => fetchCitySuggestions(e.target.value)}
            placeholder="Type city name (Paris, Delhi, Dubai...)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-200 w-full z-50 rounded-md mt-1 max-h-52 overflow-auto">
              {suggestions.map((c, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectCity(c)}
                  className="p-2 text-sm hover:bg-blue-50 cursor-pointer"
                >
                  {c.name} ({c.iataCode}) – {c.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Check-in</label>
          <input
            type="date"
            name="checkInDate"
            value={form.checkInDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="border border-gray-200 rounded-lg px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">Check-out</label>
          <input
            type="date"
            name="checkOutDate"
            value={form.checkOutDate}
            onChange={handleChange}
            min={form.checkInDate || new Date().toISOString().split("T")[0]}
            className="border border-gray-200 rounded-lg px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">Guests</label>
          <input
            type="number"
            name="adults"
            min="1"
            value={form.adults}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 mt-1 w-24"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 mt-1"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          {loading ? "Searching..." : "Search Hotels"}
        </button>
      </form>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: hotel list */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading hotels...</p>
          ) : hotels.length > 0 ? (
            hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} currency={form.currency} />)
          ) : (
            <p className="text-gray-400 text-center py-10">
              Search for a city to see available hotels.
            </p>
          )}
        </div>

        {/* RIGHT: map + weather */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md h-[320px] overflow-hidden">
            <HotelMap hotels={hotels} center={coords} />
          </div>
          {weather && (
  <div className="bg-white rounded-2xl shadow-md p-4">
    <h3 className="font-semibold text-gray-800 mb-2">Weather Forecast</h3>
    <p className="text-sm text-gray-500 mb-2">
      {weather.address} • Next {weather.days?.length || 0} Days
    </p>
    <div className="flex gap-3">
      {weather.days?.slice(0, 4).map((day, i) => (
        <div key={i} className="bg-blue-50 rounded-lg p-2 text-center flex-1">
          <p className="text-xs text-gray-500">
            {new Date(day.datetime).toLocaleDateString("en-IN", { weekday: "short" })}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            {Math.round(day.tempmax)}° / {Math.round(day.tempmin)}°
          </p>
          <p className="text-xs text-gray-400">{day.conditions}</p>
        </div>
      ))}
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default HotelTab;
