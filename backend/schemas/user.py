from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    # Registration request fields
    username: str = Field(min_length=3)
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)

    # Username cleanup and validation
    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        value = value.strip()

        if len(value) < 3:
            raise ValueError("Username must be at least 3 characters")

        return value

    # Password strength validation
    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, value: str) -> str:
        if not any(character.isupper() for character in value):
            raise ValueError("Password must contain at least one uppercase letter")

        if not any(character.islower() for character in value):
            raise ValueError("Password must contain at least one lowercase letter")

        if not any(character.isdigit() for character in value):
            raise ValueError("Password must contain at least one number")

        return value

class UserLogin(BaseModel):
    # Login request fields
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)

class UserResponse(BaseModel):
    # Public user response fields
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    # Allow responses from SQLAlchemy models
    model_config = {
        "from_attributes": True
    }
