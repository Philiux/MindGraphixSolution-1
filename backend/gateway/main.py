from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

app = FastAPI(
    title="MindGraphix API Gateway",
    description="Gateway pour les microservices MindGraphix",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URLs des services
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8002")
PROJECT_SERVICE_URL = os.getenv("PROJECT_SERVICE_URL", "http://localhost:8003")
SERVICE_SERVICE_URL = os.getenv("SERVICE_SERVICE_URL", "http://localhost:8004")
CONTACT_SERVICE_URL = os.getenv("CONTACT_SERVICE_URL", "http://localhost:8005")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "gateway"}

@app.get("/api/{service}/{path:path}")
async def proxy_request(service: str, path: str):
    service_urls = {
        "auth": AUTH_SERVICE_URL,
        "users": USER_SERVICE_URL,
        "projects": PROJECT_SERVICE_URL,
        "services": SERVICE_SERVICE_URL,
        "contact": CONTACT_SERVICE_URL
    }
    
    if service not in service_urls:
        raise HTTPException(status_code=404, detail="Service non trouvé")
    
    target_url = f"{service_urls[service]}/{path}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(target_url)
            return response.json()
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Service indisponible")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
