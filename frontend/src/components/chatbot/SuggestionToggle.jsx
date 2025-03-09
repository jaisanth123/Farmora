import React from "react";
import { FaLightbulb } from "react-icons/fa";

const SuggestionToggle = ({ showSuggestions, toggleSuggestions }) => {
  return (
    <div className="px-4 py-1 flex items-center justify-between bg-gray-50 border-b border-gray-200">
      <span className="text-xs text-gray-500">Show suggestions</span>
      <button
        onClick={toggleSuggestions}
        className={`w-10 h-5 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
          showSuggestions ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300 ${
            showSuggestions ? "translate-x-5" : "translate-x-1"
          }`}
        ></span>
      </button>
    </div>
  );
};

export default SuggestionToggle;
