import string

def username(username):
    if not (len(username) >= 3 and len(username) < 35):
        return False

    whitelist_chars = [".","-","_"]
    blacklist_chars = string.punctuation+" " #whitespace not included
    for c in blacklist_chars:
        if c in whitelist_chars:
            continue
        if c in username:
            return False

    for c in username:
        if not (32 <= ord(c) <= 126):
            return False #not letter from ascii

    return True

def email(email):
    if not "@" in email:
        return False
    if not "." in email:
        return False
    if not (len(email) >= 3 and len(email) < 200):
        return False
    return True

def password(password):
    if len(password) <= 7:
        return False
    if len(password) >= 60:
        return False
    return True


