from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

@app.post("/predict")
def predict_anomaly(data: List[Dict[str, Any]]):
    total_records = len(data)
    high_risk_count = 0
    total_risk_score = 0
    
    for record in data:
        heart_rate = record.get("heart_rate", 75)
        blood_pressure = record.get("blood_pressure", 120)
        age = record.get("age", 30)
        
        risk_score = 0
        if heart_rate > 100: risk_score += 30
        if blood_pressure > 140: risk_score += 40
        if age > 60: risk_score += 30
        
        if risk_score >= 70:
            high_risk_count += 1
        total_risk_score += risk_score

    average_risk = total_risk_score / total_records if total_records > 0 else 0
    
    overall_status = "Normal Health Data"
    if high_risk_count > 0:
        overall_status = f"High Risk Detected in {high_risk_count} patient(s)"
    elif average_risk > 30:
        overall_status = "Moderate Risk Detected"
        
    return {
        "total_records": total_records,
        "high_risk_patients": high_risk_count,
        "average_risk_score": round(average_risk, 2),
        "prediction": overall_status
    }