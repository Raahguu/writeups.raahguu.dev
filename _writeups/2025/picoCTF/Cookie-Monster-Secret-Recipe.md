---
layout: writeup
title: Cookie Monster Secret Recipe
tags: WebX
---

## Description

Cookie Monster has hidden his top-secret cookie recipe somewhere on his website. As an aspiring cookie detective, your mission is to uncover this delectable secret. Can you outsmart Cookie Monster and find the hidden recipe? You can access the Cookie Monster [here](http://verbal-sleep.picoctf.net:56241/) and good luck

## Solution

The title of `Cookie Monster` and the number of times it says `cookie` in this description is a pretty big giveaway that the challenge is likely something to do with cookies. Going to the site greets you with a login form.

I enter the credentials of Username: `admin`, Password: `admin`. This takes you to a page with the text

```text
Access Denied

Cookie Monster says: 'Me no need password. Me just need cookies!'

Hint: Have you checked your cookies lately?
Go back
```

Looking at the cookies in my browser, I can see a cookie called `secret_recipe`, which is also part of the challenges name so this is clearly the cookie, and the value of the cookie is `cGljb0NURntjMDBrMWVfbTBuc3Rlcl9sMHZlc19jMDBraWVzXzZDMkZCN0YzfQ%3D%3D`. This appears to be a url encoded Base64 code. This can be guessed by the code which contains uppercase, lowercase, and numbers along with the two `%3D`s at the end, these are url encoded `=` signs which appear commonly at the end of a Base64 code as a signature of sorts identifing the text as Base64.

Throwing the code into [CyberChef](https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false%29&input=Y0dsamIwTlVSbnRqTURCck1XVmZiVEJ1YzNSbGNsOXNNSFpsYzE5ak1EQnJhV1Z6WHpaRE1rWkNOMFl6ZlE&oeol=CR) to convert back from Base64 returns the flag.

The flag is `picoCTF{c00k1e_m0nster_l0ves_c00kies_6C2FB7F3}`
