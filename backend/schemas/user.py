from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }