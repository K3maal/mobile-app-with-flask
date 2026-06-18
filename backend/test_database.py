import pytest
import os
import database
from app import app
from database import init_db

# this runs before every single test
# it creates a clean test database so we never touch the real data.db
@pytest.fixture
def client():
    database.DATABASE = 'test.db'  # use a test database instead of data.db

    with app.app_context():
        init_db()  # create the tables in the test database

    with app.test_client() as client:
        yield client  # run the test

    database.DATABASE = 'data.db'  # switch back to real database
    if os.path.exists('test.db'):
        os.remove('test.db')  # delete the test database after the test


# ── USER TESTS ──────────────────────────────────────────────

# test 1 — register a new student
def test_register_student(client):
    response = client.post('/api/register', json={
        "naam": "Ali",
        "email": "aliaaa@test.com",
        "wachtwoord": "12345",
        "rol": "student",
        "studentnummer": "12345"
    })
    assert response.status_code == 201
    assert response.get_json()['message'] == 'Account created successfully'


# test 2 — register a teacher
def test_register_teacher(client):
    response = client.post('/api/register', json={
        "naam": "Teacher",
        "email": "teacher@test.com",
        "wachtwoord": "1234",
        "rol": "docent",
        "studentnummer": ""
    })
    assert response.status_code == 201


# test 3 — register with the same email twice should fail
def test_duplicate_email(client):
    client.post('/api/register', json={
        "naam": "Ali",
        "email": "ali@test.com",
        "wachtwoord": "1234",
        "rol": "student",
        "studentnummer": "12345"
    })
    response = client.post('/api/register', json={
        "naam": "Someone Else",
        "email": "ali@test.com",
        "wachtwoord": "5678",
        "rol": "student",
        "studentnummer": "99999"
    })
    assert response.status_code == 409
    assert response.get_json()['error'] == 'Email already exists'


# test 4 — login with correct password
def test_login_correct(client):
    client.post('/api/register', json={
        "naam": "Ali",
        "email": "ali@test.com",
        "wachtwoord": "1234",
        "rol": "student",
        "studentnummer": "12345"
    })
    response = client.post('/api/login', json={
        "email": "ali@test.com",
        "wachtwoord": "1234"
    })
    assert response.status_code == 200
    assert response.get_json()['rol'] == 'student'


# test 5 — login with wrong password
def test_login_wrong_password(client):
    client.post('/api/register', json={
        "naam": "Ali",
        "email": "ali@test.com",
        "wachtwoord": "1234",
        "rol": "student",
        "studentnummer": "12345"
    })
    response = client.post('/api/login', json={
        "email": "ali@test.com",
        "wachtwoord": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.get_json()['error'] == 'Wrong email or password'


# ── PROJECT TESTS ────────────────────────────────────────────

# test 6 — create a project
def test_create_project(client):
    client.post('/api/register', json={
        "naam": "Ali",
        "email": "ali@test.com",
        "wachtwoord": "1234",
        "rol": "student",
        "studentnummer": "12345"
    })
    login = client.post('/api/login', json={
        "email": "ali@test.com",
        "wachtwoord": "1234"
    })
    student_id = login.get_json()['id']

    response = client.post('/api/student/projects', json={
        "student_id": student_id,
        "onderwerp": "My project",
        "leerdoelen": "Learn Flask",
        "startdatum": "2026-06-01",
        "einddatum": "2026-06-30"
    })
    assert response.status_code == 201
    assert response.get_json()['message'] == 'Project created'


# test 7 — get all projects as teacher
def test_get_all_projects(client):
    response = client.get('/api/docent/projects')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)
