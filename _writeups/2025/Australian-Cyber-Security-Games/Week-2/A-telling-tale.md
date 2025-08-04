---
layout: writeup
title: A telling tale
tags: Net
---

## Description

One the staffers at the Centrist Union campaign office had a vist from a rather unusual visitor this week, a fortune teller! The fortune teller left a business card that mentioned something about an online fortune telling service.

The staffer gave this business card to the pary leader, Alyssa Chen, who decided to try it out.

Can you find what the fortune teller had to say to Alyssa via this service?
office.centrist.freedonia.vote

<!--more-->

## Solution

First off, I `nmap`ed the domain, that got:

```text
$ nmap -A -v office.centrist.freedonia.vote
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-09 19:28 AWST
NSE: Loaded 157 scripts for scanning.
NSE: Script Pre-scanning.
Initiating NSE at 19:28
Completed NSE at 19:28, 0.00s elapsed
Initiating NSE at 19:28
Completed NSE at 19:28, 0.00s elapsed
Initiating NSE at 19:28
Completed NSE at 19:28, 0.00s elapsed
Initiating Ping Scan at 19:28
Scanning office.centrist.freedonia.vote (re.da.ct.ed) [4 ports]
Completed Ping Scan at 19:28, 0.06s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 19:28
Completed Parallel DNS resolution of 1 host. at 19:28, 0.06s elapsed
Initiating SYN Stealth Scan at 19:28
Scanning office.centrist.freedonia.vote (re.da.ct.ed) [1000 ports]
Discovered open port 7/tcp on re.da.ct.ed
Discovered open port 9/tcp on re.da.ct.ed
Discovered open port 19/tcp on re.da.ct.ed
Discovered open port 17/tcp on re.da.ct.ed
Completed SYN Stealth Scan at 19:28, 5.11s elapsed (1000 total ports)
Initiating Service scan at 19:28
Scanning 4 services on office.centrist.freedonia.vote (re.da.ct.ed)
Service scan Timing: About 75.00% done; ETC: 19:32 (0:00:53 remaining)
Completed Service scan at 19:31, 158.56s elapsed (4 services on 1 host)
Initiating OS detection (try #1) against office.centrist.freedonia.vote (re.da.ct.ed)
Retrying OS detection (try #2) against office.centrist.freedonia.vote (re.da.ct.ed)
Initiating Traceroute at 19:31
Completed Traceroute at 19:31, 0.02s elapsed
Initiating Parallel DNS resolution of 1 host. at 19:31
Completed Parallel DNS resolution of 1 host. at 19:31, 0.05s elapsed
NSE: Script scanning re.da.ct.ed.
Initiating NSE at 19:31
Completed NSE at 19:31, 14.55s elapsed
Initiating NSE at 19:31
Completed NSE at 19:31, 1.21s elapsed
Initiating NSE at 19:31
Completed NSE at 19:31, 0.00s elapsed
Nmap scan report for office.centrist.freedonia.vote (re.da.ct.ed)
Host is up (0.0097s latency).
rDNS record for re.da.ct.ed: ec2-re.da.ct.ed.ap-southeast-2.compute.amazonaws.com
Not shown: 996 filtered tcp ports (no-response)
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
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port17-TCP:V=7.95%I=7%D=7/9%Time=686E526E%P=x86_64-pc-linux-gnu%r(Gener
SF:icLines,4E,"Got\x20off\x20at\x20the\x20wrong\x20stop\?\x20Maybe\x20you\
SF:x20should\x20try\x20a\x20different\x20form\x20of\x20transport\.")%r(Get
SF:Request,4E,"Got\x20off\x20at\x20the\x20wrong\x20stop\?\x20Maybe\x20you\
SF:x20should\x20try\x20a\x20different\x20form\x20of\x20transport\.")%r(HTT
SF:POptions,2D,"cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}")%r(RTSPRequ
SF:est,46,"If\x20you\x20want\x20your\x20luck\x20to\x20hold,\x20make\x20sur
SF:e\x20you\x20have\x20the\x20winning\x20numbers\.")%r(RPCCheck,2D,"cysea{
SF:y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}")%r(DNSVersionBindReqTCP,2D,"cy
SF:sea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}")%r(DNSStatusRequestTCP,4E,
SF:"Got\x20off\x20at\x20the\x20wrong\x20stop\?\x20Maybe\x20you\x20should\x
SF:20try\x20a\x20different\x20form\x20of\x20transport\.")%r(Help,4E,"Got\x
SF:20off\x20at\x20the\x20wrong\x20stop\?\x20Maybe\x20you\x20should\x20try\
SF:x20a\x20different\x20form\x20of\x20transport\.")%r(SSLSessionReq,2D,"cy
SF:sea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}")%r(TerminalServerCookie,4E
SF:,"Got\x20off\x20at\x20the\x20wrong\x20stop\?\x20Maybe\x20you\x20should\
SF:x20try\x20a\x20different\x20form\x20of\x20transport\.")%r(TLSSessionReq
SF:,46,"If\x20you\x20want\x20your\x20luck\x20to\x20hold,\x20make\x20sure\x
SF:20you\x20have\x20the\x20winning\x20numbers\.")%r(Kerberos,2D,"cysea{y0u
SF:v3_n3773d_a_f0r7un3_c0n6ratul4tion5}")%r(SMBProgNeg,46,"If\x20you\x20wa
SF:nt\x20your\x20luck\x20to\x20hold,\x20make\x20sure\x20you\x20have\x20the
SF:\x20winning\x20numbers\.")%r(X11Probe,4E,"Got\x20off\x20at\x20the\x20wr
SF:ong\x20stop\?\x20Maybe\x20you\x20should\x20try\x20a\x20different\x20for
SF:m\x20of\x20transport\.")%r(FourOhFourRequest,2D,"cysea{y0uv3_n3773d_a_f
SF:0r7un3_c0n6ratul4tion5}")%r(LPDString,46,"If\x20you\x20want\x20your\x20
SF:luck\x20to\x20hold,\x20make\x20sure\x20you\x20have\x20the\x20winning\x2
SF:0numbers\.")%r(LDAPSearchReq,2D,"cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul
SF:4tion5}")%r(LDAPBindReq,4E,"Got\x20off\x20at\x20the\x20wrong\x20stop\?\
SF:x20Maybe\x20you\x20should\x20try\x20a\x20different\x20form\x20of\x20tra
SF:nsport\.")%r(SIPOptions,4E,"Got\x20off\x20at\x20the\x20wrong\x20stop\?\
SF:x20Maybe\x20you\x20should\x20try\x20a\x20different\x20form\x20of\x20tra
SF:nsport\.");
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: bridge|VoIP adapter|general purpose
Running (JUST GUESSING): Oracle Virtualbox (96%), Slirp (96%), AT&T embedded (92%), QEMU (91%)
OS CPE: cpe:/o:oracle:virtualbox cpe:/a:danny_gasparovski:slirp cpe:/a:qemu:qemu
Aggressive OS guesses: Oracle Virtualbox Slirp NAT bridge (96%), AT&T BGW210 voice gateway (92%), QEMU user mode network gateway (91%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
TCP Sequence Prediction: Difficulty=18 (Good luck!)
IP ID Sequence Generation: Incremental
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 80/tcp)
HOP RTT     ADDRESS
1   0.63 ms 10.0.2.2
2   0.84 ms ec2-re.da.ct.ed.ap-southeast-2.compute.amazonaws.com (re.da.ct.ed)

NSE: Script Post-scanning.
Initiating NSE at 19:31
Completed NSE at 19:31, 0.00s elapsed
Initiating NSE at 19:31
Completed NSE at 19:31, 0.00s elapsed
Initiating NSE at 19:31
Completed NSE at 19:31, 0.00s elapsed
Read data files from: /usr/share/nmap
OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 184.20 seconds
           Raw packets sent: 2056 (93.620KB) | Rcvd: 55 (2.780KB)
```

