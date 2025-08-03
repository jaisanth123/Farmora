import { useState, useRef, useEffect } from "react";
import { chatbotService } from "../services/chatbotService.js";

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you with your farming questions today?",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim() || isLoading) {
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      text: message.trim(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(
        message.trim(),
        language
      );

      const botResponse = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return {
    messages,
    isLoading,
    language,
    sendMessage,
    changeLanguage,
    messagesEndRef,
  };
};
