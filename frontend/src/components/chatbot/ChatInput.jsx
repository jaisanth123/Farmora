// ChatInput.jsx
import React, { useState } from "react";
import { FaPaperPlane, FaLightbulb } from "react-icons/fa";

const ChatInput = ({ onSend, showSuggestions, toggleSuggestions }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center p-3 border-t border-gray-200 gap-2"
    >
      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 pr-10 h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="absolute right-3">
          <button
            type="button"
            onClick={toggleSuggestions}
            className="focus:outline-none hover:scale-110 transition-transform"
          >
            <FaLightbulb
              className={`h-5s mt-1 w-5 ${
                showSuggestions ? "text-yellow-400" : "text-black"
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
