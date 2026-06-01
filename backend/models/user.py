from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from datetime import datetime, timezone

from database.database import Base

class User(Base):
    # User account table
    __tablename__ = "users"

    # User account fields
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="regular")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # User bookings relationship
    bookings = relationship("Booking", back_populates="user")
