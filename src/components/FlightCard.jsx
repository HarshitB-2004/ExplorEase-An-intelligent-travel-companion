import React from "react";

/* ================= AIRLINE MAP (UNCHANGED) ================= */

const airlineNames = {
  // 🇺🇸 United States
  AA: "American Airlines",
  DL: "Delta Air Lines",
  UA: "United Airlines",
  AS: "Alaska Airlines",
  B6: "JetBlue Airways",
  NK: "Spirit Airlines",
  F9: "Frontier Airlines",
  HA: "Hawaiian Airlines",

  // 🇨🇦 Canada
  AC: "Air Canada",
  WS: "WestJet",

  // 🇬🇧 United Kingdom
  BA: "British Airways",
  U2: "easyJet",
  LS: "Jet2",
  TOM: "TUI Airways",

  // 🇫🇷 France
  AF: "Air France",
  TO: "Transavia France",

  // 🇩🇪 Germany
  LH: "Lufthansa",
  EW: "Eurowings",
  DE: "Condor",

  // 🇳🇱 Netherlands
  KL: "KLM Royal Dutch Airlines",

  // 🇪🇸 Spain
  IB: "Iberia",
  VY: "Vueling",
  UX: "Air Europa",

  // 🇮🇹 Italy
  AZ: "ITA Airways",

  // 🇨🇭 Switzerland
  LX: "SWISS International Air Lines",

  // 🇹🇷 Turkey
  TK: "Turkish Airlines",
  PC: "Pegasus Airlines",

  // 🇮🇪 Ireland
  FR: "Ryanair",
  EI: "Aer Lingus",

  // 🇷🇺 Russia
  SU: "Aeroflot",

  // 🇮🇳 India
  AI: "Air India",
  "6E": "IndiGo",
  UK: "Vistara",
  SG: "SpiceJet",
  G8: "Go First",
  IX: "Air India Express",
  AKASA: "Akasa Air", // non-IATA display key

  // 🇦🇪 Middle East
  EK: "Emirates",
  EY: "Etihad Airways",
  FZ: "Flydubai",
  G9: "Air Arabia",

  // 🇶🇦 Qatar
  QR: "Qatar Airways",

  // 🇸🇦 Saudi Arabia
  SV: "Saudia",
  XY: "flynas",

  // 🇰🇼 Kuwait
  KU: "Kuwait Airways",

  // 🇯🇵 Japan
  JL: "Japan Airlines",
  NH: "All Nippon Airways (ANA)",
  MM: "Peach Aviation",

  // 🇨🇳 China
  CA: "Air China",
  MU: "China Eastern Airlines",
  CZ: "China Southern Airlines",
  HU: "Hainan Airlines",

  // 🇭🇰 Hong Kong
  CX: "Cathay Pacific",

  // 🇸🇬 Singapore
  SQ: "Singapore Airlines",
  TR: "Scoot",

  // 🇰🇷 South Korea
  KE: "Korean Air",
  OZ: "Asiana Airlines",

  // 🇹🇭 Thailand
  TG: "Thai Airways",
  FD: "Thai AirAsia",

  // 🇲🇾 Malaysia
  MH: "Malaysia Airlines",
  AK: "AirAsia",

  // 🇮🇩 Indonesia
  GA: "Garuda Indonesia",

  // 🇦🇺 Australia
  QF: "Qantas",
  VA: "Virgin Australia",
  JQ: "Jetstar Airways",

  // 🇳🇿 New Zealand
  NZ: "Air New Zealand",

  // 🇧🇷 Brazil
  LA: "LATAM Airlines",
  G3: "GOL Airlines",
  AD: "Azul Brazilian Airlines",

  // 🇲🇽 Mexico
  AM: "Aeroméxico",
  Y4: "Volaris",

  // 🇿🇦 South Africa
  SA: "South African Airways",
  FA: "FlySafair",

  // 🇪🇬 Egypt
  MS: "EgyptAir",

  // 🇪🇹 Ethiopia
  ET: "Ethiopian Airlines",

  // 🇰🇪 Kenya
  KQ: "Kenya Airways",

  // 🇲🇦 Morocco
  AT: "Royal Air Maroc",
};


