// src/components/Navbar.jsx
import React, { useContext } from 'react';
import '../App.css';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../components/i18n/i18n.js';
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);   // ✅ AUTH CONTEXT
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="m-0 p-0">
      <nav className="bg-white w-full shadow-lg py-5 px-10 flex items-center justify-between">

        {/* ---------- LEFT: LOGO ---------- */}
        <div className="w-1/3 flex justify-start">
          <div
            onClick={() => navigate("/")}
            className="text-3xl font-bold text-blue-800 cursor-pointer"
          >
            ExplorEase
          </div>
        </div>

        {/* ---------- CENTER: NAVIGATION LINKS ---------- */}
        <div className="w-3xl flex justify-center ">
          <ul className="flex gap-10 items-center font-medium text-[14px]">

            <li>
              <Link to="/" className="hover:text-blue-500 transition flex gap-[9px]">
                
                <span>{t('dashboard')}</span>
              </Link>
            </li>

            <li>
              <Link to="/ai-planner" className="hover:text-blue-500 transition flex gap-[9px]">
                <span>{t('planTrip')}</span>
              </Link>
            </li>

            <li>
              <Link to="/deals" className="hover:text-blue-500 transition flex gap-[9px]">
                <span>{t('deals')}</span>
              </Link>
            </li>

            <li>
              <Link to="/compare" className="hover:text-blue-500 transition flex gap-[9px]">
                <span>{t('compare')}</span>
              </Link>
            </li>

          </ul>
        </div>

        {/* ---------- RIGHT: AUTH SECTION ---------- */}

        <div className="flex items-center gap-4">

          {/* IF USER NOT LOGGED IN */}

          {!user ? (

            <Link
              to="/login"
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              {t('login')}
            </Link>

          ) : (

            /* PROFILE AVATAR */

            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 cursor-pointer group"
            >

              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <span className="text-sm text-gray-700 group-hover:text-blue-600">
                Account
              </span>

            </div>

          )}

        </div>

      </nav>
    </div>
  );
};

export default Navbar;
