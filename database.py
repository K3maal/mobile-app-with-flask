import sqlite3

DATABASE = "data.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentnummer TEXT UNIQUE,
            naam TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            wachtwoord TEXT NOT NULL,
            rol TEXT NOT NULL CHECK(rol IN ('student', 'docent'))
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            onderwerp TEXT,
            leerdoelen TEXT,
            reflectie TEXT,
            eigen_beoordeling TEXT,
            feed_forward TEXT,
            opmerkingen TEXT,
            startdatum TEXT,
            einddatum TEXT,
            nakijkdatum TEXT,
            status TEXT DEFAULT 'Concept',
            FOREIGN KEY (student_id) REFERENCES users(id)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS work_processes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            b1_k1_w1 INTEGER DEFAULT 0,
            b1_k1_w2 INTEGER DEFAULT 0,
            b1_k1_w3 INTEGER DEFAULT 0,
            b1_k1_w4 INTEGER DEFAULT 0,
            b1_k1_w5 INTEGER DEFAULT 0,
            b1_k2_w1 INTEGER DEFAULT 0,
            b1_k2_w2 INTEGER DEFAULT 0,
            b1_k2_w3 INTEGER DEFAULT 0,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        )
    """)

    conn.commit()
    conn.close()
