# from fastapi import APIRouter, HTTPException
# from fastapi.responses import JSONResponse
# from pydantic import BaseModel
# import os
# import re
# from groq import Groq
# from langchain.prompts import PromptTemplate
# from langchain_groq import ChatGroq
# from langchain.chains import ConversationChain
# from langchain.chains.conversation.memory import ConversationBufferWindowMemory
# from dotenv import load_dotenv
# load_dotenv()
# # Load the Groq API key from environment variables (or directly set it here)
# groq_api_key = os.getenv("GROQ_API_KEY")  # or set this directly in the code if not using dotenv

# # Create a FastAPI router for chatbot endpoints
# router = APIRouter()

# # Define the agronomist prompt template with specialized instructions
# agronomist_template = """
# You are AgroAdvisor, an expert AI virtual agronomist designed to help farmers with agricultural decisions.

# Focus areas:
# - Crop recommendations based on soil type, climate, and region
# - Seasonal farming advice and planting calendars
# - Market-driven crop selection based on current demand trends
# - Pest and disease identification from symptom descriptions
# - Treatment recommendations for plant diseases and pest infestations
# - Current market prices and agricultural economics analysis
# - Sustainable farming practices and resource optimization

# Guidelines:
# 1. Provide concise, practical advice that farmers can implement
# 2. Include specific crop varieties, treatments, or techniques when applicable
# 3. Base recommendations on established agricultural science and data
# 4. Keep responses brief but informative (under 300 words when possible)
# 5. Ask clarifying questions if location, soil type, or other key details are missing
# 6. When given symptoms of plant problems, diagnose the likely disease or pest and suggest solutions

# IMPORTANT PRICE QUERY INSTRUCTIONS:
# 7. For market price questions (e.g., "what is the price of turmeric today", "potato price", "tomato cost"):
#    - Always provide a direct, specific price in the format "[price] rupees per kg" as the first line
#    - Example: "50 rupees per kg. Turmeric prices have increased 5% since last week..."
#    - Include brief market trends or factors affecting price if relevant
#    - If location is provided, adjust price estimation to that region
#    - Keep price responses extremely concise and straightforward

# 8. For greetings or introductions, keep them very short and friendly (1-2 sentences maximum)
# 9. Skip lengthy introductions and get straight to helpful information

# Current conversation:
# {history}
# Human: {input}
# AI Assistant: """

# # Initialize custom prompt template
# prompt = PromptTemplate(
#     input_variables=["history", "input"],
#     template=agronomist_template
# )

# # Initialize Groq Langchain chat object with appropriate model
# memory = ConversationBufferWindowMemory(k=5)  # Keep last 5 interactions in memory
# groq_chat = ChatGroq(groq_api_key=groq_api_key, model_name="mixtral-8x7b-32768")

# # Create conversation chain with custom prompt
# conversation = ConversationChain(
#     llm=groq_chat,
#     prompt=prompt,
#     memory=memory,
#     verbose=False
# )

# class ChatRequest(BaseModel):
#     message: str
#     location: str = None  # Optional location parameter
#     soil_type: str = None  # Optional soil type parameter

# # Function to detect market price queries
# def is_price_query(text):
#     # Common vegetables, fruits, and crops
#     crops = [
#         # Vegetables
#         "tomato", "potato", "onion", "corn", "cabbage", "carrot", "cucumber", 
#         "pepper", "chili", "garlic", "broccoli", "cauliflower", "spinach", "lettuce",
#         "peas", "beans", "eggplant", "okra", "radish", "beetroot", "turnip",
#         # Fruits
#         "apple", "banana", "orange", "mango", "grapes", "watermelon", "papaya",
#         "pineapple", "strawberry", "guava", "lemon", "lime",
#         # Spices
#         "turmeric", "ginger", "cumin", "coriander", "cardamom", "cinnamon", "clove",
#         "pepper", "chili", "saffron", "mustard",
#         # Major crops
#         "wheat", "rice", "soybean", "cotton", "coffee", "tea", "sugarcane"
#     ]
    
#     # Price and market related terms
#     price_terms = ["price", "cost", "rate", "value", "market", "selling", "buying", "worth", 
#                    "rupees", "rs", "inr", "₹", "today", "current", "per kg", "per kilo", "per ton"]
    
