import { useState } from "react";
import axios from "axios";

export const useSpeechController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  const playMessage = async (message, language = "en") => {
    if (isPlaying && audioInstance) {
      audioInstance.pause();
      setIsPlaying(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", message);
      formData.append("lang", language);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}/speak`,
        formData
      );

      const audioBase64 = response.data.audio;
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setAudioInstance(audio);
      setIsPlaying(true);

      audio.play();
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Speech output error:", error);
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    playMessage,
  };
};
