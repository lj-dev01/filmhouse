from datetime import datetime, timedelta, date

from database.database import SessionLocal, Base, engine
from models.user import User
from models.movie import Movie
from models.screen import Screen
from models.showtime import Showtime
from models.booking import Booking

from services.auth_service import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

db.query(Booking).delete()
db.query(Showtime).delete()
db.query(Screen).delete()
db.query(Movie).delete()
db.query(User).delete()

db.commit()

admin_user = User(
    username="admin",
    email="admin@filmhouse.com",
    password_hash=hash_password("AdminPassword123"),
    role="admin"
)

user_one = User(
    username="tester1",
    email="tester1@example.com",
    password_hash=hash_password("Password1234"),
    role="regular"
)

user_two = User(
    username="tester2",
    email="tester2@example.com",
    password_hash=hash_password("Password1234"),
    role="regular"
)

users = [admin_user, user_one, user_two]

movies = [
    Movie(title="Apex Heart", genre="Sports Drama", age_rating="12A", duration_minutes=130, description="A retired racing champion returns to mentor a fearless rookie, confronting old rivalries, personal regrets and the brutal pressure of one final season at the top.", release_date=date(2025, 6, 27), poster_url="/posters/apex_heart.jpg"),
    Movie(title="Beyond the Last Orbit", genre="Sci-Fi", age_rating="12", duration_minutes=169, description="As Earth faces environmental collapse, a team of astronauts crosses an untested gateway in search of a new home for humanity.", release_date=date(2014, 11, 7), poster_url="/posters/beyond_the_last_orbit.jpg"),
    Movie(title="Nani and the Starling", genre="Family", age_rating="U", duration_minutes=110, description="A lonely island girl discovers a mischievous alien hiding near her home, beginning a heartfelt adventure about family, friendship and belonging.", release_date=date(2025, 5, 23), poster_url="/posters/nani_and_the_starling.jpg"),
    Movie(title="Starlight Rhythm", genre="Biographical Drama", age_rating="12A", duration_minutes=140, description="A biographical drama following a gifted young performer from small-town talent shows to international fame, exploring ambition, family pressure and the cost of living in the spotlight.", release_date=date(2025, 10, 3), poster_url="/posters/starlight_rhythm.jpg"),
    Movie(title="Pixel Planet Adventure", genre="Animation", age_rating="PG", duration_minutes=100, description="A cheerful young space mechanic and his quirky alien friends travel across colourful planets to stop a power-hungry tyrant from draining energy from the stars.", release_date=date(2026, 4, 3), poster_url="/posters/pixel_planet_adventure.jpg"),
    Movie(title="Primeval Island", genre="Adventure", age_rating="12", duration_minutes=135, description="A remote research island promises a new scientific breakthrough, but when ancient creatures escape containment, visitors must survive a wilderness that should not exist.", release_date=date(2025, 7, 2), poster_url="/posters/primeval_island.jpg"),
    Movie(title="Sands of Veyra", genre="Sci-Fi", age_rating="12", duration_minutes=166, description="A young heir joins desert rebels on a harsh mineral-rich planet, torn between revenge, prophecy and the political forces that want to control his future.", release_date=date(2024, 3, 1), poster_url="/posters/sands_of_veyra.jpg"),
    Movie(title="Moonspell Academy", genre="Musical Fantasy", age_rating="PG", duration_minutes=150, description="Two young witches on opposite sides of a magical kingdom must decide whether loyalty, friendship or destiny will shape the future of their world.", release_date=date(2025, 11, 21), poster_url="/posters/moonspell_academy.jpg"),
    Movie(title="The Moorland Vow", genre="Romantic Drama", age_rating="15", duration_minutes=125, description="Across windswept moors and divided families, two childhood companions become trapped in a passionate, destructive love that echoes through generations.", release_date=date(2026, 2, 13), poster_url="/posters/the_moorland_vow.jpg"),
    Movie(title="The Editor's Return", genre="Comedy Drama", age_rating="12A", duration_minutes=120, description="Years after leaving the fashion world behind, an ambitious journalist is pulled back into glossy magazines, ruthless deadlines and an unforgettable former mentor.", release_date=date(2026, 5, 1), poster_url="/posters/the_editors_return.jpg"),
    Movie(title="The Ashcroft Haunting", genre="Horror", age_rating="15", duration_minutes=120, description="A pair of paranormal investigators take on their most disturbing case when a centuries-old house awakens with a presence that refuses to stay buried.", release_date=date(2025, 9, 5), poster_url="/posters/the_ashcroft_haunting.jpg"),
    Movie(title="Pawshire Detectives", genre="Animation", age_rating="PG", duration_minutes=105, description="In a bustling animal city, a rookie rabbit officer and a quick-witted fox reporter team up to solve a mysterious blackout threatening peace across every district.", release_date=date(2025, 11, 26), poster_url="/posters/pawshire_detectives.jpg"),
    Movie(title="The Quiet Equation", genre="Drama", age_rating="15", duration_minutes=180, description="A brilliant physicist is recruited to lead a secret wartime project, forcing him to confront ambition, morality and the consequences of discovery.", release_date=date(2023, 7, 21), poster_url="/posters/the_quiet_equation.jpg"),
    Movie(title="Shadow Protocol", genre="Action", age_rating="12", duration_minutes=160, description="An elite covert agent races across continents to stop a stolen intelligence system before it triggers a global security crisis.", release_date=date(2025, 5, 23), poster_url="/posters/shadow_protocol.jpg"),
    Movie(title="The Nova Quartet", genre="Superhero", age_rating="12", duration_minutes=125, description="Four scientists are transformed during a deep-space experiment and must learn to control their extraordinary powers when a cosmic force targets Earth.", release_date=date(2025, 7, 25), poster_url="/posters/the_nova_quartet.jpg"),
    Movie(title="The Hollow Parish", genre="Thriller", age_rating="15", duration_minutes=120, description="Two estranged siblings return to their isolated hometown and uncover a chain of disappearances tied to a secretive community and a past nobody wants revealed.", release_date=date(2025, 4, 18), poster_url="/posters/the_hollow_parish.jpg"),
    Movie(title="Vanishing Act", genre="Crime Thriller", age_rating="12", duration_minutes=125, description="A crew of illusionists reunites for a daring heist against a powerful crime syndicate, using impossible tricks to expose a dangerous conspiracy.", release_date=date(2025, 11, 14), poster_url="/posters/vanishing_act.jpg"),
    Movie(title="Dragonkeeper's Oath", genre="Fantasy Adventure", age_rating="12", duration_minutes=125, description="A young villager forms an unlikely bond with a wounded dragon, challenging generations of fear and changing the fate of both their worlds.", release_date=date(2025, 6, 13), poster_url="/posters/dragonkeepers_oath.jpg"),
    Movie(title="Neon Aegis", genre="Sci-Fi", age_rating="12", duration_minutes=125, description="When an advanced digital intelligence breaks into the physical world, a programmer must enter a glowing virtual battlefield to prevent a technological takeover.", release_date=date(2025, 10, 10), poster_url="/posters/neon_aegis.jpg"),
]

