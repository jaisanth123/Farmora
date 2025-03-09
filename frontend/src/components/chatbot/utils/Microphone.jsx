import React from "react";
import { FaMicrophone, FaVolumeUp } from "react-icons/fa";

const Microphone = ({
  isListening,
  isSpeaking,
  audioLevel,
  toggleListening,
}) => {
  return (
    <div className="relative mb-4">
      {/* Reactive Microphone with Aura SVG */}
      <div
        onClick={toggleListening}
        className="cursor-pointer"
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Outer aura circles - animated based on audio level */}
          {isListening && !isSpeaking && (
            <>
              <circle
                cx="100"
                cy="100"
                r={50 + audioLevel * 40}
                fill="rgba(52, 211, 153, 0.1)"
                className="transition-all duration-300 ease-out"
              />
              <circle
                cx="100"
                cy="100"
                r={50 + audioLevel * 25}
                fill="rgba(52, 211, 153, 0.15)"
                className="transition-all duration-300 ease-out"
              />
              <circle
                cx="100"
                cy="100"
                r={50 + audioLevel * 10}
                fill="rgba(52, 211, 153, 0.2)"
                className="transition-all duration-300 ease-out"
              />
            </>
          )}

          {/* Speaking animation */}
          {isSpeaking && (
            <>
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="rgba(52, 211, 153, 0.1)"
                className="animate-ping opacity-30"
              />
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="rgba(52, 211, 153, 0.15)"
                className="animate-pulse opacity-50"
              />
            </>
          )}

          {/* Main circle */}
          <circle
            cx="100"
            cy="100"
            r="50"
            fill={isListening ? "black" : isSpeaking ? "black" : "black"}
            className="transition-colors duration-300"
          />

          {/* Icon in center */}
          <foreignObject x="70" y="70" width="60" height="60">
            <div className="flex items-center justify-center h-full">
              {isListening ? (
                <FaMicrophone className="text-white text-4xl" />
              ) : isSpeaking ? (
                <FaVolumeUp className="text-white text-4xl" />
              ) : (
                <FaMicrophone className="text-white text-4xl" />
              )}
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Status indicator */}
      <div className="mt-4 text-lg font-medium">
        {isListening
          ? "Listening..."
          : isSpeaking
          ? "Speaking..."
          : "Tap microphone to speak"}
      </div>
    </div>
  );
};

export default Microphone;
