// src/components/ChatbotInterface/SpeechController.jsx
import { useState } from 'react';
import axios from 'axios';

export const useSpeechController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  const playMessage = async (message, language = 'en') => {
    if (!message || message.trim() === '') return false;
    
    // If already playing, stop the current audio
    if (isPlaying && audioInstance) {
      audioInstance.pause();
      setIsPlaying(false);
      setAudioInstance(null);
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('text', message);
      formData.append('lang', language);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/speak`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data.audio) {
        throw new Error("No audio data received");
      }

      const audioBase64 = response.data.audio;
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setAudioInstance(audio);
      setIsPlaying(true);
      
      audio.play();
      
      audio.onended = () => {
        setIsPlaying(false);
        setAudioInstance(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setAudioInstance(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      return true;
    } catch (error) {
      console.error('Speech output error:', error);
      setIsPlaying(false);
      setAudioInstance(null);
      return false;
    }
  };

  return {
    isPlaying,
    playMessage
  };
};