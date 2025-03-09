// ChatbotIcon.jsx
import React from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

const ChatbotIcon = ({ toggleChat, isOpen }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 transition-all duration-300"
    >
      {isOpen ? (
        <FaTimes className="h-6 w-6" />
      ) : (
        <FaRobot className="h-6 w-6" />
      )}
    </button>
  );
};

export default ChatbotIcon;
