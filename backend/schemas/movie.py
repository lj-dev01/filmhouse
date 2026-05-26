from datetime import date
from pydantic import BaseModel, Field, field_validator


class MovieBase(BaseModel):
    title: str
    genre: str
    age_rating: str
    duration_minutes: int = Field(gt=0)
    description: str
    release_date: date
    poster_url: str | None = None

    @field_validator("title", "genre", "age_rating", "description")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Field cannot be empty")

        return value


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    title: str | None = None
    genre: str | None = None
    age_rating: str | None = None
    duration_minutes: int | None = Field(default=None, gt=0)
    description: str | None = None
    release_date: date | None = None
    poster_url: str | None = None

    @field_validator("title", "genre", "age_rating", "description")
    @classmethod
    def validate_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("Field cannot be empty")

        return value


class MovieResponse(MovieBase):
    id: int

    model_config = {
        "from_attributes": True
    }