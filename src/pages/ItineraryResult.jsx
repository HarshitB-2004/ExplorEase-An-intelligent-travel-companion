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


// ItineraryResult.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapView from "../components/MapView";

const weatherIcon = (icon) => {
  if (!icon) return "🌤️";
  const lc = icon.toLowerCase();
  if (lc.includes("rain")) return "🌧️";
  if (lc.includes("snow")) return "❄️";
  if (lc.includes("cloud")) return "☁️";
  if (lc.includes("clear") || lc.includes("sun")) return "☀️";
  return "🌤️";
};

// Helper to proxy Google photos through your backend
const photoUrl = (photo_reference, maxwidth = 800) =>
  `/api/google/photo?photo_reference=${encodeURIComponent(
    photo_reference
  )}&maxwidth=${maxwidth}`;

const ItineraryResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialItinerary =
    state?.itinerary || state?.formData || state || null;
  const passedHotels = state?.hotels || [];
  const passedFlights = state?.flights || [];

  const [itinerary, setItinerary] = useState(initialItinerary || {});
  const [placeDetails, setPlaceDetails] = useState(null);
  const [heroPhotoRef, setHeroPhotoRef] = useState(null);
  const [coords, setCoords] = useState(null);
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [nearbyAttractions, setNearbyAttractions] = useState([]);
  const [loading, setLoading] = useState(false);

  // If user somehow lands here without data, send back to planner
  useEffect(() => {
    if (!initialItinerary) {
      navigate("/ai-planner");
    }
  }, [initialItinerary, navigate]);

  if (!initialItinerary) return null;

  // Destination label
  const destName =
    itinerary.Destination ||
    itinerary.destination ||
    itinerary.location ||
    itinerary.tripName ||
    state?.tripName ||
    "Your Trip";

  const firstDayWeather = itinerary.days?.[0]?.weather || null;
  const estimatedBudget =
    itinerary.estimatedBudgetINR || state?.budget || state?.estimatedBudgetINR;

  // Main enhancement effect: geocode -> place details -> nearby hotels + attractions
  useEffect(() => {
    let cancelled = false;

    const enhance = async () => {
      if (!destName) return;
      setLoading(true);

      try {
        // 1️⃣ Geocode destination if we don't already have coordinates
        let centerLat =
          itinerary.centerLat || itinerary.lat || itinerary.latitude || null;
        let centerLng =
          itinerary.centerLng || itinerary.lng || itinerary.longitude || null;
        let placeId = itinerary.place_id || null;

        if ((!centerLat || !centerLng) && destName) {
          const geoRes = await fetch(
            `/api/google/geocode?address=${encodeURIComponent(destName)}`
          );
          if (geoRes.ok) {
            const geoJson = await geoRes.json();
            const geo = Array.isArray(geoJson.results)
              ? geoJson.results[0]
              : geoJson;
            const loc = geo?.geometry?.location;
            if (loc) {
              centerLat = loc.lat;
              centerLng = loc.lng;
            }
            if (geo?.place_id) placeId = geo.place_id;
          }
        }

        if (centerLat && centerLng && !cancelled) {
          setCoords({ lat: centerLat, lng: centerLng });
        }

        // 2️⃣ Place details (photos + reviews)
        if (placeId && !cancelled) {
          const pdRes = await fetch(
            `/api/google/place-details?place_id=${encodeURIComponent(placeId)}`
          );
          if (pdRes.ok) {
            const pdJson = await pdRes.json();
            const pd = pdJson.result || pdJson;
            if (!cancelled) {
              setPlaceDetails(pd);
              if (pd?.photos?.[0]?.photo_reference) {
                setHeroPhotoRef(pd.photos[0].photo_reference);
              }
              if (pd?.geometry?.location) {
                setCoords({
                  lat: pd.geometry.location.lat,
                  lng: pd.geometry.location.lng,
                });
              }
            }
          }
        }

        // 3️⃣ Nearby hotels + attractions
        if (centerLat && centerLng && !cancelled) {
          const nearbyFetch = async (type) => {
            const res = await fetch(
              `/api/google/nearby?lat=${centerLat}&lng=${centerLng}&radius=7000&type=${type}`
            );
            if (!res.ok) return [];
            const json = await res.json();
            const arr = Array.isArray(json) ? json : json.results || [];
            return arr.map((p) => ({
              name: p.name,
              rating: p.rating,
              user_ratings_total: p.user_ratings_total,
              vicinity: p.vicinity || p.formatted_address,
              place_id: p.place_id,
              photo_reference: p.photos?.[0]?.photo_reference || null,
              lat: p.geometry?.location?.lat,
              lng: p.geometry?.location?.lng,
            }));
          };

          const [hotels, attractions] = await Promise.all([
            nearbyFetch("lodging"),
            nearbyFetch("tourist_attraction"),
          ]);

          if (!cancelled) {
            setNearbyHotels(hotels);
            setNearbyAttractions(attractions);
          }
        }
      } catch (err) {
        console.error("Itinerary enhancement error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    enhance();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destName]);

  // Flight card UI
  const FlightCard = ({ f }) => {
    const segs = f.itineraries?.[0]?.segments || [];
    const first = segs[0] || {};
    const last = segs[segs.length - 1] || {};
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            {first.carrierCode || "Airline"}
          </div>
          <div className="text-indigo-600 font-bold">
            ₹ {f.price?.grandTotal ?? "N/A"}
          </div>
        </div>
        <div className="flex gap-4 mt-2 items-center text-sm">
          <div>
            <div className="text-xs text-gray-500">From</div>
            <div className="font-medium">
              {first.departure?.iataCode || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {first.departure?.at || ""}
            </div>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div>
            <div className="text-xs text-gray-500">To</div>
            <div className="font-medium">
              {last.arrival?.iataCode || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {last.arrival?.at || ""}
            </div>
          </div>
          <div className="ml-auto text-xs text-gray-600 text-right">
            <div>Duration: {f.itineraries?.[0]?.duration || "N/A"}</div>
            <div>Stops: {segs.length > 1 ? segs.length - 1 : "Non-stop"}</div>
          </div>
        </div>
      </div>
    );
  };

  // Download as PDF (client-side)
  const handleDownloadPdf = () => {
    const el = document.getElementById("itinerary-print");
    if (!el) return;

    const opt = {
      margin: 8,
      filename: `${destName || "itinerary"}.pdf`,
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 1.4, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(el).set(opt).save();
  };

  // Save JSON itinerary to backend; backend can generate & store PDF server-side
  const handleSaveItinerary = async () => {
    try {
      const res = await fetch("/api/itinerary/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          itinerary,
          destination: destName,
          hotels: nearbyHotels,
          attractions: nearbyAttractions,
          flights: passedFlights,
          estimatedBudget,
        }),
      });

      if (!res.ok) {
        throw new Error(`Save failed with status ${res.status}`);
      }

      alert("Itinerary saved to your account.");
    } catch (err) {
      console.error("Save itinerary error:", err);
      alert("Could not save itinerary. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    

      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">
              ExploreEase — Professional Itinerary
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              A structured, AI-generated travel plan enriched with live Google
              data.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveItinerary}
              className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition text-sm"
            >
              Save to Account
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* PRINT WRAPPER */}
        <div id="itinerary-print" className="space-y-8">
          {/* HERO SECTION */}
          <section className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="relative h-[260px] sm:h-[320px] w-full bg-gray-200">
              {heroPhotoRef ? (
                <img
                  src={photoUrl(heroPhotoRef, 1600)}
                  alt={destName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No destination photo available
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-white">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold">
                    {destName}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-100 mt-1">
                    {itinerary.summary ||
                      "A curated itinerary focusing on top attractions, comfortable stays, and balanced pacing."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  {itinerary.dates?.start && itinerary.dates?.end && (
                    <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                      📅 {itinerary.dates.start} – {itinerary.dates.end}
                    </span>
                  )}
                  {estimatedBudget && (
                    <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                      💸 est. ₹{Number(estimatedBudget).toLocaleString("en-IN")}
                    </span>
                  )}
                  {firstDayWeather && (
                    <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                      {weatherIcon(firstDayWeather.icon)}{" "}
                      {firstDayWeather.conditions} —{" "}
                      {firstDayWeather.tempmax}°C
                    </span>
                  )}
                  {state?.travellers && (
                    <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                      👥 {state.travellers} traveller
                      {Number(state.travellers) > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* MAP + PLACE DETAILS ROW */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-4">
              <h2 className="text-lg font-semibold text-indigo-600 mb-3">
                Map Overview
              </h2>
              {coords ? (
                <MapView lat={coords.lat} lng={coords.lng} />
              ) : (
                <div className="w-full h-[260px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                  Map data unavailable
                </div>
              )}
            </div>

            {/* Place details */}
            <aside className="bg-white rounded-2xl shadow p-4 space-y-4">
              <div className="font-semibold text-gray-800">Place Details</div>

              <div className="flex gap-3 items-start">
                {placeDetails?.photos?.[0]?.photo_reference ? (
                  <img
                    src={photoUrl(
                      placeDetails.photos[0].photo_reference,
                      400
                    )}
                    alt="place"
                    className="w-28 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-28 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}

                <div className="text-sm">
                  <div className="font-semibold">
                    {placeDetails?.name || destName}
                  </div>
                  <div className="text-gray-600">
                    {placeDetails?.formatted_address || placeDetails?.vicinity}
                  </div>
                  {placeDetails?.formatted_phone_number && (
                    <div className="text-gray-600 mt-1">
                      {placeDetails.formatted_phone_number}
                    </div>
                  )}
                  {placeDetails?.website && (
                    <div className="mt-1">
                      <a
                        href={placeDetails.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Official Website
                      </a>
                    </div>
                  )}
                  {placeDetails?.rating && (
                    <div className="text-yellow-600 mt-1">
                      ⭐ {placeDetails.rating} (
                      {placeDetails.user_ratings_total || 0})
                    </div>
                  )}
                </div>
              </div>

              {/* Top Reviews */}
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Top Reviews
                </div>
                <div className="space-y-2 max-h-48 overflow-auto pr-1 text-xs">
                  {placeDetails?.reviews?.length ? (
                    placeDetails.reviews.slice(0, 4).map((r, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="font-medium">
                          {r.author_name}{" "}
                          <span className="text-[10px] text-gray-500">
                            • {r.rating}⭐ • {r.relative_time_description}
                          </span>
                        </div>
                        <div className="mt-1 text-gray-700">{r.text}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">
                      No reviews available for this place.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </section>

          {/* DAY-BY-DAY TIMELINE */}
          {Array.isArray(itinerary.days) && itinerary.days.length > 0 && (
            <section className="space-y-6">
              {itinerary.days.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Day {idx + 1} — {day.date || "Planned Day"}
                    </h3>
                    {day.weather && (
                      <div className="text-sm text-indigo-600">
                        {weatherIcon(day.weather.icon)} {day.weather.conditions}{" "}
                        — {day.weather.tempmax}°C
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {day.items?.map((it, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[70px,1fr] gap-4 items-start"
                      >
                        <div className="text-xs font-medium text-gray-500 pt-1">
                          {it.time || "--:--"}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900">
                            {it.title}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {it.notes}
                          </div>
                          {it.image && (
                            <img
                              src={it.image}
                              alt={it.title}
                              className="w-full h-48 object-cover rounded-lg mt-3 border"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* HOTELS + ATTRACTIONS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hotels */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">
              <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                Recommended Hotels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(nearbyHotels.length ? nearbyHotels : passedHotels)
                  .slice(0, 6)
                  .map((h, i) => (
                    <div
                      key={i}
                      className="border rounded-xl overflow-hidden bg-gray-50"
                    >
                      {h.photo_reference ? (
                        <img
                          src={photoUrl(h.photo_reference, 800)}
                          alt={h.name}
                          className="h-36 w-full object-cover"
                        />
                      ) : (
                        <div className="h-36 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          No image
                        </div>
                      )}

                      <div className="p-3 text-sm">
                        <div className="font-semibold">{h.name}</div>
                        <div className="text-gray-600">{h.vicinity}</div>
                        {h.rating && (
                          <div className="text-yellow-600 mt-1">
                            ⭐ {h.rating} ({h.user_ratings_total || 0})
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-2">
                          {h.place_id && (
                            <a
                              href={`https://www.google.com/maps/place/?q=place_id:${h.place_id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 text-xs rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Attractions */}
            <aside className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                Nearby Attractions
              </h3>
              <div className="space-y-3 max-h-[420px] overflow-auto pr-1 text-sm">
                {nearbyAttractions.length ? (
                  nearbyAttractions.map((p, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      {p.photo_reference ? (
                        <img
                          src={photoUrl(p.photo_reference, 320)}
                          alt={p.name}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-gray-600 text-xs">
                          {p.vicinity}
                        </div>
                        {p.rating && (
                          <div className="text-yellow-600 text-xs">
                            ⭐ {p.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">
                    No nearby attractions found.
                  </div>
                )}
              </div>
            </aside>
          </section>

          {/* FLIGHTS */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-3">
              Flight Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passedFlights?.length ? (
                passedFlights.slice(0, 4).map((f, i) => (
                  <FlightCard key={i} f={f} />
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No flights available.
                </div>
              )}
            </div>
          </section>

          {/* BUDGET SUMMARY */}
          <section className="flex justify-end">
            <div className="text-right text-lg font-semibold text-gray-800">
              Estimated Budget:{" "}
              <span className="text-indigo-700">
                ₹
                {Number(
                  itinerary.estimatedBudgetINR || estimatedBudget || 0
                ).toLocaleString("en-IN")}
              </span>
            </div>
          </section>
        </div>

        {loading && (
          <div className="fixed bottom-4 right-4 px-4 py-2 rounded-full shadow bg-white text-xs text-gray-600 border">
            Enhancing itinerary with live Google data…
          </div>
        )}
      </main>

      
    </div>
  );
};

export default ItineraryResult;
