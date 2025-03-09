// src/components/dashboard/ActionMenuBar.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaBell, FaCog } from "react-icons/fa";

const ActionMenuBar = ({ viewType, setViewType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-sm p-3 mb-6 flex justify-between items-center"
    >
      <div className="flex space-x-3">
        <button
          className={`px-3 py-1 rounded-full ${
            viewType === "dashboard"
              ? "bg-green-500 text-white"
              : "hover:bg-gray-100 text-gray-500"
          }`}
          onClick={() => setViewType("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-3 py-1 rounded-full flex items-center ${
            viewType === "calendar"
              ? "bg-green-500 text-white"
              : "hover:bg-gray-100 text-gray-500"
          }`}
          onClick={() => setViewType("calendar")}
        >
          <FaCalendarAlt className="mr-1" size={14} />
          Calendar
        </button>
      </div>
      <div>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150">
          Add New Crop
        </button>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <FaBell className="text-gray-500" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FaCog className="text-gray-500" />
        </button>
      </div>
    </motion.div>
  );
};

export default ActionMenuBar;
