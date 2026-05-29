"""
Database layer: SQLite (local) or PostgreSQL (online via DATABASE_URL).
"""

import os
import sqlite3
from contextlib import contextmanager

from werkzeug.security import generate_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
SQLITE_PATH = os.path.join(DATA_DIR, "enrollment.db")

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

USE_POSTGRES = bool(DATABASE_URL)


def _placeholder():
    return "%s" if USE_POSTGRES else "?"


@contextmanager
def get_db():
    if USE_POSTGRES:
        import psycopg2
        from psycopg2.extras import RealDictCursor

        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    else:
        os.makedirs(DATA_DIR, exist_ok=True)
        conn = sqlite3.connect(SQLITE_PATH)
        conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _run_schema(cur):
    if USE_POSTGRES:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                email VARCHAR(120),
                password TEXT NOT NULL,
                full_name VARCHAR(120) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS students (
                student_id VARCHAR(32) PRIMARY KEY,
                full_name VARCHAR(120) NOT NULL,
                email VARCHAR(120) NOT NULL,
                course VARCHAR(16) NOT NULL,
                year_level INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
    else:
        cur.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT,
                password TEXT NOT NULL,
                full_name TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS students (
                student_id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                course TEXT NOT NULL,
                year_level INTEGER NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            """
        )


def seed_sample_data(cur):
    """Insert demo users and students when tables are empty."""
    p = _placeholder()

    cur.execute(f"SELECT COUNT(*) AS c FROM users WHERE username = {p}", ("admin",))
    row = cur.fetchone()
    count = row["c"] if isinstance(row, dict) else row[0]
    if count == 0:
        users = [
            ("admin", "admin@school.local", "password", "Administrator"),
            ("demo", "demo@school.local", "demo123", "Demo Teacher"),
            ("registrar", "registrar@school.local", "registrar1", "Maria Registrar"),
        ]
        for username, email, plain, full_name in users:
            cur.execute(
                f"""
                INSERT INTO users (username, email, password, full_name)
                VALUES ({p}, {p}, {p}, {p})
                """,
                (username, email, generate_password_hash(plain), full_name),
            )

    cur.execute("SELECT COUNT(*) AS c FROM students")
    row = cur.fetchone()
    student_count = row["c"] if isinstance(row, dict) else row[0]
    if student_count > 0:
        return

    sample_students = [
        ("2024-0001", "Juan Dela Cruz", "juan.delacruz@student.edu", "BSIT", 2),
        ("2024-0002", "Maria Santos", "maria.santos@student.edu", "BSBA", 3),
        ("2024-0003", "Pedro Reyes", "pedro.reyes@student.edu", "BSHM", 1),
        ("2024-0004", "Ana Garcia", "ana.garcia@student.edu", "BSTM", 4),
        ("2024-0005", "Carlos Mendoza", "carlos.mendoza@student.edu", "BSIT", 1),
        ("2024-0006", "Lisa Fernandez", "lisa.fernandez@student.edu", "BSBA", 2),
        ("2024-0007", "Miguel Torres", "miguel.torres@student.edu", "BSHM", 3),
        ("2024-0008", "Sofia Ramos", "sofia.ramos@student.edu", "BSTM", 2),
        ("2024-0009", "James Wilson", "james.wilson@student.edu", "BSIT", 4),
        ("2024-0010", "Elena Cruz", "elena.cruz@student.edu", "BSBA", 1),
        ("2024-0011", "Ryan Aquino", "ryan.aquino@student.edu", "BSHM", 2),
        ("2024-0012", "Grace Lim", "grace.lim@student.edu", "BSTM", 3),
    ]
    for sid, name, email, course, year in sample_students:
        cur.execute(
            f"""
            INSERT INTO students (student_id, full_name, email, course, year_level)
            VALUES ({p}, {p}, {p}, {p}, {p})
            """,
            (sid, name, email, course, year),
        )


def init_db():
    with get_db() as conn:
        cur = conn.cursor()
        _run_schema(cur)
        seed_sample_data(cur)


def row_to_dict(row):
    if row is None:
        return None
    if isinstance(row, dict):
        return dict(row)
    return dict(row)
