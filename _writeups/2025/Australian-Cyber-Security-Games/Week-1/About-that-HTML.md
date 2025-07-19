---
layout: writeup
title: About That HTML
tags: WebX
---

## Description

A certain politician has been talking a lot about transparency lately but we all know that's just for the cameras. What's really going on behind the scenes? I wonder if there's some source of truth in their campaign page... https://alliance.freedonia.vote/

## Solution

This a very basic challenge, in order to solve all you need to do is go to the source code of the website and there as a comment is the code

```html
...
<div class="main" id="main">
        <!---cysea{H1dd3n_1n_Pl41n_51gh7}-->
        <h2>ABOUT</h2>
        <p>
		...
```
