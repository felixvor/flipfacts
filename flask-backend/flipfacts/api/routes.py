import random
import math
import json
import requests

from flask import request, Blueprint, session, redirect, url_for
from flask_login import login_user, current_user, logout_user
from flask_mail import Message
from flipfacts import db, semantic, bcrypt, mail
from flipfacts.models import User, Assumption, Source, Report
from flipfacts.api import validate

import logging
fflog = logging.getLogger("fflog")

api = Blueprint("api", __name__)

def assumption2Object(assumption, full_sources=True):
    positiveSources = []
    negativeSources = []
    for s in assumption.sources:
        s_obj = {
            "id":s.id,
            "identifier":s.identifier,
            "citations":s.num_citations,
        }
        if full_sources:
            s_obj["title"] = s.title
            s_obj["posted_by"] = s.poster.username
            s_obj["url"] = s.url

        if s.is_positive:
            positiveSources.append(s_obj)
        else:
            negativeSources.append(s_obj)

    obj = {
        "id":assumption.id,
        "author":assumption.author.username,
        "author_id":assumption.author.id,
        "views":assumption.views,
        "datePosted": assumption.date_posted.strftime("%b %d %Y"),
        "text":assumption.text,
        "positiveSources":positiveSources,
        "negativeSources":negativeSources
    }
    return obj






@api.route("/api/assumption/<int:id>/source", methods=["POST"])
def add_source(id):
    userdata = request.json
    if not current_user.is_authenticated:
        return "please login", 403
    assumption = Assumption.query.filter_by(id=id).first()
    if not assumption:
        fflog.info("  > 404 no such assumption")
        return "no such assumption", 404
    elif userdata["identifier"] in [s.identifier for s in assumption.sources]:
        fflog.info("  > 503 source already in list")
        return "source already in list", 503
     
    
    is_positive = None
    if userdata["type"] == "positive":
        is_positive = True
    elif userdata["type"] == "negative":
        is_positive = False
    if is_positive == None:
        return "invalid type", 503
    
    resp = requests.get(f"https://api.semanticscholar.org/v1/paper/{userdata['identifier']}")
    if (resp.status_code == 404):
        logout_user()
        fflog.info("  > 503 invalid identifier - Bad user was logged out!")
        return "invalid identifier", 503
    
    resp_json = resp.json()

    if len(resp_json["citations"]) < 7:
        fflog.info("  > 503 not enough citations")
        return "not enough citations", 503

    try:
        source = Source(assumption_id=assumption.id, 
                        posted_by=current_user.id, 
                        is_positive=is_positive,
                        identifier=userdata["identifier"],
                        title=resp_json["title"],
                        num_citations=len(resp_json["citations"]),
                        url=resp_json["url"])
        db.session.add(source)
        db.session.commit()
    except Exception as e:
        fflog.info("  > 503 something went wrong when trying to add the source to the database")
        fflog.info(e)
        return "Something went wrong", 500
    fflog.info("  > 200 source added")
    return "source added", 200

@api.route("/api/search", methods=["POST"])
def search():
    userdata = request.json
    similars = semantic.nearest_documents(userdata["query"], 20)
    similar_assumptions = []
    for sim in similars:
        similar_assumptions.append(assumption2Object(sim))
    fflog.info(f"  > 200 found {len(similar_assumptions)} results")
    return json.dumps(similar_assumptions), 200

@api.route("/api/assumption/<int:id>", methods=["GET"])
def get_assumption(id):
    assumption = Assumption.query.filter_by(id=id).first()
    if not assumption:
        fflog.info(f"  > 404 assumption does not exist")
        return f"id {id} does not exist", 404 

    assumption.views += 1
    db.session.commit()

    obj = assumption2Object(assumption, full_sources=True)

    similars = semantic.nearest_documents(assumption.text, 4)[1:]
    similar_assumptions = []
    for sim in similars:
        similar_assumptions.append(assumption2Object(sim))
    #return json.dumps({"assumption":obj})
    fflog.info(f"  > 200 found assumption and {len(similar_assumptions)} similar")
    return json.dumps({"assumption":obj,"similarPosts":similar_assumptions}), 200

