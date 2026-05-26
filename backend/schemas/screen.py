from pydantic import BaseModel, Field, field_validator

class ScreenBase(BaseModel):
    screen_name: str
    capacity: int = Field(gt=0)
    screen_type: str

    @field_validator("screen_name", "screen_type")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Field cannot be empty")

        return value

class ScreenCreate(ScreenBase):
    pass

class ScreenUpdate(BaseModel):
    screen_name: str | None = None
    capacity: int | None = Field(default=None, gt=0)
    screen_type: str | None = None

    @field_validator("screen_name", "screen_type")
    @classmethod
    def validate_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("Field cannot be empty")

        return value

class ScreenResponse(ScreenBase):
    id: int
    
    model_config = {
        "from_attributes": True
    }