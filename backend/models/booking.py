from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database.database import Base

class Booking(Base):
    # Customer booking table
    __tablename__ = "bookings"

    # Booking identity
    id = Column(Integer, primary_key=True, index=True)

    # Linked customer and showtime
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    showtime_id = Column(Integer, ForeignKey("showtimes.id"), nullable=False)

    # Booking details
    number_of_tickets = Column(Integer, nullable=False)
    booking_reference = Column(String, unique=True, index=True, nullable=False)
    booking_status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Parent relationships
    user = relationship("User", back_populates="bookings")
    showtime = relationship("Showtime", back_populates="bookings")
