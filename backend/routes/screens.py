from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from models.screen import Screen
from models.user import User
from schemas.screen import ScreenResponse, ScreenCreate, ScreenUpdate
from services.auth_service import get_current_admin_user

router = APIRouter(
    prefix="/screens",
    tags=["Screens"]
)

@router.get("/", response_model=list[ScreenResponse])
def get_screens(db: Session = Depends(get_db)):
    screens = db.query(Screen).all()
    return screens

@router.post("/", response_model=ScreenResponse, status_code=status.HTTP_201_CREATED)
def create_screen(
    screen_data: ScreenCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    new_screen = Screen(**screen_data.model_dump())

    db.add(new_screen)
    db.commit()
    db.refresh(new_screen)

    return new_screen

@router.put("/{screen_id}", response_model=ScreenResponse)
def update_screen(
    screen_id: int,
    screen_data: ScreenUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    screen = db.query(Screen).filter(Screen.id == screen_id).first()

    if screen is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screen not found"
        )

    for key, value in screen_data.model_dump(exclude_unset=True).items():
        setattr(screen, key, value)

    db.commit()
    db.refresh(screen)

    return screen

@router.delete("/{screen_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_screen(
    screen_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    screen = db.query(Screen).filter(Screen.id == screen_id).first()

    if screen is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screen not found"
        )

    db.delete(screen)
    db.commit()