import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaLightbulb,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";

const ChatInput = ({ onSend, showSuggestions, toggleSuggestions }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(null);
  const [language, setLanguage] = useState("en-US");
  const [isMicSupported, setIsMicSupported] = useState(true);

  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // Language options
  const languageOptions = [
    { value: "en-US", label: "English (US)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "es-ES", label: "Spanish" },
    { value: "fr-FR", label: "French" },
    { value: "de-DE", label: "German" },
    { value: "ta-IN", label: "Tamil" },
    { value: "hi-IN", label: "Hindi" },
    { value: "zh-CN", label: "Chinese" },
    { value: "ja-JP", label: "Japanese" },
  ];

  // Add this to your useEffect that runs on component mount
  useEffect(() => {
    initSpeechRecognition();
    checkMicrophoneAccess();

    // Add network status listeners
    const handleOnline = () => {
      if (micError && micError.includes("offline")) {
        setMicError(null);
      }
    };

    const handleOffline = () => {
      if (isListening) {
        stopListening();
        setMicError(
          "You are offline. Speech recognition requires internet connection."
        );
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Remove network listeners
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check if Web Speech API is supported
  const initSpeechRecognition = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsMicSupported(false);
      setMicError(
        "Your browser doesn't support speech recognition. Try Chrome or Edge."
      );
      return;
    }

    // Initialize speech recognition
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      // Set up event handlers
      recognition.onresult = handleSpeechResult;
      recognition.onend = handleSpeechEnd;
      recognition.onerror = handleSpeechError;

      recognitionRef.current = recognition;
      setIsMicSupported(true);
    } catch (error) {
      console.error("Speech recognition init error:", error);
      setIsMicSupported(false);
      setMicError(`Speech recognition error: ${error.message}`);
    }
  };

  // Check microphone access
  const checkMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicError(null);
    } catch (error) {
      console.error("Microphone access error:", error);
      if (error.name === "NotAllowedError") {
        setMicError(
          "Microphone access denied. Please allow access in your browser settings."
        );
      } else if (error.name === "NotFoundError") {
        setMicError("No microphone found. Please connect a microphone.");
      } else {
        setMicError(`Microphone error: ${error.message}`);
      }
    }
  };

  // Handle speech recognition results
  const handleSpeechResult = (event) => {
    // Reset silence timeout each time we get a result
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    // Get latest transcript
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("");

    // Update input field
    setMessage(transcript);

    // Setup silence detection - if no new speech in 2 seconds, stop listening
    silenceTimeoutRef.current = setTimeout(() => {
      if (isListening) {
        stopListening();
      }
    }, 2000);
  };

  // Handle speech recognition end
  const handleSpeechEnd = () => {
    // If recognition ended but we still think we're listening, restart it
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        // If we can't restart, update state to reflect that
        console.error("Could not restart speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  // Modify your handleSpeechError function to implement a backoff strategy
  const handleSpeechError = (event) => {
    console.error("Speech recognition error:", event.error);

    if (event.error === "network") {
      // More user-friendly network error message
      setMicError(
        "Network connection issue. Speech recognition will retry automatically. You can continue typing."
      );

      // Implement exponential backoff for retries
      let retryCount = 0;
      const maxRetries = 5; // Increased from 3 to 5

      const attemptReconnect = () => {
        if (retryCount < maxRetries) {
          retryCount++;

          // Exponential backoff: wait longer between each retry attempt
          const backoffDelay = 1000 * Math.pow(1.5, retryCount);

          // Try to completely reinitialize the speech recognition
          if (recognitionRef.current) {
            try {
              recognitionRef.current.abort();
            } catch (e) {
              console.log("Error aborting recognition:", e);
            }
          }

          setTimeout(() => {
            initSpeechRecognition();

            // Try starting again if we were listening
            if (isListening) {
              try {
                if (recognitionRef.current) {
                  recognitionRef.current.start();
                  setMicError(`Reconnecting... (${retryCount}/${maxRetries})`);
                }
              } catch (e) {
                console.error("Retry failed:", e);
                setTimeout(attemptReconnect, backoffDelay);
              }
            }
          }, backoffDelay);
        } else {
          // After max retries, give a more helpful message with fallback
          setMicError(
            "Speech recognition unavailable. Please use text input instead."
          );
          setIsListening(false);

          // Add a notification that gets cleared after several seconds
          setTimeout(() => {
            if (micError && micError.includes("unavailable")) {
              setMicError(null);
            }
          }, 7000);
        }
      };

      attemptReconnect();
      return;
    }

    // Rest of your error handling...
  };
  // Update recognition language when language selection changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;

      // If we're listening, restart with new language
      if (isListening) {
        stopListening();
        setTimeout(startListening, 300);
      }
    }
  }, [language]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!isMicSupported) {
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current) {
      initSpeechRecognition();
      if (!recognitionRef.current) {
        return; // Exit if initialization failed
      }
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setMicError(null);
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setMicError(`Could not start listening: ${error.message}`);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }

    setIsListening(false);

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");

      // Stop listening if active
      if (isListening) {
        stopListening();
      }
    }
  };

  // Language change handler
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Handle manual input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    // If typing manually, stop listening
    if (isListening) {
      stopListening();
    }
  };

  // Request microphone permission again
  const requestMicPermission = () => {
    checkMicrophoneAccess();
  };

  return (
    <div className="relative">
      {/* Microphone not supported or error banner */}
      {(micError || !isMicSupported) && (
        <div className="absolute -top-12 left-0 right-0 p-2 bg-red-100 text-red-700 text-sm rounded-md mx-1 flex justify-between items-center">
          <span>{micError || "Microphone not available"}</span>
          <button
            onClick={requestMicPermission}
            className="bg-red-700 text-white px-2 py-1 rounded text-xs"
          >
            Retry
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center p-3 border-t border-gray-200 gap-2"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder={
              isListening
                ? "Listening... Speak now"
                : "Type or click microphone to speak..."
            }
            className={`w-full p-2 pr-20 h-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black
              ${isListening ? "border-red-500" : "border-gray-300"}`}
          />

          {/* Voice activity visualization during listening */}
          {isListening && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <span className="w-2 h-4 bg-red-500 rounded-full animate-pulse"></span>
              <span className="w-2 h-6 bg-red-500 rounded-full animate-pulse delay-100"></span>
              <span className="w-2 h-3 bg-red-500 rounded-full animate-pulse delay-200"></span>
            </div>
          )}

          <div className="absolute right-3 flex gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`focus:outline-none hover:scale-110 transition-transform p-1 rounded-full
                ${isListening ? "bg-red-100" : ""}`}
              title={isListening ? "Stop listening" : "Start listening"}
              disabled={!isMicSupported}
            >
              {isListening ? (
                <FaMicrophone className="h-5 w-5 text-red-500 animate-pulse" />
              ) : (
                <FaMicrophoneSlash
                  className={`h-5 w-5 ${
                    !isMicSupported ? "text-gray-400" : "text-black"
                  }`}
                />
              )}
            </button>
            <button
              type="button"
              onClick={toggleSuggestions}
              className="focus:outline-none hover:scale-110 transition-transform p-1 rounded-full"
              title="Toggle suggestions"
            >
              <FaLightbulb
                className={`h-5 w-5 ${
                  showSuggestions ? "text-yellow-400" : "text-black"
                }`}
              />
            </button>
          </div>

          {/* Language selection dropdown - shows only when listening */}
          {isListening && (
            <div className="absolute bottom-14 right-0 bg-white p-2 shadow-lg rounded-md text-sm z-10 border border-gray-200 w-48">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-medium flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2 animate-ping"></span>
                    Listening...
                  </span>
                </div>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="p-1 border border-gray-300 rounded-md text-sm w-full"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`p-2 h-10 w-10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform ${
            message.trim()
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!message.trim()}
        >
          <FaPaperPlane className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
