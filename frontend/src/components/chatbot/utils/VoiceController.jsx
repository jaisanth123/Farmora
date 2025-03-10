import { useState, useEffect } from "react";
import axios from "axios";

export const useVoiceController = () => {
  const [listening, setListening] = useState(false);
  const [tamilListening, setTamilListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [listeningLanguage, setListeningLanguage] = useState("");

  // This function would need to be connected to an actual speech recognition implementation
  // For this example, we'll focus on the API interaction part

  const startEnglishListening = () => {
    setListening(true);
    setTamilListening(false);
    setListeningLanguage("en-US");
    // SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    resetInactivityTimer();
  };

  const startTamilListening = () => {
    setTamilListening(true);
    setListening(false);
    setListeningLanguage("ta-IN");
    // SpeechRecognition.startListening({ continuous: true, language: 'ta-IN' });
    resetInactivityTimer();
  };

  const stopListening = () => {
    setListening(false);
    setTamilListening(false);
    if (timeoutId) clearTimeout(timeoutId);
    // SpeechRecognition.stopListening();
  };

  const resetInactivityTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      stopListening();
    }, 5000);
    setTimeoutId(newTimeoutId);
  };

  const processVoiceInput = async (text, language) => {
    try {
      const endpoint = language === "ta-IN" ? "/tamil-voice" : "/voice";
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}${endpoint}`,
        { text }
      );

      if (language === "ta-IN" && response.data.recognized_tamil) {
        return {
          original: response.data.recognized_tamil,
          translated: response.data.translated_english,
        };
      } else if (response.data.text) {
        return {
          original: response.data.text,
          translated: response.data.text,
        };
      }
      return null;
    } catch (error) {
      console.error("Voice processing error:", error);
      return null;
    } finally {
      stopListening();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return {
    listening,
    tamilListening,
    transcript,
    setTranscript,
    startEnglishListening,
    startTamilListening,
    stopListening,
    processVoiceInput,
    listeningLanguage,
  };
};
