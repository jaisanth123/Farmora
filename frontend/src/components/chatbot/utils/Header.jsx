import React from "react";
import { FaTimes, FaComment, FaMicrophone } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const Header = ({ closeChat, isVoiceMode, toggleVoiceMode }) => {
  return (
    <div className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <GiFarmer className="text-green-500 text-2xl hover:text-4xl transform duration-500" />
        <h3 className="ml-2 font-semibold text-xl">Farmora Assistant</h3>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex rounded-full p-1">
          <button
            className="rounded-full p-2 transition-colors text-white"
            onClick={toggleVoiceMode}
            aria-label={
              isVoiceMode ? "Switch to Chat Mode" : "Switch to Voice Mode"
            }
            title={isVoiceMode ? "Switch to Chat Mode" : "Switch to Voice Mode"}
          >
            {isVoiceMode ? (
              <FaMicrophone className="text-2xl" />
            ) : (
              <FaComment className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      <button
        onClick={closeChat}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        aria-label="Close Chat"
      >
        <FaTimes className="text-white text-xl" />
      </button>
    </div>
  );
};

export default Header;
