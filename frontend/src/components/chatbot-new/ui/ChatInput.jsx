import React, { useState } from "react";
import { FaPaperPlane, FaLightbulb } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

const ChatInput = ({
  onSend,
  showSuggestions,
  toggleSuggestions,
  isLoading,
  language,
  onLanguageChange,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSend(inputMessage);
      setInputMessage("");
    }
  };

  const handleLanguageChange = (lang) => {
    onLanguageChange(lang);
    setShowLanguageDropdown(false);
  };

  return (
    <div className="border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center p-3 gap-2">
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center px-1 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >
            {language === "english" ? "English" : "தமிழ்"}
            <IoChevronDown className="w-3 h-3" />
          </button>

          {showLanguageDropdown && (
            <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <ul>
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    language === "english" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleLanguageChange("english")}
                >
                  English
                </li>
                <li
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    language === "tamil" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleLanguageChange("tamil")}
                >
                  தமிழ்
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              language === "english"
                ? "Type your message..."
                : "உங்கள் செய்தியை உள்ளிடவும்..."
            }
            className="w-full p-2 pr-16 h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isLoading}
          />
          <div className="absolute right-3 flex gap-2">
            <button
              type="button"
              onClick={toggleSuggestions}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <FaLightbulb
                className={`h-5 w-5 ${
                  showSuggestions ? "text-yellow-400" : "text-gray-500"
                }`}
              />
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-black text-white p-2 h-10 w-10 rounded-lg hover:bg-gray-800 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
          disabled={!inputMessage.trim() || isLoading}
        >
          <FaPaperPlane className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
