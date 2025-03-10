import React, { useState, useEffect, useRef } from "react";
import { GiFarmer } from "react-icons/gi";
import { FaMicrophone, FaComment, FaTimes } from "react-icons/fa";
import ChatInterface from "./utils/ChatInterface";
import VoiceInterface from "./utils/VoiceInterface";
import Header from "./utils/Header";

const ChatbotDialog = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you with your farming questions today?",
      sender: "bot",
    },
  ]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const animationFrameRef = useRef(null);

  // Speech recognition simulation
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate audio levels for visualization
    simulateAudioLevels();

    // Simulate recognition after random time
    const recognitionDelay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      const randomQuestions = [
        "What crops are best for sandy soil?",
        "When should I plant tomatoes?",
        "How do I control aphids on my vegetables?",
        "What's the weather forecast for next week?",
      ];
      const recognizedText =
        randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
      handleSpeechResult(recognizedText);
    }, recognitionDelay);
  };

  const stopListening = () => {
    setIsListening(false);
    // In a real implementation, you would stop speech recognition here
    // SpeechRecognition.stopListening();

    // Stop audio level simulation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioLevel(0);
  };

  const handleSpeechResult = (text) => {
    if (!text.trim()) return;

    stopListening();

    // Add user message
    handleSend(text);
  };

  const simulateAudioLevels = () => {
    const updateAudioLevel = () => {
      // Generate a random audio level that fluctuates naturally
      const newLevel = Math.min(0.2 + Math.random() * 0.8, 1);
      setAudioLevel(newLevel);

      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  };

  const handleSend = (message) => {
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
    };
    setMessages([...messages, newUserMessage]);

    // Simulate bot response and speaking
    setIsSpeaking(true);

    setTimeout(() => {
      const responses = [
        `Based on your soil type, I'd recommend growing carrots, radishes, or potatoes in sandy soil.`,
        `For tomatoes, it's best to plant them after all danger of frost has passed, typically in late spring.`,
        `To control aphids naturally, try spraying plants with a mixture of water and mild dish soap, or introduce ladybugs as a natural predator.`,
        `The forecast shows sunny conditions with occasional showers, perfect for your crops.`,
      ];

      const botResponse = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "bot",
      };

      setMessages((prev) => [...prev, botResponse]);

      // Simulate the time it takes to speak the response
      const speakingTime = Math.min(
        Math.max(botResponse.text.length * 50, 1500),
        4000
      );
      setTimeout(() => {
        setIsSpeaking(false);
      }, speakingTime);
    }, 1000);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    stopListening();
    setIsSpeaking(false); 
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 w-96 h-140 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden border border-gray-200">
      <Header
        closeChat={closeChat}
        isVoiceMode={isVoiceMode}
        toggleVoiceMode={toggleVoiceMode}
      />

      {isVoiceMode ? (
        <VoiceInterface
          messages={messages}
          isListening={isListening}
          isSpeaking={isSpeaking}
          audioLevel={audioLevel}
          toggleListening={toggleListening}
        />
      ) : (
        <ChatInterface messages={messages} handleSend={handleSend} />
      )}
    </div>
  );
};

export default ChatbotDialog;
