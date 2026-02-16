---
layout: writeup
title: Log
tags:
  - Forensics
excerpt: My website has been hacked. Please help me answer the provided questions using the available logs! - daffainfo
---
## Description
My website has been hacked. Please help me answer the provided questions using the available logs! - daffainfo

This was a forensics challenge where the apache access and error logs were given and then questions about them needed to be answered to get the flag

## Disclaimer
This writeup did not use Generative AI to write or to aid in the writing of it, and the solution to this CTF challenge was not found using or aided by the use of Generative AI


## Solution
The challenge gives an instance that we can `nc` into and get questions, here is `Question 1`:
```txt
$ nc challenges.1pc.tf 25157
Please answer the following questions based on your analysis:

Question #1:
1. What is the Victim's IP address?
Required Format: 127.0.0.1
Your Answer: 
```

This was very easy, as from a quick query of what IPs there are and how many times they make a request (the first row in the access file):
```bash
$ cat access.log | awk '{print $1}' | sort | uniq -c
      9 127.0.0.1
     76 182.8.97.244
   3041 219.75.27.16
```

One of these is a loopback (`127.0.0.1`), and then I made the assumption that the IP that made over 3000 queries was likely the attacker, so the victim is obviously `182.8.97.244`

```txt
Question #1:
1. What is the Victim's IP address?
Required Format: 127.0.0.1
Your Answer: 182.8.97.244
Status: Correct!
```

And now we get `Question 2`:
```txt
Question #2:
2. What is the Attacker's IP address?
Required Format: 127.0.0.1
Your Answer:
```

We already found this, it is `219.75.27.16`
```txt
Question #2:
2. What is the Attacker's IP address?
Required Format: 127.0.0.1
Your Answer: 219.75.27.16
Status: Correct!
```

Time for `Question 3`:
```txt
Question #3:
3. How many login attempts were made?
Required Format: 1337
Your Answer:
```

This is a bit harder, but not too much, looking at the queries in `access.log`, it is obvious that all login attempts are made to `/wp-login.php`, so we just need to grep for that
```bash
$ grep "POST /wp-login.php" access.log | wc -l
8
```

But this gets `incorrect`, for two reasons.
First, if we look at the IPs that made those requests:
```bash
$ grep "POST /wp-login.php" access.log | awk '{print $1}' | sort | uniq -c
      1 182.8.97.244
      7 219.75.27.16
```

One of the requests was not made by the attacker and should not be counted.

Secondly, `attempts` implies only incorrect requests, and all correct requests result in a `302` HTTP status code as they redirect the user away from the login page once they have logged in, so we need to exclude those as well:
```bash
$ grep "POST /wp-login.php" access.log | grep -v "302" | awk '{print $1}' | sort | uniq -c
      6 219.75.27.16
```

And we get that there were only 6 failed attempts to log in, and all of them were from the attacker's IP.
```txt
Question #3:
3. How many login attempts were made?
Required Format: 1337
Your Answer: 6
Status: Correct!
```

Now for `Question 4`:
```txt
Question #4:
4. Which plugin was affected?
Required Format: -
Your Answer:
```

This one was very easy, just grep for `plugins/` as this looks for anything in the folder `plugins`, which would only be plugins.
```bash
$ grep "plugins/" access.log | head -1
182.8.97.244 - - [11/Jan/2026:12:27:59 +0000] "GET /wp-content/plugins/easy-quotes/public/js/star.js?ver=1768134453 HTTP/1.1" 200 892 "http://165.22.125.147/wp-admin/edit.php?post_type=quote" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.56 Safari/537.36"
```

And so this shows the plugin `easy-quotes`, so just need to awnser:
```txt
Question #4:
4. Which plugin was affected?
Required Format: -
Your Answer: Easy Quotes
Status: Correct!
```

Onto `Question 5`:
```txt
Question #5:
5. What is the CVE ID?
Required Format: CVE-XXXX-XXXX
Your Answer:
```

