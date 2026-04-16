from flask import Blueprint, request, jsonify
from database import get_db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    naam = data.get("naam")
    email = data.get("email")
    wachtwoord = data.get("wachtwoord")
    rol = data.get("rol")
    studentnummer = data.get("studentnummer") 

    if not naam or not email or not wachtwoord or not rol:
        return jsonify({"error": "naam, email, wachtwoord and rol are required"}), 400

    if rol not in ("student", "docent"):
        return jsonify({"error": "rol must be student or docent"}), 400

    conn = get_db()

    existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "Email already exists"}), 409

    conn.execute(
        "INSERT INTO users (studentnummer, naam, email, wachtwoord, rol) VALUES (?, ?, ?, ?, ?)",
        (studentnummer, naam, email, wachtwoord, rol)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Account created successfully"}), 201


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    wachtwoord = data.get("wachtwoord")

    if not email or not wachtwoord:
        return jsonify({"error": "email and wachtwoord are required"}), 400

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email = ? AND wachtwoord = ?",
        (email, wachtwoord)
    ).fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "Wrong email or password"}), 401

    return jsonify({
        "message": f"Welcome back, {user['naam']}!",
        "rol": user["rol"],
        "id": user["id"]
    }), 200
