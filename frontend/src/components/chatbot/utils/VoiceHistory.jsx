import React from "react";
import { FaMicrophone, FaVolumeUp, FaArrowUp } from "react-icons/fa";

const VoiceHistory = ({ messages, scrollToMicrophone }) => {
  return (
    <div className="p-4 border-t border-gray-200 relative">
      <div className="text-gray-700 font-medium mb-2 flex justify-between items-center">
        <span>Recent Conversation</span>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        {/* Chat bubbles container - Messages in reverse order */}
        <div className="flex flex-col space-y-3">
          {messages
            .slice()
            .reverse()
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-black text-white rounded-tr-none"
                      : "bg-gray-200 text-black rounded-tl-none"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 flex items-center">
                    {message.sender === "user" ? (
                      <>
                        <FaMicrophone className="mr-1" size={10} /> You
                      </>
                    ) : (
                      <>
                        <FaVolumeUp className="mr-1 text-green-800" size={10} />
                        Farmora
                      </>
                    )}
                  </div>
                  <div>{message.text}</div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={scrollToMicrophone}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            aria-label="Go back to microphone"
          >
            <FaArrowUp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceHistory;
