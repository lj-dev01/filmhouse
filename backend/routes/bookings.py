import uuid # Python library being used to generate unique booking reference

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from models.booking import Booking
from models.showtime import Showtime
from models.user import User
from schemas.booking import BookingResponse, BookingCreate
from services.auth_service import get_current_user

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    showtime = db.query(Showtime).filter(Showtime.id == booking_data.showtime_id).first()

    if showtime is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Showtime not found"
        )

    if booking_data.number_of_tickets <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of tickets must be greater than 0"
        )

    if booking_data.number_of_tickets > showtime.available_seats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough seats available"
        )

    booking_reference = f"FH-{uuid.uuid4().hex[:8].upper()}"

    new_booking = Booking(
        user_id=current_user.id,
        showtime_id=booking_data.showtime_id,
        number_of_tickets=booking_data.number_of_tickets,
        booking_reference=booking_reference,
        booking_status="active"
    )

    showtime.available_seats -= booking_data.number_of_tickets

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking

@router.get("/my-bookings", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    return bookings

@router.put("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own bookings"
        )

    if booking.booking_status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled"
        )

    showtime = db.query(Showtime).filter(Showtime.id == booking.showtime_id).first()

    booking.booking_status = "cancelled"
    showtime.available_seats += booking.number_of_tickets

    db.commit()
    db.refresh(booking)

    return booking