The most important part of this is what the ports were:

```text
PORT   STATE SERVICE  VERSION
 20 7/tcp  open  echo
 21 9/tcp  open  discard?
 22 17/tcp open  qotd?
 23 | fingerprint-strings:
 24 |   DNSStatusRequestTCP, GenericLines, GetRequest, Help, LDAPBindReq, SIPOptions, TerminalServerCookie, X11Probe:
 25 |     Got off at the wrong stop? Maybe you should try a different form of transport.
 26 |   DNSVersionBindReqTCP, FourOhFourRequest, HTTPOptions, Kerberos, LDAPSearchReq, RPCCheck, SSLSessionReq:
 27 |     cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}
 28 |   LPDString, RTSPRequest, SMBProgNeg, TLSSessionReq:
 29 |_    If you want your luck to hold, make sure you have the winning numbers.
 30 19/tcp open  chargen  Linux chargen
```

This identifies which ports are open, and becuase the protocol `port 17`uses wasn't recoginsed, also showed what return the command got. Now port 17 just happens to return the flag, so the challenge was over `cysea{y0uv3_n3773d_a_f0r7un3_c0n6ratul4tion5}`

But there was a separate continuation challenge called [Lottery ticket](./Lottery-ticket). I suggest reading that if you want to see some slightly more complex net stuff.
