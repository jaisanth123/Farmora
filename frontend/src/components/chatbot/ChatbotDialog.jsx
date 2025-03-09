import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { FaTimes, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdAgriculture } from "react-icons/md"; // Correct import
import { GiFarmTractor, GiFarmer } from "react-icons/gi";
const ChatbotDialog = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you with your farming questions today?",
      sender: "bot",
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const suggestionRowRef1 = useRef(null);
  const suggestionRowRef2 = useRef(null);

  // Example suggestions - more to demonstrate scrolling
  const suggestions = [
    { id: 1, text: "Crop recommendations" },
    { id: 2, text: "Upload soil report" },
    { id: 3, text: "View my farm history" },
    { id: 4, text: "Reset my password" },
    { id: 5, text: "Contact support" },
    { id: 6, text: "Weather forecast" },
    { id: 7, text: "Pest control advice" },
    { id: 8, text: "Market prices" },
  ];

  // Split suggestions into two rows
  const firstRowSuggestions = suggestions.slice(0, 4);
  const secondRowSuggestions = suggestions.slice(4);

  const handleSend = (message) => {
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
    };
    setMessages([...messages, newUserMessage]);
    setShowSuggestions(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: `This is a simulated response to "${message}"`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const scrollRight = () => {
    const scrollAmount = 150;
    if (suggestionRowRef1.current) {
      suggestionRowRef1.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    if (suggestionRowRef2.current) {
      suggestionRowRef2.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    setScrollPosition(scrollPosition + scrollAmount);
  };

  const scrollLeft = () => {
    const scrollAmount = -150;
    if (suggestionRowRef1.current) {
      suggestionRowRef1.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    if (suggestionRowRef2.current) {
      suggestionRowRef2.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    setScrollPosition(Math.max(0, scrollPosition + scrollAmount));
  };

  // Check if scrolling is possible
  useEffect(() => {
    const checkScrollability = () => {
      if (suggestionRowRef1.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          suggestionRowRef1.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    // Initial check
    checkScrollability();

    // Add event listener
    const row1 = suggestionRowRef1.current;

    if (row1) row1.addEventListener("scroll", checkScrollability);

    return () => {
      if (row1) row1.removeEventListener("scroll", checkScrollability);
    };
  }, [messages, showSuggestions]);

  return (
    <div className="fixed bottom-24 right-6 w-96 h-140 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden border border-gray-200">
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <GiFarmTractor className="text-green-400 hover:text-4xl transform duration-500 text-2xl" />
          {/* <MdAgriculture className="text-green-400 text-xl" /> */}
          <h3 className=" ml-2 font-semibold text-xl">Farmora Assistant</h3>
          <GiFarmer className=" text-green-500 text-2xl hover:text-4xl transform duration-500" />
        </div>
        <button
          onClick={closeChat}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close Chat"
        >
          <FaTimes className="text-white text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="border-t border-gray-200">
        {showSuggestions && (
          <div className="py-3 relative">
            {/* First row of suggestions */}
            <div
              ref={suggestionRowRef1}
              className="px-4 mb-2 flex gap-2 overflow-x-hidden whitespace-nowrap hide-scrollbar"
            >
              {firstRowSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="px-3 py-1 bg-black text-white text-sm border border-gray-600 rounded-full whitespace-nowrap hover:bg-gray-800 transition-colors"
                  onClick={() => handleSend(suggestion.text)}
                >
                  {suggestion.text}
                </button>
              ))}
            </div>

            {/* Second row of suggestions */}
            <div
              ref={suggestionRowRef2}
              className="px-4 flex gap-2 overflow-x-hidden whitespace-nowrap hide-scrollbar"
            >
              {secondRowSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="px-3 py-1 bg-black text-white text-sm border border-gray-600 rounded-full whitespace-nowrap hover:bg-gray-800 transition-colors"
                  onClick={() => handleSend(suggestion.text)}
                >
                  {suggestion.text}
                </button>
              ))}
            </div>

            {/* Right navigation arrow with circle */}
            {canScrollRight && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={scrollRight}
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Scroll right"
                >
                  <FaArrowRight className="text-black" />
                </button>
              </div>
            )}

            {/* Left navigation arrow with circle */}
            {canScrollLeft && (
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={scrollLeft}
                  className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Scroll left"
                >
                  <FaArrowLeft className="text-black" />
                </button>
              </div>
            )}
          </div>
        )}

        <ChatInput
          onSend={handleSend}
          showSuggestions={showSuggestions}
          toggleSuggestions={toggleSuggestions}
        />
      </div>
    </div>
  );
};

export default ChatbotDialog;
