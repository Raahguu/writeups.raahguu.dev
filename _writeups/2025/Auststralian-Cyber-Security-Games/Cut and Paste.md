---
layout: writeup
tags: Osint
---

## Description

A confidential memo from Governor Henrik Stahl of the National Renewal Party has surfaced just before the election. It appears routine but investigators believe crucial data is hidden within. The memo references an earlier operation involving a mid-April strategy drop, which may still be accessible. Your task, if you choose to accept it is to uncover and reconstruct the full flag, hidden across multiple layers of this document and one external source.

The challenge then gives you the pdf file [memo.pdf](/assets/files/cutAndPasteMemo.pdf)

## Solution

#### Flag Part 1
Running a quick strings gets
```text
$ strings memo.pdf
...
<</Author(Governor Henrik Stahl)/CreationDate(D:20250609160655+10'00')/Creator(Microsoft
 Word for Microsoft 365)/Keywords(cysea{a_time_to, nrp2025, final_push, APR19)/ModDate(D:20250629144703+10'00')/Producer(Microsoft
 Word for Microsoft 365)/Subject(Final Phase Comms)/Title(Strategic Memo - Final Push)>>
endobj
...
```

This contains the first part of a flag `cysea{a_time_to`

#### Flag Part 2

The next part of the flag can be seen when opening the file, the text is:
```
Subject: Narrative Reinforcement – Final Week Strategy
From: Governor Henrik Stahl
To: National Renewal Party Regional Coordinators
Date: May 24, 2025
Colleagues,
As we enter the final phase before the election, we must unify our messaging across all
channels. Push our core theme: "Tradition, Responsibility, Prosperity."
Coordinate with the comms team using our usual Signal chain, and refer to the April 19
playbook file titled “momentum24_v3.pdf.”
Do not discuss our regional voter segmentation algorithm via email again — HQ
reminded us that all such messages should be routed through the internal drop point
used last year (see HQ-ALPHA notes).
Be_alive_ to opportunities, and let’s move forward with confidence.
Governor Stahl
```

This shows the second part of the flag `be_alive_`. Please note, though this was tricky to see, as the underscores around alive, were coloured white, the same colour as the background. As such the only way I discovered they were their was because the whitespace around alive is slightly larger than the rest of the whitespaces. (As can be seen if you download the pdf)


#### Flag Part 3

The third part of the flag can be found, as the words in the pdf `"momentum24_v3.pdf."` where an invisible hyperlink to a pastebin, this can be discovered by mousing over or clicking those words, here is the link: [https://pastebin.com/1MptDBdM](https://pastebin.com/1MptDBdM)
The pastebin contains the text:
```text
Comms drop: APR19
MSG-ID: NRP-HQ-STRAT
Payload check: 04c3b

memo_quote: 4klbn56} && pushhard2025
```

This pastebin contains the third part of the flag `4klbn56}`

Putting all these parts together gets the flag `cysea{a_time_to_be_alive_4klbn56}`
