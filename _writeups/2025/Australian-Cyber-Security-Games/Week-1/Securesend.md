---
layout: writeup
title: Securesend
tags: Osint
---

## Description

Some phishing emails have been going out from the People's Solidarity front. Can you figure out why their domain isn't being protected?

<!--more-->

## Solution

The description was everything you got for that challenge, so I first off had to find out what domain the `People's Solidairy front` used. Luckily, I had already done the web challenges, and all of them used different subdomains of `freedonia.vote`, so I guessed that their domain would be `solidarity.freedonia.vote`, and what would you know, I was right
```text
$ curl solidarity.freedonia.vote -X GET
<!-- Template site from  https://www.w3schools.com/css/tryit.asp?filename=trycss3_flexbox_website2 -->

<!DOCTYPE html>
<html>
  <head>
    <title>Comrade Elira Voss</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
  ...
```

Searching up how to implement email authentication protections, so only authorised servers can use your email came up with three protocols `SPF`, `DKIM`, and `DMARC`

### SPF - Sender Policty Framework

This is a protocol that spcifies what mail servers are authorised to send emails from their domain, this SPF record is published in a domains DNS records.
This value can be seen by anyone that looks at your DNS record, or can be specifically seen with the command:
```text
$ dig +short TXT solidarity.freedonia.vote
"v=spf1 a ~all cysea{spf_and_"
```

In this case, instead of a proper SPF record, the domain has part of the flag there. `cysea{spf_and_`


### DKIM - DomainKeys Identified Mail

This is a protocol that yet again stores data in DNS records, but this time it contains the public keys used to decrypt the email's signature, ensuring that the email wasn't altered along the way. This can be seen by looking at DNS records, or with the command:
```text
$ dig +short TXT dkim._domainkey.solidarity.freedonia.vote

```

Which in this case returned nothing but normally e.g. for twitter this is what it looks like:

```text
$ dig +short TXT dkim._domainkey.twitter.com
"v=DKIM1; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrZ6zwKHLkoNpHNyPGwGd8wZoNZOk5buOf8wJwfkSZsNllZs4jTNFQLy6v4Ok9qd46NdeRZWnTAY+lmAAV1nfH6ulBjiRHsdymijqKy/VMZ9Njjdy/+FPnJSm3+tG9Id7zgLxacA1Yis/18V3TCfvJrHAR/a77Dxd65c96UvqP3QIDAQAB"
```

### DMARC - Domain-based Message Authentication, Reporting, and Conformance

This is a protocol that requires either DKIM or SPF records to be up on the DNS. It tells servers how to handle messages that fail any SPF or DKIM checks. It is also accessible in the DNS record, or can be specifically seen with the command:
```text
$ dig TXT _dmarc.solidarity.freedonia.vote

; <<>> DiG 9.20.9-1-Debian <<>> TXT _dmarc.solidarity.freedonia.vote
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 25690
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;_dmarc.solidarity.freedonia.vote. IN   TXT

;; ANSWER SECTION:
_dmarc.solidarity.freedonia.vote. 295 IN TXT    "v=DMARC1;p=reject;sp=quarantine;pct=100;rua=mailto:dmarc_l7813eDu}@solidarity.freedonia.vote"

;; Query time: 52 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Sun Jul 06 21:55:49 AWST 2025
;; MSG SIZE  rcvd: 166
```

this reply has a part of the flag in it `dmarc_l7813eDu}`.

Combining the two parts of the flag found gets the flag `cysea{spf_and_dmarc_l7813eDu}`
