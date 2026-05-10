from datetime import datetime
from pydantic import BaseModel

class BookingCreate(BaseModel):
    showtime_id: int
    number_of_tickets: int

class BookingResponse(BaseModel):
    id: int
    user_id: int
    showtime_id: int
    number_of_tickets: int
    booking_reference: str
    booking_status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }