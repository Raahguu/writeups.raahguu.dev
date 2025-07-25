---
layout: writeup
title: Lottery ticket
tags: Net
---

## Warning

This challenge is a continuation of [A telling tale](./A-telling-tale), so I suggest you read that first to get an idea of what is going on

## Description

The leader of the Centrist Union, Alyssa Chen knows that a political career is a life full of gambles. To remind herself of how much luck plays a part in her political fortunes she buys a ticket in the Freedonia State Lottery every month.

This month she left a copy of her ticket on the Centrist Union's office server. Can you find the ticket and repeat the numbers back to her?

(It is recommended that you solve "A telling tale" before attempting this challenge)
office.centrist.freedonia.vote

## Solution

In the last challenge, we had nmaped the ports, so I'll copy that over for reference:

```text
PORT   STATE SERVICE  VERSION
7/tcp  open  echo
9/tcp  open  discard?
17/tcp open  qotd?
| fingerprint-strings:
|   DNSStatusRequestTCP, GenericLines, GetRequest, Help, LDAPBindReq, SIPOptions, TerminalServerCookie, X11Probe:
|     Got off at the wrong stop? Maybe you should try a different form of transport.
|   DNSVersionBindReqTCP, FourOhFourRequest, HTTPOptions, Kerberos, LDAPSearchReq, RPCCheck, SSLSessionReq:
|     cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
|   LPDString, RTSPRequest, SMBProgNeg, TLSSessionReq:
|_    If you want your luck to hold, make sure you have the winning numbers.
19/tcp open  chargen  Linux chargen
```

Lets start with some recon, by `nc`ing into every port.

```text
$ nc office.centrist.freedonia.vote 17     
test
If you want your luck to hold, make sure you have the winning numbers.
If you want your luck to hold, make sure you have the winning numbers.
If you want your luck to hold, make sure you have the winning numbers.
If you want your luck to hold, make sure you have the winning numbers.
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
Got off at the wrong stop? Maybe you should try a different form of transport.
If you want your luck to hold, make sure you have the winning numbers.
Got off at the wrong stop? Maybe you should try a different form of transport.
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}1
cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}0
If you want your luck to hold, make sure you have the winning numbers.1
Got off at the wrong stop? Maybe you should try a different form of transport.2
If you want your luck to hold, make sure you have the winning numbers.^C
```

Port 17 seems to just cycle through quotes, which contain the flag for the last challenge (`cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}`), and two hints:

```text
1. If you want your luck to hold, make sure you have the winning numbers.
2. Got off at the wrong stop? Maybe you should try a different form of transport.
```

Lets continue on with the other ports and then circle back to these hints.

```text
$ nc office.centrist.freedonia.vote 7
e
e
test
test
/x
/x
%x
%x
%n
%n
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA


^C
```

Port 7 seems to be an `echo`, as the `nmap` guessed, it also doesn't seem to be easily susceptible to any attacks, maybe if we could get the source code somehow we could do a buffer overflow but at this point it would just be guesseing and brute force, lets look at everything else first and circle back if were stuck.

```text
$ nc office.centrist.freedonia.vote 9
test
yes
%x
%n
^C
```

Port 9 seems to be a `discard`, yet again as the `nmap` guessed, so this is likely not succeptible to attacks unless it turns out that some specific token returns the flag, but that is unlikely.

```text
$ nc office.centrist.freedonia.vote 19
!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefgh
"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghi
#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghij
$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijk
%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijkl
&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklm
'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmn
()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmno
)*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnop
*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopq
+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqr
,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrs
-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrst
./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstu
/0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuv
0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvw
123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwx
23456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxy
3456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz
...
...
...
xyz{|}~ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`
yz{|}~ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`a
z{|}~ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`ab
{|}~ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abc
|}~ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcd
}~ !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcde
~ !"#$%&'(^C
```

Port 19 seems to print out lines rotating through every charcater until we close the connection. Keeping it open for a couple seconds resulted in tens of thousands of lines.

We've now gone through all of the ports open to us, time to go back to those hints and make sense of them, for refernce the hints were:

```text
1. If you want your luck to hold, make sure you have the winning numbers.
2. Got off at the wrong stop? Maybe you should try a different form of transport.
```

The first hint seems to be about the flavour text of this challenge, the whole `Lottery ticket numbers` thing, but it could also reference that the winning port number is not port 17.

The second hint talks about a `different form of transport`, and yet again being at the `wrong stop`. These two hints make me think that the flag likely isn't at port 17 with how both hints are about the port number being wrong. And this clue about transport seems to me to be about how we are 'transporting' the packets to their 'stop'(port). The only thing I can think about for packet transportation is `UDP` vs `TCP`, I know that normal netcat connections use `TCP`, as they are designed for the transfer of text, so my idea is what if we connect through `UDP`. Lets try, time to go through all the ports again with `UDP` traffic this time

```text
$ nc -u  office.centrist.freedonia.vote 17
test

```

Port 17 sent nothing back, likely connect at all

```text
$ nc -u  office.centrist.freedonia.vote 9
test

```

Port 9 also sent nothing back, but the connection closed on its own, so it likely refused the connection rather than ignoring it.

```text
$ nc -u  office.centrist.freedonia.vote 7
test
cysea{fr33d0n14_5ta73_l0773ry_numb3r5_202,97,131,1033}
```

And there we go, port 7 echoes back the flag after any input instead of its usual echo back what you said to it.

The final flag was: `cysea{fr33d0n14_5ta73_l0773ry_numb3r5_202,97,131,1033}`
