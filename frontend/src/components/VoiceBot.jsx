import React, { useState, useEffect, useRef } from 'react';
import VoiceInterface from './components/VoiceInterface';

const API_URL = 'http://localhost:8000'; // Change this to your FastAPI server URL

const VoiceBot = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(new Audio());
  const wsRef = useRef(null);
  
  // Fetch message history on component mount
  useEffect(() => {
    fetchMessages();
  }, []);
  
  // Set up WebSocket connection for audio levels
  useEffect(() => {
    setupWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
  
  const setupWebSocket = () => {
    const ws = new WebSocket(`ws://${API_URL.replace('http://', '')}/ws/audio-level`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.audioLevel !== undefined) {
        setAudioLevel(data.audioLevel);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after a delay
      setTimeout(setupWebSocket, 2000);
    };
    
    wsRef.current = ws;
  };
  
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`);
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = async () => {
    try {
      setIsListening(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio level analyzer
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Send audio level data via WebSocket
      const sendAudioLevel = () => {
        if (!isListening) return;
        
        analyser.getByteTimeDomainData(dataArray);
        
        // Send audio data samples to WebSocket for processing
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ samples: Array.from(dataArray) }));
        }
        
        requestAnimationFrame(sendAudioLevel);
      };
      
      sendAudioLevel();
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1]; // Remove the data URL prefix
          
          try {
            const response = await fetch(`${API_URL}/api/audio`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ audio_data: base64Audio })
            });
            
            const data = await response.json();
            
            // Add both user and assistant messages
            if (data.message) {
              // Update messages in state
              fetchMessages();
              
              // Play audio response
              if (data.audio) {
                playAudioResponse(data.audio);
              }
            }
          } catch (error) {
            console.error('Error sending audio:', error);
            setIsListening(false);
          }
        };
      };
      
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopListening();
        }
      }, 8000); // Auto-stop after 8 seconds if user doesn't stop manually
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsListening(false);
  };
  
  const playAudioResponse = (base64Audio) => {
    setIsSpeaking(true);
    
    // Create audio URL from base64
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
    audioRef.current.src = audioUrl;
    
    audioRef.current.onended = () => {
      setIsSpeaking(false);
    };
    
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    });
  };
  
  const handleSubmitText = async (text) => {
    try {
      const response = await fetch(`${API_URL}/api/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      
      // Update messages
      fetchMessages();
      
      // Play audio response
      if (data.audio) {
        playAudioResponse(data.audio);
      }
    } catch (error) {
      console.error('Error sending text:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-black text-white px-4 py-3">
        <h1 className="text-xl font-semibold">Kisan AI Assistant</h1>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <VoiceInterface
          messages={messages}
          isListening={isListening}
          isSpeaking={isSpeaking}
          audioLevel={audioLevel}
          toggleListening={toggleListening}
        />
      </main>
    </div>
  );
};

export default VoiceBot;