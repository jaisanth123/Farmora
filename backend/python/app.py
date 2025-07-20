from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.lon import router as coordinates_router
from utils.weather import router as environmental_router
# from utils.multilingual import router as multilingual_router
from models.crop_recommend.crop_recommend import router as crop_recommend_router
from models.pest.pest import router as pest_router
from models.crop_recommend.demand_crop import router as demand_router
from models.crop_recommend.seasonal import router as seasonal_router
from utils.info import router as info_router
app = FastAPI()
# # Add CORS middlewasdare
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:3000"],  # Your Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Including the routers for each endpoint with prefixes
app.include_router(info_router, prefix="/api")
app.include_router(coordinates_router, prefix="/api")
app.include_router(environmental_router, prefix="/api")
# app.include_router(multilingual_router, prefix="/api")
app.include_router(crop_recommend_router, prefix="/api")
app.include_router(pest_router, prefix="/api")
app.include_router(demand_router, prefix="/api")
app.include_router(seasonal_router, prefix="/api")




# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the API!"}
