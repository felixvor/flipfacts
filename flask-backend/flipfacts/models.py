
from flask_login import UserMixin #will give me is_authenticated and stuff
from datetime import datetime
from flipfacts import db, login_manager

import logging

fflog = logging.getLogger("fflog")

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(35), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    active = db.Column(db.Boolean(), nullable=False, default=True)
    role = db.Column(db.String(10), nullable=False, default="basic")

    assumptions = db.relationship("Assumption", backref="author", lazy=True) # Backref -> assumption.auther to get user object, Lazy -> will load posts when loading a user (?)
    sources = db.relationship("Source", backref="poster", lazy=True)
    reports = db.relationship("Report", backref="reporting_user", lazy=True)

    @property
    def is_administrator(self):
        return self.role == "admin"

    def __repr__(self):
        return f"User ID {self.id}('{self.username}','{self.email}')"

class Assumption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False) #user.id lowercase tablename.columname

    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    text = db.Column(db.String(512), nullable=False, unique=True)
    views = db.Column(db.Integer, nullable=False, default=1)

    embedding = db.Column(db.String(16384), nullable=True)
    embedding_hash = db.Column(db.String(42), nullable=True)
    
    sources = db.relationship("Source", backref="assumption", lazy=True)
    reports = db.relationship("Report", backref="assumption", lazy=True)



    def __repr__(self):
        return f"Assumption ID {self.id} (by id='{self.user_id}', '{self.date_posted}', '{self.views} views', '{self.text}')"

