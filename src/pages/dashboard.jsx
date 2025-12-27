// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [itineraries, setItineraries] = useState([]);
  const [newItinerary, setNewItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState({ transport: "", stay: "", food: "" });


  // 🔹 Fetch itineraries
  const fetchItineraries = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trips/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItineraries(res.data);
    } catch (error) {
      console.error("Error loading itineraries:", error);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  // 🔹 Save itinerary
  const saveItinerary = async () => {
    if (!newItinerary.trim()) return alert("Write something first!");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/trips",
        { userId: user.id, itinerary: newItinerary },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Itinerary Saved!");
      setNewItinerary("");
      fetchItineraries(); // refresh data
    } catch (error) {
      alert("Failed to save itinerary");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete itinerary
  const deleteItinerary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItineraries();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete itinerary");
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      {/* ================= NEW ITINERARY ================= */}
      <div className="bg-white p-6 shadow-lg rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Create New Itinerary ✈️</h2>

        <textarea
          rows="4"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
          placeholder="Example: 3-day trip to Goa with beach activities and local food..."
          value={newItinerary}
          onChange={(e) => setNewItinerary(e.target.value)}
        />

        <button
          onClick={saveItinerary}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Itinerary"}
        </button>
      </div>

      {/* ================= SAVED ITINERARIES ================= */}
      <div className="mt-10 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Your Saved Itineraries 📚</h2>

        {itineraries.length === 0 ? (
          <p className="text-gray-500 text-center">
            No itineraries yet. Create one above! ✍️
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {itineraries.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 shadow rounded-lg border-l-4 border-blue-600"
              >
                <p className="text-gray-700 whitespace-pre-line">{item.itinerary}</p>

                <p className="text-sm text-gray-400 mt-2">
                  📅 {new Date(item.createdAt).toLocaleDateString()}
                </p>

                <button
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  onClick={() => deleteItinerary(item._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
