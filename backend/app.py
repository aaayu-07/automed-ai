from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import mongo

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize Extensions
    CORS(app)
    import certifi
    # Adding tlsAllowInvalidCertificates=True to resolve macOS specific SSL handshake errors
    mongo.init_app(app, tlsAllowInvalidCertificates=True)
    JWTManager(app)
    
    # Register Blueprints
    from routes.auth import auth_bp
    from routes.predict import predict_bp
    from routes.admin import admin_bp
    from routes.coach import coach_bp
    from routes.publications import publications_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(predict_bp, url_prefix='/api/predict')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(coach_bp, url_prefix='/api/coach')
    app.register_blueprint(publications_bp, url_prefix='/api/publications')
    
    @app.route("/")
    def home():
        return "AI Lifestyle Disease Risk API is running with Auth & DB"

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5001)