For this, you just need to search up on google 'Easy Quotes CVE', and you get [CVE-2025-26943](https://www.cve.org/CVERecord?id=CVE-2025-26943)
```txt
Question #5:
5. What is the CVE ID?
Required Format: CVE-XXXX-XXXX
Your Answer: CVE-2025-26943
Status: Correct!
```

Now for `Question 6`:
```txt
Question #6:
6. Which tool and version were used to exploit the CVE?
Required Format: tool_name/13.3.7
Your Answer:
```

For this, I just read that the CVE was an SQL exploit, and immediately greped for `sqlmap`, and found it:
```bash
$ grep "sqlmap" access.log | head -1
219.75.27.16 - - [11/Jan/2026:12:52:03 +0000] "GET /wp-json/layart/v1/fonts?family=1 HTTP/1.1" 200 564 "http://165.22.125.147/wp-json/layart/v1/fonts?family=1" "sqlmap/1.10.1.21#dev (https://sqlmap.org)"
```

So we can just submit `sqlmap/1.10.1.21`:
```txt
Question #6:
6. Which tool and version were used to exploit the CVE?
Required Format: tool_name/13.3.7
Your Answer: sqlmap/1.10.1.21
Status: Correct!
```

`Question 7`:
```txt
Question #7:
7. What is the email address obtained by the attacker?
Required Format: r00t@localhost.xyz
Your Answer: 
```

For this one, looking through the logs they appear to have done blind SQL injection with `sqlmap`, so as `sqlmap` does binary search to find the ASCII code of each char in the target string, before it checks exactly what ASCII code the char is. 

So we can grep for just requests for the `user_email` that contain `!=` in them, or rather because it is URL encoded, `%21%3D`, then grab the next few numbers up until the next `%`, this would result in a list of all the ASCII codes, which would be painful to parse manually, so we can extract the ASCII codes from the previous grep using sed, and then do a for loop to convert from ASCII code to actual character to finally get the following:
```bash
$ grep -i "user_email" access.log | grep -F "%21%3D" | grep -o -P "3D.{0,4}%" | sed 's/3D\([0-9]*\)%/\1/' | while read code; do printf "\\$(printf '%03o' "$code")"; done;
admin@daffainfo.com
```

This gets us the email `admin@daffainfo.com`
```txt
Question #7:
7. What is the email address obtained by the attacker?
Required Format: r00t@localhost.xyz
Your Answer: admin@daffainfo.com
Status: Correct!
```

`Question 8`:
```txt
Question #8:
8. What is the password hash obtained by the attacker?
Required Format: -
Your Answer:
```

We just solved this challenge, now we are just looking at what they got from `user_pass` instead of `user_email`:
```bash
$ grep -i "user_pass" access.log | grep -F "%21%3D" | grep -o -P "3D.{0,4}%" | sed 's/3D\([0-9]*\)%/\1/' | while read code; do printf "\\$(printf '%03o' "$code")"; done;
$wp$2y$10$vMTERqJh2IlhS.NZthNpRu/VWyhLWc0ZmTgbzIUcWxwNwXze44SqW
```

This gets a `/etc/shadow` style output, so lets return it:
```txt
Question #8:
8. What is the password hash obtained by the attacker?
Required Format: -
Your Answer: $wp$2y$10$vMTERqJh2IlhS.NZthNpRu/VWyhLWc0ZmTgbzIUcWxwNwXze44SqW
Status: Correct!
```

Finally, `Question 9` (Yes it doesn't end at an even number):
```txt
Question #9:
9. When did the attacker successfully log in?
Required Format: DD/MM/YYYY HH:MM:SS
Your Answer:
```

This can be done by yet again grepping for `POST /wp-login.php` and then just looking at the latest one, which happened at `11/Jan/2026:13:12:49 +0000`
So we can submit that, changing the format slightly

```txt
Question #9:
9. When did the attacker successfully log in?
Required Format: DD/MM/YYYY HH:MM:SS
Your Answer: 11/01/2026 13:12:49
Status: Correct!
```

And we get the flag:
![Image showing the flag being displayed](/assets/images/writeups_images/2026/C2C-qualifiers/Log/1.png)

```flag
C2C{7H15_15_V3rY_345Y_30bb3fffa930}
```