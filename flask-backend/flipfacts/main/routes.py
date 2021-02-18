import random
import threading
import time
import math
import jsonschema
import json
import requests

from flask import render_template, request, Response, session
from flask_login import login_user, logout_user, current_user
from flask_mail import Message

from main import app, db, bcrypt, mail
from main.models import User, Assumption, Source, Report
from main import validate
from main import semantic

#@app.route("/", defaults={"path":""})
#@app.route("/<path:path>") # to deploy with flask.
#def home(path):
#    resp = Response()
#    resp.headers.add('Set-Cookie','cross-site-cookie=bar; SameSite=Strict; Secure')
#    return render_template("index.html", some_token="Hello from Flask Backend")