class Source(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    assumption_id = db.Column(db.Integer, db.ForeignKey("assumption.id"), nullable=False)
    posted_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    is_positive = db.Column(db.Boolean, nullable=False)

    # TODO: Place on own table where unique=true and migrate:
    identifier = db.Column(db.String(128), nullable=False)
    title = db.Column(db.String(512), nullable=False)
    num_citations = db.Column(db.Integer, nullable=False)
    url = db.Column(db.String(350), nullable=False)

    reports = db.relationship("Report", backref="source", lazy=True)

    def __repr__(self):
        type = "positive" if self.is_positive else "negative"
        return f"Source ID {self.id} (Assumption='{self.assumption_id}' posted_by='{self.posted_by}', {self.date_posted}', '{type}', '{self.identifier}')"

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    posted_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    assumption_id = db.Column(db.Integer, db.ForeignKey("assumption.id"), nullable=True)
    source_id = db.Column(db.Integer, db.ForeignKey("source.id"), nullable=True)

    reviewed = db.Column(db.Boolean, nullable=False, default=False)

    user_comment = db.Column(db.String(4096), nullable=True)

    def __repr__(self):
        type = "source" if self.assumption_id==None else "assumption"
        type_id = self.source_id if self.assumption_id==None else self.assumption_id
        return f"Report ID {self.id} for {type} {type_id}: (by id='{self.posted_by}', {self.date_posted}', '{self.comment}')"


def create_db(db):
    db.create_all() # create initial db if does not exist
    #
    # +++ Adding initial example data to database +++
    #
    admin_account = User.query.filter_by(id=1).first()
    if not admin_account: #this means database is empty. add initial stuff:
        fflog.info("Writing initial data to empty database.")

        user = User(username="Admin", email="admin@bratp.fun", password="$2b$12$jiPGO.uC1Sxg5OyMdKvs7.HhNzZIP52i.9y4q.i/anQX.MnYO8FTm", role="admin")
        db.session.add(user)
        db.session.flush()

        # initial assumptions:
        assumption1 = Assumption(user_id=user.id, text="Long sleep duration is associated with lower cognitive function and lower health.")
        db.session.add(assumption1)
        assumption2 = Assumption(user_id=user.id, text="Countries that improve gender equality have more women in STEM fields.")
        db.session.add(assumption2)
        assumption3 = Assumption(user_id=user.id, text="LSD is less toxic to the human body than Aspirin (for standard dosages).")
        db.session.add(assumption3)
        assumption4 = Assumption(user_id=user.id, text="In the last century, access to drinking water in low and middle income countries has continually improved.")
        db.session.add(assumption4)
        assumption5 = Assumption(user_id=user.id, text="Spending money on others increases happiness more than spending money on yourself.")
        db.session.add(assumption5)
        db.session.flush()

        # initial sources:
        assumption1_source1 = Source(assumption_id=assumption1.id, 
                                    posted_by=user.id, 
                                    is_positive=True,
                                    identifier="10.1016/j.smrv.2017.11.001",
                                    title="Association between long sleep duration and increased risk of obesity and type 2 diabetes: A review of possible mechanisms.",
                                    num_citations=45,
                                    url="https://www.semanticscholar.org/paper/Association-between-long-sleep-duration-and-risk-of-Tan-Chapman/0cf44d08b45b5c05e2276878148949d03edf224b")
        db.session.add(assumption1_source1)

        assumption1_source2 = Source(assumption_id=assumption1.id, 
                                    posted_by=user.id, 
                                    is_positive=True,
                                    identifier="10.1016/j.sleep.2017.07.029",
                                    title="Long sleep duration is associated with lower cognitive function among middle-age adults - the Doetinchem Cohort Study.",
                                    num_citations=14,
                                    url="https://www.semanticscholar.org/paper/Long-sleep-duration-is-associated-with-lower-among-Oostrom-Nooyens/b7669defa4c0650028b31759a49e1fd3985c85c2")
        db.session.add(assumption1_source2)

        assumption2_source1 = Source(assumption_id=assumption2.id, 
                                    posted_by=user.id, 
                                    is_positive=False,
                                    identifier="10.1177/0956797617741719",
                                    title="The Gender-Equality Paradox in Science, Technology, Engineering, and Mathematics Education",
                                    num_citations=255,
                                    url="https://www.semanticscholar.org/paper/The-Gender-Equality-Paradox-in-Science%2C-Technology%2C-Stoet-Geary/db85143e577e48f8abe57af7c2579edd40b4fa23")
        db.session.add(assumption2_source1)

        assumption3_source1 = Source(assumption_id=assumption3.id, 
                                    posted_by=user.id, 
                                    is_positive=True,
                                    identifier="10.1016/j.forsciint.2018.01.006",
                                    title="Is LSD toxic?",
                                    num_citations=14,
                                    url="https://www.semanticscholar.org/paper/Is-LSD-toxic-Nichols-Grob/a1d9a9a6db7a3b971abc2227a9b155db1cc5c5fb")
        db.session.add(assumption3_source1)

        assumption3_source2 = Source(assumption_id=assumption3.id, 
                                    posted_by=user.id, 
                                    is_positive=True,
                                    identifier="10.3109/15563657508988063",
                                    title="Coma, hyperthermia, and bleeding associated with massive LSD overdose, a report of eight cases.",
                                    num_citations=62,
                                    url="https://www.semanticscholar.org/paper/Coma%2C-hyperthermia%2C-and-bleeding-associated-with-a-Klock-Boerner/78057daa1e839668d7efefa5df7cbd0e55f32dbe")
        db.session.add(assumption3_source2)

        assumption4_source1 = Source(assumption_id=assumption4.id, 
                                    posted_by=user.id, 
                                    is_positive=True,
                                    identifier="10.1016/j.scitotenv.2015.09.130",
                                    title="Tracking progress towards global drinking water and sanitation targets: A within and among country analysis.",
                                    num_citations=37,
                                    url="https://www.semanticscholar.org/paper/Tracking-progress-towards-global-drinking-water-and-Fuller-Goldstick/2921dab93455205982aeba7aed938b42f56e51aa")
        db.session.add(assumption4_source1)

        assumption5_source1 = Source(assumption_id=assumption5.id, 
                                    posted_by=user.id, 
                                    is_positive=True,
                                    identifier="10.1126/science.1150952",
                                    title="Spending Money on Others Promotes Happiness.",
                                    num_citations=949,
                                    url="https://www.semanticscholar.org/paper/Spending-Money-on-Others-Promotes-Happiness-Dunn-Aknin/e3e09873cfa6d7a2b106bc0792e7d8de51c49f18")
        db.session.add(assumption5_source1)

        db.session.commit()

        fflog.info("DB initialized.")
