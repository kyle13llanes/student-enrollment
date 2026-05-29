"""
Student Enrollment System — Flask server.
Local: SQLite in data/enrollment.db
Online: set DATABASE_URL to PostgreSQL (Render, Railway, etc.)
"""

import os
import socket
from datetime import datetime, timezone
from functools import wraps

from flask import Flask, jsonify, render_template, request, session
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.security import check_password_hash, generate_password_hash

from db import USE_POSTGRES, get_db, init_db, row_to_dict

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "student-enrollment-dev-key-change-online")

if os.environ.get("RENDER") or USE_POSTGRES or os.environ.get("BEHIND_PROXY"):
    app.config["SESSION_COOKIE_SECURE"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)


def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "127.0.0.1"


def ph():
    return "%s" if USE_POSTGRES else "?"


def login_required_api(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)

    return wrapped


@app.route("/")
def index():
    return render_template("index.html", is_online=bool(os.environ.get("RENDER") or USE_POSTGRES))


@app.route("/signup")
def signup_page():
    return render_template("signup.html")


@app.route("/dashboard")
def dashboard_page():
    return render_template("dashboard.html")


@app.route("/students/add")
def add_student_page():
    return render_template("add-student.html")


@app.route("/students")
def view_students_page():
    return render_template("view-students.html")


@app.route("/api/ping")
def api_ping():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) AS c FROM students")
        row = cur.fetchone()
        student_count = row["c"] if isinstance(row, dict) else row[0]

    return jsonify(
        {
            "status": "ok",
            "message": "Client and server are communicating successfully.",
            "server_time": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            "client_ip": request.remote_addr,
            "host": request.host,
            "database": "postgresql" if USE_POSTGRES else "sqlite",
            "students_in_db": student_count,
        }
    )


@app.route("/api/auth/session")
def api_session():
    if "user_id" not in session:
        return jsonify({"logged_in": False})
    return jsonify(
        {
            "logged_in": True,
            "user": {
                "user_id": session["user_id"],
                "username": session.get("username"),
                "full_name": session.get("full_name"),
            },
        }
    )


@app.route("/api/auth/login", methods=["POST"])
def api_login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    p = ph()
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            f"SELECT user_id, username, full_name, password FROM users WHERE username = {p}",
            (username,),
        )
        row = cur.fetchone()

    row = row_to_dict(row)
    if not row or not check_password_hash(row["password"], password):
        return jsonify({"error": "Invalid username or password."}), 401

    session.clear()
    session["user_id"] = row["user_id"]
    session["username"] = row["username"]
    session["full_name"] = row["full_name"]

    return jsonify(
        {
            "message": "Login successful",
            "user": {
                "user_id": row["user_id"],
                "username": row["username"],
                "full_name": row["full_name"],
            },
        }
    )


@app.route("/api/auth/signup", methods=["POST"])
def api_signup():
    data = request.get_json(silent=True) or {}
    full_name = (data.get("full_name") or "").strip()
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    confirm = data.get("confirm_password") or ""

    if not all([full_name, username, password]):
        return jsonify({"error": "All fields are required."}), 400
    if password != confirm:
        return jsonify({"error": "Passwords do not match."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    p = ph()
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(f"SELECT 1 FROM users WHERE username = {p}", (username,))
        if cur.fetchone():
            return jsonify({"error": "Username already exists."}), 409
        cur.execute(
            f"INSERT INTO users (username, password, full_name) VALUES ({p}, {p}, {p})",
            (username, generate_password_hash(password), full_name),
        )

    return jsonify({"message": "Account created successfully."}), 201


@app.route("/api/auth/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify({"message": "Logged out"})


@app.route("/api/stats")
@login_required_api
def api_stats():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT course FROM students")
        rows = cur.fetchall()

    stats = {"total": 0, "bsit": 0, "bsba": 0, "bshm": 0, "bstm": 0}
    for row in rows:
        r = row_to_dict(row)
        stats["total"] += 1
        key = (r.get("course") or "").lower()
        if key in stats:
            stats[key] += 1

    return jsonify(stats)


@app.route("/api/students", methods=["GET"])
@login_required_api
def api_list_students():
    q = (request.args.get("q") or "").strip().lower()
    p = ph()

    with get_db() as conn:
        cur = conn.cursor()
        if q:
            like = f"%{q}%"
            cur.execute(
                f"""
                SELECT student_id, full_name, email, course, year_level, created_at
                FROM students
                WHERE LOWER(student_id) LIKE {p}
                   OR LOWER(full_name) LIKE {p}
                   OR LOWER(email) LIKE {p}
                ORDER BY created_at DESC
                """,
                (like, like, like),
            )
        else:
            cur.execute(
                """
                SELECT student_id, full_name, email, course, year_level, created_at
                FROM students
                ORDER BY created_at DESC
                """
            )
        rows = [row_to_dict(r) for r in cur.fetchall()]

    return jsonify({"students": rows, "count": len(rows)})


@app.route("/api/students", methods=["POST"])
@login_required_api
def api_add_student():
    data = request.get_json(silent=True) or {}
    student_id = (data.get("student_id") or "").strip()
    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip()
    course = (data.get("course") or "").strip()
    year_level = data.get("year_level")

    if not all([student_id, full_name, email, course, year_level]):
        return jsonify({"error": "All student fields are required."}), 400

    try:
        year_level = int(year_level)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid year level."}), 400

    p = ph()
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(f"SELECT 1 FROM students WHERE student_id = {p}", (student_id,))
        if cur.fetchone():
            return jsonify({"error": "A student with this ID already exists."}), 409
        cur.execute(
            f"""
            INSERT INTO students (student_id, full_name, email, course, year_level)
            VALUES ({p}, {p}, {p}, {p}, {p})
            """,
            (student_id, full_name, email, course, year_level),
        )

    return jsonify({"message": "Student added successfully."}), 201


@app.route("/api/students/<student_id>", methods=["DELETE"])
@login_required_api
def api_delete_student(student_id):
    p = ph()
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(f"DELETE FROM students WHERE student_id = {p}", (student_id,))
        deleted = cur.rowcount > 0

    if not deleted:
        return jsonify({"error": "Student not found."}), 404
    return jsonify({"message": "Student deleted successfully."})


with app.app_context():
    init_db()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    lan = get_lan_ip()
    db_label = "PostgreSQL" if USE_POSTGRES else f"SQLite ({os.path.join('data', 'enrollment.db')})"
    print("\n" + "=" * 60)
    print("  Student Enrollment System — Flask Server")
    print("=" * 60)
    print(f"  Database:           {db_label}")
    print(f"  On this laptop:     http://127.0.0.1:{port}")
    print(f"  On your phone:      http://{lan}:{port}")
    print("  Demo logins: admin/password  |  demo/demo123")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
