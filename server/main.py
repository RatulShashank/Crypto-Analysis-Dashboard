from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from data_ingestion import DataIngestionEngine
from analysis_engine import QuantAnalysisEngine

app = FastAPI(title="VINCI Quant Backend")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConfigPayload(BaseModel):
    data_source_type: str # 'api', 'local', or 'yfinance'
    api_key: Optional[str] = None
    local_path: Optional[str] = None
    oi_path: Optional[str] = None
    funding_path: Optional[str] = None
    symbol: str = "BTCUSDT"
    start_date: Optional[str] = None
    end_date: Optional[str] = None

# Global state to hold the loaded engine (for simplicity in this demo)
global_engine: Optional[QuantAnalysisEngine] = None

@app.get("/")
def read_root():
    return {"status": "VINCI Quant Backend is running"}

@app.post("/api/configure")
def configure_dashboard(config: ConfigPayload):
    global global_engine
    
    try:
        # Initialize ingestion engine
        ingestion = DataIngestionEngine(
            data_source_type=config.data_source_type,
            kline_path=config.local_path,
            oi_path=config.oi_path,
            funding_path=config.funding_path,
            api_key=config.api_key,
            start_date=config.start_date,
            end_date=config.end_date
        )
        
        # Load datasets
        datasets = ingestion.load_all_datasets(symbol=config.symbol)
        
        # Initialize analysis engine
        global_engine = QuantAnalysisEngine(data=datasets)
        
        return {"status": "success", "message": "Data loaded and analysis engine initialized"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/dashboard-data")
def get_dashboard_data():
    if global_engine is None:
        raise HTTPException(status_code=400, detail="Dashboard not configured. Please supply data source first.")
        
    try:
        payload = global_engine.generate_dashboard_payload()
        return payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
