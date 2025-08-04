---
layout: writeup
title: Dark Detour
tags: WebX
---

## Description

Everyone wants to be in the room where it happens! You can always wait for the invite, or just go in blind!

<!--more-->

http://redac.ted:3000/


## Solution

This page is a small static page that links to a login page. We got nothing except this login page, and there is no robots.txt or sitemap.xml, so the only thing to do is to do some injection into the login field.

Now we don't know any usernames, so we need to inject within the username field. Let's just try a simple SQL injection into the username field:

```SQL
e' OR 1=1 --
```

Submitting this, sends you to the `/admin` page which is just a single piece of text in the middle of the screen: `secedu{sql_d03s_n0t_s33_r0l3s}`

That was a pretty quick flag: `secedu{sql_d03s_n0t_s33_r0l3s}`
