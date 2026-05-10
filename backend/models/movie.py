from sqlalchemy import Column, Date, Integer, String, Text
from sqlalchemy.orm import relationship

from database.database import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    age_rating = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    release_date = Column(Date, nullable=False)

    showtimes = relationship("Showtime", back_populates="movie")