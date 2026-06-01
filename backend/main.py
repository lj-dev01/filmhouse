from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import Base, engine
from routes import auth, movies, screens, showtimes, bookings, users

from models.user import User
from models.movie import Movie
from models.screen import Screen
from models.showtime import Showtime
from models.booking import Booking


# FastAPI application settings
app = FastAPI(
    title="FILMHOUSE API",
    description="Backend API for the FILMHOUSE cinema booking system",
    version="1.0.0",
)

# Frontend access settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database table setup
Base.metadata.create_all(bind=engine)

# API route registration
app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(screens.router)
app.include_router(showtimes.router)
app.include_router(bookings.router)
app.include_router(users.router)

# Health check route
@app.get("/")
def root():
   return {"message": "FILMHOUSE API is running"} 
