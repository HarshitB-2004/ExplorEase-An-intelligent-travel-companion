import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";

const TravelPreferences = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripData = location.state?.tripData || {};
  
  const [tripType, setTripType] = useState("");
  const [interests, setInterests] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const allInterests = [
    "Museums & Culture",
    "Food & Dining",
    "Nature & Outdoors",
    "Adventure Sports",
    "Shopping",
    "Nightlife",
    "Photography",
    "Architecture",
    "Local Markets",
    "Historical Sites",
    "Art Galleries",
    "Music & Entertainment",
  ];

  const handleInterestClick = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((item) => item !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleBack = () => {
    navigate("/ai-planner");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const completeData = {
  ...tripData,
  destination: tripData.destinationName,     // FIXED ✔
  startDate: tripData.dates?.start,          // FIXED ✔
  endDate: tripData.dates?.end,              // FIXED ✔
  currency: "INR",                           // Currency FIXED ✔
  tripType,
  interests,
};


  console.log("Sending to backend:", completeData);

  try {
    const res = await fetch("http://localhost:5000/api/itinerary", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(completeData),
});


    const data = await res.json();
    console.log("BACKEND RESPONSE:", data);

    if (!data.itinerary) {
      alert("AI itinerary failed. Check backend logs.");
      return;
    }

    // ✅ Navigate with complete AI itinerary data
    navigate("/itinerary-result", {
      state: {
        itinerary: data.itinerary,
        hotels: data.hotels,
        flights: data.flights,
        destinationImages: data.destinationImages,
      },
    });

  } catch (err) {
    console.error("Itinerary generation failed:", err);
    alert("Failed to generate itinerary. Check console.");
  }
};


  return (
    <div className={`flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}>
      
      
      
      <div className="text-center mt-10">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          AI Trip Planner
        </h1>
        <p className="text-gray-600 mt-2">
          Let our AI create the perfect itinerary for your next adventure
        </p>

        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold">
              ✓
            </div>
            <div className="w-12 h-1 bg-indigo-400"></div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
              2
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">
              3
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl mt-10 transition-all duration-700 hover:shadow-2xl"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span role="img" aria-label="star">
            ⭐
          </span>
          Travel Preferences
        </h2>

        <div className="mb-6">
          <label className="block font-medium mb-2">
            What type of trip is this?
          </label>
          <select
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          >
            <option value="">Select trip type</option>
            <option value="Leisure">Leisure</option>
            <option value="Business">Business</option>
            <option value="Adventure">Adventure</option>
            <option value="Romantic">Romantic</option>
            <option value="Family">Family</option>
          </select>
        </div>

        <div className="mb-8">
          <label className="block font-medium mb-4">
            What are you interested in? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {allInterests.map((interest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleInterestClick(interest)}
                className={`border rounded-full py-2 px-4 transition-all duration-300 ${
                  interests.includes(interest)
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md transform transition hover:scale-105 hover:shadow-lg active:scale-95"
          >
            ✨ Generate AI Itinerary
          </button>
        </div>
      </form>

    
    </div>
  );
};

export default TravelPreferences;