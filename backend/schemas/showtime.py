from datetime import datetime
from pydantic import BaseModel


class ShowtimeBase(BaseModel):
    movie_id: int
    screen_id: int
    start_time: datetime
    ticket_price: float
    available_seats: int


class ShowtimeCreate(ShowtimeBase):
    pass


class ShowtimeUpdate(BaseModel):
    movie_id: int | None = None
    screen_id: int | None = None
    start_time: datetime | None = None
    ticket_price: float | None = None
    available_seats: int | None = None


class ShowtimeResponse(ShowtimeBase):
    id: int
    screen_name: str | None = None
    screen_type: str | None = None

    model_config = {
        "from_attributes": True
    }