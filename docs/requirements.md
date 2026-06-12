# Requirements

## Functional Requirements

User registration: Users must be able to create an account

User login: Users must authenticate before using protected features

Role-based access: Admin and regular users must have different permissions

Movie browsing: Users must be able to view available movies

Showtime viewing: Users must be able to view showtimes for movies

Booking creation: Regular users must be able to book tickets

Booking cancellation: Users must be able to cancel their own bookings

Admin CRUD: Admins must be able to create, read, update, and delete system records

Validation: Invalid data must be rejected with useful error messages

Database persistence: Data must be stored in a relational SQLite database

## Non-Functional Requirements

Security: Passwords are hashed and protected routes require JWT authentication

Usability: The frontend provides clear navigation, forms and success/error messages

Maintainability: The backend is separated into routes, models, schemas, services and database modules

Reliability: Validation prevents invalid data such as weak passwords, negative ticket values and past showtimes

Performance: SQLite and SQLAlchemy provide efficient database access for the project scale

Scalability: The modular structure allows new features to be added in future iterations
