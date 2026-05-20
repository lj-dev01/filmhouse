from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from models.showtime import Showtime
from models.movie import Movie
from models.screen import Screen
from models.user import User
from schemas.showtime import ShowtimeResponse, ShowtimeCreate, ShowtimeUpdate
from services.auth_service import get_current_admin_user

router = APIRouter(
    prefix="/showtimes",
    tags=["Showtimes"]
)


@router.get("/", response_model=list[ShowtimeResponse])
def get_showtimes(db: Session = Depends(get_db)):
    showtimes = db.query(Showtime).all()
    return showtimes

@router.get("/movie/{movie_id}", response_model=list[ShowtimeResponse])
def get_showtimes_by_movie(movie_id: int, db: Session = Depends(get_db)):
    showtimes = db.query(Showtime).filter(Showtime.movie_id == movie_id).all()

    return [
        {
            "id": showtime.id,
            "movie_id": showtime.movie_id,
            "screen_id": showtime.screen_id,
            "screen_name": showtime.screen.screen_name,
            "screen_type": showtime.screen.screen_type,
            "start_time": showtime.start_time,
            "ticket_price": showtime.ticket_price,
            "available_seats": showtime.available_seats,
        }
        for showtime in showtimes
    ]

@router.post("/", response_model=ShowtimeResponse, status_code=status.HTTP_201_CREATED)
def create_showtime(
    showtime_data: ShowtimeCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    movie = db.query(Movie).filter(Movie.id == showtime_data.movie_id).first()

    if movie is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )

    screen = db.query(Screen).filter(Screen.id == showtime_data.screen_id).first()

    if screen is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screen not found"
        )

    new_showtime = Showtime(**showtime_data.model_dump())

    db.add(new_showtime)
    db.commit()
    db.refresh(new_showtime)

    return new_showtime

@router.put("/{showtime_id}", response_model=ShowtimeResponse)
def update_showtime(
    showtime_id: int,
    showtime_data: ShowtimeUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()

    if showtime is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Showtime not found"
        )

    for key, value in showtime_data.model_dump(exclude_unset=True).items():
        setattr(showtime, key, value)

    db.commit()
    db.refresh(showtime)

    return showtime

@router.delete("/{showtime_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_showtime(
    showtime_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    showtime = db.query(Showtime).filter(Showtime.id == showtime_id).first()

    if showtime is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Showtime not found"
        )

    db.delete(showtime)
    db.commit()