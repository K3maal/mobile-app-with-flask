from flask import Flask
from flask_cors import CORS
from database import init_db
from routes.auth import auth_bp
from routes.student import student_bp
from routes.docent import docent_bp
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address



app = Flask(__name__)
CORS(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["2000 per day" , "100 per minute"],
    storage_uri= "memory://",
)

app.register_blueprint(auth_bp)
app.register_blueprint(student_bp)
app.register_blueprint(docent_bp)

with app.app_context():                     
    init_db()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')