from fastapi import FastAPI

app = FastAPI(
    title="FILMHOUSE API",
    description="Backend API for the FILMHOUSE cinema booking system",
    version="1.0.0",
)

@app.get("/")
def root():
   return {"message": "FILMHOUSE API is running"} 