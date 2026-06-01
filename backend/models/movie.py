from sqlalchemy import Column, Date, Integer, String, Text
from sqlalchemy.orm import relationship

from database.database import Base

class Movie(Base):
    # Movie catalogue table
    __tablename__ = "movies"

    # Movie details
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    age_rating = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    release_date = Column(Date, nullable=False)
    poster_url = Column(String, nullable=True)

    # Movie showtimes relationship
    showtimes = relationship("Showtime", back_populates="movie")
