// src/components/Navbar.jsx
import React from 'react';
import '../App.css';
import '../index.css';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import '../components/i18n/i18n.js';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="m-0 p-0">
      <nav className="bg-white w-full shadow-lg py-5 px-10 flex items-center justify-between">
        
        {/* ---------- LEFT: LOGO ---------- */}
        <div className="w-1/3 flex justify-start">
          <div className="text-3xl font-bold text-blue-800 cursor-pointer">ExplorEase</div>
        </div>

        {/* ---------- CENTER: NAVIGATION LINKS ---------- */}
        <div className="w-3xl flex justify-center ">
          <ul className="flex gap-10 items-center font-medium text-[14px]">
            <li>
              <Link to="/" className="hover:text-blue-500 transition flex gap-[9px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[23px] h-[23px] fill-current group-hover:text-blue-400 transition-colors duration-300" viewBox="0 0 24 24">
                  <path d="M11 4.68v3.88a2.45 2.45 0 0 1-1.509 2.258A2.409 2.409 0 0 1 8.56 11H4.68a2.44 2.44 0 0 1-2.43-2.44V4.69a2.44 2.44 0 0 1 2.43-2.44h3.88A2.44 2.44 0 0 1 11 4.68m10.75.01v3.87a2.41 2.41 0 0 1-.71 1.72a2.378 2.378 0 0 1-1.72.72h-3.88a2.45 2.45 0 0 1-2.256-1.502A2.4 2.4 0 0 1 13 8.56V4.69a2.391 2.391 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.88a2.44 2.44 0 0 1 2.43 2.44M11 15.45v3.87a2.44 2.44 0 0 1-2.44 2.43H4.68a2.45 2.45 0 0 1-1.72-.71a2.41 2.41 0 0 1-.71-1.72v-3.87a2.41 2.41 0 0 1 .71-1.72A2.47 2.47 0 0 1 4.68 13h3.88A2.46 2.46 0 0 1 11 15.45m10.75 1.93A4.37 4.37 0 1 1 17.37 13a4.4 4.4 0 0 1 4.049 2.707c.22.53.332 1.099.331 1.673"/>
                </svg>
                <span>{t('dashboard')}</span>
              </Link>
            </li>
            <li>
              <Link to="/ai-planner" className="hover:text-blue-500 transition flex gap-[9px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[23px] h-[23px] fill-current group-hover:text-blue-400 transition-colors duration-300" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.5 6.5l3-2.9a2.05 2.05 0 0 1 2.9 2.9l-2.9 3L20 17l-2.5 2.55L14 13l-3 3v3l-2 2l-1.5-4.5L3 15l2-2h3l3-3l-6.5-3.5L7 4l7.5 2.5z"/>
                </svg>
                <span>{t('planTrip')}</span>
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-blue-500 transition flex gap-[9px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[23px] h-[23px] fill-current group-hover:text-blue-400 transition-colors duration-300" viewBox="0 0 24 24">
                  <path d="M19.5 7.75h-1.4c.4-.48.65-1.08.65-1.75c0-1.52-1.23-2.75-2.75-2.75c-1.68 0-3.16.89-4 2.21a4.75 4.75 0 0 0-4-2.21C6.48 3.25 5.25 4.48 5.25 6c0 .67.25 1.27.65 1.75H4.5c-.69 0-1.25.56-1.25 1.25v2.5c0 .6.43 1.08 1 1.2v6.8c0 .69.56 1.25 1.25 1.25h13c.69 0 1.25-.56 1.25-1.25v-6.8c.57-.12 1-.6 1-1.2V9c0-.69-.56-1.25-1.25-1.25Zm-.25 3.5h-6.5v-2h6.5v2ZM16 4.75a1.25 1.25 0 0 1 0 2.5h-3.16c.34-1.43 1.63-2.5 3.16-2.5Zm-8 0c1.53 0 2.82 1.07 3.16 2.5H8a1.25 1.25 0 0 1 0-2.5Zm-3.25 4.5h6.5v2h-6.5v-2Zm1 3.5h5.5v6.5h-5.5v-6.5Zm12.5 6.5h-5.5v-6.5h5.5v6.5Z"/>
                </svg>
                <span>{t('deals')}</span>
              </Link>
            </li>
            <li>
              <Link to="/compare" className="hover:text-blue-500 transition flex gap-[9px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[23px] h-[23px] fill-current group-hover:text-blue-400 transition-colors duration-300" viewBox="0 0 24 24">
                  <path d="M18.364 5.636A9 9 0 1 0 5.636 18.364A9 9 0 0 0 18.364 5.636ZM4.222 4.222c4.296-4.296 11.26-4.296 15.556 0c4.296 4.296 4.296 11.26 0 15.556c-4.296 4.296-11.26 4.296-15.556 0c-4.296-4.296-4.296-11.26 0-15.556Zm13.22 2.337l-4.965 12.91l-2.1-5.844l-5.845-2.1l12.91-4.966Zm-7.174 4.902l1.672.6l.6 1.672l1.42-3.692l-3.692 1.42Z"/>
                </svg>
                <span>{t('compare')}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* ---------- RIGHT: LOGIN + LANGUAGE SELECTOR ---------- */}
        <div className="w-1/3 flex justify-end items-center gap-6">
          {/* Language Selector */}
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          >
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="es">🇪🇸 Español</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="hi">🇮🇳 हिन्दी</option>
          </select>
          
          <Link
            to="/login"
            className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            {t('login')}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;