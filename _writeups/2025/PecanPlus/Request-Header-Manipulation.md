---
layout: writeup
title: Request Header Manipulation
tags: WebX
excerpt: "I found a website with some crazy privacy rules about who can join."
---

## Description

I found a website with some crazy privacy rules about who can join.

And a link was given


## Solution

The link leads to a website looking like this
![403 error saying `I only trust users of the 'cheese' browser`](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/1.png)


With a name like `Request Header Manipulation`, in a http/s site, it is likely that what the browser, is refering to are the request headers sent in all get requests.

So, you go to `Burp` and open up the website in the proxy, before moving that into the `Repeater`.
![An HTTP Request](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/2.png)

The hint for this is that you need to use the `Cheese` browser, that likely refers to the `User-Agent` request header, so changing it:
```
GET / HTTP/1.1
Host: localhost:8000
Cache-Control: max-age=0
sec-ch-ua: "Not:A-Brand";v="24", "Chromium";v="134"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Accept-Language: en-US,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: Cheese
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

Note: This doesn't seem to get a reply from the server at all, but if there are two empty lines afterwards, then everything is fine?

Gets the reply:
![403 error `I will only reply to those that accept '1337' as their language of choice`](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/3.png)

The next hint for accepting a language, likely refers to `Accepted-Language`:
```
GET / HTTP/1.1
Host: localhost:8000
Cache-Control: max-age=0
sec-ch-ua: "Not:A-Brand";v="24", "Chromium";v="134"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Accept-Language: 1337
Upgrade-Insecure-Requests: 1
User-Agent: Cheese
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

This gets the reply:
![403 error `I can't believe your not even going to accept a 'flag' instead of text/html or even worse */*`](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/4.png)

The next hint for accepting `flag` instead of `text/html`, that likely refers to `Accept`:
```
GET / HTTP/1.1
Host: 127.0.0.1:8000
Cache-Control: max-age=0
sec-ch-ua: "Not:A-Brand";v="24", "Chromium";v="134"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Accept-Language: 1337
Upgrade-Insecure-Requests: 1
User-Agent: Cheese
Accept: flag
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

This gets the reply:
![403 error `If the message wasn't sent at the exact time of the Unix Epoch, then I don't care`](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/5.png)

The hint for sending the request at the `Unix Epoch`, likely refers to `Date`:
```
GET / HTTP/1.1
Host: 127.0.0.1:8000
Cache-Control: max-age=0
sec-ch-ua: "Not:A-Brand";v="24", "Chromium";v="134"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Accept-Language: 1337
Upgrade-Insecure-Requests: 1
User-Agent: Cheese
Date: Thu, 01 Jan 1970 00:00:00 GMT
Accept: flag
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

This gets the reply:
![403 error `Go rick roll yourself, then refer back to here`](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/6.png)

The hint to `rickroll yourself` and then `refer` back likely refers to either `Referer`, or `Origin`:
Lets try `Referer`, the link for rick rolling is `https://www.youtube.com/watch?v=dQw4w9WgXcQ`:
```
GET / HTTP/1.1
Host: 127.0.0.1:8000
Cache-Control: max-age=0
sec-ch-ua: "Not:A-Brand";v="24", "Chromium";v="134"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Accept-Language: 1337
Upgrade-Insecure-Requests: 1
User-Agent: Cheese
Date: Thu, 01 Jan 1970 00:00:00 GMT
Accept: flag
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

That works, getting the reply:
![403 error `Are you even going to be using an effective connection of 5g?`](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/7.png)

The hint of using an `Effective connection`, likely refers to `Effective Connection Type` or `ECT`:
```
GET / HTTP/1.1
Host: 127.0.0.1:8000
Cache-Control: max-age=0
sec-ch-ua: "Not:A-Brand";v="24", "Chromium";v="134"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Accept-Language: 1337
Upgrade-Insecure-Requests: 1
User-Agent: Cheese
Date: Thu, 01 Jan 1970 00:00:00 GMT
Accept: flag
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
ECT: 5g
```

This gets the reply:
![403 error `What email is this request even from?`](/assets/images/writeups_images/2025/PecanPlus/Request-Header-Manipulation/8.png)

This hint of supplying an `Email` likely refers to the `From` header, where you can give the server an email in. There isn't a hint about what email to use, so I just made one up:
```
GET / HTTP/1.1
Host: 127.0.0.1:8000
Cache-Control: max-age=0
sec-ch-ua: "Not:A-Brand";v="24", "Chromium";v="134"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Accept-Language: 1337
Upgrade-Insecure-Requests: 1
User-Agent: Cheese
Date: Thu, 01 Jan 1970 00:00:00 GMT
Accept: flag
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Referer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
ECT: 5g
From: picklerick@example.com
```

This replies with the flag:
`pecan{HTTP_r3q35st_h34d3r5_c4n_g3t_qu1t3_w13rd_4nd_5p3c1f1c}`
