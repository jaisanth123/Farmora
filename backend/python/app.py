from fastapi import FastAPI
from coordinates import router as coordinates_router
from environmental_conditions import router as environmental_router

app = FastAPI()

# Including the routers for each endpoint
app.include_router(coordinates_router)
app.include_router(environmental_router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Weather API!"}
