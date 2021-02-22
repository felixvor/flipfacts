from flask import redirect, url_for, request
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user


#from flipfacts.models import User, Assumption, Source, Report

# @app.before_request
# def before_request_func():
#     if request.path.startswith('/admin/'):
#         if (not current_user.is_authenticated) or (not current_user.is_administrator):
#             return redirect(url_for('/'))


class SecureModelView(ModelView):
    column_display_pk = True
    column_exclude_list = ['password', "embedding"]
    form_excluded_columns  = ['password',]

    def is_accessible(self):
        if current_user.is_authenticated:
            return current_user.is_administrator
        else:
            return False

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('/'))

class UserModelView(SecureModelView):
    column_searchable_list = ('username', 'email')

class AssumptionModelView(SecureModelView):
    column_searchable_list = ('text', "user_id")

class SourceModelView(SecureModelView):
    column_searchable_list = ('title', 'assumption_id')

class ReportModelView(SecureModelView):
    column_searchable_list = ('user_comment', 'posted_by', "assumption_id", "source_id")

# dbadmin.add_view(SecureModelView(User, db.session))
# dbadmin.add_view(SecureModelView(Assumption, db.session))
# dbadmin.add_view(SecureModelView(Source, db.session))
# dbadmin.add_view(SecureModelView(Report, db.session))
