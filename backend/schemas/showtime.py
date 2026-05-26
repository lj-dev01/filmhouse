from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class ShowtimeBase(BaseModel):
    movie_id: int = Field(gt=0)
    screen_id: int = Field(gt=0)
    start_time: datetime
    ticket_price: float = Field(gt=0)
    available_seats: int = Field(ge=0)

    @field_validator("start_time")
    @classmethod
    def validate_future_start_time(cls, value: datetime) -> datetime:
        now = datetime.now(value.tzinfo) if value.tzinfo else datetime.now()

        if value < now:
            raise ValueError("Showtime start date and time cannot be in the past")

        return value


class ShowtimeCreate(ShowtimeBase):
    pass


class ShowtimeUpdate(BaseModel):
    movie_id: int | None = Field(default=None, gt=0)
    screen_id: int | None = Field(default=None, gt=0)
    start_time: datetime | None = None
    ticket_price: float | None = Field(default=None, gt=0)
    available_seats: int | None = Field(default=None, ge=0)

    @field_validator("start_time")
    @classmethod
    def validate_optional_future_start_time(cls, value: datetime | None) -> datetime | None:
        if value is None:
            return value

        now = datetime.now(value.tzinfo) if value.tzinfo else datetime.now()

        if value < now:
            raise ValueError("Showtime start date and time cannot be in the past")

        return value


class ShowtimeResponse(ShowtimeBase):
    id: int
    screen_name: str | None = None
    screen_type: str | None = None

    model_config = {
        "from_attributes": True
    }