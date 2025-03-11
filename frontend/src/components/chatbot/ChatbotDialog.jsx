import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import ChatInterface from "./utils/ChatInterface";
import VoiceInterface from "./utils/VoiceInterface";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { withTranslation } from "react-google-multi-lang";

const ChatbotDialog = ({ closeChat }) => {
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you with your farming questions today?",
      sender: "bot",
      type: "message",
    },
  ]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isTamil, setIsTamil] = useState(false);
  const [isSpeak, setIsSpeak] = useState(false);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  // Initialize user ID
  useEffect(() => {
    const generatedUserId = uuidv4();
    setUserId(generatedUserId);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      type: "message",
    };

    // Add loading message
    const loadingMessage = {
      id: messages.length + 2,
      text: "Loading",
      sender: "bot",
      type: "loading",
    };

    setMessages((prev) => [...prev, newUserMessage, loadingMessage]);

    try {
      setLoading(true);

      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
        }/chatbot`,
        {
          message: message,
          user_id: userId,
          prompt: "agri", // Using 'agri' as default prompt as in your reference code
        }
      );

      if (response.status === 200) {
        // Format the response to match our message structure
        const botResponse = {
          id: messages.length + 3,
          text: response.data.message,
          sender: "bot",
          type: response.data.type || "message",
          ...(response.data.pdf && { pdf: response.data.pdf }),
        };

        // Replace loading message with actual response
        setMessages((prev) => [
          ...prev.filter((msg) => msg.type !== "loading"),
          botResponse,
        ]);
      } else {
        setMessages((prev) => [
          ...prev.filter((msg) => msg.type !== "loading"),
          {
            id: messages.length + 3,
            text: "Some Error has occurred",
            sender: "bot",
            type: "message",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "loading"),
        {
          id: messages.length + 3,
          text: "Some Error has occurred",
          sender: "bot",
          type: "message",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-140 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <GiFarmer className="text-2xl mr-2" />
          <h2 className="text-lg font-medium">Farmer Helper Chatbot</h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleVoiceMode}
            className="text-white mr-3 hover:text-gray-300"
          >
            {isVoiceMode ? "Text Mode" : "Voice Mode"}
          </button>
          <button
            onClick={closeChat}
            className="text-white hover:text-gray-300"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {isVoiceMode ? (
        <VoiceInterface
          messages={messages.map((msg) => ({
            ...msg,
            isTamil,
            isSpeak,
          }))}
          sendMessage={sendMessage}
        />
      ) : (
        <ChatInterface
          messages={messages.map((msg) => ({
            ...msg,
            isTamil,
            isSpeak,
            setIsTamil,
            setIsSpeak,
          }))}
          handleSend={sendMessage}
        />
      )}

      {/* Hidden scroll reference */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default withTranslation(ChatbotDialog);
