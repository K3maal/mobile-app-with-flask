from flask import Blueprint, request, jsonify
from database import get_db

docent_bp = Blueprint("docent", __name__)


@docent_bp.route("/api/docent/projects", methods=["GET"])
def get_all_projects():
    conn = get_db()

    projects = conn.execute("SELECT * FROM projects").fetchall()
    conn.close()

    return jsonify([dict(p) for p in projects]), 200

@docent_bp.route("/api/docent/students", methods=["GET"])
def get_all_students():
    conn = get_db()

    students = conn.execute(
        "SELECT id, studentnummer, naam, email FROM users WHERE rol = 'student'"
    ).fetchall()
    conn.close()

    return jsonify([dict(s) for s in students]), 200


@docent_bp.route("/api/docent/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    conn = get_db()

    project = conn.execute(
        "SELECT * FROM projects WHERE id = ?",
        (project_id,)
    ).fetchone()
    conn.close()

    if not project:
        return jsonify({"error": "Project not found"}), 404

    return jsonify(dict(project)), 200


@docent_bp.route("/api/docent/projects/<int:project_id>/approve", methods=["PUT"])
def approve_project(project_id):
    data = request.get_json()
    nakijkdatum = data.get("nakijkdatum")
    initialen = data.get("initialen")

    conn = get_db()

    conn.execute(
        "UPDATE projects SET status = 'Approved', nakijkdatum = ?, opmerkingen = ? WHERE id = ?",
        (nakijkdatum, initialen, project_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Project approved"}), 200


@docent_bp.route("/api/docent/projects/<int:project_id>/reject", methods=["PUT"])
def reject_project(project_id):
    conn = get_db()

    conn.execute(
        "UPDATE projects SET status = 'Rejected' WHERE id = ?",
        (project_id,)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Project rejected"}), 200


@docent_bp.route("/api/docent/projects/<int:project_id>/feedback", methods=["POST"])
def add_feedback(project_id):
    data = request.get_json()
    feedback = data.get("feedback")

    if not feedback:
        return jsonify({"error": "feedback is required"}), 400

    conn = get_db()

    conn.execute(
        "UPDATE projects SET opmerkingen = ? WHERE id = ?",
        (feedback, project_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Feedback added"}), 200
