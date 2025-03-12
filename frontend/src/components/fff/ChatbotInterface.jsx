import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faMicrophone,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { BotMessage, UserMessage, LoadingMessage } from "./MessageBubbles";
import axios from "axios";
// import artist from '../assets/artist.jpg';

export const ChatbotInterface = () => {
  const [disableInput, setDisableInput] = useState(false);
  const [response, setResponse] = useState("");
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [inputBox, setInputBox] = useState("");
  const [isTamil, setIsTamil] = useState(false);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [tamilListening, setTamilListening] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [listeningLanguage, setListeningLanguage] = useState("");
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [isSpeak, setIsSpeak] = useState(false);
  const [localInput, setLocalInput] = useState("");

  const startEnglishListening = () => {
    SpeechRecognition.stopListening(); // Stop any ongoing listening
    resetTranscript(); // Reset the transcript
    setInputBox(""); // Clear inputBox
    setInput(""); // Clear input
    setLocalInput(""); // Clear localInput

    setListening(true);
    setIsTamil(false);
    setListeningLanguage("en-US");
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    const validateUrl = `${import.meta.env.VITE_BACKEND_URL}/voice`;
    console.log(`Validate URL for English: ${validateUrl}`);
    resetInactivityTimer();
  };

  const startTamilListening = () => {
    SpeechRecognition.stopListening(); // Stop any ongoing listening
    resetTranscript(); // Reset the transcript
    setInputBox(""); // Clear inputBox
    setInput(""); // Clear input
    setLocalInput(""); // Clear localInput

    setTamilListening(true);
    setIsTamil(true);
    setIsSpeak(true);
    setListeningLanguage("ta-IN");
    SpeechRecognition.startListening({ continuous: true, language: "ta-IN" });
    const validateUrlTamil = `${import.meta.env.VITE_BACKEND_URL}/tamil-voice`;
    console.log(`Validate URL for Tamil: ${validateUrlTamil}`);
    resetInactivityTimer();
  };

  const resetInactivityTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 5000);
    setTimeoutId(newTimeoutId);
    setListening(false);
    setTamilListening(false);
  };

  useEffect(() => {
    console.log(listeningLanguage);
    if (transcript && transcript.trim() !== "") {
      if (listeningLanguage === "ta-IN") {
        sendTranscriptToBackendTamil(transcript);
      } else if (listeningLanguage === "en-US") {
        sendTranscriptToBackendEnglish(transcript);
      }
      resetInactivityTimer();
    }
  }, [transcript, listeningLanguage]);

  useEffect(() => {
    if (transcript && transcript.trim() !== "") {
      setLocalInput(transcript);
    }
  }, [transcript]);

  const sendTranscriptToBackendEnglish = async (text) => {
    try {
      setListening(true);
      setIsTamil(false);
      setIsSpeak(false);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/voice`,
        { text }
      );
      console.log("Processing English transcript:", text);
      const data = res.data;
      if (data.text) {
        setInputBox(data.text);
        setInput(data.text);
        setResponse(data.text);
      }
    } catch (error) {
      console.error("Error sending transcript to backend:", error);
    } finally {
      setListening(false);
      setIsTamil(false);
      // Don't reset inputBox here as we want to show what was recognized
    }
  };

  const sendTranscriptToBackendTamil = async (text) => {
    try {
      setTamilListening(true);
      setIsTamil(true);
      setIsSpeak(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/tamil-voice`,
        { text }
      );
      console.log("Processing Tamil transcript:", text);
      const data = res.data;
      if (data.recognized_tamil && data.translated_english) {
        setInputBox(data.recognized_tamil);
        setInput(data.translated_english);
        setResponse(data.recognized_tamil);
      }
    } catch (error) {
      console.error("Error sending transcript to backend:", error);
    } finally {
      setTamilListening(false);
      // Don't reset inputBox here as we want to show what was recognized
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageToSend = input.trim() === "" ? inputBox : input;
    if (messageToSend.trim() === "") {
      return;
    }

    // Store message before clearing inputs
    const userMessage = messageToSend;

    // Clear all input states immediately
    setInput("");
    setInputBox("");
    setLocalInput("");
    resetTranscript(); // Reset the transcript

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        user: "user",
        type: "user",
        content: inputBox,
      },
      {
        user: "bot",
        type: "loading",
        message: "Loading",
      },
    ]);

    try {
      setDisableInput(true);
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/chatbot",
        {
          message: userMessage,
        }
      );

      if (response.status === 200) {
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.type !== "loading"),
          {
            user: "bot",
            type: "bot",
            content: response.data.response,
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.type !== "loading"),
          {
            user: "bot",
            type: "message",
            message: "Some Error has occurred",
          },
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.type !== "loading"),
        {
          user: "bot",
          type: "message",
          message: "Some Error has occurred",
        },
      ]);
    } finally {
      setDisableInput(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        className="fixed bottom-4 right-4 p-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600"
      >
        <FontAwesomeIcon icon={faMessage} color="white" size="lg" />
      </button>

      {visible && (
        <div
          className="fixed bottom-20 right-4 w-96 h-[600px] bg-gray-900 rounded-lg shadow-xl border border-gray-700"
          // style={{
          //   backgroundImage: `url(${artist})`,
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          //   backgroundBlendMode: 'multiply'
          // }}
        >
          <div className="h-14 bg-[#0f172a] rounded-t-lg flex items-center justify-between px-4">
            <h2 className="text-xl font-bold text-white">Chatbot</h2>
          </div>

          <div className="h-[calc(100%-120px)] overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="text-white text-center mt-10 p-4 bg-gray-800 bg-opacity-60 rounded-lg">
                {isTamil
                  ? "வணக்கம்! கச்சேரி டிக்கெட் புக்கிங் குறித்து என்னிடம் கேளுங்கள்."
                  : "Hello! I am your Virtual Agronomist!!"}
              </div>
            )}
            {messages.map((msg, idx) =>
              msg.type === "user" ? (
                <UserMessage key={idx} message={msg.content} />
              ) : msg.type === "loading" ? (
                <LoadingMessage key={idx} />
              ) : (
                <BotMessage key={idx} message={msg.content} isTamil={isTamil} />
              )
            )}
            {(listening || tamilListening) && (
              <div className="text-white italic bg-gray-800 bg-opacity-60 p-2 rounded-lg inline-block ml-5 mt-2">
                {listening
                  ? "Listening..."
                  : "நான் கேட்டுக் கொண்டிருக்கிறேன்..."}
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <div className="absolute bottom-0 w-full p-4 bg-gray-800 rounded-b-lg">
            <form
              onSubmit={sendMessage}
              className="flex items-center space-x-2"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={inputBox}
                  onChange={(e) => {
                    setInputBox(e.target.value);
                    // If English mode, set both input and inputBox to the same value
                    if (!isTamil) {
                      setInput(e.target.value);
                    }
                  }}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white text-sm"
                  placeholder={
                    isTamil ? "உங்கள் செய்தியை உள்ளிடவும்" : "Type your message"
                  }
                />
              </div>

              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={startEnglishListening}
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#3f3f46] text-[#d4d4d8] shadow-lg transition-colors duration-300 ease-in-out"
                  title="English"
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                  <span className="sr-only">English</span>
                </button>

                <button
                  type="button"
                  onClick={startTamilListening}
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#3f3f46] text-[#d4d4d8] shadow-lg transition-colors duration-300 ease-in-out"
                  title="தமிழ்"
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                  <span className="sr-only">தமிழ்</span>
                </button>

                <button
                  type="submit"
                  className="h-10 w-10 rounded-lg bg-gray-700 text-white hover:bg-gray-600 flex items-center justify-center"
                  disabled={disableInput}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
