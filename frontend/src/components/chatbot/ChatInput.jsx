import React, { useState, useEffect } from "react";
import {
  FaPaperPlane,
  FaLightbulb,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

const ChatInput = ({ onSend, showSuggestions, toggleSuggestions }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("english");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Mock SpeechRecognition API if not available in the browser
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let recognition = null;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = language === "english" ? "en-US" : "ta-IN";
      recognition.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setMessage(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (isListening && recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognition && isListening) {
      recognition.stop();
      recognition.lang = language === "english" ? "en-US" : "ta-IN";
      recognition.start();
    }
  }, [language]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center p-3 border-t border-gray-200 gap-2"
    >
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="flex items-center  px-1 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            language === "english"
              ? "Type your message..."
              : "உங்கள் செய்தியை உள்ளிடவும்..."
          }
          className="w-full p-2 pr-16 h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="absolute right-3 flex gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`focus:outline-none hover:scale-110 transition-transform ${
              isListening ? "text-red-500" : "text-gray-500"
            }`}
          >
            {isListening ? (
              <FaMicrophone className="h-5 w-5" />
            ) : (
              <FaMicrophoneSlash className="h-5 w-5" />
            )}
          </button>
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
        className="bg-black text-white p-2 h-10 w-10 rounded-lg hover:bg-gray-800 flex items-center justify-center hover:scale-105 transition-transform"
        disabled={!message.trim()}
      >
        <FaPaperPlane className="h-4 w-4" />
      </button>
    </form>
  );
};

export default ChatInput;
