// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './components/i18n/i18n.js'; // Import i18n configuration
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AIPlanner from './pages/AIPlanner';
import TravelPreferences from './pages/TravelPreferences';
import ItineraryResult from './pages/ItineraryResult';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Deals from './pages/TravelDeals';
import ComparePage from './pages/ComparePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/travel-preferences" element={<TravelPreferences />} />
          <Route path="/itinerary-result" element={<ItineraryResult />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;