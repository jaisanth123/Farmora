import React, { useState, useRef, useEffect } from "react";
import { FaHistory, FaArrowUp } from "react-icons/fa";
import Microphone from "./Microphone";
import VoiceHistory from "./VoiceHistory";

const VoiceInterface = ({
  messages,
  isListening,
  isSpeaking,
  audioLevel,
  toggleListening,
}) => {
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const voiceContainerRef = useRef(null);
  const microphoneRef = useRef(null);

  const toggleConversationHistory = () => {
    setShowConversationHistory(!showConversationHistory);
  };

  const scrollToTop = () => {
    if (voiceContainerRef.current) {
      voiceContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToMicrophone = () => {
    if (microphoneRef.current) {
      microphoneRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll event to show/hide the scroll to top button
  const handleScroll = () => {
    if (voiceContainerRef.current) {
      const { scrollTop } = voiceContainerRef.current;
      setShowScrollToTop(scrollTop > 200);
    }
  };

  // Add scroll event listener to the voice container
  useEffect(() => {
    const container = voiceContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [showConversationHistory]);

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div ref={voiceContainerRef} className="flex-1 overflow-y-auto">
        <div
          ref={microphoneRef}
          className="flex flex-col items-center justify-center p-6 text-center min-h-96"
        >
          <Microphone
            isListening={isListening}
            isSpeaking={isSpeaking}
            audioLevel={audioLevel}
            toggleListening={toggleListening}
          />

          {/* Single button for history */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleConversationHistory}
              className="px-4 py-2 bg-black text-gray-200 rounded-full font-medium hover:scale-110 duration-500 transform flex items-center"
            >
              <FaHistory className="mr-2" />{" "}
              {showConversationHistory ? "Hide History" : "Show History"}
            </button>
          </div>
        </div>

        {/* Conversation history */}
        {showConversationHistory && (
          <VoiceHistory
            messages={messages}
            scrollToMicrophone={scrollToMicrophone}
          />
        )}
      </div>

      {/* Scroll to top button - visible when scrolled but history not shown */}
      {showScrollToTop && !showConversationHistory && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-6 right-6 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default VoiceInterface;
