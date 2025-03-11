import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FaTimes,
  FaHome,
  FaSeedling,
  FaDisease,
  FaChartLine,
  FaComments,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { MdOutlineForum, MdWbSunny } from "react-icons/md";
import GoogleTranslate from "../GoogleTranslate";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-72 h-full bg-black text-white transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } shadow-2xl z-50`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Menu</h2>
        <FaTimes
          onClick={onClose}
          className="cursor-pointer text-xl hover:text-red-500 transition-colors duration-300"
        />
      </div>
      <nav className="mt-6 px-4">
        <Link
          to="/dashboard"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaHome className="mr-4 text-lg" />
          <span className="text-lg">Home</span>
        </Link>
        <Link
          to="/crop-recommendation"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaSeedling className="mr-4 text-lg" />
          <span className="text-lg">Crop Recommendation</span>
        </Link>
        <Link
          to="/disease"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaDisease className="mr-4 text-lg" />
          <span className="text-lg">Disease Diagnosis</span>
        </Link>
        <Link
          to="/market-analysis"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaChartLine className="mr-4 text-lg" />
          <span className="text-lg">Market Analysis</span>
        </Link>
        <Link
          to="/forum"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <MdOutlineForum className="mr-4 text-lg" />
          <span className="text-lg">Discussion Forum</span>
        </Link>
        <Link
          to="/weather"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <MdWbSunny className="mr-4 text-lg" />
          <span className="text-lg">Weather Forecast</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaUser className="mr-4 text-lg" />
          <span className="text-lg">Profile</span>
        </Link>
      </nav>
      <div className="flex justify-center items-center p-4 border-t border-white">
        <GoogleTranslate />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4 rounded-lg text-black bg-white hover:scale-110 duration-500 hover:text-white hover:bg-red-800 transition-all"
        >
          <FaSignOutAlt className="mr-4 text-lg" />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
