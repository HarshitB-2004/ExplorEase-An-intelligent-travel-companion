import React from "react";

function Footer() {
  return (
    <footer className="bg-[#0B1120] text-gray-300 py-10 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-8">
        
        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Explor<span className="text-blue-500">Ease</span>
          </h2>
          <p className="text-sm leading-6">
            Your all-in-one travel planner. Compare flights, hotels, and create
            AI-powered itineraries effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Home</li>
            <li className="hover:text-blue-400 cursor-pointer">Top Deals</li>
            <li className="hover:text-blue-400 cursor-pointer">AI Planner</li>
            <li className="hover:text-blue-400 cursor-pointer">Destinations</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">FAQs</li>
            <li className="hover:text-blue-400 cursor-pointer">Help Center</li>
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms of Use</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Stay Updated</h3>
          <p className="text-sm mb-3">
            Subscribe to get the latest travel deals and AI trip ideas.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 rounded-l-md text-black"
            />
            <button className="bg-blue-500 px-4 rounded-r-md hover:bg-blue-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} ExplorEase. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
