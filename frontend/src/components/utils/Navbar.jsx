import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import GoogleTranslate from "../GoogleTranslate";
import {
  FaBars,
  FaHome,
  FaUser,
  FaCaretDown,
  FaSeedling,
  FaMicroscope,
  FaBook,
  FaGlobe,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-google-multi-lang";
import { BsChatLeftTextFill } from "react-icons/bs";

const NavBar = ({ toggleSidebar }) => {
  const { setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Language options with flag codes and names
  const languages = [
    { code: "en", name: "English", flag: "gb" },
    { code: "ta", name: "Tamil", flag: "in" },
    { code: "es", name: "Español", flag: "es" },
    { code: "fr", name: "Français", flag: "fr" },
    { code: "hi", name: "हिंदी", flag: "in" },
    { code: "zh", name: "中文", flag: "cn" },
  ];

  // Toggle dropdown functions
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (showLangDropdown) setShowLangDropdown(false);
  };

  const toggleLangDropdown = () => {
    setShowLangDropdown(!showLangDropdown);
    if (showDropdown) setShowDropdown(false);
  };

  // Handle language change
  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setShowLangDropdown(false);
  };

  // Get flag emoji from country code
  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setShowLangDropdown(false);
      }
    };

    // Add event listener when any dropdown is open
    if (showDropdown || showLangDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showLangDropdown]);

  return (
    <nav className="bg-black p-4 shadow-lg fixed top-0 left-0 right-0 w-full z-40">
      <div className="w-full h-10 flex justify-between items-center">
        <div className="flex items-center text-white">
          <FaBars
            onClick={toggleSidebar}
            className="cursor-pointer mr-4 text-2xl hover:scale-110 sidebar-toggle transition"
          />
          <Link
            to="/dashboard"
            className="text-white hover:underline duration-500 transition"
          >
            <span className="font-bold hover:scale-110 text-2xl">
              Farmora 🌾
            </span>
          </Link>
        </div>

        <div className="flex space-x-8 mr-4 relative">
          {/* Home Link */}
          <Link
            to="/dashboard"
            className="text-white hover:text-green-400 hover:scale-110 hover:underline duration-500 transition flex items-center"
          >
            <FaHome className="mr-2" />
            <span>Home</span>
          </Link>

          {/* Crop & Disease Guide Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-green-400 hover:scale-110 hover:underline duration-500 transition flex items-center"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <FaBook className="mr-2" />
              <span>Crop & Disease Guide</span>
              <FaCaretDown
                className={`ml-2 transition-transform duration-300 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute bg-white rounded-md shadow-lg mt-2 py-2 w-56 transition-opacity duration-300 ease-in-out opacity-100 transform scale-100 origin-top">
                <Link
                  to="/crop-recommendation"
                  className="block px-4 py-2 text-gray-800 hover:bg-green-100 transition flex items-center"
                  onClick={() => setShowDropdown(false)}
                >
                  <FaSeedling className="mr-2 text-green-600" />
                  <span>Crop Recommendation</span>
                </Link>
                <Link
                  to="/disease"
                  className="block px-4 py-2 text-gray-800 hover:bg-green-100 transition flex items-center"
                  onClick={() => setShowDropdown(false)}
                >
                  <FaMicroscope className="mr-2 text-red-600" />
                  <span>Disease Diagnosis</span>
                </Link>
              </div>
            )}
          </div>

          {/* Discussion Forum Link */}
          <Link
            to="/forum"
            className="text-white hover:text-green-400 hover:scale-110 hover:underline duration-500 transition flex items-center"
          >
            <BsChatLeftTextFill className="mr-2" />
            <span>Discussion Forum</span>
          </Link>

          {/* Profile Link */}
          <Link
            to="/profile"
            className="text-white hover:text-green-400 hover:scale-110 hover:underline duration-500 transition flex items-center"
          >
            <FaUser className="mr-2" />
            <span>Profile</span>
          </Link>
          <div className="text-white">
            <GoogleTranslate />
          </div>
          {/* Language Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={toggleLangDropdown}
              className="text-white hover:text-green-400 hover:scale-110 hover:underline duration-500 transition flex items-center"
              aria-expanded={showLangDropdown}
              aria-haspopup="true"
            >
              <FaGlobe className="mr-2" />
              <span>
                {getFlagEmoji(
                  languages.find((lang) => lang.code === currentLang)?.flag ||
                    "gb"
                )}{" "}
                {languages.find((lang) => lang.code === currentLang)?.name}
              </span>
              <FaCaretDown
                className={`ml-2 transition-transform duration-300 ${
                  showLangDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 bg-white rounded-md shadow-lg mt-2 py-2 w-40 transition-all duration-300 ease-in-out animate-fadeIn">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-green-100 transition flex items-center justify-between ${
                      currentLang === language.code
                        ? "bg-green-50 font-medium"
                        : ""
                    }`}
                  >
                    <span>{language.name}</span>
                    <span className="text-xl">
                      {getFlagEmoji(language.flag)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
