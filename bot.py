import google.generativeai as genai
import speech_recognition as sr
import tkinter as tk
from tkinter import scrolledtext, PhotoImage
import threading
import os
import tempfile
from gtts import gTTS
import pygame
import time
from apikey import api_data

# Configure Google Generative AI API
GENAI_API_KEY = api_data
genai.configure(api_key=GENAI_API_KEY)

# Initialize pygame mixer for audio playback
pygame.mixer.init()

# Global variables
stop_conversation = False
is_listening = False
recognizer = sr.Recognizer()

# Improve handling of pauses between words by increasing pause threshold
# This helps with Indian English speech patterns that often have natural pauses
recognizer.pause_threshold = 2.0  # Increased from default to allow more time between phrases
recognizer.phrase_threshold = 0.3  # Lower threshold for considering a phrase complete
recognizer.non_speaking_duration = 0.8  # Longer duration to determine when speech has ended

def speak(text):
    """Convert text to speech using Google TTS and play it with pygame"""
    try:
        # Create a temporary file for the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            temp_filename = temp_file.name
        
        # Generate speech audio file - add Indian English accent
        tts = gTTS(text=text, lang='en', tld='co.in')  # Use Indian English TLD
        tts.save(temp_filename)
        
        # Update UI to show speaking status
        status_label.config(text="Speaking...")
        
        # Play the audio using pygame
        pygame.mixer.music.load(temp_filename)
        pygame.mixer.music.play()
        
        # Wait for playback to finish
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
            
        # Clean up temp file
        try:
            os.remove(temp_filename)
        except:
            pass
            
        # Update UI to show ready status
        status_label.config(text="Ready")
        
    except Exception as e:
        conversation_area.insert(tk.END, f"TTS Error: {e}\n")
        status_label.config(text="TTS Error")

def listen_for_command():
    """Activated when the mic button is pressed"""
    global is_listening
    
    # If already listening, don't start a new listening session
    if is_listening:
        return
        
    is_listening = True
    mic_button.config(bg="red", text="Listening...")
    status_label.config(text="Listening...")
    
    # Start listening in a separate thread
    threading.Thread(target=process_listening).start()

def process_listening():
    """Process the audio input from the microphone"""
    global is_listening
    
    try:
        with sr.Microphone() as source:
            # Adjust for ambient noise and set parameters
            recognizer.adjust_for_ambient_noise(source, duration=1.0)  # Increased duration
            
            # Wait for audio input
            conversation_area.insert(tk.END, "Listening...\n")
            conversation_area.see(tk.END)
            
            try:
                # Increase timeout and phrase_time_limit for Indian English speakers
                audio = recognizer.listen(source, timeout=10, phrase_time_limit=15)
                
                # Reset button appearance
                root.after(0, lambda: mic_button.config(bg="lightblue", text="🎤 Speak"))
                status_label.config(text="Processing...")
                
                # Process the audio with Indian English language model
                query = recognizer.recognize_google(audio, language='en-in')
                
                # Display the query
                conversation_area.insert(tk.END, f"You: {query}\n")
                conversation_area.see(tk.END)
                
                # Process the query
                process_query(query)
                
            except sr.WaitTimeoutError:
                conversation_area.insert(tk.END, "No speech detected. Please try again.\n")
                conversation_area.see(tk.END)
                
            except sr.UnknownValueError:
                conversation_area.insert(tk.END, "Sorry, I didn't catch that. Please try again.\n")
                conversation_area.see(tk.END)
                
            except sr.RequestError as e:
                conversation_area.insert(tk.END, f"Could not request results; {e}\n")
                conversation_area.see(tk.END)
                
    except Exception as e:
        conversation_area.insert(tk.END, f"Error: {e}\n")
        conversation_area.see(tk.END)
    
    # Reset listening state and button
    is_listening = False
    root.after(0, lambda: mic_button.config(bg="lightblue", text="🎤 Speak"))
    root.after(0, lambda: status_label.config(text="Ready"))

def process_query(query):
    """Generate a response for the user's query"""
    if not query:
        return
        
    # Normalize query - handle common speech recognition issues in Indian English
    query = normalize_query(query)
    
    # Check for exit commands
    if "exit" in query or "quit" in query or "bye" in query or "goodbye" in query:
        response = "Goodbye! Have a great day!"
        conversation_area.insert(tk.END, f"Assistant: {response}\n")
        conversation_area.see(tk.END)
        speak(response)
        return
    
    # Generate AI response with improved prompting for agricultural queries
    try:
        status_label.config(text="Thinking...")
        
        # Enhance the prompt for agricultural contexts if detected
        if is_agricultural_query(query):
            enhanced_query = enhance_agricultural_query(query)
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                enhanced_query, 
                generation_config=genai.GenerationConfig(
                    max_output_tokens=200,  # Increased for more detailed agricultural answers
                    temperature=0.2,
                )
            )
        else:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                query, 
                generation_config=genai.GenerationConfig(
                    max_output_tokens=100,
                    temperature=0.2,
                )
            )
        
        # Display response
        response_text = response.text
        conversation_area.insert(tk.END, f"Assistant: {response_text}\n\n")
        conversation_area.see(tk.END)
        
        # Speak the response
        speak(response_text)
        
    except Exception as e:
        error_msg = f"Sorry, I encountered an error: {e}"
        conversation_area.insert(tk.END, f"Assistant: {error_msg}\n\n")
        conversation_area.see(tk.END)
        speak("Sorry, I encountered an error.")