screens = [
    Screen(screen_name="Screen 1", capacity=100, screen_type="Standard"),
    Screen(screen_name="Screen 2", capacity=120, screen_type="Standard"),
    Screen(screen_name="Screen 3", capacity=90, screen_type="Standard"),
    Screen(screen_name="Screen 4", capacity=140, screen_type="Dolby"),
    Screen(screen_name="Screen 5", capacity=180, screen_type="IMAX"),
    Screen(screen_name="Screen 6", capacity=110, screen_type="3D"),
    Screen(screen_name="Screen 7", capacity=160, screen_type="XL"),
]

db.add_all(users)
db.add_all(movies)
db.add_all(screens)

db.commit()

movie_by_title = {movie.title: movie for movie in db.query(Movie).all()}
screen_by_name = {screen.screen_name: screen for screen in db.query(Screen).all()}


def get_showtime_base_date(months_ahead=3):
    today = date.today()
    month_index = today.month - 1 + months_ahead
    year = today.year + month_index // 12
    month = month_index % 12 + 1

    return date(year, month, 1)


showtime_base_date = get_showtime_base_date()
movie_showtime_offsets = {
    movie.title: index
    for index, movie in enumerate(movies)
}


def create_showtime(movie_title, screen_name, days_from_now, hour, minute, price):
    screen = screen_by_name[screen_name]
    movie_offset = movie_showtime_offsets[movie_title]
    showtime_date = showtime_base_date + timedelta(
        days=movie_offset + days_from_now - 1
    )

    return Showtime(
        movie_id=movie_by_title[movie_title].id,
        screen_id=screen.id,
        start_time=datetime(
            showtime_date.year,
            showtime_date.month,
            showtime_date.day,
            hour,
            minute
        ),
        ticket_price=price,
        available_seats=screen.capacity
    )