const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
};

const FlightCard = ({ flight }) => {

  const itinerary = flight.itineraries?.[0];
  const segments = itinerary?.segments || [];

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  if (!firstSegment || !lastSegment) return null;

  /* ================= BASIC DATA ================= */

  const airlineCode = firstSegment.carrierCode;
  const airlineName =
    airlineNames[airlineCode] || airlineCode || "Unknown Airline";

  const stops = Math.max(segments.length - 1, 0);

  const duration = itinerary?.duration
    ?.replace("PT", "")
    .replace("H", "h ")
    .replace("M", "m");

  const price = flight.price?.total || "N/A";
  const currency = flight.price?.currency || "INR";
  const symbol = currencySymbols[currency] || currency;

  const logo = airlineCode
    ? `https://content.airhex.com/content/logos/airlines_${airlineCode}_200_50_r.png?proportions=keep`
    : "";

  /* ================= LAYOVER DISPLAY ================= */

  const layoverAirports = segments
    .slice(0, -1)
    .map((seg) => seg.arrival?.iataCode)
    .filter(Boolean);

  let layoverText = "Non-stop flight";

  if (stops === 1) layoverText = `1 stop via ${layoverAirports.join(", ")}`;
  if (stops > 1)
    layoverText = `${stops} stops via ${layoverAirports.join(", ")}`;

  /* ================= BOOKING REDIRECT (REAL) ================= */

  const handleBooking = () => {

    const from = firstSegment.departure.iataCode;
    const to = lastSegment.arrival.iataCode;

    // YYYY-MM-DD → YYMMDD
    const dateRaw = firstSegment.departure.at.split("T")[0];
    const date = dateRaw.replaceAll("-", "").slice(2);

    const bookingURL = `https://www.skyscanner.co.in/transport/flights/${from}/${to}/${date}/`;

    window.open(bookingURL, "_blank");
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col md:flex-row md:items-center justify-between border border-gray-100 hover:border-blue-300">

      {/* Airline Section */}
      <div className="flex items-center gap-4 md:w-1/3 mb-3 md:mb-0">
        {logo && (
          <img
            src={logo}
            alt={airlineName}
            className="w-10 h-10 object-contain drop-shadow-sm"
          />
        )}

        <div>
          <h3 className="font-semibold text-gray-800 text-sm md:text-base">
            {airlineName}
          </h3>

          <p className="text-xs text-gray-500">
            {firstSegment.departure.iataCode} →{" "}
            {lastSegment.arrival.iataCode}
          </p>

          {firstSegment.number && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              Flight {airlineCode}
              {firstSegment.number}
            </p>
          )}
        </div>
      </div>

      {/* Time Section */}
      <div className="text-center md:w-1/3 md:px-4">
        <p className="text-gray-800 text-sm font-medium">
          {firstSegment.departure.at.slice(11, 16)} →{" "}
          {lastSegment.arrival.at.slice(11, 16)}
        </p>

        <p className="text-xs text-gray-500 mt-1">{duration}</p>
        <p className="text-xs text-gray-400 mt-1">{layoverText}</p>

        {layoverAirports.length > 0 && (
          <div className="mt-1 flex flex-wrap justify-center gap-1">
            {layoverAirports.map((code) => (
              <span
                key={code}
                className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
              >
                Via {code}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price + Booking */}
      <div className="text-right md:w-1/3 mt-3 md:mt-0">
        <p className="text-lg font-bold text-green-600">
          {symbol}
          {price !== "N/A"
            ? Number(price).toLocaleString("en-IN")
            : "N/A"}
        </p>

        <button
          onClick={handleBooking}
          className="inline-block bg-blue-600 text-white px-4 py-2 mt-2 text-sm rounded-md hover:bg-blue-700 hover:shadow-md transition-all"
        >
          Select & Book
        </button>

        <p className="text-[11px] text-gray-400 mt-1">
          Redirects to Skyscanner for secure booking
        </p>
      </div>
    </div>
  );
};

export default FlightCard;
