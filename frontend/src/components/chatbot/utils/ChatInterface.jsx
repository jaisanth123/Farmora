import React, { useState } from "react";
import ChatMessage from "../ChatMessage";
import ChatInput from "../ChatInput";
import SuggestionRows from "./SuggestionRows";

const ChatInterface = ({ messages, handleSend }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="border-t border-gray-200">
        {showSuggestions && <SuggestionRows handleSend={handleSend} />}

        <ChatInput
          onSend={handleSend}
          showSuggestions={showSuggestions}
          toggleSuggestions={toggleSuggestions}
        />
      </div>
    </>
  );
};

export default ChatInterface;
