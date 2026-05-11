from datetime import datetime, timedelta, date

from database.database import SessionLocal
from models.user import User
from models.movie import Movie
from models.screen import Screen
from models.showtime import Showtime
from models.booking import Booking

from services.auth_service import hash_password

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
    username="johndoe",
    email="john@example.com",
    password_hash=hash_password("Password1234"),
    role="regular"
)

user_two = User(
    username="janedoe",
    email="jane@example.com",
    password_hash=hash_password("Password1234"),
    role="regular"
)

users = [admin_user, user_one, user_two]

movies = [
    Movie(title="Michael", genre="Biographical Drama", age_rating="12A", duration_minutes=140, description="A biographical drama exploring the life, career and legacy of Michael Jackson, following his rise from child star to global music icon through the highs and controversies of his extraordinary career.", release_date=date(2025, 10, 3)),
    Movie(title="Zootopia 2", genre="Animation", age_rating="PG", duration_minutes=105, description="Officers Judy Hopps and Nick Wilde return for a brand-new adventure as they investigate a mysterious case threatening the harmony of Zootopia and uncover secrets hidden deep within the city.", release_date=date(2025, 11, 26)),
    Movie(title="F1", genre="Sports Drama", age_rating="12A", duration_minutes=130, description="A retired Formula One driver returns to the track to mentor a rising young star, facing fierce rivalries, personal demons and the dangerous world of elite motorsport.", release_date=date(2025, 6, 27)),
    Movie(title="Sinners", genre="Thriller", age_rating="15", duration_minutes=120, description="A dark psychological thriller following two estranged siblings who return to their hometown only to uncover terrifying secrets linked to a series of unexplained disappearances.", release_date=date(2025, 4, 18)),
    Movie(title="Wicked: For Good", genre="Musical Fantasy", age_rating="PG", duration_minutes=150, description="The untold story of the witches of Oz continues as Elphaba and Glinda confront the consequences of their choices in a powerful musical fantasy about friendship, identity and destiny.", release_date=date(2025, 11, 21)),
    Movie(title="Fantastic Four: First Steps", genre="Superhero", age_rating="12A", duration_minutes=125, description="Marvel's first family arrives as Reed Richards, Sue Storm, Johnny Storm and Ben Grimm gain extraordinary powers and face a cosmic threat unlike anything Earth has seen.", release_date=date(2025, 7, 25)),
    Movie(title="Avatar: Fire and Ash", genre="Sci-Fi", age_rating="12A", duration_minutes=180, description="Jake Sully and Neytiri encounter dangerous new tribes and devastating conflicts on Pandora as tensions rise between humanity and the Na'vi in this visually spectacular sci-fi epic.", release_date=date(2025, 12, 19)),
    Movie(title="Jurassic World: Rebirth", genre="Adventure", age_rating="12A", duration_minutes=135, description="A new era begins as scientists attempt to rebuild Jurassic World, only for genetically engineered dinosaurs to escape and threaten humanity once again.", release_date=date(2025, 7, 2)),
    Movie(title="Lilo & Stitch", genre="Family", age_rating="PG", duration_minutes=110, description="A live-action retelling of Disney's beloved story about a lonely Hawaiian girl who forms an unlikely friendship with a mischievous alien fugitive named Stitch.", release_date=date(2025, 5, 23)),
    Movie(title="The Conjuring: Last Rites", genre="Horror", age_rating="15", duration_minutes=120, description="Ed and Lorraine Warren return for one final terrifying investigation involving a haunting that pushes them beyond anything they have faced before.", release_date=date(2025, 9, 5)),
    Movie(title="Final Destination: Bloodlines", genre="Horror", age_rating="15", duration_minutes=110, description="A new generation attempts to escape Death's design after surviving a catastrophic accident, only to realise fate cannot be cheated forever.", release_date=date(2025, 5, 16)),
    Movie(title="Now You See Me: Now You Don't", genre="Crime Thriller", age_rating="12A", duration_minutes=125, description="The Four Horsemen reunite for another high-stakes illusion-filled heist involving dangerous enemies, impossible tricks and shocking betrayals.", release_date=date(2025, 11, 14)),
    Movie(title="Dune Part Two", genre="Sci-Fi", age_rating="12A", duration_minutes=166, description="Paul Atreides unites with the Fremen to wage war against House Harkonnen while struggling with destiny, power and the future of Arrakis.", release_date=date(2024, 3, 1)),
    Movie(title="Interstellar", genre="Sci-Fi", age_rating="12A", duration_minutes=169, description="A team of astronauts travel through a wormhole in search of humanity's future as Earth faces environmental collapse and extinction.", release_date=date(2014, 11, 7)),
    Movie(title="Oppenheimer", genre="Drama", age_rating="15", duration_minutes=180, description="The story of J. Robert Oppenheimer and the creation of the atomic bomb during World War II, exploring ambition, morality and the consequences of scientific discovery.", release_date=date(2023, 7, 21)),
    Movie(title="The Devil Wears Prada 2", genre="Comedy Drama", age_rating="12A", duration_minutes=120, description="Andy Sachs returns to the world of high fashion years later, facing new career pressures and an unexpected reunion with Miranda Priestly.", release_date=date(2026, 5, 1)),
    Movie(title="Scream 7", genre="Horror", age_rating="18", duration_minutes=115, description="Ghostface returns once again, targeting a new group of victims while long-buried secrets from the past resurface.", release_date=date(2026, 2, 27)),
    Movie(title="Hamlet", genre="Drama", age_rating="12A", duration_minutes=130, description="A cinematic adaptation of Shakespeare's classic tragedy following Prince Hamlet's quest for revenge after discovering the truth behind his father's death.", release_date=date(2025, 10, 17)),
    Movie(title="Wuthering Heights", genre="Romantic Drama", age_rating="12A", duration_minutes=125, description="A gothic romantic drama exploring the passionate and destructive relationship between Heathcliff and Catherine across generations.", release_date=date(2026, 2, 13)),
    Movie(title="The Super Mario Galaxy Movie", genre="Animation", age_rating="PG", duration_minutes=100, description="Mario, Luigi and friends embark on a cosmic adventure across the galaxy to stop Bowser from conquering the universe.", release_date=date(2026, 4, 3)),
    Movie(title="Mission: Impossible - The Final Reckoning", genre="Action", age_rating="12A", duration_minutes=160, description="Ethan Hunt faces his most dangerous mission yet as global security hangs in the balance and old enemies return for a final confrontation.", release_date=date(2025, 5, 23)),
    Movie(title="Spider-Man: Beyond the Spider-Verse", genre="Animation", age_rating="PG", duration_minutes=120, description="Miles Morales journeys deeper into the multiverse where new Spider-heroes, dangerous enemies and impossible choices await.", release_date=date(2026, 6, 5)),
    Movie(title="How to Train Your Dragon", genre="Fantasy Adventure", age_rating="PG", duration_minutes=125, description="A live-action adaptation of the beloved fantasy adventure about a young Viking who befriends a dragon and changes the future of his village forever.", release_date=date(2025, 6, 13)),
    Movie(title="Tron: Ares", genre="Sci-Fi", age_rating="12A", duration_minutes=125, description="A powerful AI escapes into the real world, forcing humanity to confront the growing dangers of advanced digital technology.", release_date=date(2025, 10, 10)),
]

