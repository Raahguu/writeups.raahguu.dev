---
layout: writeup
title: Beep Boop
tags: WebX
---

## Description

The site's running fine, but something feels... mechanical. Not everything here was meant for humans — but then again, you’re not just any human, are you? Some files weren’t meant to be seen. But just because they're disallowed doesn't mean they're invisible. Can you find what the bots were told to avoid? https://renewal.freedonia.vote/


## Solution

This is another easy web challenge, just go to the link, and then the `robots.txt`:

```text
Disallow: /MN4XGZLBPNZDAYRQORZV6NDOMRPXG4BRMRSXE435
```

This is a base 32 code: `cysea{r0b0ts_4nd_sp1ders}`
