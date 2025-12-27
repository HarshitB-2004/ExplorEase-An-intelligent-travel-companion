import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, DollarSign } from "lucide-react";

// === 25 Travel Destinations ===
const deals = [
  { id: 1, title: "Paris City Break - 4 Days", location: "Paris, France", category: "Tours", price: 849, oldPrice: 1200, discount: "29% OFF", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", via: "Expedia", tag: "Featured" },
  { id: 2, title: "Safari Adventure in Kenya", location: "Nairobi, Kenya", category: "Adventures", price: 2399, oldPrice: 3200, discount: "25% OFF", image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2", via: "Intrepid Travel", tag: "Top Pick" },
  { id: 3, title: "Luxury Resort in Bali", location: "Bali, Indonesia", category: "Hotels", price: 1875, oldPrice: 2500, discount: "25% OFF", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", via: "Booking.com", tag: "Luxury" },
  { id: 4, title: "Round-trip Flight to Tokyo", location: "Tokyo, Japan", category: "Flights", price: 679, oldPrice: 890, discount: "24% OFF", image: "https://images.pexels.com/photos/47044/aircraft-landing-reach-injection-47044.jpeg", via: "Kayak" },
  { id: 5, title: "Helicopter Tour of New York", location: "New York, USA", category: "Tours", price: 199, oldPrice: 250, discount: "20% OFF", image: "https://images.pexels.com/photos/17229078/pexels-photo-17229078.jpeg", via: "Viator" },
  { id: 6, title: "Maldives Beach Resort", location: "Maldives", category: "Hotels", price: 2299, oldPrice: 2800, discount: "18% OFF", image: "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg", via: "TripAdvisor", tag: "Popular" },
  { id: 7, title: "Swiss Alps Ski Trip", location: "Zermatt, Switzerland", category: "Adventures", price: 1599, oldPrice: 2100, discount: "24% OFF", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", via: "SnowTours" },
  { id: 8, title: "Rome Historical Tour", location: "Rome, Italy", category: "Tours", price: 499, oldPrice: 650, discount: "23% OFF", image: "https://images.pexels.com/photos/2676642/pexels-photo-2676642.jpeg", via: "GetYourGuide" },

  // 🔹 NEW 17 MORE DESTINATIONS ADDED BELOW (TOTAL 25)
  { id: 9, title: "Santorini Sunset Escape", location: "Santorini, Greece", category: "Hotels", price: 1299, oldPrice: 1600, discount: "18% OFF", image: "https://images.unsplash.com/photo-1505739772183-d7329a39d4aa", via: "Airbnb" },
  { id: 10, title: "Dubai Luxury Tour - 5 Days", location: "Dubai, UAE", category: "Tours", price: 1899, oldPrice: 2400, discount: "21% OFF", image: "https://images.unsplash.com/photo-1508087625009-cddb89ac9a9f", via: "Emirates Holidays" },
  { id: 11, title: "Cape Town Adventure", location: "Cape Town, South Africa", category: "Adventures", price: 1499, oldPrice: 2000, discount: "25% OFF", image: "https://images.unsplash.com/photo-1518987048-93e29699dc7a", via: "Adventure Co." },
  { id: 12, title: "London Flights Deal", location: "London, UK", category: "Flights", price: 499, oldPrice: 650, discount: "23% OFF", image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba", via: "Kayak" },
  { id: 13, title: "Thailand Island Hopping", location: "Phuket, Thailand", category: "Tours", price: 999, oldPrice: 1400, discount: "30% OFF", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", via: "Trip.com" },
  { id: 14, title: "Iceland Northern Lights", location: "Reykjavik, Iceland", category: "Adventures", price: 1899, oldPrice: 2500, discount: "24% OFF", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa", via: "Aurora Tours" },
  { id: 15, title: "Barcelona Weekend Trip", location: "Barcelona, Spain", category: "Tours", price: 799, oldPrice: 1100, discount: "27% OFF", image: "https://images.unsplash.com/photo-1505731132160-1f41e04e2e57", via: "Viator" },
  { id: 16, title: "Flight to Los Angeles", location: "Los Angeles, USA", category: "Flights", price: 699, oldPrice: 950, discount: "26% OFF", image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2", via: "Skyscanner" },
  { id: 17, title: "Sydney Opera House Tour", location: "Sydney, Australia", category: "Tours", price: 1099, oldPrice: 1500, discount: "23% OFF", image: "https://images.unsplash.com/photo-1549924231-f129b911e442", via: "GetYourGuide" },
  { id: 18, title: "Singapore Budget Trip", location: "Singapore", category: "Flights", price: 599, oldPrice: 780, discount: "18% OFF", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", via: "Expedia" },
  { id: 19, title: "Amsterdam Canal Tour", location: "Amsterdam, Netherlands", category: "Tours", price: 649, oldPrice: 900, discount: "28% OFF", image: "https://images.unsplash.com/photo-1505236733079-730b9e97d52b", via: "GetYourGuide" },
  { id: 20, title: "Machu Picchu Trek", location: "Peru", category: "Adventures", price: 1699, oldPrice: 2100, discount: "19% OFF", image: "https://images.unsplash.com/photo-1529927066849-8b1d1d60a6e7", via: "Adventure Co." },
  { id: 21, title: "Bangkok Flight Deal", location: "Bangkok, Thailand", category: "Flights", price: 499, oldPrice: 680, discount: "26% OFF", image: "https://images.unsplash.com/photo-1541233349642-6e425fe6190e", via: "Kayak" },
  { id: 22, title: "Venice Romantic Trip", location: "Venice, Italy", category: "Tours", price: 999, oldPrice: 1400, discount: "30% OFF", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", via: "Expedia" },
  { id: 23, title: "Dubai 5-Star Hotel", location: "Dubai, UAE", category: "Hotels", price: 2099, oldPrice: 2900, discount: "27% OFF", image: "https://images.unsplash.com/photo-1506765515384-028b60a970df", via: "TripAdvisor" },
  { id: 24, title: "Great Wall Hiking Tour", location: "Beijing, China", category: "Adventures", price: 1199, oldPrice: 1600, discount: "25% OFF", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05", via: "Adventure Asia" },
  { id: 25, title: "Madrid City Escape", location: "Madrid, Spain", category: "Tours", price: 899, oldPrice: 1200, discount: "22% OFF", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f", via: "Viator" },
];

const TravelDeals = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const filteredDeals = deals
    .filter((deal) =>
      (category === "All" || deal.category === category) &&
      deal.title.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeals = filteredDeals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-white">
      {/* HERO SECTION */}
      <div
        className="relative text-white text-center py-32 bg-cover bg-center"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg)" }}
      >
        <div className="absolute inset-0 bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">🌍 Explore Travel Deals</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Handpicked destinations to make your next trip memorable.
          </p>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <motion.div className="bg-white shadow-xl rounded-xl mx-auto p-6 w-11/12 max-w-6xl -mt-12 relative z-20 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center w-full sm:w-1/3 bg-gray-100 rounded-lg px-3 py-2">
          <Search className="text-gray-500 mr-2" size={18} />
          <input type="text" placeholder="Search..." className="bg-transparent w-full" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <select className="border rounded-lg px-4 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Flights">Flights</option>
          <option value="Hotels">Hotels</option>
          <option value="Tours">Tours</option>
          <option value="Adventures">Adventures</option>
        </select>

        <select className="border rounded-lg px-4 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Sort by</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </motion.div>

      {/* DEAL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-10 max-w-7xl mx-auto">
        {currentDeals.map((deal) => (
          <motion.div key={deal.id} whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
            <img src={deal.image} alt={deal.title} className="w-full h-56 object-cover" />
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800">{deal.title}</h3>
              <p className="text-gray-500">{deal.location}</p>
              <div className="flex gap-2 items-center">
                <span className="text-green-600 font-bold flex items-center"><DollarSign size={16} />{deal.price}</span>
                <span className="line-through text-gray-400">${deal.oldPrice}</span>
              </div>
              <p className="text-gray-500 text-sm">via {deal.via}</p>
              <button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-lg">View Deal</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 pb-10">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-4 py-2 bg-gray-200 rounded-lg">⬅ Prev</button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-4 py-2 bg-gray-200 rounded-lg">Next ➡</button>
      </div>
    </div>
  );
};

export default TravelDeals;

