import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import { useChatbot } from "./hooks/useChatbot";
import ChatInterface from "./ui/ChatInterface";
import ChatInput from "./ui/ChatInput";
import Suggestions from "./suggestions/Suggestions";

// Chatbot Icon Component
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

// Header Component
const Header = ({ closeChat }) => {
  return (
    <div className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <GiFarmer className="text-green-500 text-2xl hover:text-4xl transform duration-500" />
        <h3 className="ml-2 font-semibold text-xl">Farmora Assistant</h3>
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

// Main Chatbot Dialog Container
const ChatbotDialog = ({ closeChat, children }) => {
  return (
    <div className="fixed bottom-24 right-6 w-96 h-140 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden border border-gray-200">
      <div className="sticky top-0 z-10">
        <Header closeChat={closeChat} />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

// Main Chatbot Component
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    messages,
    isLoading,
    language,
    sendMessage,
    changeLanguage,
    messagesEndRef,
  } = useChatbot();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const handleSuggestionClick = async (suggestionText) => {
    await sendMessage(suggestionText);
    toggleSuggestions();
  };

  return (
    <>
      <ChatbotIcon toggleChat={toggleChat} isOpen={isOpen} />
      {isOpen && (
        <ChatbotDialog closeChat={closeChat}>
          <div className="flex flex-col h-full">
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
            {showSuggestions && (
              <Suggestions
                handleSend={sendMessage}
                toggleSuggestions={toggleSuggestions}
                handleSuggestionClick={handleSuggestionClick}
              />
            )}
            <ChatInput
              onSend={sendMessage}
              showSuggestions={showSuggestions}
              toggleSuggestions={toggleSuggestions}
              isLoading={isLoading}
              language={language}
              onLanguageChange={changeLanguage}
            />
          </div>
        </ChatbotDialog>
      )}
    </>
  );
};

export default Chatbot;