#     # Question patterns
#     question_patterns = ["what is", "how much", "current", "today's", "latest"]
    
#     lower_text = text.lower()
    
#     # Check if the text contains a crop name
#     has_crop = any(crop in lower_text for crop in crops)
    
#     # Check if it contains price terms
#     has_price_term = any(term in lower_text for term in price_terms)
    
#     # Check if it has question patterns
#     has_question = any(pattern in lower_text for pattern in question_patterns)
    
#     # Return true if it has a crop and either price terms or question patterns
#     return has_crop and (has_price_term or has_question)

# @router.post("/chatbot")
# async def chat_with_agronomist(chat_request: ChatRequest):
#     try:
#         # Prepare the user's message with context if provided
#         user_input = chat_request.message
        
#         # Handle common greetings with direct detection
#         lower_input = user_input.lower()
#         greeting_phrases = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]
        
#         is_simple_greeting = any(phrase in lower_input for phrase in greeting_phrases) and len(user_input.split()) < 5
        
#         # Detect if this is a market price query
#         is_market_query = is_price_query(user_input)
        
#         # Add location and soil context if provided
#         context = []
#         if chat_request.location:
#             context.append(f"My location is {chat_request.location}.")
#         if chat_request.soil_type:
#             context.append(f"My soil type is {chat_request.soil_type}.")
        
#         # Enhance market price queries with specific instructions
#         if is_market_query:
#             # Extract the crop name for better targeting
#             crops = [
#                 "tomato", "potato", "onion", "corn", "wheat", "rice", "turmeric", "ginger",
#                 "cabbage", "carrot", "cucumber", "pepper", "chili", "garlic", "broccoli", 
#                 "cauliflower", "spinach", "lettuce", "eggplant", "okra", "radish", "beetroot",
#                 "turnip", "apple", "banana", "orange", "mango", "grapes", "watermelon", "papaya",
#                 "pineapple", "strawberry", "guava", "lemon", "lime", "cumin", "coriander", 
#                 "cardamom", "cinnamon", "clove", "saffron", "mustard", "soybean", "cotton", 
#                 "coffee", "tea", "sugarcane"
#             ]
            
#             # Find the crop mentioned in the query
#             mentioned_crops = [crop for crop in crops if crop in lower_input]
#             crop_name = mentioned_crops[0] if mentioned_crops else "the mentioned crop"
            
#             # Create a more specific price query instruction
#             user_input = f"Respond with current market price information for {crop_name}. START YOUR RESPONSE WITH THE EXACT PRICE IN RUPEES PER KG, followed by brief market trends. {user_input}"
        
#         # Combine context with user query
#         if context:
#             user_input = f"{' '.join(context)} {user_input}"

#         # Generate the response using Groq model through langchain
#         response = conversation(user_input)
        
#         # For simple greetings, potentially override with a shorter response
#         if is_simple_greeting and "response" in response:
#             greetings = [
#                 "Hi there! How can I help with your farming today?",
#                 "Hello! What agricultural advice do you need?",
#                 "Hi! I'm your farming assistant. What can I help with?",
#                 "Welcome! Ask me any farming questions."
#             ]
#             # Select a greeting based on a simple hash of the input to maintain consistency
#             greeting_index = sum(ord(c) for c in user_input) % len(greetings)
#             return JSONResponse(content={"response": greetings[greeting_index]})
        
#         # Check if the response is valid
#         if response and "response" in response:
#             return JSONResponse(content={"response": response["response"]})
#         else:
#             raise HTTPException(status_code=500, detail="Failed to generate agricultural insights.")
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Agronomist chatbot error: {str(e)}")


from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import re
from groq import Groq
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from dotenv import load_dotenv
load_dotenv()

# Load the Groq API key from environment variables
groq_api_key = os.getenv("GROQ_API_KEY")

# Create a FastAPI router for chatbot endpoints
router = APIRouter()

