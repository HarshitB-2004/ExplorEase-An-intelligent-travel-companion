// import React, { useState,useEffect } from "react";
// import jsPDF from "jspdf";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { useLocation } from "react-router-dom";


// const ItineraryResult = ({ formData }) => {
//   const [itinerary, setItinerary] = useState("");
//   const [loading, setLoading] = useState(false);

//   const location = useLocation();
// const travelData = location.state?.formData || {};


//   // In ItineraryResult.jsx, make sure your fetch call includes all the data:
// const generateItinerary = async () => {
//   setLoading(true);
//   try {
//     console.log("Sending data to backend:", travelData); // Debug log
    
//     const res = await fetch("http://localhost:5000/api/ai/itinerary", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(travelData),
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const data = await res.json();
//     setItinerary(data.itinerary);
//   } catch (err) {
//     console.error("Error generating itinerary:", err);
//     alert("Error generating itinerary. Try again!");
//   } finally {
//     setLoading(false);
//   }
// };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(14);
//     doc.text("AI Trip Itinerary", 20, 20);
//     doc.setFontSize(12);

//     const text = itinerary || "No itinerary available.";
//     const lines = doc.splitTextToSize(text, 170);
//     doc.text(lines, 20, 30);

//     doc.save(`${travelData.tripName || "Trip"}_Itinerary.pdf`);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-purple-50">

//       <div className="mt-10 w-[70vw] bg-white p-8 rounded-2xl shadow-xl">
//         <h2 className="text-2xl font-semibold text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
//           ✨ Your AI-Generated Itinerary
//         </h2>

//         <div className="flex justify-center mt-6">
//           <button
//             onClick={generateItinerary}
//             disabled={loading}
//             className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition"
//           >
//             {loading ? "Generating..." : "Generate Itinerary"}
//           </button>
//         </div>

//         {itinerary && (
//           <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
//             <h3 className="text-lg font-bold mb-3">Itinerary Summary:</h3>
//             <pre className="whitespace-pre-wrap text-gray-800">{itinerary}</pre>

//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={downloadPDF}
//                 className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
//               >
//                 📄 Download as PDF
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

      
//     </div>
//   );
// };

// export default ItineraryResult;


import React from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ItineraryResult = () => {

  const { state } = useLocation();

  // ✅ SAFE EXTRACTION
  const itinerary = state?.itinerary;
  const destination = state?.destination || "Your Trip";
  const cityDescription = state?.cityDescription || "";

  // ================= SAVE TRIP =================

  const handleSaveTrip = async () => {

    try {

      const tripData = {
        tripName: destination,
        destination,
        startDate: itinerary.startDate || "",
        endDate: itinerary.endDate || "",
        budget: itinerary.budget || 0,
        itinerary // saving full AI result
      };

      await axios.post(
        "http://localhost:5000/api/trips/save",
        tripData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Trip saved successfully!");

    } catch (error) {
      console.error(error);
      alert("Failed to save trip");
    }
  };

  // ================= DOWNLOAD PDF =================

  const handleDownloadPDF = () => {
    window.print();
  };

  // ✅ LOADING GUARD
  if (!itinerary || !itinerary.days) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Generating your itinerary...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 pb-10">

      {/* ACTION BAR */}

      <div className="sticky top-0 bg-white shadow-sm z-20">
        <div className="max-w-5xl mx-auto flex justify-end gap-4 p-4">

          <button
            onClick={handleSaveTrip}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Trip
          </button>

          <button
            onClick={handleDownloadPDF}
            className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Download PDF
          </button>

        </div>
      </div>

      {/* HERO SECTION */}

      <div className="relative h-[320px] bg-gradient-to-r from-indigo-700 to-purple-700 flex items-end">

        <div className="p-6 text-white max-w-5xl mx-auto">

          <h1 className="text-3xl font-bold">
            {destination}
          </h1>

          <p className="mt-2 text-sm opacity-90 max-w-2xl">
            {cityDescription}
          </p>

        </div>

      </div>

      {/* DAY WISE PLAN */}

      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-8">

        {(itinerary.days || []).map((day, index) => (

          <div
            key={index}
            className="bg-white rounded-xl shadow p-6"
          >

            <h2 className="text-xl font-semibold mb-4">
              Day {index + 1}
            </h2>

            <div className="space-y-4">

              {(day.plan || []).map((item, idx) => (

                <div
                  key={idx}
                  className="flex gap-4"
                >

                  {/* TIME */}

                  <div className="text-indigo-600 font-semibold min-w-[70px]">
                    {item.time || "--"}
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>

                    {/* IMAGE SAFE RENDER */}

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rounded-xl w-full my-3 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ItineraryResult;
