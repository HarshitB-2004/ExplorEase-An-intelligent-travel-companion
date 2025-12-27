import React from "react";
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import "../index.css"
import axios from "axios";
import Footer from '../components/Footer'

import Navbar from '../components/Navbar'
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// import LatestDeals from "../components/LatestDeals"

function Home() {

  const [destination, setDestination] = useState("")
  const [itinerary,setItinerary]=useState(null);


  const navigate = useNavigate();

  const generateItinerary=async()=>{
    try{
      const res=await axios.post("http://localhost:5000/api/itinerary",{
    destination,
    days:3,
    budget:"Moderate",
    interests:["Beaches","Food"]
  });
  setItinerary(res.data.itinerary);
} catch(err){
  console.error(err);
}
  };

  // Redirect Handlers
  const handlePlanWithAI = () => {
    navigate("/ai-planner");
  };

  const handleStartSearch = () => {
    navigate("/compare");
  };

  const handleSearch = () => {
    if (destination.trim()) {
      navigate(`/deals?destination=${encodeURIComponent(destination)}`);
    }
  }
  

  return (
    <>
    {/* <Navbar/> */}
         <div className="cover-img w-auto h-auto border-2  relative text-white ">
          <img className="h-[90vh] w-full object-cover brightness-50  " src="/assets/images/42551.jpg" alt="" />
          <div className="cover-img-content absolute  z-1000 py-12 px-96 inset-0 flex justify-center items-center flex-col ">
            <span className=" text-[55px] font-bold ">Discover. Compare. Travel Smarter</span>
            <p className="text-[24px] font-light text-center ">Compare real-time deals on Hotels, Flights, and Tour Packages — save time, save money, and plan your trip smarter, all in one place.</p>
              <div className="btns flex gap-[20px] items-center text-white font-medium text-[16px] mt-11 ">
                <button onClick={handleStartSearch} className="py-[10px] px-[14px]  rounded-md    cursor-pointer bg-[#007bff] hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-[5px] "><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 26 26"><path fill="white" d="M10 .188A9.812 9.812 0 0 0 .187 10A9.812 9.812 0 0 0 10 19.813c2.29 0 4.393-.811 6.063-2.125l.875.875a1.845 1.845 0 0 0 .343 2.156l4.594 4.625c.713.714 1.88.714 2.594 0l.875-.875a1.84 1.84 0 0 0 0-2.594l-4.625-4.594a1.824 1.824 0 0 0-2.157-.312l-.875-.875A9.812 9.812 0 0 0 10 .188zM10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM4.937 7.469a5.446 5.446 0 0 0-.812 2.875a5.46 5.46 0 0 0 5.469 5.469a5.516 5.516 0 0 0 3.156-1a7.166 7.166 0 0 1-.75.03a7.045 7.045 0 0 1-7.063-7.062c0-.104-.005-.208 0-.312z"/></svg><span>Start your search</span></button>
                <button onClick={handlePlanWithAI} className="py-[10px] px-[14px] rounded-md group  border border-white cursor-pointer hover:bg-white hover:text-blue-400  hover:scale-110  transition-all duration-300 ease-in-out flex items-center gap-[5px]"><svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-current group-hover:text-blue-400 transition-colors duration-300 " viewBox="0 0 24 24"><path   stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14 12.648l2.37-2.37c.294-.293.44-.44.518-.598c.15-.3.15-.653 0-.954c-.078-.158-.224-.304-.517-.597s-.44-.439-.597-.517a1.07 1.07 0 0 0-.954 0c-.158.078-.305.224-.598.517l-2.37 2.371M14 12.648l-8.222 8.223c-.293.293-.44.439-.598.517c-.3.15-.653.15-.954 0c-.158-.078-.304-.224-.597-.517s-.439-.44-.517-.597a1.07 1.07 0 0 1 0-.954c.078-.158.224-.305.517-.598l8.223-8.222M14 12.648L11.852 10.5m7.648-8l-.11.299c-.146.391-.218.587-.36.73c-.144.143-.34.216-.731.36L18 4l.299.11c.391.145.587.218.73.36c.143.144.215.34.36.731l.111.299l.11-.299c.146-.391.218-.587.36-.73c.144-.143.34-.216.731-.36L21 4l-.299-.11c-.391-.145-.587-.218-.73-.36c-.143-.144-.215-.34-.36-.731zm0 10l-.11.299c-.146.391-.218.587-.36.73c-.144.143-.34.216-.731.36L18 14l.299.11c.391.146.587.218.73.36c.143.144.215.34.36.731l.111.299l.11-.299c.146-.391.218-.587.36-.73c.144-.143.34-.216.731-.36L21 14l-.299-.11c-.391-.146-.587-.218-.73-.36c-.143-.144-.215-.34-.36-.731zm-9-10l-.11.299c-.146.391-.218.587-.36.73c-.144.143-.34.216-.731.36L9 4l.299.11c.391.145.587.218.73.36c.143.144.216.34.36.731l.111.299l.11-.299c.146-.391.218-.587.36-.73c.144-.143.34-.216.731-.36L12 4l-.299-.11c-.391-.145-.587-.218-.73-.36c-.143-.144-.216-.34-.36-.731z" color="currentColor"/></svg><span>Plan with Ai</span></button> 

              </div>
               <div className="searchBar flex justify-center items-center gap-3 mt-10 ">
                  <input className="border-2 cursor-pointer w-96 p-3 rounded-md" type="text" placeholder="Enter destination(e.g Goa)" />
                  <button onClick={handleSearch} className="text-white  cursor-pointer p-3 rounded-md bg-[#007bff] text-white-400 font-medium hover:bg-[#006fe7] hover:scale-105 transition-all duration-100 ease-in-out ">Search</button>
                </div>
             </div>
         </div>

    

         <div className="features mt-24 flex flex-col items-center justify-center gap-2 ">
           <h1 className="text-center text-[40px] font-bold">Your Travel Command Center</h1>
           <span className="text-[18px]">Everything you need to plan the perfect trip</span>

           <div className="featuresCards grid  grid-rows-1 grid-cols-4 gap-6 mt-16">
            {/* Card 1 */}
            <div className="featureCard flex flex-col justify-center items-center gap-[10px] w-[300px] h-[250px]  cursor-pointer p-[10px] rounded-md shadow-lg  hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-gradient-to-r from-[#fafdff] to-[#f2fbff]  ">
              <img className="w-[70px] h-[60px] " src="/assets/SVG's/magic.svg" alt="" />
              <h1 className="text-[20px] font-bold mt-[7px]">AI trip planner</h1>
              <span className="text-center text-[16px] font-light">Create intelligent itinearies with our ai assistant</span>
              <div className="capsule border-2  px-[5px] text-[12px]  rounded-xl bg-blue-100 text-blue-700 font-medium"><span>Smart planning</span></div>
            </div>
            {/* Card 2 */}
            <div className="featureCard flex flex-col justify-center items-center gap-[10px] w-[300px] h-[250px]  cursor-pointer p-[10px] rounded-md shadow-lg  hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-gradient-to-r from-[#fafffa] to-[#f5fff7] ">
              <img className="w-[70px] h-[60px] " src="/assets/SVG's/dollar.svg" alt="" />
              <h1 className="text-[20px] font-bold mt-[7px]">Budget Tracker</h1>
              <span className="text-center text-[16px] font-light">Track expenses smartly and stay within budget</span>
              <div className="capsule border-2  px-[5px] text-[12px]  rounded-xl bg-green-100 text-green-700 font-medium"><span>Money management</span></div>
            </div>
            {/* Card 3 */}
            <div className="featureCard flex flex-col justify-center items-center gap-[10px] w-[300px] h-[250px]  cursor-pointer p-[10px] rounded-md shadow-lg  hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-gradient-to-r from-[#fafaff] to-[#f9f5ff] ">
              <img className="w-[70px] h-[60px] " src="/assets/SVG's/gift.svg" alt="" />
              <h1 className="text-[20px] font-bold mt-[7px]">Travel Deals</h1>
              <span className="text-center text-[16px] font-light">Discover amazing offers from top platforms</span>
              <div className="capsule border-2  px-[5px] text-[12px]  rounded-xl bg-purple-100 text-purple-700 font-medium"><span>Best prices</span></div>
            </div>
            {/* Card 4 */}
            <div className="featureCard flex flex-col justify-center items-center gap-[10px] w-[300px] h-[250px]  cursor-pointer p-[10px] rounded-md shadow-lg  hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-gradient-to-r from-[#fffaf5] to-[#fff5eb]  hover:border-orange-300  ">
              <img className="w-[70px] h-[60px] " src="/assets/SVG's/mountain.svg" alt="" />
              <h1 className="text-[20px] font-bold mt-[7px]">Explore Places</h1>
              <span className="text-center text-[16px] font-light">Find inspiration and plan destinations</span>
              <div className="capsule border-2  px-[5px] text-[12px]  rounded-xl bg-orange-100 text-orange-700 font-medium"><span>Discover</span></div>
            </div>
                  
           </div>
         </div>

         <div className="destinations mt-24 flex flex-col items-center justify-center gap-2">
          <h1 className="text-center text-[40px] font-bold  ">Top Places to explore</h1>
          <span className="text-[18px]">Discover the most loved destinations and find the best deals on hotels, flights, and packages.</span>
          <div className="featuredDest grid grid-rows-2 grid-cols-3 gap-8 w-[80vw]   shadow-2xl rounded-2xl px-12 py-10  ">
            {/* img 1 */}
            <div className="img1 w-[350px] h-[250px]  relative flex flex-col justify-center items-center group ">
              <img className="  w-full h-full cursor-pointer group-hover:scale-105 group-hover:brightness-50 group-hover:rounded-xl  transition-all ease-in-out duration-300 " src="https://images.pexels.com/photos/88212/pexels-photo-88212.jpeg" alt="" />
              <div className="img-txt absolute top-[15px] text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col  items-center gap-5">
                <span className="text-[16px] font-bold ">Goa, India</span>
                <p className="text-[14px] ">Golden beaches, vibrant nightlife, and a paradise for travelers.</p>
              </div>
            </div>
            {/* img 2 */}
            <div className="img1 w-[350px] h-[250px]  relative flex flex-col justify-center items-center group ">
              <img className="  w-full h-full cursor-pointer group-hover:scale-105 group-hover:brightness-50 group-hover:rounded-xl  transition-all ease-in-out duration-300 object-fill  " src="https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg" alt="image" />
              <div className="img-txt absolute top-[15px] text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col  items-center gap-5">
                <span className="text-[16px] font-bold ">Paris, France</span>
                <p className="text-[14px] ">Romantic boulevards, world-class fashion, and the timeless charm of the City of Light.</p>
              </div>
            </div>
            {/* img 3 */}
            <div className="img1 w-[350px] h-[250px]  relative flex flex-col justify-center items-center group ">
              <img className="  w-full h-full cursor-pointer group-hover:scale-105 group-hover:brightness-50 group-hover:rounded-xl  transition-all ease-in-out duration-300 " src="https://images.pexels.com/photos/161772/las-vegas-nevada-cities-urban-161772.jpeg" alt="" />
              <div className="img-txt absolute top-[15px] text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col  items-center gap-5">
                <span className="text-[16px] font-bold ">Las Vegas,USA</span>
                <p className="text-[14px] ">Dazzling lights, endless entertainment, and the ultimate playground for thrill-seekers.</p>
              </div>
            </div>
            {/* img 4 */}
            <div className="img1 w-[350px] h-[250px]  relative flex flex-col justify-center items-center group ">
              <img className="  w-full h-full cursor-pointer group-hover:scale-105 group-hover:brightness-50 group-hover:rounded-xl  transition-all ease-in-out duration-300 " src="https://images.pexels.com/photos/2676642/pexels-photo-2676642.jpeg" alt="" />
              <div className="img-txt absolute top-[15px] text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col  items-center gap-5">
                <span className="text-[16px] font-bold ">Rome, Italy</span>
                <p className="text-[14px] ">Ancient ruins, artistic splendor, and the heart of history waiting to be explored.</p>
              </div>
            </div>
            {/* img 5 */}
            <div className="img1 w-[350px] h-[250px]  relative flex flex-col justify-center items-center group ">
              <img className="  w-full h-full cursor-pointer group-hover:scale-105 group-hover:brightness-50 group-hover:rounded-xl  transition-all ease-in-out duration-300 " src="https://images.pexels.com/photos/797824/pexels-photo-797824.jpeg" alt="" />
              <div className="img-txt absolute top-[15px] text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col  items-center gap-5">
                <span className="text-[16px] font-bold ">Rajasthan, India</span>
                <p className="text-[14px] ">Majestic forts, vibrant culture, and a royal journey through India’s golden deserts.</p>
              </div>
            </div>
            {/* img 6 */}
            <div className="img1 w-[350px] h-[250px]  relative flex flex-col justify-center items-center group ">
              <img className="  w-full h-full cursor-pointer group-hover:scale-105 group-hover:brightness-50 group-hover:rounded-xl  transition-all ease-in-out duration-300 " src="https://images.pexels.com/photos/427679/pexels-photo-427679.jpeg" alt="" />
              <div className="img-txt absolute top-[15px] text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col  items-center gap-5">
                <span className="text-[16px] font-bold ">London, UK</span>
                <p className="text-[14px] ">Historic landmarks, royal charm, and a blend of modern culture and timeless tradition.</p>
              </div>
            </div>
            
          </div>
         </div>

         {/* <LatestDeals /> */}

         {/* ===== Features Section ===== */}
      {/* (keep your existing feature cards here, unchanged) */}

      {/* ===== Popular Destinations ===== */}
      {/* (your destination cards remain the same) */}

      {/* ✅ Trending Deals Section */}
<section className="py-16 mt-24 bg-gradient-to-r from-blue-50 via-white to-pink-50">
  <h2 className="text-[40px] font-bold text-center text-gray-800 mb-8">
    Trending Travel Deals
  </h2>
  {/* <span className="text-center px-auto text-[18px]">Find trending offers on flights, stays, and adventures before they’re gone!</span> */}

  <div className="overflow-hidden relative w-full">
    <motion.div
      className="flex gap-6 px-8"
      animate={{
        x: ["0%", "-50%"], // Infinite scroll effect
      }}
      transition={{
        ease: "linear",
        duration: 20,
        repeat: Infinity,
      }}
    >
      {[...Array(2)].flatMap(() => [
        {
          id: 1,
          title: "Flight to Dubai",
          price: "$499",
          image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
          type: "Flight",
        },
        {
          id: 2,
          title: "Luxury Hotel in Bali",
          price: "$899",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
          type: "Hotel",
        },
        {
          id: 3,
          title: "Paris Getaway",
          price: "$749",
          image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
          type: "Tour",
        },
        {
          id: 4,
          title: "Maldives Honeymoon Offer",
          price: "$1299",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          type: "Resort",
        },
        {
          id: 5,
          title: "Adventure Trek - Nepal",
          price: "$499",
          image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
          type: "Adventure",
        },
      ]).map((deal) => (
        <div
          key={deal.id + Math.random()}
          className="min-w-[300px] bg-white shadow-md rounded-2xl overflow-hidden hover:scale-105 transition-all cursor-pointer"
        >
          <img
            src={deal.image}
            alt={deal.title}
            className="h-40 w-full object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-blue-600 font-semibold mb-1">
              {deal.type}
            </p>
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {deal.title}
            </h3>
            <p className="text-gray-500 text-sm mb-2">{deal.price}</p>
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded-lg hover:opacity-90 transition-all">
              View Deal
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  </div>
</section>

{/* ===== Weekend Deals Section (Similar to the screenshot) ===== */}
<section className="mt-24 px-10">
  <h2 className="text-[32px] font-bold">Deals for the Weekend</h2>
  <p className="text-gray-600 text-[16px] mb-6">
    Save on stays for <span className="font-medium">28 November – 30 November</span>
  </p>

  <div className="flex gap-6 overflow-x-scroll pb-4 hide-scrollbar">
    {[
      {
        id: 1,
        title: "Dahabi Venue Premium - 9 min from Delhi Airport T3",
        location: "New Delhi, India",
        rating: "6.4",
        reviews: "50 reviews",
        priceOld: "₹10,183",
        priceNew: "₹6,110",
        nights: "2 nights",
        offer: "Review score",
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      },
      {
        id: 2,
        title: "Trim Boutique Parkota Haveli",
        location: "Jaipur, India",
        rating: "8.4",
        reviews: "595 reviews",
        priceOld: "₹9,998",
        priceNew: "₹7,499",
        nights: "2 nights",
        offer: "Late Escape Deal",
        image:
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      },
      {
        id: 3,
        title: "Limewood Stay Oasis - Golf Course Road",
        location: "Gurgaon, India",
        rating: "9.0",
        reviews: "747 reviews",
        priceOld: "₹12,200",
        priceNew: "₹4,270",
        nights: "2 nights",
        offer: "Late Escape Deal",
        image:
          "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
      },
      {
        id: 4,
        title: "Hotel The Grand Olive Aero Suites Near Delhi Airport",
        location: "New Delhi, India",
        rating: "8.4",
        reviews: "156 reviews",
        priceOld: "₹4,424",
        priceNew: "₹2,743",
        nights: "2 nights",
        offer: "Late Escape Deal",
        image:
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
      },
    ].map((item) => (
      <div
        key={item.id}
        className="min-w-[300px] bg-white shadow-md rounded-2xl overflow-hidden hover:scale-105 transition"
      >
        {/* Image */}
        <div className="relative">
          <img src={item.image} alt={item.title} className="h-[180px] w-full object-cover" />
          <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition">
            ❤️
          </button>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="text-[17px] font-bold leading-tight line-clamp-2">{item.title}</h3>
          <p className="text-gray-600 text-sm">{item.location}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
              {item.rating}
            </span>
            <span className="text-gray-700 text-sm">Very good</span>
            <span className="text-gray-500 text-xs">{item.reviews}</span>
          </div>

          {/* Offer Tag */}
          <div className="mt-2 inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-medium">
            {item.offer}
          </div>

          {/* Price */}
          <div className="mt-4">
            <p className="text-gray-500 text-sm">{item.nights}</p>
            <p className="text-gray-400 line-through text-sm">{item.priceOld}</p>
            <p className="text-[20px] font-bold text-black">{item.priceNew}</p>
          </div>

          {/* Button */}
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            View Deal
          </button>
        </div>
      </div>
    ))}
  </div>
</section>



      {/* ===== Why Choose Us Section ===== */}
      <div className="why-us mt-24 flex flex-col items-center gap-6 text-center px-10">
        <h1 className="text-[40px] font-bold">Why Choose ExplorEase?</h1>
        <p className="text-[18px] text-gray-600 w-[60%]">
          From AI-based planning to real-time price comparison, ExplorEase is
          your one-stop solution for smarter travel decisions.
        </p>
        <div className="grid grid-cols-3 gap-8 mt-10">
          <div className="p-6 bg-white shadow-lg rounded-2xl hover:scale-105 transition-all">
            <img
              src="/assets/SVG's/support.svg"
              alt="support"
              className="w-[90px] mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">24/7 Assistance</h3>
            <p className="text-gray-600">
              Get real-time travel help whenever you need it, anywhere you go.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl hover:scale-105 transition-all">
            <img
              src="/assets/SVG's/earth.svg"
              alt="earth"
              className="w-[90px] mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
            <p className="text-gray-600">
              Explore deals and experiences from destinations all around the
              globe.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl hover:scale-105 transition-all">
            <img
              src="/assets/SVG's/discount.svg"
              alt="discount"
              className="w-[90px] mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">Smart Savings</h3>
            <p className="text-gray-600">
              Compare live offers and book with confidence at the best prices.
            </p>
          </div>
        </div>
      </div>

      {/* ===== Testimonials Section ===== */}
      <div className="testimonials mt-24 bg-gray-100 py-16">
        <h1 className="text-[40px] font-bold text-center mb-10">
          Traveler Stories
        </h1>
        <div className="flex justify-center gap-8 px-16">
          <div className="bg-white shadow-lg rounded-xl p-6 w-[300px] hover:scale-105 transition-all">
            <p className="text-gray-700 italic">
              “ExplorEase made planning our honeymoon trip a breeze. The AI
              itinerary saved us hours!”
            </p>
            <h4 className="mt-4 font-semibold">— Sarah & Amit</h4>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 w-[300px] hover:scale-105 transition-all">
            <p className="text-gray-700 italic">
              “The best deals I found online — everything compared in one place!”
            </p>
            <h4 className="mt-4 font-semibold">— Rohan Mehta</h4>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 w-[300px] hover:scale-105 transition-all">
            <p className="text-gray-700 italic">
              “Beautiful design and smooth experience. Definitely my go-to for
              travel planning.”
            </p>
            <h4 className="mt-4 font-semibold">— Emily Johnson</h4>
          </div>
        </div>
      </div>

        

         
         
         
    </>
  )
}

export default Home;
