import React from "react";

const HotelFilters = () => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg mt-6 flex flex-wrap gap-6 items-center">
      <div>
        <label className="text-sm font-semibold">Price Range</label>
        <input type="range" min="1000" max="50000" className="w-40 ml-2" />
      </div>
      <div>
        <label className="text-sm font-semibold">Rating</label>
        <select className="ml-2 border p-1 rounded">
          <option>All</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">Distance</label>
        <select className="ml-2 border p-1 rounded">
          <option>Any</option>
          <option>Within 2 km</option>
          <option>Within 5 km</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">Amenities</label>
        <select className="ml-2 border p-1 rounded">
          <option>All</option>
          <option>Free Wi-Fi</option>
          <option>Pool</option>
          <option>Breakfast</option>
        </select>
      </div>
    </div>
  );
};

export default HotelFilters;