screens = [
    Screen(screen_name="Screen 1", capacity=100, screen_type="Standard"),
    Screen(screen_name="Screen 2", capacity=120, screen_type="Standard"),
    Screen(screen_name="Screen 3", capacity=90, screen_type="Standard"),
    Screen(screen_name="Dolby Cinema", capacity=140, screen_type="Dolby"),
    Screen(screen_name="IMAX", capacity=180, screen_type="IMAX"),
    Screen(screen_name="Real3D", capacity=110, screen_type="Real3D"),
    Screen(screen_name="XL", capacity=160, screen_type="XL")
]

db.add_all(users)
db.add_all(movies)
db.add_all(screens)

db.commit()

movie_by_title = {movie.title: movie for movie in db.query(Movie).all()}
screen_by_name = {screen.screen_name: screen for screen in db.query(Screen).all()}


def create_showtime(movie_title, screen_name, days_from_now, hour, minute, price):
    screen = screen_by_name[screen_name]

    return Showtime(
        movie_id=movie_by_title[movie_title].id,
        screen_id=screen.id,
        start_time=datetime.now() + timedelta(days=days_from_now, hours=hour, minutes=minute),
        ticket_price=price,
        available_seats=screen.capacity
    )

showtimes = [
    create_showtime("Michael", "Screen 1", 1, 14, 0, 11.99),
    create_showtime("Michael", "Screen 2", 1, 19, 30, 12.99),

    create_showtime("Zootopia 2", "Screen 1", 1, 11, 0, 9.99),
    create_showtime("Zootopia 2", "Screen 2", 1, 13, 30, 9.99),
    create_showtime("Zootopia 2", "Real3D", 1, 16, 0, 13.99),
    create_showtime("Zootopia 2", "XL", 2, 18, 30, 12.99),

    create_showtime("F1", "Screen 3", 1, 13, 0, 11.99),
    create_showtime("F1", "Dolby Cinema", 1, 18, 0, 15.99),
    create_showtime("F1", "IMAX", 2, 20, 30, 16.99),

    create_showtime("Sinners", "Screen 2", 1, 20, 0, 12.99),
    create_showtime("Sinners", "Screen 3", 2, 21, 15, 12.99),

    create_showtime("Wicked: For Good", "Screen 1", 1, 15, 0, 11.99),
    create_showtime("Wicked: For Good", "Dolby Cinema", 1, 19, 0, 15.99),
    create_showtime("Wicked: For Good", "XL", 2, 17, 30, 13.99),

    create_showtime("Fantastic Four: First Steps", "Screen 1", 1, 12, 30, 11.99),
    create_showtime("Fantastic Four: First Steps", "Screen 2", 1, 17, 30, 12.99),
    create_showtime("Fantastic Four: First Steps", "IMAX", 1, 20, 30, 16.99),
    create_showtime("Fantastic Four: First Steps", "Dolby Cinema", 2, 19, 0, 15.99),

    create_showtime("Avatar: Fire and Ash", "Screen 1", 1, 11, 30, 12.99),
    create_showtime("Avatar: Fire and Ash", "IMAX", 1, 15, 30, 17.99),
    create_showtime("Avatar: Fire and Ash", "Real3D", 1, 19, 30, 15.99),
    create_showtime("Avatar: Fire and Ash", "Dolby Cinema", 2, 14, 30, 16.99),
    create_showtime("Avatar: Fire and Ash", "XL", 2, 20, 0, 15.99),

    create_showtime("Jurassic World: Rebirth", "Screen 2", 1, 12, 0, 11.99),
    create_showtime("Jurassic World: Rebirth", "Screen 3", 1, 18, 30, 12.99),
    create_showtime("Jurassic World: Rebirth", "IMAX", 2, 19, 30, 16.99),

    create_showtime("Lilo & Stitch", "Screen 1", 1, 10, 30, 8.99),
    create_showtime("Lilo & Stitch", "Screen 2", 1, 13, 0, 9.99),
    create_showtime("Lilo & Stitch", "Real3D", 2, 15, 30, 12.99),

    create_showtime("The Conjuring: Last Rites", "Screen 3", 1, 21, 0, 12.99),
    create_showtime("The Conjuring: Last Rites", "Screen 2", 2, 22, 0, 12.99),

    create_showtime("Final Destination: Bloodlines", "Screen 3", 1, 19, 45, 12.99),
    create_showtime("Final Destination: Bloodlines", "Screen 1", 2, 21, 30, 12.99),

    create_showtime("Now You See Me: Now You Don't", "Screen 1", 1, 16, 15, 11.99),
    create_showtime("Now You See Me: Now You Don't", "Screen 2", 2, 19, 45, 12.99),

    create_showtime("Dune Part Two", "Screen 2", 1, 14, 30, 11.99),
    create_showtime("Dune Part Two", "IMAX", 1, 19, 0, 16.99),
    create_showtime("Dune Part Two", "Dolby Cinema", 2, 20, 0, 15.99),

    create_showtime("Interstellar", "Screen 3", 1, 15, 0, 10.99),
    create_showtime("Interstellar", "IMAX", 2, 18, 30, 15.99),

    create_showtime("Oppenheimer", "Screen 1", 1, 18, 0, 11.99),
    create_showtime("Oppenheimer", "Screen 2", 2, 20, 30, 12.99),

    create_showtime("The Devil Wears Prada 2", "Screen 1", 1, 13, 30, 10.99),
    create_showtime("The Devil Wears Prada 2", "Screen 2", 2, 18, 15, 11.99),

    create_showtime("Scream 7", "Screen 3", 1, 22, 15, 12.99),
    create_showtime("Scream 7", "Screen 2", 2, 21, 45, 12.99),

    create_showtime("Hamlet", "Screen 1", 1, 17, 0, 10.99),
    create_showtime("Hamlet", "Screen 3", 2, 19, 30, 11.99),

    create_showtime("Wuthering Heights", "Screen 2", 1, 16, 45, 10.99),
    create_showtime("Wuthering Heights", "Screen 1", 2, 20, 15, 11.99),

    create_showtime("The Super Mario Galaxy Movie", "Screen 1", 1, 10, 0, 8.99),
    create_showtime("The Super Mario Galaxy Movie", "Screen 2", 1, 12, 30, 9.99),
    create_showtime("The Super Mario Galaxy Movie", "Real3D", 1, 15, 0, 12.99),
    create_showtime("The Super Mario Galaxy Movie", "XL", 2, 17, 30, 12.99),

    create_showtime("Mission: Impossible - The Final Reckoning", "Screen 3", 1, 14, 0, 11.99),
    create_showtime("Mission: Impossible - The Final Reckoning", "IMAX", 1, 19, 30, 16.99),
    create_showtime("Mission: Impossible - The Final Reckoning", "Dolby Cinema", 2, 20, 15, 15.99),

    create_showtime("Spider-Man: Beyond the Spider-Verse", "Screen 1", 1, 11, 45, 9.99),
    create_showtime("Spider-Man: Beyond the Spider-Verse", "Real3D", 1, 16, 30, 13.99),
    create_showtime("Spider-Man: Beyond the Spider-Verse", "IMAX", 2, 19, 0, 16.99),

    create_showtime("How to Train Your Dragon", "Screen 1", 1, 10, 45, 9.99),
    create_showtime("How to Train Your Dragon", "Screen 2", 1, 14, 15, 10.99),
    create_showtime("How to Train Your Dragon", "Real3D", 2, 16, 45, 13.99),

    create_showtime("Tron: Ares", "Screen 3", 1, 17, 45, 11.99),
    create_showtime("Tron: Ares", "IMAX", 1, 21, 0, 16.99),
    create_showtime("Tron: Ares", "Dolby Cinema", 2, 18, 30, 15.99),
]

db.add_all(showtimes)
db.commit()

bookings = [
    Booking(
        user_id=2,
        showtime_id=1,
        number_of_tickets=2,
        booking_reference="FH-DEMO001",
        booking_status="active"
    ),
    Booking(
        user_id=3,
        showtime_id=2,
        number_of_tickets=4,
        booking_reference="FH-DEMO002",
        booking_status="active"
    ),
    Booking(
        user_id=2,
        showtime_id=5,
        number_of_tickets=1,
        booking_reference="FH-DEMO003",
        booking_status="active"
    ),
    Booking(
        user_id=3,
        showtime_id=10,
        number_of_tickets=3,
        booking_reference="FH-DEMO004",
        booking_status="cancelled"
    ),
    Booking(
        user_id=2,
        showtime_id=15,
        number_of_tickets=2,
        booking_reference="FH-DEMO005",
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