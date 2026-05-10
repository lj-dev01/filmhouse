from datetime import date
from pydantic import BaseModel

class MovieBase(BaseModel):
    title: str
    genre: str
    age_rating: str
    duration_minutes: int
    description: str
    release_date: date

class MovieCreate(MovieBase):
    pass

class MovieUpdate(BaseModel):
    title: str | None = None
    genre: str | None = None
    age_rating: str | None = None
    duration_minutes: int | None = None
    description: str | None = None
    release_date: date | None = None


class MovieResponse(MovieBase):
    id: int

    model_config = {
        "from_attributes": True
    }