// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { useNavigate } from "react-router-dom";

// const AIPlanner = () => {
//   const navigate = useNavigate();
//   const [visible, setVisible] = useState(false);
  
//   useEffect(() => {
//     setTimeout(() => setVisible(true), 100);
//   }, []); 

//   const [formData, setFormData] = useState({
//     tripName: "",
//     destination: "",
//     startDate: "",
//     endDate: "",
//     budget: "",
//     travellers: 1,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Trip Details:", formData);
//     // Pass trip details to the next component
//     navigate("/travel-preferences", { state: { tripData: formData } });
//   };

//   return (
//     <div className={`flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 transition-opacity duration-700 ${
//         visible ? "opacity-100" : "opacity-0"
//       }`}>
     
//      <div className="text-center mt-10">
//         <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
//           AI Trip Planner
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Let our AI create the perfect itinerary for your next adventure
//         </p>

//         <div className="flex items-center justify-center gap-6 mt-6">
//           <div className="flex items-center">
//             <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold">
//               1
//             </div>
//             <div className="w-12 h-1 bg-indigo-400"></div>
//             <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">
//               2
//             </div>
//             <div className="w-12 h-1 bg-gray-300"></div>
//             <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">
//               3
//             </div>
//           </div>
//         </div>
//       </div>
     
//      <form onSubmit={handleSubmit} className="mx-auto w-[60vw] bg-white shadow-2xl p-8 rounded-2xl mt-10">
//        <h1 className="text-2xl font-semibold text-center mb-6 flex justify-center items-center gap-2">
//          <img src="/assets/SVG's/destination.svg" alt="" className="w-6 h-6" />
//          Trip Details
//        </h1>

//        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
//           <div>
//             <label className="block font-medium mb-2">Trip Name</label>
//             <input
//               type="text"
//               name="tripName"
//               placeholder="e.g. Summer Europe Adventure"
//               value={formData.tripName}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-2">Destination</label>
//             <input
//               type="text"
//               name="destination"
//               placeholder="e.g. Paris, France"
//               value={formData.destination}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-2">Start Date</label>
//             <input
//               type="date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-2">End Date</label>
//             <input
//               type="date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-2">Budget (USD)</label>
//             <input
//               type="number"
//               name="budget"
//               placeholder="e.g. 2000"
//               value={formData.budget}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-2">Number of Travelers</label>
//             <input
//               type="number"
//               name="travellers"
//               min="1"
//               value={formData.travellers}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end mt-8">
//           <button
//             type="submit"
//             className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md transform transition hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
//           >
//             Next: Preferences
//           </button>
//         </div>
//      </form>
//     </div>
//   );
// };

// export default AIPlanner;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const cityMappings = {
  paris: { city: "PAR", airport: "CDG" },
  delhi: { city: "DEL", airport: "DEL" },
  london: { city: "LON", airport: "LHR" },
  "new york": { city: "NYC", airport: "JFK" },
  dubai: { city: "DXB", airport: "DXB" },
  tokyo: { city: "TYO", airport: "HND" },
  singapore: { city: "SIN", airport: "SIN" },
};

const AIPlanner = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const [formData, setFormData] = useState({
    tripName: "",
    destinationName: "",
    startDate: "",
    endDate: "",
    budget: "",
    travellers: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const destinationInput = formData.destinationName.toLowerCase();
    const foundKey = Object.keys(cityMappings).find((k) =>
      destinationInput.includes(k)
    );
    const mapping = foundKey
      ? cityMappings[foundKey]
      : { city: "PAR", airport: "CDG" }; // sensible default

    const payload = {
      ...formData,
      destinationCityCode: mapping.city,
      destinationAirport: mapping.airport,
      hotelbedsDestinationCode: mapping.city,
      origin: "DEL", // still hard-coded; you can wire this to user input later
      dates: {
        start: formData.startDate,
        end: formData.endDate,
      },
    };

    console.log("Passing trip data to backend:", payload);

    navigate("/travel-preferences", {
      state: { tripData: payload },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      <Navbar />

      <main
        className={`flex flex-col items-center flex-1 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Header */}
        <div className="text-center mt-10">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            AI Trip Planner
          </h1>
          <p className="text-gray-600 mt-2">
            Let our AI create the perfect itinerary for your next adventure
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold">
                1
              </div>
              <div className="w-12 h-1 bg-indigo-400" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">
                2
              </div>
              <div className="w-12 h-1 bg-gray-300" />
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">
                3
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-[95vw] sm:w-[70vw] lg:w-[60vw] bg-white shadow-2xl p-8 rounded-2xl mt-10 mb-10"
        >
          <h1 className="text-2xl font-semibold text-center mb-6 flex justify-center items-center gap-2">
            <img
              src="/assets/SVG's/destination.svg"
              alt=""
              className="w-6 h-6"
            />
            Trip Details
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div>
              <label className="block font-medium mb-2">Trip Name</label>
              <input
                type="text"
                name="tripName"
                placeholder="e.g. Summer Europe Adventure"
                value={formData.tripName}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Destination</label>
              <input
                type="text"
                name="destinationName"
                placeholder="e.g. Paris, France"
                value={formData.destinationName}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Budget (INR)</label>
              <input
                type="number"
                name="budget"
                min="0"
                placeholder="e.g. 45000"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Number of Travelers
              </label>
              <input
                type="number"
                name="travellers"
                min="1"
                value={formData.travellers}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md transform transition hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Next: Preferences
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AIPlanner;