# Define the agronomist prompt template with specialized instructions
agronomist_template = """
You are AgroAdvisor, an expert AI virtual agronomist designed to help farmers with agricultural decisions.

Focus areas:
- Crop recommendations based on soil type, climate, and region
- Seasonal farming advice and planting calendars
- Market-driven crop selection based on current demand trends
- Pest and disease identification from symptom descriptions
- Treatment recommendations for plant diseases and pest infestations
- Current market prices and agricultural economics analysis
- Sustainable farming practices and resource optimization

Guidelines:
1. Provide concise, practical advice that farmers can implement
2. Include specific crop varieties, treatments, or techniques when applicable
3. Base recommendations on established agricultural science and data
4. Keep responses brief but informative (under 300 words when possible)
5. Ask clarifying questions if location, soil type, or other key details are missing
6. When given symptoms of plant problems, diagnose the likely disease or pest and suggest solutions

IMPORTANT PRICE QUERY INSTRUCTIONS:
7. For market price questions (e.g., "what is the price of turmeric today", "potato price", "tomato cost"):
   - Always provide a direct, specific price in the format "[price] rupees per kg" as the first line
   - Example: "50 rupees per kg. Turmeric prices have increased 5% since last week..."
   - Include brief market trends or factors affecting price if relevant
   - If location is provided, adjust price estimation to that region
   - Keep price responses extremely concise and straightforward

8. For greetings or introductions, keep them very short and friendly (1-2 sentences maximum)
9. Skip lengthy introductions and get straight to helpful information
10. NEVER start your responses with "Hello! I'm AgroAdvisor" or any introduction phrases after the first interaction

Current conversation:
{history}
Human: {input}
AI Assistant: """

# Initialize custom prompt template
prompt = PromptTemplate(
    input_variables=["history", "input"],
    template=agronomist_template
)

# Store conversation chains with unique user identifiers
conversation_chains = {}

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"  # Add session_id for tracking conversations
    location: str = None  # Optional location parameter
    soil_type: str = None  # Optional soil type parameter

# Function to detect market price queries
def is_price_query(text):
    # Common vegetables, fruits, and crops
    crops = [
        # Vegetables
        "tomato", "potato", "onion", "corn", "cabbage", "carrot", "cucumber", 
        "pepper", "chili", "garlic", "broccoli", "cauliflower", "spinach", "lettuce",
        "peas", "beans", "eggplant", "okra", "radish", "beetroot", "turnip",
        # Fruits
        "apple", "banana", "orange", "mango", "grapes", "watermelon", "papaya",
        "pineapple", "strawberry", "guava", "lemon", "lime",
        # Spices
        "turmeric", "ginger", "cumin", "coriander", "cardamom", "cinnamon", "clove",
        "pepper", "chili", "saffron", "mustard",
        # Major crops
        "wheat", "rice", "soybean", "cotton", "coffee", "tea", "sugarcane"
    ]
    
    # Price and market related terms
    price_terms = ["price", "cost", "rate", "value", "market", "selling", "buying", "worth", 
                   "rupees", "rs", "inr", "₹", "today", "current", "per kg", "per kilo", "per ton"]
    
    # Question patterns
    question_patterns = ["what is", "how much", "current", "today's", "latest"]
    
    lower_text = text.lower()
    
    # Check if the text contains a crop name
    has_crop = any(crop in lower_text for crop in crops)
    
    # Check if it contains price terms
    has_price_term = any(term in lower_text for term in price_terms)
    
    # Check if it has question patterns
    has_question = any(pattern in lower_text for pattern in question_patterns)
    
    # Return true if it has a crop and either price terms or question patterns
    return has_crop and (has_price_term or has_question)

# Function to get or create conversation for a session
def get_conversation_chain(session_id):
    if session_id not in conversation_chains:
        # Initialize a new conversation chain for this session
        memory = ConversationBufferWindowMemory(k=5)
        groq_chat = ChatGroq(groq_api_key=groq_api_key, model_name="mixtral-8x7b-32768")
        conversation_chains[session_id] = {
            "chain": ConversationChain(
                llm=groq_chat,
                prompt=prompt,
                memory=memory,
                verbose=False
            ),
            "is_first_interaction": True
        }
    return conversation_chains[session_id]