@api.route("/api/assumption/create", methods=["POST"])
def new_assumption():
    userdata = request.json
    if not current_user.is_authenticated:
        fflog.info("  > 403 not logged in")
        return "please login", 403
    
    new_id = ""
    try:
        user_id = current_user.id
        assumption = Assumption(user_id=user_id, text=userdata["assumptionText"])
        db.session.add(assumption)
        db.session.flush()
        new_id += str(assumption.id)
        db.session.commit()
    except Exception as e:
        fflog.info(e)
        fflog.info("  > 503 something went wrong when trying to add the assumption to the database")
        return "Something went wrong", 500
    fflog.info(f"  > 200 source id {new_id} added")
    return new_id, 200

@api.route("/api/report", methods=["POST"])
def report():
    userdata = request.json
    fflog.info(userdata)
    if not current_user.is_authenticated:
        fflog.info("  > 403 not logged in")
        return "please login", 403

    report = None
    if userdata["assumption"] != None:
        report = Report.query.filter_by(assumption_id=userdata["assumption"]).filter_by(posted_by=current_user.id).first()
    if userdata["source"] != None:
        report = Report.query.filter_by(source_id=userdata["source"]).filter_by(posted_by=current_user.id).first()
    if report != None:
        fflog.info("  > 403 already reported")
        return "already reported", 403

    report = Report(posted_by=current_user.id, assumption_id=userdata["assumption"], source_id=userdata["source"], user_comment=userdata["comment"])
    db.session.add(report)
    db.session.commit()
    
    fflog.info(f"  > 200 New Report: {report}")
    return "ok", 200

@api.route("/api/assumption/recent", methods=["GET"])
def get_recent():
    sources = db.session.query(Source).order_by(Source.date_posted.desc()).limit(25).all()
    source_iter = iter(sources)
        
    result = []
    prev_iterations = []
    while len(result) < 3:
        try:
            assumption = next(source_iter).assumption
        except StopIteration:
            break # will just return all it got
        if assumption.id in prev_iterations:
            continue
        prev_iterations.append(assumption.id)
        obj = assumption2Object(assumption)
        result.append(obj)
    fflog.info(f"  > 200: {len(result)} recent assumptions")
    return json.dumps(result), 200


@api.route("/api/assumption/top/<int:page>", methods=["GET"])
def get_top(page):
    per_page = 4
    assumptions = Assumption.query.order_by(Assumption.views.desc()).paginate(page,per_page,error_out=False)
    results = []
    for assumption in assumptions.items:
        obj = assumption2Object(assumption, full_sources=False)
        results.append(obj)
    fflog.info(f"  >  200: {len(results)} posts on page {page}")
    return json.dumps({"assumptions":results,"page":page,"maxPages":math.ceil(assumptions.total/per_page)}), 200

@api.route("/api/profile", methods=["GET"])
def profile():
    if not current_user.is_authenticated:
        fflog.info("  > 403 not logged in")
        return "please login", 403
    else:
        fflog.info(f"  > 200: Profile data sent")
        return {"username":current_user.username, "email":current_user.email}, 200

@api.route("/api/profile/role", methods=["GET"])
def get_role():
    if current_user.is_authenticated:
        fflog.info(f"  > 200: {current_user.role}")
        return current_user.role, 200
    else:
        fflog.info(f"  > 200: guest")
        return "guest", 200

@api.route("/api/profile/username", methods=["PUT"])
def change_username():
    userdata = request.json
    if not current_user.is_authenticated:
        fflog.info(f"  > 403: not logged in")
        return "please login", 403
    if not validate.username(userdata["name"]):
        fflog.info(f"  > 400: username invalid")
        return "username invalid", 400

    user = User.query.filter_by(username=userdata["name"]).first()
    if user:
        return "username exists", 400
    
    current_user.username = userdata["name"]
    db.session.commit()

    return "ok", 200

