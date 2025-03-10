import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUser,
  FaCaretDown,
  FaSeedling,
  FaMicroscope,
  FaBook,
  FaComments,
  FaLeaf,
} from "react-icons/fa";
import { BsChatLeftTextFill } from "react-icons/bs";
const NavBar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown function
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="bg-black p-4 shadow-lg fixed top-0 left-0 right-0 w-full z-40">
      <div className="w-full h-10 flex justify-between items-center">
        <div className="flex items-center  text-white">
          <FaBars
            onClick={toggleSidebar}
            className="cursor-pointer mr-4 text-2xl hover:scale-110 sidebar-toggle  transition"
          />
          <Link
            to="/dashboard"
            className="text-white  hover:underline duration-500 transition"
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

          {/* Crop & Disease Guide Dropdown - Changed icon to FaBook */}
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
              <div className="absolute bg-white rounded-md shadow-lg mt-2 py-2 w-56 transition-all duration-300 ease-in-out">
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

          {/* Discussion Forum Link - Changed icon to FaComments */}
          <Link
            to="/forum"
            className="text-white hover:text-green-400 hover:scale-110 hover:underline duration-500 transition flex items-center"
          >
            <BsChatLeftTextFill className="mr-2" />
            <span>Discussion Forum</span>
          </Link>

          {/* Profile Link - Kept FaUser as it's appropriate */}
          <Link
            to="/profile"
            className="text-white hover:text-green-400 hover:scale-110 hover:underline duration-500 transition flex items-center"
          >
            <FaUser className="mr-2" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
