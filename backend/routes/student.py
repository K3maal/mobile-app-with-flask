from flask import Blueprint, request, jsonify
from database import get_db

student_bp = Blueprint("student", __name__)


@student_bp.route("/api/student/projects", methods=["GET"])
def get_projects():
    student_id = request.args.get("student_id")

    if not student_id:
        return jsonify({"error": "student_id is required"}), 400

    conn = get_db()

    projects = conn.execute(
        "SELECT * FROM projects WHERE student_id = ?",
        (student_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(p) for p in projects]), 200


@student_bp.route("/api/student/projects", methods=["POST"])
def create_project():
    data = request.get_json()

    student_id = data.get("student_id")
    onderwerp = data.get("onderwerp")
    leerdoelen = data.get("leerdoelen")
    startdatum = data.get("startdatum")
    einddatum = data.get("einddatum")

    if not student_id or not onderwerp:
        return jsonify({"error": "student_id and onderwerp are required"}), 400

    conn = get_db()

    cursor = conn.execute(
        "INSERT INTO projects (student_id, onderwerp, leerdoelen, startdatum, einddatum, status) VALUES (?, ?, ?, ?, ?, 'Concept')",
        (student_id, onderwerp, leerdoelen, startdatum, einddatum)
    )
    project_id = cursor.lastrowid 

    conn.execute(
        """INSERT INTO work_processes
        (project_id, b1_k1_w1, b1_k1_w2, b1_k1_w3, b1_k1_w4, b1_k1_w5, b1_k2_w1, b1_k2_w2, b1_k2_w3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            project_id,
            1 if data.get("b1_k1_w1") else 0,
            1 if data.get("b1_k1_w2") else 0,
            1 if data.get("b1_k1_w3") else 0,
            1 if data.get("b1_k1_w4") else 0,
            1 if data.get("b1_k1_w5") else 0,
            1 if data.get("b1_k2_w1") else 0,
            1 if data.get("b1_k2_w2") else 0,
            1 if data.get("b1_k2_w3") else 0,
        )
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Project created", "project_id": project_id}), 201


@student_bp.route("/api/student/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    conn = get_db()

    project = conn.execute(
        "SELECT * FROM projects WHERE id = ?",
        (project_id,)
    ).fetchone()

    work = conn.execute(
        "SELECT * FROM work_processes WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    conn.close()

    if not project:
        return jsonify({"error": "Project not found"}), 404

    return jsonify({
        "project": dict(project),
        "work_processes": dict(work) if work else {}
    }), 200


@student_bp.route("/api/student/projects/<int:project_id>/complete", methods=["PUT"])
def complete_project(project_id):
    conn = get_db()
    conn.execute(
        "UPDATE projects SET status = 'Completed' WHERE id = ?",
        (project_id,)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Project marked as completed"}), 200


@student_bp.route("/api/student/projects/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    data = request.get_json()

    conn = get_db()

    conn.execute("""
        UPDATE projects SET
            onderwerp = ?,
            leerdoelen = ?,
            reflectie = ?,
            eigen_beoordeling = ?,
            feed_forward = ?,
            opmerkingen = ?,
            startdatum = ?,
            einddatum = ?
        WHERE id = ?
    """, (
        data.get("onderwerp"),
        data.get("leerdoelen"),
        data.get("reflectie"),
        data.get("eigen_beoordeling"),
        data.get("feed_forward"),
        data.get("opmerkingen"),
        data.get("startdatum"),
        data.get("einddatum"),
        project_id
    ))

    conn.execute("""
        UPDATE work_processes SET
            b1_k1_w1 = ?, b1_k1_w2 = ?, b1_k1_w3 = ?,
            b1_k1_w4 = ?, b1_k1_w5 = ?,
            b1_k2_w1 = ?, b1_k2_w2 = ?, b1_k2_w3 = ?
        WHERE project_id = ?
    """, (
        data.get("b1_k1_w1", 0), data.get("b1_k1_w2", 0), data.get("b1_k1_w3", 0),
        data.get("b1_k1_w4", 0), data.get("b1_k1_w5", 0),
        data.get("b1_k2_w1", 0), data.get("b1_k2_w2", 0), data.get("b1_k2_w3", 0),
        project_id
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Project updated"}), 200
