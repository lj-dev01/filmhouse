from pydantic import BaseModel

class ScreenBase(BaseModel):
    screen_name: str
    capacity: int
    screen_type: str

class ScreenCreate(ScreenBase):
    pass

class ScreenUpdate(BaseModel):
    screen_name: str | None = None
    capacity: int | None = None
    screen_type: str | None = None

class ScreenResponse(ScreenBase):
    id: int
    
    model_config = {
        "from_attributes": True
    }