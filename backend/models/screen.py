from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database.database import Base

class Screen(Base):
    # Cinema screen table
    __tablename__ = "screens"

    # Screen details
    id = Column(Integer, primary_key=True, index=True)
    screen_name = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    screen_type = Column(String, nullable=False)

    # Screen showtimes relationship
    showtimes = relationship("Showtime", back_populates="screen")