@router.post("/chatbot")
async def chat_with_agronomist(chat_request: ChatRequest):
    try:
        # Get the conversation chain for this session
        session_data = get_conversation_chain(chat_request.session_id)
        conversation = session_data["chain"]
        is_first_interaction = session_data["is_first_interaction"]
        
        # Prepare the user's message with context if provided
        user_input = chat_request.message
        lower_input = user_input.lower()
        
        # Handle common greetings with direct detection
        greeting_phrases = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]
        is_simple_greeting = any(phrase in lower_input for phrase in greeting_phrases) and len(user_input.split()) < 5
        
        # Detect if this is a market price query
        is_market_query = is_price_query(user_input)
        
        # Add location and soil context if provided
        context = []
        if chat_request.location:
            context.append(f"My location is {chat_request.location}.")
        if chat_request.soil_type:
            context.append(f"My soil type is {chat_request.soil_type}.")
        
        # Enhance market price queries with specific instructions
        if is_market_query:
            # Extract the crop name for better targeting
            crops = [
                "tomato", "potato", "onion", "corn", "wheat", "rice", "turmeric", "ginger",
                "cabbage", "carrot", "cucumber", "pepper", "chili", "garlic", "broccoli", 
                "cauliflower", "spinach", "lettuce", "eggplant", "okra", "radish", "beetroot",
                "turnip", "apple", "banana", "orange", "mango", "grapes", "watermelon", "papaya",
                "pineapple", "strawberry", "guava", "lemon", "lime", "cumin", "coriander", 
                "cardamom", "cinnamon", "clove", "saffron", "mustard", "soybean", "cotton", 
                "coffee", "tea", "sugarcane"
            ]
            
            # Find the crop mentioned in the query
            mentioned_crops = [crop for crop in crops if crop in lower_input]
            crop_name = mentioned_crops[0] if mentioned_crops else "the mentioned crop"
            
            # Create a more specific price query instruction
            user_input = f"Respond with current market price information for {crop_name}. START YOUR RESPONSE WITH THE EXACT PRICE IN RUPEES PER KG, followed by brief market trends. {user_input}"
        
        # Add first interaction instruction if this is the first message
        if is_first_interaction:
            # For the first interaction, allow a brief introduction
            user_input = f"This is our first interaction. You may briefly introduce yourself once as AgroAdvisor. {user_input}"
        else:
            # For subsequent interactions, explicitly tell the model not to introduce itself
            user_input = f"This is NOT our first interaction. DO NOT introduce yourself again. {user_input}"
        
        # Combine context with user query
        if context:
            user_input = f"{' '.join(context)} {user_input}"

        # Generate the response using Groq model through langchain
        response = conversation(user_input)
        
        # Mark that we've had the first interaction
        if is_first_interaction:
            session_data["is_first_interaction"] = False
        
        # For simple greetings, potentially override with a shorter response
        if is_simple_greeting and "response" in response:
            # Only use predefined greetings for non-first interactions
            if not is_first_interaction:
                greetings = [
                    "How can I help with your farming today?",
                    "What agricultural advice do you need?",
                    "What farming questions can I answer for you?",
                    "What can I help you with today?"
                ]
                # Select a greeting based on a simple hash of the input to maintain consistency
                greeting_index = sum(ord(c) for c in user_input) % len(greetings)
                return JSONResponse(content={"response": greetings[greeting_index]})
        
        # Check if the response is valid
        if response and "response" in response:
            # Post-process to remove any unwanted introductions in subsequent responses
            if not is_first_interaction:
                response_text = response["response"]
                # Remove common introduction patterns
                intro_patterns = [
                    r"^Hello!?\s+I'm AgroAdvisor,\s+your AI virtual agronomist\.?\s+",
                    r"^As AgroAdvisor,\s+",
                    r"^AgroAdvisor here\.?\s+",
                    r"^This is AgroAdvisor\.?\s+"
                ]
                
                for pattern in intro_patterns:
                    response_text = re.sub(pattern, "", response_text, flags=re.IGNORECASE)
                
                return JSONResponse(content={"response": response_text})
            
            return JSONResponse(content={"response": response["response"]})
        else:
            raise HTTPException(status_code=500, detail="Failed to generate agricultural insights.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agronomist chatbot error: {str(e)}")