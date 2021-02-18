from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_admin import Admin
from flask_mail import Mail
from flipfacts.config import Config
from flipfacts.semantic import Semantic

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
dbadmin = Admin(name='Administration', template_mode='bootstrap3')
mail = Mail()
semantic = Semantic()

from flask import redirect, url_for, request
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from flipfacts.models import User, Assumption, Source, Report



class SecureModelView(ModelView):
    column_exclude_list = ['password', "embedding"]
    form_excluded_columns  = ['password',]

    def is_accessible(self):
        if current_user.is_authenticated:
            return current_user.is_administrator
        else:
            return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('/'))


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    dbadmin.init_app(app)

    dbadmin.add_view(SecureModelView(User, db.session))
    dbadmin.add_view(SecureModelView(Assumption, db.session))
    dbadmin.add_view(SecureModelView(Source, db.session))
    dbadmin.add_view(SecureModelView(Report, db.session))

    mail.init_app(app)

    

    from flipfacts.models import create_db
    with app.app_context():
        create_db(db)
    
    from flipfacts.api.routes import api
    app.register_blueprint(api)

    semantic.init_app(app)

    return app
    

