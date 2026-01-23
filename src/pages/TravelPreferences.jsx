import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const interestsList = [
  "Museums",
  "Food",
  "Nature",
  "Photography",
  "Shopping",
  "Nightlife",
  "Architecture",
  "Adventure",
];

const TravelPreferences = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const tripData = state.tripData;

  const [visible, setVisible] = useState(false);
  const [tripType, setTripType] = useState("");
  const [pace, setPace] = useState("Balanced");
  const [stayType, setStayType] = useState("Mid-range");
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 150);
  }, []);

  const toggleInterest = (val) => {
    setInterests(
      interests.includes(val)
        ? interests.filter(i => i !== val)
        : [...interests, val]
    );
  };

  const handleSubmit = async e => {

    e.preventDefault();
    setLoading(true);

    const payload = {
      ...tripData,
      tripType,
      travelPace: pace,
      stayType,
      interests,
    };

    const res = await fetch("http://localhost:5000/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    navigate("/itinerary-result", { state: data });
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100">

      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded-2xl shadow-xl w-[92%] max-w-2xl transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >

        <h2 className="text-xl font-bold mb-6">
          Customize Your Trip
        </h2>

        <select onChange={e => setTripType(e.target.value)} required className="input-box mb-3">
          <option value="">Trip Type</option>
          <option>Leisure</option>
          <option>Adventure</option>
          <option>Romantic</option>
          <option>Family</option>
        </select>

        <select onChange={e => setPace(e.target.value)} className="input-box mb-3">
          <option>Relaxed</option>
          <option>Balanced</option>
          <option>Fast-paced</option>
        </select>

        <select onChange={e => setStayType(e.target.value)} className="input-box mb-4">
          <option>Budget</option>
          <option>Mid-range</option>
          <option>Luxury</option>
        </select>

        <p className="font-semibold mb-2">Select Interests</p>

        <div className="grid grid-cols-2 gap-2 mb-5">

          {interestsList.map(item => (

            <button
              type="button"
              key={item}
              onClick={() => toggleInterest(item)}
              className={`border rounded-full py-2 text-sm transition ${
                interests.includes(item)
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>

      </form>

    </div>
  );
};

export default TravelPreferences;
