// src/ComparePage.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FlightCard from "../components/FlightCard";

const ComparePage = () => {
  /* ====================== GLOBAL & FLIGHT STATE ====================== */
  const [tab, setTab] = useState("flights");
  const [loading, setLoading] = useState(false);
// Popup comparison modal
const [showComparison, setShowComparison] = useState(false);
const [compareHotel, setCompareHotel] = useState(null);

  const [suggestions, setSuggestions] = useState({
    origin: [],
    destination: [],
  });

  const [flightData, setFlightData] = useState([]);
  const [flightCurrency, setFlightCurrency] = useState("INR");

  const [priceRange, setPriceRange] = useState({ min: 0, max: 80000 });
  const [priceFilter, setPriceFilter] = useState(80000);
  const [stopsFilter, setStopsFilter] = useState("any");
  const [timeFilter, setTimeFilter] = useState("any");
  const [airlineFilter, setAirlineFilter] = useState("any");

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    tripType: "oneway",
    adults: 1,
    children: 0,
    travelClass: "ECONOMY",
    nonStop: false,
  });

  /* ====================== HOTEL STATE & MAP ====================== */
  const [hotelForm, setHotelForm] = useState({
    city: "",
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    currency: "INR",
  });

  const [hotelData, setHotelData] = useState([]);
  const [coords, setCoords] = useState(null); // city center
  const [weather, setWeather] = useState(null);

  // hotel filters
  const [sortBy, setSortBy] = useState("recommended");
  const [minStars, setMinStars] = useState(0);
  const [hotelPriceRange, setHotelPriceRange] = useState({
    min: 0,
    max: 50000,
  });
  const [hotelPriceFilter, setHotelPriceFilter] = useState(50000);
  const [distanceFilter, setDistanceFilter] = useState("any"); // any / 2 / 5 / 10
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);

  const [hoveredHotel, setHoveredHotel] = useState(null);

  // Google Map
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  useEffect(() => {
  if (hotelData.length > 0 && map) {
    addHotelMarkers(hotelData);
  }
}, [hotelData, map]);


  // destination image for flights (pexels)
  const [image, setImage] = useState(null);

  const currencySymbol = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
  };

  /* ========================== GOOGLE MAP ========================== */

  const initMap = () => {
    if (!window.google || !coords || !mapRef.current) return;

    const mapOptions = {
      center: { lat: coords.lat, lng: coords.lon },
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    };

    try {
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setMapLoaded(true);
    } catch (err) {
      console.error("Error initializing map:", err);
    }
  };

  const createMarkerSVG = (color = "#4285F4", hover = false) => {
    const size = hover ? 36 : 32;
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <path d="M${size / 2} 2C${size / 2 - 4.42} 2 ${size / 2 - 8} ${size / 2 - 6.42} ${size / 2 - 8} ${
      size / 2 - 2
    }C${size / 2 - 8} ${size / 2 + 4.08} ${size / 2} ${size - 2} ${size / 2} ${
      size - 2
    }C${size / 2} ${size - 2} ${size / 2 + 8} ${size / 2 + 4.08} ${size / 2 + 8} ${
      size / 2 - 2
    }C${size / 2 + 8} ${size / 2 - 6.42} ${size / 2 + 4.42} 2 ${size / 2} 2Z" fill="${color}" />
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 6}" fill="white" />
      </svg>
    `;
  };

  const addHotelMarkers = (hotels) => {
    if (!map || !window.google) return;

    // clear old markers
    markers.forEach((m) => m.setMap(null));

    const newMarkers = [];

    hotels.forEach((hotel) => {
      const lat =
        hotel.latitude || hotel.hotel?.latitude || coords?.lat || null;
      const lng =
        hotel.longitude || hotel.hotel?.longitude || coords?.lon || null;

      if (!lat || !lng) return;

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: hotel.name,
        icon: {
          url:
            "data:image/svg+xml;base64," +
            btoa(createMarkerSVG("#4285F4", false)),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        },
      });

      marker.addListener("mouseover", () => {
        setHoveredHotel(hotel);
        marker.setIcon({
          url:
            "data:image/svg+xml;base64," +
            btoa(createMarkerSVG("#EA4335", true)),
          scaledSize: new window.google.maps.Size(36, 36),
          anchor: new window.google.maps.Point(18, 36),
        });
      });

      marker.addListener("mouseout", () => {
        setHoveredHotel(null);
        marker.setIcon({
          url:
            "data:image/svg+xml;base64," +
            btoa(createMarkerSVG("#4285F4", false)),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  };

  // Load Google Maps script when coords are ready
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        if (coords && !mapLoaded) initMap();
        return;
      }

      if (
        !document.querySelector(
          'script[src*="maps.googleapis.com/maps/api/js"]'
        )
      ) {
        const script = document.createElement("script");
        const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
        window.initMap = () => initMap();

        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (coords) initMap();
        };
        document.head.appendChild(script);
      }
    };

    if (coords) loadGoogleMaps();
  }, [coords, mapLoaded]);

  useEffect(() => {
    if (hotelData.length > 0 && map && mapLoaded) {
      addHotelMarkers(hotelData);
    }
  }, [hotelData, map, mapLoaded]);

  /* ============================ HELPERS ============================ */

  const haversineKm = (lat1, lon1, lat2, lon2) => {
    if (
      [lat1, lon1, lat2, lon2].some(
        (v) => v === null || v === undefined || Number.isNaN(v)
      )
    )
      return null;
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /* ========================== API CALLS ========================== */

  const fetchFlights = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/api/flights", {
        params: {
          originLocationCode: formData.origin,
          destinationLocationCode: formData.destination,
          departureDate: formData.departureDate,
          returnDate:
            formData.tripType === "round" && formData.returnDate
              ? formData.returnDate
              : undefined,
          adults: formData.adults,
          children: formData.children > 0 ? formData.children : undefined,
          travelClass: formData.travelClass,
          nonStop: formData.nonStop || undefined,
          currencyCode: flightCurrency,
          max: 20,
        },
      });

      const data = response.data?.data ?? [];
      setFlightData(data);

      // destination image & weather (optional, from first segment)
      if (data.length > 0) {
        const first = data[0].itineraries?.[0]?.segments?.[0];
        const destCode = first?.arrival?.iataCode;
        if (destCode) {
          try {
            const imgRes = await axios.get(
              "http://localhost:5000/api/pexels",
              { params: { query: destCode } }
            );
            if (imgRes.data?.photo) setImage(imgRes.data.photo);
          } catch (err) {
            console.error("Pexels fetch failed:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => {
    if (!city) return;
    try {
      const res = await axios.get("http://localhost:5000/api/hotels/weather", {
        params: { city },
      });
      setWeather(res.data);
    } catch (err) {
      console.error("Weather fetch failed", err);
    }
  };

  const fetchHotels = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/hotels/search",
        {
          params: {
            city: hotelForm.city,
            checkInDate: hotelForm.checkInDate,
            checkOutDate: hotelForm.checkOutDate,
            adults: hotelForm.adults,
            currency: hotelForm.currency || "INR",
          },
        }
      );

      const hotels = response.data.hotels || [];
      const cityCoords = response.data.coords || null;

      const enriched = await Promise.all(
        hotels.map(async (h) => {
          try {
            const googleRes = await axios.get(
              "http://localhost:5000/api/hotels/google-hotel-data",
              {
                params: {
                  hotelName: h.name,
                  lat: h.latitude || h.hotel?.latitude || cityCoords?.lat,
                  lng: h.longitude || h.hotel?.longitude || cityCoords?.lon,
                },
              }
            );

            const googleData = googleRes.data || {};
            const bookingSources = h.offer?.sources || [];

            const bookingSourceNames = bookingSources
              .map((source) => {
                const s = source.toLowerCase();
                if (s.includes("booking")) return "Booking.com";
                if (s.includes("expedia")) return "Expedia";
                if (s.includes("agoda")) return "Agoda";
                if (s.includes("hotels")) return "Hotels.com";
                return source;
              })
              .filter((value, index, self) => self.indexOf(value) === index);

            return {
              ...h,
              google_photos: googleData.photos || [],
              google_rating: googleData.rating || null,
              google_reviews: googleData.reviews || [],
              user_ratings_total: googleData.user_ratings_total || null,
              formatted_address: googleData.formatted_address || h.address,
              url: googleData.url || null,
              booking_sources:
                bookingSourceNames.length > 0
                  ? bookingSourceNames
                  : ["Multiple Providers"],
              best_price: h.price || null,
              currency: h.currency || hotelForm.currency,
            };
          } catch (err) {
            console.error("Google data fetch failed for", h.name, err);
            return {
              ...h,
              google_photos: [],
              google_rating: null,
              google_reviews: [],
              booking_sources: ["Multiple Providers"],
              best_price: h.price || null,
              currency: h.currency || hotelForm.currency,
            };
          }
        })
      );

      setHotelData(enriched);

      if (cityCoords) {
        setCoords(cityCoords);
      }

      fetchWeather(hotelForm.city);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitySuggestions = async (input, type) => {
    if (!input || input.length < 2) return;
    try {
      const res = await axios.get(
        "http://localhost:5000/api/flights/locations",
        {
          params: { keyword: input },
        }
      );
      setSuggestions((prev) => ({ ...prev, [type]: res.data }));
    } catch (err) {
      console.error("City autocomplete failed:", err);
    }
  };

  /* ======================== SMALL COMPONENTS ======================== */

  const StarRating = ({ rating, totalRatings, size = "sm" }) => {
    if (!rating) return null;

    const sizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    return (
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={
                index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
              }
            >
              {index < Math.floor(rating) ? "★" : "☆"}
            </span>
          ))}
        </div>
        <span className="font-semibold text-gray-700 ml-1">
          {rating.toFixed ? rating.toFixed(1) : rating}
        </span>
        {totalRatings && (
          <span className="text-gray-500 text-[10px] ml-1">
            (
            {totalRatings > 1000
              ? `${(totalRatings / 1000).toFixed(1)}k`
              : totalRatings}
            )
          </span>
        )}
      </div>
    );
  };

  const HotelImage = ({ hotel }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [loadingImg, setLoadingImg] = useState(true);
    const [imageSource, setImageSource] = useState("");

    useEffect(() => {
      let mounted = true;

      const loadImage = async () => {
        if (!mounted) return;

        if (hotel.google_photos && hotel.google_photos.length > 0) {
          setImageSrc(hotel.google_photos[0].url);
          setImageSource("google");
          setLoadingImg(false);
          return;
        }

        try {
          const res = await axios.get("http://localhost:5000/api/pexels", {
            params: { query: `${hotel.name} hotel` },
          });
          if (res.data.photo && mounted) {
            setImageSrc(res.data.photo);
            setImageSource("pexels");
            setLoadingImg(false);
            return;
          }
        } catch (err) {
          console.log("Pexels fallback failed:", err);
        }

        if (mounted) {
          setImageSrc(
            "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg"
          );
          setImageSource("default");
          setLoadingImg(false);
        }
      };

      loadImage();
      return () => {
        mounted = false;
      };
    }, [hotel]);

    return (
      <div className="relative w-40 h-40 flex-shrink-0">
        {loadingImg && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-l-xl flex items-center justify-center">
            <span className="text-gray-500 text-xs">Loading…</span>
          </div>
        )}
        <img
          src={imageSrc}
          alt={hotel.name}
          className={`w-full h-full object-cover rounded-l-xl transition-all duration-300 ${
            loadingImg ? "opacity-0" : "opacity-100 group-hover:scale-105"
          }`}
          onLoad={() => setLoadingImg(false)}
          onError={() => {
            setLoadingImg(false);
            setImageSrc(
              "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg"
            );
            setImageSource("default");
          }}
        />

        {hotel.google_rating && (
          <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-yellow-400 text-xs">⭐</span>
            <span className="text-[10px] font-semibold">
              {hotel.google_rating}
              {hotel.user_ratings_total && (
                <span className="text-gray-300 ml-1">
                  (
                  {hotel.user_ratings_total > 1000
                    ? `${(hotel.user_ratings_total / 1000).toFixed(1)}k`
                    : hotel.user_ratings_total}
                  )
                </span>
              )}
            </span>
          </div>
        )}

        {!loadingImg && (
          <div className="absolute bottom-2 right-2">
            <span
              className={`text-[10px] px-2 py-1 rounded-full ${
                imageSource === "google"
                  ? "bg-blue-600 text-white"
                  : imageSource === "pexels"
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {imageSource === "google"
                ? "📸 Google"
                : imageSource === "pexels"
                ? "📸 Pexels"
                : "📸 Default"}
            </span>
          </div>
        )}
      </div>
    );
  };

  /* =========================== HANDLERS =========================== */

  const handleFlightChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitySelect = (city, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: city.iataCode,
    }));
    setCoords({ lat: city.lat, lon: city.lon });
    setSuggestions((prev) => ({ ...prev, [type]: [] }));
  };

  const handleAmenityToggle = (value) => {
    setAmenitiesFilter((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const handleHotelCardHover = (hotel) => {
    setHoveredHotel(hotel);
    if (map && window.google) {
      markers.forEach((marker) => {
        if (marker.title === hotel.name) {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 700);
          map.panTo(marker.getPosition());
          map.setZoom(14);
        }
      });
    }
  };

  const handleHotelCardLeave = () => {
    setHoveredHotel(null);
  };

  /* ======================= DERIVED DATA ======================= */

  // Flight price range & airlines
  useEffect(() => {
    if (!flightData.length) return;
    const prices = flightData
      .map((f) => Number(f.price?.total || 0))
      .filter((p) => !Number.isNaN(p) && p > 0);
    if (!prices.length) return;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceRange({ min, max });
    setPriceFilter(max);
  }, [flightData]);

  const airlineOptions = Array.from(
    new Set(
      flightData
        .map((f) => f.itineraries?.[0]?.segments?.[0]?.carrierCode)
        .filter(Boolean)
    )
  );

  const filteredFlights = flightData.filter((f) => {
    const itinerary = f.itineraries?.[0];
    const segments = itinerary?.segments || [];
    const totalPrice = Number(f.price?.total || 0);
    const stops = segments.length - 1;

    if (priceFilter && totalPrice > priceFilter) return false;

    if (stopsFilter === "nonstop" && stops !== 0) return false;
    if (stopsFilter === "1" && stops !== 1) return false;
    if (stopsFilter === "2plus" && stops < 2) return false;

    if (timeFilter !== "any" && segments[0]?.departure?.at) {
      const hour = parseInt(segments[0].departure.at.slice(11, 13), 10);
      if (timeFilter === "morning" && !(hour >= 5 && hour < 12)) return false;
      if (timeFilter === "afternoon" && !(hour >= 12 && hour < 17))
        return false;
      if (timeFilter === "evening" && !(hour >= 17 && hour < 21)) return false;
      if (timeFilter === "night" && !(hour >= 21 || hour < 5)) return false;
    }

    if (airlineFilter !== "any") {
      const code = segments[0]?.carrierCode;
      if (code !== airlineFilter) return false;
    }

    return true;
  });

  // Hotel price range
  useEffect(() => {
    if (!hotelData.length) return;
    const prices = hotelData
      .map((h) => Number(h.best_price || h.price || 0))
      .filter((p) => !Number.isNaN(p) && p > 0);
    if (!prices.length) return;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setHotelPriceRange({ min, max });
    setHotelPriceFilter(max);
  }, [hotelData]);

  const processedHotels = hotelData
    .map((h) => {
      const rating = Number(h.google_rating || h.rating || 0);
      const priceNum = Number(h.best_price || h.price || 0) || null;
      const lat = h.latitude || h.hotel?.latitude || null;
      const lon = h.longitude || h.hotel?.longitude || null;
      const distance =
        coords && lat && lon
          ? haversineKm(coords.lat, coords.lon, lat, lon)
          : null;
      return { ...h, __rating: rating, __priceNum: priceNum, __distance: distance };
    })
    .filter((h) => {
      if (h.__rating < minStars) return false;
      if (hotelPriceFilter && h.__priceNum && h.__priceNum > hotelPriceFilter)
        return false;

      if (distanceFilter !== "any" && h.__distance != null) {
        const limit = Number(distanceFilter);
        if (h.__distance > limit) return false;
      }

      if (amenitiesFilter.length && h.amenities) {
        const haystack =
          Array.isArray(h.amenities) ? h.amenities.join(" ").toLowerCase() : String(h.amenities).toLowerCase();
        for (const a of amenitiesFilter) {
          if (!haystack.includes(a.toLowerCase())) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_low")
        return (a.__priceNum || Infinity) - (b.__priceNum || Infinity);
      if (sortBy === "price_high")
        return (b.__priceNum || 0) - (a.__priceNum || 0);
      if (sortBy === "rating")
        return (b.__rating || 0) - (a.__rating || 0);

      // recommended
      return (
        (b.__rating || 0) - (a.__rating || 0) ||
        (a.__priceNum || Infinity) - (b.__priceNum || Infinity)
      );
    });

  /* ============================= RENDER ============================= */

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Tabs */}
      <div className="flex gap-6 justify-center py-6 border-b bg-white shadow-sm">
        {["flights", "hotels"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 font-semibold text-lg capitalize transition-colors ${
              tab === t
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ==================== FLIGHT TAB ==================== */}
      {tab === "flights" && (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-inner">
          {/* LEFT – sticky search + filters */}
          <aside className="lg:w-1/3 w-full bg-white rounded-2xl shadow-lg p-6 space-y-6 lg:sticky lg:top-4 lg:self-start">
            {/* Trip type toggle */}
            <div className="flex justify-between items-center bg-gray-50 rounded-xl p-1">
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tripType: "oneway",
                    returnDate: "",
                  }))
                }
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  formData.tripType === "oneway"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                One Way
              </button>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tripType: "round",
                  }))
                }
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  formData.tripType === "round"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Round Trip
              </button>
            </div>

            {/* Search form */}
            <form onSubmit={fetchFlights} className="space-y-4">
              {/* From */}
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700">
                  From
                </label>
                <input
                  type="text"
                  name="origin"
                  placeholder="Type city"
                  value={formData.origin}
                  onChange={(e) => {
                    handleFlightChange(e);
                    fetchCitySuggestions(e.target.value, "origin");
                  }}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {suggestions.origin.length > 0 && (
                  <ul className="absolute bg-white border border-gray-200 w-full mt-1 rounded-md shadow-xl z-50 max-h-52 overflow-y-auto text-sm">
                    {suggestions.origin.map((city, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleCitySelect(city, "origin")}
                        className="p-2 hover:bg-blue-50 cursor-pointer"
                      >
                        {city.name} ({city.iataCode}) - {city.country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* To */}
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700">To</label>
                <input
                  type="text"
                  name="destination"
                  placeholder="Type city"
                  value={formData.destination}
                  onChange={(e) => {
                    handleFlightChange(e);
                    fetchCitySuggestions(e.target.value, "destination");
                  }}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {suggestions.destination.length > 0 && (
                  <ul className="absolute bg-white border border-gray-200 w-full mt-1 rounded-md shadow-xl z-50 max-h-52 overflow-y-auto text-sm">
                    {suggestions.destination.map((city, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleCitySelect(city, "destination")}
                        className="p-2 hover:bg-blue-50 cursor-pointer"
                      >
                        {city.name} ({city.iataCode}) - {city.country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Departure
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.departureDate}
                    onChange={handleFlightChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                {formData.tripType === "round" && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Return
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      min={formData.departureDate}
                      value={formData.returnDate}
                      onChange={handleFlightChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>

              {/* passengers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Adults
                  </label>
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleFlightChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Children
                  </label>
                  <input
                    type="number"
                    name="children"
                    min="0"
                    value={formData.children}
                    onChange={handleFlightChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all text-sm disabled:opacity-60"
              >
                {loading ? "Searching…" : "Search Flights"}
              </button>
            </form>

            {/* Filters */}
            <div className="border-t pt-4 mt-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="nonStop"
                  checked={formData.nonStop}
                  onChange={handleFlightChange}
                  className="accent-blue-600"
                />
                Non-stop only (API)
              </label>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Max Price ({flightCurrency})
                </label>
                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                  <span>
                    {priceRange.min
                      ? Math.round(priceRange.min).toLocaleString("en-IN")
                      : "0"}
                  </span>
                  <span>
                    {priceFilter
                      ? Math.round(priceFilter).toLocaleString("en-IN")
                      : "Any"}
                  </span>
                </div>
                <input
                  type="range"
                  min={priceRange.min || 0}
                  max={priceRange.max || 80000}
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Stops
                  </label>
                  <select
                    value={stopsFilter}
                    onChange={(e) => setStopsFilter(e.target.value)}
                    className="w-full mt-1 border rounded-md p-2 text-sm"
                  >
                    <option value="any">Any</option>
                    <option value="nonstop">Non-stop</option>
                    <option value="1">1 stop</option>
                    <option value="2plus">2+ stops</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Time of day
                  </label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full mt-1 border rounded-md p-2 text-sm"
                  >
                    <option value="any">Any</option>
                    <option value="morning">Morning (5–12)</option>
                    <option value="afternoon">Afternoon (12–17)</option>
                    <option value="evening">Evening (17–21)</option>
                    <option value="night">Night (21–5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Travel Class
                </label>
                <select
                  name="travelClass"
                  value={formData.travelClass}
                  onChange={handleFlightChange}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Currency
                </label>
                <select
                  value={flightCurrency}
                  onChange={(e) => setFlightCurrency(e.target.value)}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Change currency & search again to refresh prices.
                </p>
              </div>

              {airlineOptions.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Airline
                  </label>
                  <select
                    value={airlineFilter}
                    onChange={(e) => setAirlineFilter(e.target.value)}
                    className="w-full mt-1 border rounded-md p-2 text-sm"
                  >
                    <option value="any">All airlines</option>
                    {airlineOptions.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT – flight results + optional destination info */}
          <main className="lg:w-2/3 w-full space-y-6">
            {image && (
              <div className="bg-white p-5 rounded-2xl shadow-md flex gap-5 items-center">
                <img
                  src={image}
                  alt="destination"
                  className="w-48 h-36 rounded-xl object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {formData.destination}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Real-time pricing from Amadeus – filter & choose the best
                    option.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {filteredFlights.length > 0 ? (
                filteredFlights.map((f, idx) => (
                  <FlightCard key={idx} flight={f} />
                ))
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  Search to view available flights
                </p>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ==================== HOTELS TAB ==================== */}
      {tab === "hotels" && (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-[80vh] rounded-2xl shadow-inner">
          {/* LEFT – sticky search + filters */}
          <aside className="lg:w-1/3 w-full bg-white rounded-2xl shadow-lg p-6 space-y-6 lg:sticky lg:top-4 lg:self-start">
            <form onSubmit={fetchHotels} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Find the perfect stay
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Destination / City
                </label>
                <input
                  type="text"
                  name="city"
                  value={hotelForm.city}
                  onChange={handleHotelChange}
                  placeholder="e.g. Dubai, New York"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={hotelForm.checkInDate}
                    onChange={handleHotelChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={hotelForm.checkOutDate}
                    onChange={handleHotelChange}
                    min={
                      hotelForm.checkInDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    name="adults"
                    min="1"
                    max="10"
                    value={hotelForm.adults}
                    onChange={handleHotelChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={hotelForm.currency}
                    onChange={handleHotelChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all text-sm disabled:opacity-60"
              >
                {loading ? "Searching…" : "Search Hotels"}
              </button>
            </form>

            {/* Filters */}
            <div className="border-t pt-4 mt-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_low">Price – Low to High</option>
                  <option value="price_high">Price – High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Max price ({hotelForm.currency})
                </label>
                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                  <span>
                    {hotelPriceRange.min
                      ? Math.round(hotelPriceRange.min).toLocaleString("en-IN")
                      : "0"}
                  </span>
                  <span>
                    {hotelPriceFilter
                      ? Math.round(hotelPriceFilter).toLocaleString("en-IN")
                      : "Any"}
                  </span>
                </div>
                <input
                  type="range"
                  min={hotelPriceRange.min || 0}
                  max={hotelPriceRange.max || 50000}
                  value={hotelPriceFilter}
                  onChange={(e) =>
                    setHotelPriceFilter(Number(e.target.value))
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Minimum rating
                </label>
                <select
                  value={minStars}
                  onChange={(e) => setMinStars(Number(e.target.value))}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                >
                  <option value={0}>Any</option>
                  <option value={3}>3+ stars</option>
                  <option value={4}>4+ stars</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Distance from center
                </label>
                <select
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                >
                  <option value="any">Any</option>
                  <option value="2">Within 2 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Popular amenities
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["wifi", "pool", "parking", "breakfast"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleAmenityToggle(a)}
                      className={`px-2 py-1 rounded-full text-xs border transition ${
                        amenitiesFilter.includes(a)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {a === "wifi"
                        ? "Free Wi-Fi"
                        : a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT – map, weather, hotel list */}
          <main className="lg:w-2/3 w-full space-y-4">
            {/* Map & weather */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 h-72 sticky top-4"
>
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Hotel map
                    </h3>
                    <p className="text-xs text-gray-500">
                      {hoveredHotel
                        ? `Focusing: ${hoveredHotel.name}`
                        : "Hover over a hotel card to focus it on the map"}
                    </p>
                  </div>
                </div>
                <div ref={mapRef} className="w-full h-full" />
</div>

              {weather && (
  <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
      🌤 Weather Forecast – {weather.address}
    </h3>

    <div className="flex overflow-x-auto gap-4 p-2 scrollbar-hide">
      {weather.days?.slice(0, 7).map((day, i) => (
        <div
          key={i}
          className="min-w-[120px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-105 cursor-pointer transition-all"
        >
          <p className="text-sm font-medium text-gray-700">
            {new Date(day.datetime).toLocaleDateString("en-IN", { weekday: "short" })}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${day.icon || "01d"}.png`}
            alt="weather-icon"
            className="w-10 h-10 mt-2"
          />
          <p className="text-lg font-bold text-gray-800 mt-1">{day.tempmax}°</p>
          <p className="text-xs text-gray-500">{day.conditions}</p>
        </div>
      ))}
    </div>
  </div>
)}
            </div>

            {/* Hotels list */}
            <div className="space-y-3">
              {processedHotels.length > 0 ? (
                processedHotels.map((hotel, idx) => {
                  const name = hotel.name;
                  const address =
                    hotel.formatted_address || hotel.address || "Address N/A";
                  const rating = hotel.__rating;
                  const totalRatings = hotel.user_ratings_total;
                  const bookingSources = hotel.booking_sources || [];
                  const price = hotel.__priceNum;
                  const currency = hotel.currency || hotelForm.currency;
                  const referralLink =
                    hotel.url ||
                    `https://www.google.com/search?q=${encodeURIComponent(
                      `${hotel.name} hotel booking`
                    )}`;

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-indigo-300 overflow-hidden group"
                      onMouseEnter={() => handleHotelCardHover(hotel)}
                      onMouseLeave={handleHotelCardLeave}
                    >
                      <div className="flex">
                        <HotelImage hotel={hotel} />
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                {name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {address}
                              </p>
                            </div>
                          </div>

                          {rating > 0 && (
                            <div className="mb-2">
                              <StarRating
                                rating={rating}
                                totalRatings={totalRatings}
                                size="md"
                              />
                            </div>
                          )}

                          {bookingSources.length > 0 && (
                            <div className="mb-2">
                              <p className="text-[11px] text-gray-500">
                                Available on:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {bookingSources.map((source, i) => (
                                  <span
                                    key={i}
                                    className="inline-block bg-indigo-50 text-indigo-700 text-[11px] px-2 py-1 rounded-full border border-indigo-100 font-medium"
                                  >
                                    {source}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {hotel.google_reviews &&
                            hotel.google_reviews.slice(0, 1).map((review, i) => (
                              <div
                                key={i}
                                className="bg-gray-50 rounded-lg p-3 mb-2"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {review.profile_photo_url && (
                                    <img
                                      src={review.profile_photo_url}
                                      alt={review.author_name}
                                      className="w-6 h-6 rounded-full"
                                    />
                                  )}
                                  <span className="text-xs font-medium text-gray-700">
                                    {review.author_name}
                                  </span>
                                  <span className="text-[11px] text-yellow-600">
                                    ⭐ {review.rating}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-600 line-clamp-2">
                                  {review.text}
                                </p>
                              </div>
                            ))}

                          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
  <div>
    <p className="text-indigo-700 font-bold text-lg">
      {currencySymbol[currency] || currency}{" "}
      {price ? Number(price).toLocaleString("en-IN") : "—"}
      <span className="text-xs text-gray-400 font-normal"> / night</span>
    </p>

    {/* Show Price Source */}
    {bookingSources.length > 0 && (
      <p className="text-[11px] text-gray-500 mt-1">
        Price sourced via{" "}
        <span className="text-indigo-700 font-semibold">
          {bookingSources[0]}
        </span>
      </p>
    )}
  </div>

  <div className="flex gap-2">
    {/* COMPARE BUTTON */}
    <button
  onClick={() => {
    setCompareHotel(hotel);
    setShowComparison(true);
  }}
  className="text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
>
  Compare
</button>

    {/* BOOK NOW BUTTON */}
    <button
      onClick={() => window.open(referralLink, "_blank")}
      className="text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      Book Now
    </button>
  </div>
</div>

                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500">
                    Search above to see available hotels
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    We’ll show real images, Google ratings & reviews.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
      {/* HOTEL PRICE COMPARISON MODAL */}
{showComparison && compareHotel && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white w-full md:w-2/3 lg:w-1/2 p-6 rounded-2xl shadow-xl relative">
      
      {/* Close Button */}
      <button
        onClick={() => setShowComparison(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
      >
        ✖
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Compare Prices – {compareHotel.name}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Find the best deal from top booking sites.
      </p>

      {/* Table of Prices */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-2">Source</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {compareHotel.booking_sources?.map((source, idx) => (
              <tr key={idx} className="text-center border-b">
                <td className="py-2 font-medium">
                  {source === "Booking.com" ? "Booking.com" :
                   source === "Expedia" ? "Expedia" :
                   source === "Agoda" ? "Agoda" : source}
                </td>
                <td className="text-indigo-600 font-semibold">
                  {currencySymbol[compareHotel.currency] || ""} {compareHotel.best_price || "—"}
                </td>
                <td>
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/search?q=${encodeURIComponent(compareHotel.name + " " + source + " booking")}`,
                        "_blank"
                      )
                    }
                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                  >
                    View Offer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-gray-400 mt-3">
        Pricing data is directly sourced from Google Maps API & Amadeus.
      </p>
    </div>
  </div>
)}

    </div>
  );
};

export default ComparePage;
