from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.lon import router as coordinates_router
from utils.weather import router as environmental_router
from utils.multilingual import router as multilingual_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Including the routers for each endpoint with prefixes
app.include_router(coordinates_router, prefix="/api")
app.include_router(environmental_router, prefix="/api")
app.include_router(multilingual_router, prefix="/api")


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the API!"}
