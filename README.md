# FILMHOUSE

## Overview

FILMHOUSE is a web-based cinema booking system that allows users to browse movies, view showtimes and book tickets. Admin users can manage movies, showtimes and bookings.

---

## Tech Stack

* Backend: Python (FastAPI)
* Database: SQLite + SQLAlchemy
* Frontend: React + Vite
* Routing: React Router
* API Communication: Axios
* Authentication: JWT Authentication

---

## Running the Application (Backend)

### 1. Clone the repository

git clone https://github.com/your-username/filmhouse.git

### 2. Navigate to backend

cd filmhouse/backend

### 3. (Optional) Create and activate a virtual environment

python -m venv venv
venv\Scripts\activate

### 4. Install dependencies

pip install -r requirements.txt

### 5. Seed the database with demo data

python seed.py

### 6. Run the server

uvicorn main:app --reload

### 7. Open in browser

http://127.0.0.1:8000
http://127.0.0.1:8000/docs


## Running the Application (Frontend)

### 1. Navigate to frontend folder

cd ../frontend

### 2. Install frontend dependencies

npm install

### 3. Start the frontend development server

npm run dev

### 4. Open frontend in browser

http://localhost:5173


## Default Test Accounts

### Admin User

Email: admin@filmhouse.com
Password: AdminPassword123

### Regular Users

Email: tester1@example.com
Password: Password1234

Email: tester2@example.com
Password: Password1234
