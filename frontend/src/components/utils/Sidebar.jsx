import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaTimes,
  FaClock,
  FaSignOutAlt,
  FaHome,
  FaUserGraduate,
  FaClipboardList,
  FaUser,
} from "react-icons/fa"; // Import icons

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT token from sessionStorage
    sessionStorage.removeItem("jwtToken");
    // Set a flag to indicate logout action (optional but helpful)
    sessionStorage.setItem("justLoggedOut", "true");
    // Close sidebar first
    onClose();
    // Then navigate to signin page
    navigate("/signin");
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
          to="/"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaHome className="mr-4 text-lg" />
          <span className="text-lg">Home</span>
        </Link>
        <Link
          to="/proctor"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaUserGraduate className="mr-4 text-lg" />
          <span className="text-lg">Take Test</span>
        </Link>
        <Link
          to="/upload"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaClipboardList className="mr-4 text-lg" />
          <span className="text-lg">Upload PDF</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaUser className="mr-4 text-lg" />
          <span className="text-lg">Profile</span>
        </Link>
        <Link
          to="/history"
          className="flex items-center p-4 my-2 rounded-lg hover:bg-gray-800 transition-all duration-300 hover:pl-6"
          onClick={onClose}
        >
          <FaClock className="mr-4 text-lg" />
          <span className="text-lg">History</span>
        </Link>
      </nav>

      {/* Logout button at the bottom */}
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