@api.route("/api/profile/password", methods=["PUT"])
def change_password():
    userdata = request.json
    fflog.info(userdata)
    if not current_user.is_authenticated:
        fflog.info(f"  > 403: not logged in")
        return "please login", 403
    if not validate.password(userdata["password"]):
        fflog.info(f"  > 400: bad password {userdata['password']}")
        return "password invalid", 400
    
    hashed_pw = bcrypt.generate_password_hash(userdata["password"]).decode("utf-8")
    current_user.password = hashed_pw
    db.session.commit()

    return "ok", 200

@api.route("/api/register", methods=["POST"])
def register():
    userdata = request.json
    if current_user.is_authenticated:
        fflog.info("  > 500: already logged in")
        return "already logged in", 500

    if not validate.username(userdata["name"]):
        fflog.info("  > 400: bad username")
        return "username invalid", 400
    if not validate.email(userdata["email"]):
        fflog.info(f"  > 400: bad email: {userdata['email']}")
        return "email invalid", 400
    if not validate.password(userdata["password"]):
        fflog.info(f"  > 400: bad password: {userdata['password']}")
        return "password invalid", 400

    hashed_pw = bcrypt.generate_password_hash(userdata["password"]).decode("utf-8")
    user = User.query.filter_by(username=userdata["name"]).first()
    if user:
        fflog.info(f"  > 400: username already exists: {userdata['name']}")
        return "username exists", 400
    
    user = User.query.filter_by(email=userdata["email"]).first()
    if user:
        fflog.info(f"  > 400: email already exists: {userdata['email']}")
        return "email invalid", 400


    mail_verification_code = "".join([str(random.randint(0, 9)) for _ in range(8)])
    session["mail_verification_code"] = mail_verification_code

    # access these session vars when email validation code is correct
    session["reg_username"] = userdata["name"]
    session["reg_email"] = userdata["email"]
    session["reg_pwhash"] = hashed_pw

    #sendMail(recipient = userdata["email"], recipient_name = userdata["name"], mail_verification_code = mail_verification_code)
    
    msg = Message("Verify your ClaimRate Account!", recipients=[userdata["email"]])
    msg.body = f"""
        Hello {userdata["name"]},

        Your Verification Code: {mail_verification_code}
    """
    fflog.info("  > Verification Mail ready")
    with mail.connect() as conn:
        conn.send(msg)

    fflog.info(f"  > 200: verification email sent")
    return "mail sent", 200

@api.route("/api/mailverify", methods=["POST"])
def verify_mail():
    userdata = request.json
    if userdata["mail_verification_code"] != session["mail_verification_code"] and userdata["mail_verification_code"]!="debug123": #TODO:Remove this, only for debugging!
        return "bad verification code", 422
    try:
        user = User(username=session["reg_username"], email=session["reg_email"], password=session["reg_pwhash"])
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        fflog.info(e)
        fflog.info(f"  > 500: something went wrong when adding the new user to the database")
        return "Something went wrong", 500
    fflog.info(f"  > 200: New Account created for user {session['reg_username']}")
    return "Account Registered", 200

@api.route("/api/login", methods=["POST"])
# TODO: @api.validate( 'users', 'login' )
def login():
    if current_user.is_authenticated:
        fflog.info("  > 200: already logged in")
        return "Logged in", 200
    userdata = request.json
    user = User.query.filter_by(email=userdata["email"]).first()
    if not user:
        fflog.info("  > 401: wrong username")
        return "Invalid Password", 401 # thats a lie :DDDD
    if not bcrypt.check_password_hash(user.password, userdata["password"]):
        fflog.info("  > 401: wrong password")
        return "Invalid Password", 401
    else:
        login_user(user, remember=userdata["remember"])
        fflog.info(f"  > 200: logged in (Remember={userdata['remember']})")
        return "Logged in", 200

@api.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    fflog.info("  > 200: logged out")
    return 'Logged out', 200 
