from fastapi import APIRouter, Depends
from api.state import get_state
from api.schemas import Reading
from api.services.pipeline import run_predict, run_anomaly, run_optimize, update_buffer

router = APIRouter()

@router.post("/predict")
async def predict_only(request: Reading, state: dict = Depends(get_state)):
    """
    Returns unified forecast, anomaly, optimization, and metadata response.
    """
    anomaly_result = await run_anomaly(request, state)
    forecast_result = await run_predict(request, state)
    update_buffer(request, state)
    
    optimize_result = None
    if request.run_optimizer:
        optimize_result = await run_optimize(forecast_result, state)
        
    return {
        "forecast": forecast_result,
        "confidence_interval": forecast_result.get("confidence_interval"),
        "anomaly": anomaly_result,
        "optimization": optimize_result,
        "metadata": {
            "algorithm": "LightGBM",
            "buffer_rows": len(state['buffer'])
        }
    }

@router.post("/predict_full")
async def predict_full(request: Reading, state: dict = Depends(get_state)):
    """
    Wrapper endpoint that orchestrates calls to predict, anomaly, and optimize.
    """
    anomaly_result = await run_anomaly(request, state)
    forecast_result = await run_predict(request, state)
    update_buffer(request, state)
    
    optimize_result = None
    if request.run_optimizer:
        optimize_result = await run_optimize(forecast_result, state)
        
    return {
        "forecast": forecast_result,
        "confidence_interval": forecast_result.get("confidence_interval"),
        "anomaly": anomaly_result,
        "optimization": optimize_result,
        "metadata": {
            "algorithm": "LightGBM",
            "buffer_rows": len(state['buffer'])
        }
    }
