import React from "react";

const airlineNames = {
  // (same map as before; left unchanged)
  AA: "American Airlines",
  AC: "Air Canada",
  AD: "Azul Brazilian Airlines",
  AF: "Air France",
  AI: "Air India",
  AM: "Aeroméxico",
  AR: "Aerolíneas Argentinas",
  AS: "Alaska Airlines",
  AT: "Royal Air Maroc",
  AV: "Avianca",
  AY: "Finnair",
  AZ: "ITA Airways",
  BA: "British Airways",
  BG: "Biman Bangladesh Airlines",
  BI: "Royal Brunei Airlines",
  BR: "EVA Air",
  BT: "Air Baltic",
  CA: "Air China",
  CI: "China Airlines",
  CM: "Copa Airlines",
  CX: "Cathay Pacific",
  CZ: "China Southern Airlines",
  DL: "Delta Air Lines",
  DY: "Norwegian Air Shuttle",
  EK: "Emirates",
  EI: "Aer Lingus",
  ET: "Ethiopian Airlines",
  EY: "Etihad Airways",
  FJ: "Fiji Airways",
  FI: "Icelandair",
  FZ: "flydubai",
  GA: "Garuda Indonesia",
  GF: "Gulf Air",
  GQ: "Sky Express",
  HA: "Hawaiian Airlines",
  HG: "Niki Airlines",
  HU: "Hainan Airlines",
  IB: "Iberia",
  IR: "Iran Air",
  IT: "Tigerair Taiwan",
  JL: "Japan Airlines",
  JP: "Adria Airways",
  JU: "Air Serbia",
  KE: "Korean Air",
  KL: "KLM Royal Dutch Airlines",
  KM: "Air Malta",
  KP: "ASKY Airlines",
  KQ: "Kenya Airways",
  KU: "Kuwait Airways",
  LA: "LATAM Airlines",
  LG: "Luxair",
  LH: "Lufthansa",
  LO: "LOT Polish Airlines",
  LX: "SWISS International Air Lines",
  LY: "EL AL Israel Airlines",
  MH: "Malaysia Airlines",
  MK: "Air Mauritius",
  MS: "Egyptair",
  MU: "China Eastern Airlines",
  NH: "All Nippon Airways",
  NZ: "Air New Zealand",
  OA: "Olympic Air",
  OD: "Malindo Air",
  OK: "Czech Airlines",
  OS: "Austrian Airlines",
  OU: "Croatia Airlines",
  OZ: "Asiana Airlines",
  PC: "Pegasus Airlines",
  PG: "Bangkok Airways",
  PK: "Pakistan International Airlines",
  PR: "Philippine Airlines",
  QR: "Qatar Airways",
  QV: "Lao Airlines",
  QF: "Qantas",
  RJ: "Royal Jordanian",
  RO: "TAROM",
  RS: "Air Seoul",
  RV: "Air Canada Rouge",
  S7: "S7 Airlines",
  SA: "South African Airways",
  SB: "Air Calin",
  SK: "SAS Scandinavian Airlines",
  SN: "Brussels Airlines",
  SQ: "Singapore Airlines",
  SU: "Aeroflot Russian Airlines",
  SV: "Saudia",
  SW: "Air Namibia",
  TA: "TACA",
  TB: "TUI Fly Belgium",
  TG: "Thai Airways",
  TK: "Turkish Airlines",
  TL: "Airnorth",
  TP: "TAP Air Portugal",
  TU: "Tunisair",
  TV: "Tibet Airlines",
  UA: "United Airlines",
  UL: "SriLankan Airlines",
  UN: "Transaero Airlines",
  UO: "HK Express",
  UX: "Air Europa",
  VA: "Virgin Australia",
  VB: "VivaAerobus",
  VF: "Valuair",
  VS: "Virgin Atlantic",
  VY: "Vueling Airlines",
  WE: "Thai Smile",
  WF: "Widerøe",
  WY: "Oman Air",
  XL: "LATAM Ecuador",
  XM: "J-Air",
  XP: "Xtra Airways",
  XY: "flynas",
  ZB: "Monarch Airlines",
  ZL: "Regional Express",
  "9W": "Jet Airways",
  "6E": "IndiGo",
  SG: "SpiceJet",
  G8: "Go First",
  UK: "Vistara",
  I5: "AirAsia India",
  AK: "AirAsia Malaysia",
  FD: "Thai AirAsia",
  D7: "AirAsia X",
  U2: "easyJet",
  FR: "Ryanair",
  W6: "Wizz Air",
  VY2: "Vueling",
  HV: "Transavia",
  LXU: "Luxair Express",
  LOF: "LOT Charters",
  IBS: "Iberia Express",
  EN: "Air Dolomiti",
  EZY: "easyJet Europe",
  EW: "Eurowings",
  WS: "WestJet",
  TS: "Air Transat",
  PD: "Porter Airlines",
  "9K": "Cape Air",
  B6: "JetBlue Airways",
  NK: "Spirit Airlines",
  F9: "Frontier Airlines",
  WN: "Southwest Airlines",
  VX: "Virgin America",
  SY: "Sun Country Airlines",
  G4: "Allegiant Air",
  HM: "Air Seychelles",
  DT: "TAAG Angola Airlines",
  PZ: "LATAM Paraguay",
  JJ: "LATAM Brasil",
  LAE: "LATAM Chile",
  LP: "LATAM Peru",
  LR: "Avianca Costa Rica",
  TAI: "Avianca El Salvador",
  AVH: "Avianca Honduras",
  CMI: "Copa Colombia",
  AE: "Mandarin Airlines",
  GE: "TransAsia Airways",
  MM: "Peach Aviation",
  GK: "Jetstar Japan",
  JC: "J-Air",
  TW: "T'way Air",
  ZE: "Eastar Jet",
  LJ: "Jin Air",
  "7C": "Jeju Air",
  VJ: "VietJet Air",
  VN: "Vietnam Airlines",
  QH: "Bamboo Airways",
  HX: "Hong Kong Airlines",
  "5J": "Cebu Pacific",
  DG: "Cebgo",
  TZ: "Scoot",
  TR: "Scoot",
  "3K": "Jetstar Asia",
  MI: "SilkAir",
  QZ: "Indonesia AirAsia",
  JT: "Lion Air",
  ID: "Batik Air",
  SJ: "Sriwijaya Air",
  W5: "Mahan Air",
  EP: "Iran Aseman Airlines",
  MN: "Kulula",
  FA: "FlySafair",
  LS: "Jet2.com",
  BY: "TUI Airways",
  BE: "Flybe",
  A3: "Aegean Airlines",
  PS: "Ukraine International Airlines",
  FB: "Bulgaria Air",
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

  const airlineCode = firstSegment?.carrierCode;
  const airlineName = airlineNames[airlineCode] || airlineCode || "Unknown Airline";
  const stops = Math.max(segments.length - 1, 0);
  const duration = itinerary?.duration?.replace("PT", "").toLowerCase();

  const price = flight.price?.total || "N/A";
  const currency = flight.price?.currency || "INR";
  const symbol = currencySymbols[currency] || currency;

  const logo = airlineCode
    ? `https://content.airhex.com/content/logos/airlines_${airlineCode}_200_50_r.png?proportions=keep`
    : "";

  // Layover airports (arrival airport of each segment except the last)
  const layoverAirports = segments
    .slice(0, -1)
    .map((seg) => seg.arrival?.iataCode)
    .filter(Boolean);

  let layoverText = "Non-stop flight";
  if (stops === 1) {
    layoverText = `1 stop via ${layoverAirports.join(", ")}`;
  } else if (stops > 1) {
    layoverText = `${stops} stops via ${layoverAirports.join(", ")}`;
  }

  // Simple booking integration: open a Google search with all details
  const origin = firstSegment?.departure?.iataCode;
  const destination = lastSegment?.arrival?.iataCode;
  const departureDate = firstSegment?.departure?.at?.slice(0, 10); // YYYY-MM-DD
  const flightNumber = firstSegment?.number;

  const bookingQuery = `${airlineName} ${airlineCode || ""}${flightNumber || ""} ${origin} to ${destination} ${departureDate} flight booking`;
  const bookingUrl = `https://www.google.com/search?q=${encodeURIComponent(bookingQuery)}`;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col md:flex-row md:items-center justify-between border border-gray-100 hover:border-blue-300">
      {/* Airline */}
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
            {origin} → {destination}
          </p>
          {flightNumber && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              Flight {airlineCode}
              {flightNumber}
            </p>
          )}
        </div>
      </div>

      {/* Time + Duration + Stops */}
      <div className="text-center md:w-1/3 md:px-4">
        <p className="text-gray-800 text-sm font-medium">
          {firstSegment?.departure?.at?.slice(11, 16)} →{" "}
          {lastSegment?.arrival?.at?.slice(11, 16)}
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
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 mt-2 text-sm rounded-md hover:bg-blue-700 hover:shadow-md transition-all"
        >
          Select &amp; Book
        </a>
        <p className="text-[11px] text-gray-400 mt-1">
          Opens booking options in a new tab
        </p>
      </div>
    </div>
  );
};

export default FlightCard;
