import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {

  const { user, logout } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState("trips");

  useEffect(() => {

    const fetchTrips = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/trips/my-trips",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTrips(res.data);
    };

    fetchTrips();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}

      <div className="w-64 bg-white shadow-lg p-6">

        <div className="mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>

          <h3 className="mt-3 font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="space-y-3">

          <button
            onClick={() => setActiveTab("trips")}
            className={`dashboard-btn ${activeTab === "trips" && "active"}`}
          >
            Saved Trips
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`dashboard-btn ${activeTab === "profile" && "active"}`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`dashboard-btn ${activeTab === "settings" && "active"}`}
          >
            Settings
          </button>

          <button
            onClick={logout}
            className="dashboard-btn text-red-500"
          >
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-10">

        {/* Saved Trips */}

        {activeTab === "trips" && (

          <>
            <h2 className="text-2xl font-semibold mb-6">
              Your Itineraries
            </h2>

            {trips.length === 0 ? (
              <p className="text-gray-500">
                No saved trips yet.
              </p>
            ) : (

              <div className="grid md:grid-cols-2 gap-6">

                {trips.map((trip) => (

                  <div
                    key={trip._id}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                  >

                    <h3 className="font-semibold text-lg">
                      {trip.tripName}
                    </h3>

                    <p className="text-gray-600">
                      {trip.destination}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {trip.startDate} → {trip.endDate}
                    </p>

                    <p className="mt-2 font-medium">
                      Budget: ₹{trip.budget}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </>
        )}

        {/* Profile Tab */}

        {activeTab === "profile" && (

          <div className="bg-white p-8 rounded-xl shadow max-w-xl">

            <h2 className="text-xl font-semibold mb-4">
              Profile Information
            </h2>

            <p><strong>Name:</strong> {user.name}</p>
            <p className="mt-2"><strong>Email:</strong> {user.email}</p>

          </div>

        )}

        {/* Settings Tab */}

        {activeTab === "settings" && (

          <div className="bg-white p-8 rounded-xl shadow max-w-xl">

            <h2 className="text-xl font-semibold mb-4">
              Account Settings
            </h2>

            <p className="text-gray-600">
              More settings coming soon...
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;
