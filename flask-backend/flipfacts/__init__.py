from flipfacts.api import semantic
from flipfacts.admin import SecureModelView
from flask import Flask, redirect, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, current_user
from flask_admin import Admin
from flask_mail import Mail
from flipfacts.config import Config



db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
dbadmin = Admin(name='Administration', template_mode='bootstrap3')
mail = Mail()
semantic = semantic.Semantic()



def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    dbadmin.init_app(app)
    mail.init_app(app)

    # import order very careful not to collapse the house of cards:

    from flipfacts.models import create_db
    with app.app_context():
        create_db(db)

    semantic.init_app(app)
    
    from flipfacts.api.routes import api
    app.register_blueprint(api)
    
    from flipfacts.models import User, Assumption, Source, Report
    dbadmin.add_view(SecureModelView(User, db.session))
    dbadmin.add_view(SecureModelView(Assumption, db.session))
    dbadmin.add_view(SecureModelView(Source, db.session))
    dbadmin.add_view(SecureModelView(Report, db.session))

    @app.before_request
    def log_request():
        if current_user.is_anonymous:
            user=f"{request.remote_addr}: Anonymous"
        else:
            user=f"{request.remote_addr}: {current_user.username}"
        print(f"API REQUEST BY {user}: {request.path}")
        obj = request.json
        if obj != None:
            if "password" in obj.keys():
                password = obj["password"]
                obj["password"] = "*******"
                print(f"  > {obj}")
                obj["password"] = password
            else:
                print(f"  > {obj}")


        if request.path.startswith('/admin/'):
            if (not current_user.is_authenticated) or (not current_user.is_administrator):
                return redirect('/')

    return app