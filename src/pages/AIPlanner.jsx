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

const cityMappings = {
  paris: "CDG",
  london: "LHR",
  "new york": "JFK",
  dubai: "DXB",
  tokyo: "HND",
};

const AIPlanner = () => {

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 150);
  }, []);

  const [formData, setFormData] = useState({
    tripName: "",
    destinationName: "",
    startDate: "",
    endDate: "",
    budget: "",
    travellers: 1,
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const key = Object.keys(cityMappings).find(k =>
      formData.destinationName.toLowerCase().includes(k)
    );

    const airport = key ? cityMappings[key] : "CDG";

    navigate("/travel-preferences", {
      state: {
        tripData: {
          ...formData,
          destinationLocationCode: airport,
          originLocationCode: "DEL",
        }
      }
    });
  };

  return (
  <div className="min-h-screen bg-[#f5f8ff] flex flex-col items-center py-14 px-4">

    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-indigo-500">
        AI Trip Planner
      </h1>
      <p className="text-gray-600 mt-2 text-sm">
        Let our AI create the perfect itinerary for your next adventure
      </p>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="step-active">1</div>
        <div className="step-line"></div>
        <div className="step-inactive">2</div>
        <div className="step-line"></div>
        <div className="step-inactive">3</div>
      </div>
    </div>

    {/* Card */}
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-xl w-full max-w-5xl p-10 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >

      {/* Section Title */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <span className="text-purple-500 text-xl">📍</span>
        <h2 className="text-xl font-semibold">
          Trip Details
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

        <div>
          <label className="label-style">Trip Name</label>
          <input
            name="tripName"
            required
            onChange={handleChange}
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-style">Destination</label>
          <input
            name="destinationName"
            required
            onChange={handleChange}
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-style">Start Date</label>
          <input
            type="date"
            name="startDate"
            required
            onChange={handleChange}
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-style">End Date</label>
          <input
            type="date"
            name="endDate"
            required
            onChange={handleChange}
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-style">Budget (INR)</label>
          <input
            type="number"
            name="budget"
            required
            onChange={handleChange}
            className="input-ui focus:border-indigo-500 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="label-style">Number of Travelers</label>
          <input
            type="number"
            name="travellers"
            min="1"
            value={formData.travellers}
            onChange={handleChange}
            className="input-ui"
          />
        </div>

      </div>

      {/* Button */}
      <div className="flex justify-end mt-10">
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition"
        >
          Next: Preferences
        </button>
      </div>

    </form>

  </div>
);

};

export default AIPlanner;
