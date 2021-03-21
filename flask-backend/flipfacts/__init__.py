
import logging

fflog = logging.getLogger("fflog")
fflog.setLevel(logging.DEBUG)

file = logging.FileHandler("flipfacts_server.log")
file.setLevel(logging.DEBUG)
fileformat = logging.Formatter("%(levelname)s:%(asctime)s:\t%(message)s")
file.setFormatter(fileformat)
fflog.addHandler(file)

stream = logging.StreamHandler()
stream.setLevel(logging.INFO)
streamformat = logging.Formatter("%(levelname)s:%(asctime)s:\t%(message)s")
stream.setFormatter(streamformat)
fflog.addHandler(stream)

# The demo test code
fflog.info("Starting Server ...")


from flipfacts.api import semantic
from flipfacts.api import index
from flipfacts.admin import AssumptionModelView, SourceModelView, UserModelView, ReportModelView
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
index = index.Index()



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

    index.init_app(app)
    
    from flipfacts.api.routes import api
    app.register_blueprint(api)
    
    from flipfacts.models import User, Assumption, Source, Report
    dbadmin.add_view(UserModelView(User, db.session))
    dbadmin.add_view(AssumptionModelView(Assumption, db.session))
    dbadmin.add_view(SourceModelView(Source, db.session))
    dbadmin.add_view(ReportModelView(Report, db.session))

    @app.before_request
    def log_request():
        fflog.info("############### API CALL ###############")
        fflog.info(request.url)
        if current_user.is_anonymous:
            user="guest"
        else:
            user=f"{current_user.id}:{current_user.username}:{current_user.email}"
        ip = "localhost"
        if 'X-Real-Ip' in request.headers.keys():
            ip = request.headers['X-Real-Ip']
        elif app.config["DEBUG"] is False:
            fflog.info("No X-Real-Ip: Dropping Request")
            return "Forbidden", 403
        
        fflog.info(f"FROM {ip} ({user})")
        if request.access_control_request_headers is not None:
            fflog.debug(request.access_control_request_headers)
        if request.access_control_request_method is not None: 
            fflog.debug(request.access_control_request_method)
        if request.access_route is not None:
            fflog.debug(request.access_route)
        if request.args is not None:
            fflog.debug(request.args)
        if request.authorization is not None:
            fflog.debug(request.authorization)
        if request.cookies is not None:
            fflog.debug(request.cookies)
        if request.headers is not None:
            fflog.debug("Headers:\n")
            fflog.debug(request.headers)
        if app.config["DEBUG"] is False:
            if "flipfacts.net" not in request.headers["Host"] or "8000" in request.headers["Host"]:
                fflog.info("Host not flipfacts.net/: Dropping Request")
                return "Forbidden", 403
        
        

        obj = request.json
        if obj != None:
            if "password" in obj.keys():
                password = obj["password"]
                obj["password"] = "*******"
                fflog.info(f"  > {obj}")
                obj["password"] = password
            else:
                fflog.info(f"  > {obj}")
        

        if request.path.startswith('/admin/'):
            if (not current_user.is_authenticated) or (not current_user.is_administrator):
                return redirect('/')

    return app