from fastapi import FastAPI
from database.database import Base, engine
from routes import auth, movies

from models.user import User
from models.movie import Movie
from models.screen import Screen
from models.showtime import Showtime
from models.booking import Booking

app = FastAPI(
    title="FILMHOUSE API",
    description="Backend API for the FILMHOUSE cinema booking system",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(movies.router)

@app.get("/")
def root():
   return {"message": "FILMHOUSE API is running"} 