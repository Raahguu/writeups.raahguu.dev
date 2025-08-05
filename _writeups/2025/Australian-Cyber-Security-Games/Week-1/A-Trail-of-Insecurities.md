---
layout: writeup
title: A Trail of Insecurities
tags: Osint
excerpt: "These interns are going to be the end of me. How are we supposed to champion digital governance when they can't stop leaking things? First it was Ken’s offhand post on Bluesky that he made me sign up to... and who knows what else they’ve scattered online? Find out what they’ve let slip... before someone less responsible does."
---

## Description

These interns are going to be the end of me. How are we supposed to champion digital governance when they can't stop leaking things? First it was Ken’s offhand post on Bluesky that he made me sign up to... and who knows what else they’ve scattered online? Find out what they’ve let slip... before someone less responsible does.


`Alyssa Chen`

## Solution

#### Flag Part 1

With the clues of `Alyssa Chen`, `Bluesky`, and `Ken`: it was obvious that the first step was to find their bluesky accounts.

Some searching can get you the two accounts [Alyssa Chen Bluesky](https://bsky.app/profile/did:plc:eesdhh5iyadit247u3fiwenf) and [Ken Goodman Bluesky](https://bsky.app/profile/did:plc:vo4thn3yrsy5fxereaxb2qgn). 

The Alyssa Chen account does not have any public posts, so she is a dead end, but Ken has quite a few. The one that stood out was his latest post (at least at the time)

```text
The Centrist Union says they’re about balance, but there’s something off. No one ever disagrees. Meetings end on time. People say “both sides make valid points” like it’s gospel.

📸 Took this during a “spontaneous alignment moment.”
#Kenternship #ModerateMadness #StillMissVanessa
```

What really stood out about this post though was the attatched image
![Image of 6 coworkers at a table independently working on things](/assets/images/writeups_images/A-Trail-of-Insecurities/KenGoodmanPostPhoto.jpeg)

On the far away monitor in the photo is the first part of the flag `cysea{s3cur3`. 

#### Flag Part 2

on that same photo from before, on the closer monitor is what appears to be a github account that uses the same profile pic as `Ken Goodman`, so it is likely his Github Account. A bit of searching gets the account [Ken Goodman Github](https://github.com/kengoodman-cu).

This account has one repository, named `cu-website-draft` which seems promising, looking through the commits of this repository, in the `Added style guide and more website design` commit, in the `style.css` additions is an intresting comment

```css
...

h2 {
    flex: 30%;
    padding: 20px;
}


/* _y0ur_s3cr3ts */


footer {
    flex: 2;
    padding: 20px;
    text-align: center;
    background-color: #f1b9ec;
}

...
```

This comment of `_y0ur_s3cr3ts` seems to be a second part to the flag

#### Flag Part 3

In the final commit's index.html there is a video link which was added in the same commit as the README.md message `Add in a video of secret message`. This link is: [video link](https://www.canva.com/design/DAGqSzVswNM/n3okI37oRKhG8sjTsvSGTQ/watch?embed&autoplay=1&loop=1)

The video shows a bunch of squares after one another with different patterns within them, but is starts with a `_` and ends with a `}`, so this is clearly the flag encoded in some weird way.

Some research reveals that they are `international maritime flags` [wikipedia link that contains translation table](https://en.wikipedia.org/wiki/International_maritime_signal_flags)

These flags then end up creating the string `_sd6f4shf7}`

So all together the flag is: `cysea{s3cur3_y0ur_s3cr3ts_sd6f4shf7}`
