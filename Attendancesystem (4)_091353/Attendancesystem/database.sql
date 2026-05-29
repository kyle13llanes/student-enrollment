-- Student Enrollment System — database schema
-- Local: created automatically in data/enrollment.db (SQLite)
-- Online: PostgreSQL on Render (linked via DATABASE_URL)

-- USERS (login accounts)
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- STUDENTS (enrollment records)
CREATE TABLE IF NOT EXISTS students (
    student_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    year_level INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Sample data is loaded automatically on first run (see db.py seed_sample_data)
-- Demo logins: admin / password  |  demo / demo123  |  registrar / registrar1
