from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite database file
DATABASE_URL = "sqlite:///./filmhouse.db"

# Database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Database session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Shared model base
Base = declarative_base()

# Request-scoped database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
