---
layout: writeup
title: head-dump
tags: WebX
excerpt: "Welcome to the challenge! In this challenge, you will explore a web application and find an endpoint that exposes a file containing a hidden flag. The application is a simple blog website where you can read articles about various topics, including an article about API Documentation. Your goal is to explore the application and find the endpoint that generates files holding the server’s memory, where a secret flag is hidden. The website is running picoCTF News."
---

## Description

Welcome to the challenge! In this challenge, you will explore a web application and find an endpoint that exposes a file containing a hidden flag. The application is a simple blog website where you can read articles about various topics, including an article about API Documentation. Your goal is to explore the application and find the endpoint that generates files holding the server’s memory, where a secret flag is hidden. The website is running picoCTF News.


## Solution

This is a very quick challenge going to the website shows a bunch of cards which each appear to contain a post from `picoCTF News`. Of these the only one mentioned in the description was the `API Documentation` one. Clicking everything on it does nothing, except for clicking `#API Documentation`, which takes you to a site documenting all the endpoints of the api.

One of these options is a `heapdump` at `/heapdump`. This stands out as the challenge was called `head-dump` which is very similar. Doing a Get request on this endpoint downloads a file called `heapdump-1751889921223.heapsnapshot`. Catting this file reveals a `538,436` line file, grepping this for picoCTF gets you the flag.

```bash
$ cat heapdump-1751889921223.heapsnapshot | grep picoCTF
picoCTF{Pat!3nt_15_Th3_K3y_f1179e46}
```

And thats the flag `picoCTF{Pat!3nt_15_Th3_K3y_f1179e46}`
