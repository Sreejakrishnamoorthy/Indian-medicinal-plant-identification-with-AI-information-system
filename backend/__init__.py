import os
from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv

mysql = MySQL()

def create_app():
    # Load environment variables
    load_dotenv()

    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = os.getenv("UPLOAD_FOLDER", os.path.join(app.root_path, "static", "uploads"))
    app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST", "localhost")
    app.config['MYSQL_USER'] = os.getenv("MYSQL_USER", "root")
    app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD", "")
    app.config['MYSQL_DB'] = os.getenv("MYSQL_DB", "faceDetector")

    # Initialize MySQL
    mysql.init_app(app)

    # Register blueprints
    from .routes import main
    app.register_blueprint(main)

    return app
