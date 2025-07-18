from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from scraper import scrape_website
import requests # to catch request exceptions

app = FastAPI()

# Allow CORS for the Next.js default port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

@app.post("/scrape")
async def scrape(request: ScrapeRequest):
    url = request.url
    if not (url.startswith('http://') or url.startswith('https://')):
        raise HTTPException(status_code=400, detail="Invalid URL. Please include http:// or https://")

    try:
        zip_path = scrape_website(url)
        filename = os.path.basename(zip_path)
        return FileResponse(
            path=zip_path, 
            filename=filename, 
            media_type='application/zip'
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to reach the website: {e}")
    except Exception as e:
        # Catch other potential errors from the scraper
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)