def normalize_query(query):
    """Handle common speech recognition issues in Indian English"""
    # Convert to lowercase for easier processing
    query = query.lower()
    
    # Fix common speech recognition errors for Indian English speakers
    # These are examples - you may need to expand based on your users
    replacements = {
        "form": "farm",
        "former": "farmer",
        "rise": "rice",
        "whether": "weather",
        "whether report": "weather report",
        "whether forecast": "weather forecast"
    }
    
    # Apply replacements
    for original, replacement in replacements.items():
        query = query.replace(original, replacement)
    
    return query

def is_agricultural_query(query):
    """Detect if query is related to agriculture"""
    agricultural_keywords = [
        "farm", "crop", "soil", "plant", "harvest", "seed", "fertilizer", 
        "pesticide", "irrigation", "weather", "rain", "disease", "pest",
        "monsoon", "agriculture", "price", "market", "vegetable", "fruit",
        "paddy", "rice", "sugarcane", "cotton", "mango", "wheat", "rotation"
    ]
    
    return any(keyword in query.lower() for keyword in agricultural_keywords)

def enhance_agricultural_query(query):
    """Enhance agricultural queries with contextual information"""
    return f"""
    Context: The user is a farmer in Tamil Nadu, India.
    
    User query: {query}
    
    Please provide a clear, accurate, and practical response that:
    1. Is concise and easy to understand
    2. Uses simple language appropriate for farmers
    3. Gives specific, actionable advice when possible
    4. Considers Tamil Nadu's agricultural conditions
    5. References local crop varieties and farming practices when relevant
    """

def text_input(event=None):
    """Process text input from the entry field"""
    query = text_entry.get()
    if not query:
        return
        
    # Clear the entry field
    text_entry.delete(0, tk.END)
    
    # Display the query
    conversation_area.insert(tk.END, f"You: {query}\n")
    conversation_area.see(tk.END)
    
    # Process the query
    process_query(query)

def clear_conversation():
    """Clear the conversation area"""
    conversation_area.delete(1.0, tk.END)
    conversation_area.insert(tk.END, "Conversation cleared. Ready for new queries.\n\n")
    conversation_area.see(tk.END)

def exit_application():
    """Exit the application"""
    global stop_conversation
    stop_conversation = True
    root.quit()

# Set up the GUI
root = tk.Tk()
root.title("Kisan AI Assistant")  # Renamed to be more specific to farming
root.geometry("600x500")
root.configure(bg="#f0f0f0")

# Create a frame for the chat area
chat_frame = tk.Frame(root, bg="#f0f0f0")
chat_frame.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

# Status label
status_label = tk.Label(chat_frame, text="Ready", bg="#f0f0f0", fg="#333")
status_label.pack(anchor="w", pady=5)

# Conversation area
conversation_area = scrolledtext.ScrolledText(
    chat_frame, 
    wrap=tk.WORD, 
    width=60, 
    height=20, 
    font=("Arial", 11),
    bg="#ffffff",
    fg="#000000"
)
conversation_area.pack(padx=0, pady=5, fill=tk.BOTH, expand=True)
conversation_area.insert(tk.END, "Kisan AI Assistant is ready. Speak slowly and clearly or type your farming questions below.\n\n")

# Create a frame for input controls
input_frame = tk.Frame(root, bg="#f0f0f0")
input_frame.pack(padx=10, pady=5, fill=tk.X)

# Text entry
text_entry = tk.Entry(input_frame, font=("Arial", 12), width=40)
text_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
text_entry.bind("<Return>", text_input)  # Bind Enter key to submit

# Send button
send_button = tk.Button(
    input_frame, 
    text="Send", 
    font=("Arial", 11), 
    bg="#4CAF50", 
    fg="white", 
    command=text_input
)
send_button.pack(side=tk.LEFT, padx=5)

# Microphone button
mic_button = tk.Button(
    input_frame,
    text="🎤 Speak",
    font=("Arial", 11),
    bg="lightblue",
    fg="black",
    width=10,
    command=listen_for_command
)
mic_button.pack(side=tk.LEFT, padx=5)

# Control buttons frame
controls_frame = tk.Frame(root, bg="#f0f0f0")
controls_frame.pack(padx=10, pady=10, fill=tk.X)

# Clear conversation button
clear_button = tk.Button(
    controls_frame,
    text="Clear Chat",
    font=("Arial", 11),
    bg="#f44336",
    fg="white",
    command=clear_conversation
)
clear_button.pack(side=tk.LEFT, padx=5)

# Exit button
exit_button = tk.Button(
    controls_frame,
    text="Exit",
    font=("Arial", 11),
    bg="#555555",
    fg="white",
    command=exit_application
)
exit_button.pack(side=tk.RIGHT, padx=5)

# Start the app with a welcome message
def welcome():
    conversation_area.insert(tk.END, "Assistant: Namaste! I'm your Kisan AI assistant. I can help with farming advice, weather information, crop diseases, and more. How can I help you today?\n\n")
    conversation_area.see(tk.END)
    speak("Namaste! I'm your Kisan AI assistant. I can help with farming advice, weather information, crop diseases, and more. How can I help you today?")

# Schedule the welcome message to play after the GUI has launched
root.after(1000, welcome)

# Start the main event loop
root.mainloop()