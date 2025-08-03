from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from models.crop_recommend.crop_recommend import router as soil_router
from models.crop_recommend.seasonal import router as seasonal_router
from models.crop_recommend.demand_crop import router as demand_router

router = APIRouter()

# Include existing crop recommendation routers
router.include_router(soil_router, prefix="/crop_recommend", tags=["Soil Analysis"])
router.include_router(seasonal_router, prefix="/seasonal", tags=["Seasonal Analysis"])
router.include_router(demand_router, prefix="/demand", tags=["Demand Analysis"])

# Additional utility endpoints
@router.get("/districts")
async def get_available_districts():
    """
    Get list of available districts for crop recommendations
    """
    try:
        # This would typically come from a database or configuration
        districts = [
            "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
            "Dindigul", "Erode", "Kancheepuram", "Karur", "Krishnagiri",
            "Madurai", "Nagapattinam", "Salem", "Thanjavur", "Tiruppur"
        ]
        return {"districts": sorted(districts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching districts: {str(e)}")

@router.get("/seasons")
async def get_available_seasons():
    """
    Get list of available seasons for crop recommendations
    """
    try:
        seasons = [
            {"name": "Monsoon", "period": "June to October (Monsoon)"},
            {"name": "Winter", "period": "October to March (Winter)"},
            {"name": "Summer", "period": "March to June (Summer)"},
            {"name": "Whole Year", "period": "Whole Year"}
        ]
        return {"seasons": seasons}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching seasons: {str(e)}")

@router.get("/health")
async def crop_recommendation_health():
    """
    Health check for crop recommendation services
    """
    return {
        "status": "ok",
        "service": "crop_recommendation",
        "available_services": ["soil_analysis", "seasonal_prediction", "demand_analysis"]
    }
