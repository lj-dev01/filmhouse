from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database.database import Base

class Screen(Base):
    __tablename__ = "screens"

    id = Column(Integer, primary_key=True, index=True)
    screen_name = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    screen_type = Column(String, nullable=False)

    showtimes = relationship("Showtime", back_populates="screen")