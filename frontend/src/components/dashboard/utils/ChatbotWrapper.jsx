// src/components/dashboard/utils/ChatbotWrapper.jsx
import React from "react";
import { Chatbot } from "../../chatbot-new";

const ChatbotWrapper = ({ isChatOpen, toggleChat, setIsChatOpen }) => {
  // The new Chatbot component is self-contained and handles its own state
  // This wrapper is now simplified since the new chatbot manages everything internally
  return <Chatbot />;
};

export default ChatbotWrapper;
