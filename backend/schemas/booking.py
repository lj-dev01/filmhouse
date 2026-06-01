from datetime import datetime
from pydantic import BaseModel

class BookingCreate(BaseModel):
    # Booking request fields
    showtime_id: int
    number_of_tickets: int

class BookingResponse(BaseModel):
    # Core booking response fields
    id: int
    user_id: int
    showtime_id: int
    number_of_tickets: int
    booking_reference: str
    booking_status: str
    created_at: datetime

    # Expanded booking display fields
    user_email: str | None = None
    movie_title: str | None = None
    movie_age_rating: str | None = None
    showtime_start_time: datetime | None = None
    screen_name: str | None = None
    screen_type: str | None = None

    # Allow responses from SQLAlchemy models
    model_config = {
        "from_attributes": True
    }
