import React from "react";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaUserGraduate,
  FaHome,
  FaRegUser,
  FaUser,
  FaBars,
} from "react-icons/fa";

const NavBar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-black p-4 shadow-lg fixed top-0 left-0 right-0 w-full z-40">
      <div className="w-full h-10 flex justify-between items-center">
        <div className="flex items-center text-white">
          <FaBars
            onClick={toggleSidebar}
            className="cursor-pointer mr-4 sidebar-toggle"
          />
          <span className="font-bold text-2xl">Farmora 🌾 </span>
        </div>
        <div className="flex space-x-8 mr-4">
          <Link
            to="/"
            className="text-white hover:scale-110 hover:underline duration-500 transition"
          >
            <FaHome className="mr-1 inline" /> Home
          </Link>
          <Link
            to="/proctor"
            className="text-white hover:scale-110 hover:underline duration-500 transition"
          >
            <FaUserGraduate className="mr-1 inline" /> Take Test
          </Link>

          <Link
            to="/upload"
            className="text-white hover:underline duration-500 hover:scale-110 transition"
          >
            <FaClipboardList className="mr-1 inline" /> Upload PDF
          </Link>
          <Link
            to="/profile"
            className="text-white hover:scale-110 hover:underline duration-500 transition"
          >
            <FaUser className="mr-1 inline" /> Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
