from fastapi import FastAPI
from database.database import Base, engine

app = FastAPI(
    title="FILMHOUSE API",
    description="Backend API for the FILMHOUSE cinema booking system",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
   return {"message": "FILMHOUSE API is running"} 