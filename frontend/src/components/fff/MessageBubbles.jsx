// src/components/ChatbotInterface/MessageBubbles.jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSpeechController } from './SpeechController';

export const BotMessage = ({ message, isTamil }) => {
  const [translatedMessage, setTranslatedMessage] = useState(null);
  const { isPlaying, playMessage } = useSpeechController();
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
  // const [isTamil,setIsTamil]=useState(false);

  useEffect(() => {
    const translateMessage = async () => {
      if (isTamil) {
        try {
          // Send the message to the ba
          // ckend to translate it to Tamil
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/translate-to-tamil?input_text=${message}`);
          console.log("ehllo");
          console.log(response)
          // If translation is successful, set translated message
          if (response.data.translated_tamil) {
            setTranslatedMessage(response.data.translated_tamil);
          } else {
            setTranslatedMessage(message); // If no translation available, fallback to original message
          }
        } catch (error) {
          console.error("Error translating message:", error);
          setTranslatedMessage(message); // If there's an error, fallback to original message
        }
        finally{
          setIsTamil(false);// Set listening to true when the microphone button is clicked
        }
      } else {
        setTranslatedMessage(message); // If not Tamil, use the original message
      }
    };

    translateMessage();
  }, [message]);

  const handlePlayPause = () => {
    const textToPlay = translatedMessage || message;
    playMessage(textToPlay, isTamil ? 'ta' : 'en')
      .then(playing => setCurrentlyPlaying(playing))
      .catch(err => console.error('Error playing message:', err));
  };

  return (
    <div className="max-w-[70%]">
      <div className="ml-5 font-medium text-white">Assistant</div>
      <div className="flex items-start space-x-2">
        <pre className="bg-[#334155] text-white m-3 font-sans rounded-t-3xl rounded-br-3xl p-3 text-wrap shadow-lg">
          {isTranslating ? "Translating..." : translatedMessage || message}
        </pre>
        <button 
          onClick={handlePlayPause}
          className="mt-4 p-2 rounded-full bg-[#3f3f46] hover:bg-[#52525b]"
        >
          <FontAwesomeIcon 
            icon={currentlyPlaying ? faPause : faPlay} 
            color="white" 
          />
        </button>
      </div>
    </div>
  );
};

export const UserMessage = ({ message }) => (
  <div className="max-w-[70%] ml-auto">
    <div className="mr-5 font-medium text-white text-right">You</div>
    <p className="bg-[#6b7280] text-white mr-3 ml-auto rounded-t-3xl rounded-bl-3xl p-3 shadow-lg">
      {message}
    </p>
  </div>
);

export const LoadingMessage = () => (
  <div className="max-w-[70%]">
    <div className="ml-5 font-medium text-white">Assistant</div>
    <div className="bg-[#334155] text-white m-3 rounded-t-3xl rounded-br-3xl p-4 text-wrap shadow-lg flex space-x-1">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
    </div>
  </div>
);