from flask import Flask
from database import init_db
from routes.auth import auth_bp
from routes.student import student_bp
from routes.docent import docent_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)
app.register_blueprint(student_bp)
app.register_blueprint(docent_bp)

with app.app_context():
    init_db()

if __name__ == "__main__":
    app.run(debug=True)
