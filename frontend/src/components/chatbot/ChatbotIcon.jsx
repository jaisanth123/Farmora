// ChatbotIcon.jsx
import React from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

const ChatbotIcon = ({ toggleChat, isOpen }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-xl 
                 bg-black transition-all duration-300 transform hover:scale-110 
                 hover:shadow-2xl active:scale-95 flex items-center justify-center"
    >
      {isOpen ? (
        <FaTimes className="text-3xl text-white" />
      ) : (
        <FaRobot className="text-3xl text-white" />
      )}
    </button>
  );
};

export default ChatbotIcon;
