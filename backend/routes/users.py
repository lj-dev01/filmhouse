from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.user import User
from schemas.user import UserResponse
from services.auth_service import get_current_admin_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# List all users as an admin
@router.get("/admin/all", response_model=list[UserResponse])
def admin_get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    users = db.query(User).all()
    return users