showtimes = [
    create_showtime("Apex Heart", "Screen 1", 1, 13, 0, 11.99),
    create_showtime("Apex Heart", "Screen 4", 1, 18, 0, 15.99),
    create_showtime("Apex Heart", "Screen 5", 2, 20, 30, 16.99),

    create_showtime("Beyond the Last Orbit", "Screen 3", 1, 15, 0, 10.99),
    create_showtime("Beyond the Last Orbit", "Screen 5", 2, 18, 30, 15.99),

    create_showtime("Nani and the Starling", "Screen 1", 1, 10, 30, 8.99),
    create_showtime("Nani and the Starling", "Screen 2", 1, 13, 0, 9.99),
    create_showtime("Nani and the Starling", "Screen 6", 2, 15, 30, 12.99),

    create_showtime("Starlight Rhythm", "Screen 1", 1, 14, 0, 11.99),

    create_showtime("Pixel Planet Adventure", "Screen 2", 1, 12, 30, 9.99),
    create_showtime("Pixel Planet Adventure", "Screen 7", 2, 17, 30, 12.99),

    create_showtime("Primeval Island", "Screen 2", 1, 12, 0, 11.99),
    create_showtime("Primeval Island", "Screen 3", 1, 18, 30, 12.99),
    create_showtime("Primeval Island", "Screen 5", 2, 19, 30, 16.99),

    create_showtime("Sands of Veyra", "Screen 2", 1, 14, 30, 11.99),
    create_showtime("Sands of Veyra", "Screen 5", 1, 19, 0, 16.99),
    create_showtime("Sands of Veyra", "Screen 4", 2, 20, 0, 15.99),

    create_showtime("Moonspell Academy", "Screen 1", 1, 15, 0, 11.99),
    create_showtime("Moonspell Academy", "Screen 4", 1, 19, 0, 15.99),

    create_showtime("The Moorland Vow", "Screen 2", 1, 16, 45, 10.99),

    create_showtime("The Editor's Return", "Screen 1", 1, 13, 30, 10.99),
    create_showtime("The Editor's Return", "Screen 2", 2, 18, 15, 11.99),

    create_showtime("The Ashcroft Haunting", "Screen 3", 1, 21, 0, 12.99),
    create_showtime("The Ashcroft Haunting", "Screen 2", 2, 22, 0, 12.99),

    create_showtime("Pawshire Detectives", "Screen 1", 1, 11, 0, 9.99),

    create_showtime("The Quiet Equation", "Screen 2", 2, 20, 30, 12.99),

    create_showtime("Shadow Protocol", "Screen 1", 1, 14, 0, 11.99),
    create_showtime("Shadow Protocol", "Screen 5", 1, 19, 30, 16.99),

    create_showtime("The Nova Quartet", "Screen 1", 1, 12, 30, 11.99),
    create_showtime("The Nova Quartet", "Screen 5", 1, 20, 30, 16.99),

    create_showtime("The Hollow Parish", "Screen 2", 1, 20, 0, 12.99),
    create_showtime("The Hollow Parish", "Screen 3", 2, 21, 15, 12.99),

    create_showtime("Vanishing Act", "Screen 1", 1, 16, 15, 11.99),
    create_showtime("Vanishing Act", "Screen 2", 2, 19, 45, 12.99),

    create_showtime("Dragonkeeper's Oath", "Screen 6", 2, 16, 45, 13.99),

    create_showtime("Neon Aegis", "Screen 1", 1, 17, 45, 11.99),
    create_showtime("Neon Aegis", "Screen 5", 1, 21, 0, 16.99),
    create_showtime("Neon Aegis", "Screen 4", 2, 18, 30, 15.99),
]

db.add_all(showtimes)
db.commit()

bookings = [
    # tester1 bookings
    Booking(
        user_id=2,
        showtime_id=1,
        number_of_tickets=2,
        booking_reference="FH-DEMO001",
        booking_status="active"
    ),
    Booking(
        user_id=2,
        showtime_id=4,
        number_of_tickets=1,
        booking_reference="FH-DEMO002",
        booking_status="active"
    ),
    Booking(
        user_id=2,
        showtime_id=7,
        number_of_tickets=3,
        booking_reference="FH-DEMO003",
        booking_status="cancelled"
    ),
    Booking(
        user_id=2,
        showtime_id=10,
        number_of_tickets=2,
        booking_reference="FH-DEMO004",
        booking_status="active"
    ),
    Booking(
        user_id=2,
        showtime_id=15,
        number_of_tickets=4,
        booking_reference="FH-DEMO005",
        booking_status="active"
    ),

    # tester2 bookings
    Booking(
        user_id=3,
        showtime_id=2,
        number_of_tickets=2,
        booking_reference="FH-DEMO006",
        booking_status="active"
    ),
    Booking(
        user_id=3,
        showtime_id=5,
        number_of_tickets=1,
        booking_reference="FH-DEMO007",
        booking_status="active"
    ),
    Booking(
        user_id=3,
        showtime_id=9,
        number_of_tickets=2,
        booking_reference="FH-DEMO008",
        booking_status="cancelled"
    ),
    Booking(
        user_id=3,
        showtime_id=12,
        number_of_tickets=3,
        booking_reference="FH-DEMO009",
        booking_status="active"
    ),
    Booking(
        user_id=3,
        showtime_id=18,
        number_of_tickets=2,
        booking_reference="FH-DEMO010",
        booking_status="active"
    )
]

active_bookings = [booking for booking in bookings if booking.booking_status == "active"]

for booking in active_bookings:
    showtime = db.query(Showtime).filter(Showtime.id == booking.showtime_id).first()

    if showtime:
        showtime.available_seats -= booking.number_of_tickets

db.add_all(bookings)
db.commit()

db.close()
