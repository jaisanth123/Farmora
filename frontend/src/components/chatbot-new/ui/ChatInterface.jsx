import React from "react";
import { IoIosPerson } from "react-icons/io";
import { FaRobot } from "react-icons/fa";

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`flex items-center max-w-[80%] gap-2 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">
          {isUser ? (
            <IoIosPerson className="text-black text-2xl" />
          ) : (
            <FaRobot className="text-black text-2xl" />
          )}
        </div>
        <div
          className={`p-3 rounded-xl mb-2 shadow-md transition-colors ${
            isUser
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};

const LoadingMessage = () => (
  <div className="flex justify-start my-2">
    <div className="flex items-center max-w-[80%] gap-2">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">
        <FaRobot className="text-black text-2xl" />
      </div>
      <div className="bg-gray-100 text-gray-800 p-3 rounded-xl mb-2 shadow-md">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: "200ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: "400ms" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

const ChatInterface = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
