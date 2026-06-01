import uuid # Python library being used to generate unique booking reference

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from models.booking import Booking
from models.showtime import Showtime
from models.user import User
from schemas.booking import BookingResponse, BookingCreate
from services.auth_service import get_current_user, get_current_admin_user

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

# Build the expanded booking response used by account and admin views
def format_booking_response(booking: Booking):
    showtime = booking.showtime
    movie = showtime.movie if showtime else None
    screen = showtime.screen if showtime else None
    user = booking.user

    return {
        "id": booking.id,
        "user_id": booking.user_id,
        "user_email": user.email if user else None,
        "showtime_id": booking.showtime_id,
        "number_of_tickets": booking.number_of_tickets,
        "booking_reference": booking.booking_reference,
        "booking_status": booking.booking_status,
        "created_at": booking.created_at,
        "movie_title": movie.title if movie else None,
        "movie_age_rating": movie.age_rating if movie else None,
        "showtime_start_time": showtime.start_time if showtime else None,
        "screen_name": screen.screen_name if screen else None,
        "screen_type": screen.screen_type if screen else None,
    }


# Create a booking for the current regular user
@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Admin accounts manage bookings but cannot create customer bookings
    if current_user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins cannot create customer bookings"
        )

    # Check the requested showtime exists
    showtime = db.query(Showtime).filter(Showtime.id == booking_data.showtime_id).first()

    if showtime is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Showtime not found"
        )

    # Validate ticket count
    if booking_data.number_of_tickets <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of tickets must be greater than 0"
        )

    # Check seat availability
    if booking_data.number_of_tickets > showtime.available_seats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough seats available"
        )

    booking_reference = f"FH-{uuid.uuid4().hex[:8].upper()}"

    # Create the booking record
    new_booking = Booking(
        user_id=current_user.id,
        showtime_id=booking_data.showtime_id,
        number_of_tickets=booking_data.number_of_tickets,
        booking_reference=booking_reference,
        booking_status="active"
    )

    # Reserve the selected seats
    showtime.available_seats -= booking_data.number_of_tickets

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking

# List bookings for the current user
@router.get("/my-bookings", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()

    return [format_booking_response(booking) for booking in bookings]

# Cancel the current user's booking
@router.put("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find the booking to cancel
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Users can only cancel their own bookings
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own bookings"
        )

    # Prevent duplicate cancellations
    if booking.booking_status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled"
        )

    showtime = db.query(Showtime).filter(Showtime.id == booking.showtime_id).first()

    # Mark cancelled and restore seats
    booking.booking_status = "cancelled"
    showtime.available_seats += booking.number_of_tickets

    db.commit()
    db.refresh(booking)

    return booking

# List all bookings as an admin
@router.get("/admin/all", response_model=list[BookingResponse])
def admin_get_all_bookings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    bookings = db.query(Booking).all()
    return [format_booking_response(booking) for booking in bookings]

# Cancel any booking as an admin
@router.put("/admin/{booking_id}/cancel", response_model=BookingResponse)
def admin_cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    # Find the booking to cancel
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Prevent duplicate cancellations
    if booking.booking_status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled"
        )

    showtime = db.query(Showtime).filter(Showtime.id == booking.showtime_id).first()

    # Mark cancelled and restore seats
    booking.booking_status = "cancelled"
    showtime.available_seats += booking.number_of_tickets

    db.commit()
    db.refresh(booking)

    return booking
