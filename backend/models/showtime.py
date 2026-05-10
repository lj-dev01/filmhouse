from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database.database import Base

class Showtime(Base):
    __tablename__ = "showtimes"

    id = Column(Integer, primary_key=True, index=True)

    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    screen_id = Column(Integer, ForeignKey("screens.id"), nullable=False)

    start_time = Column(DateTime, nullable=False)
    ticket_price = Column(Float, nullable=False)
    available_seats = Column(Integer, nullable=False)

    movie = relationship("Movie", back_populates="showtimes")
    screen = relationship("Screen", back_populates="showtimes")

    bookings = relationship("Booking", back_populates="showtime")