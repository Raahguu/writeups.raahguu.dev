---
layout: writeup
title: Early Voting App v1
tags: WebX
---

## Description

Hey everyone! We're Beta testing this new web application we're going to deploy to our voters to potentially replace our mail in voting system.

Ok fine, maybe its more in the alpha stage, but we're quite excited about this one! Feel free to give it a go with the example user.

We've implemented some logic for when a candidate wins by getting all the votes, but... that shouldn't be possible with only one user anyways.

`http:/redac.ted/`



## Solution

The website starts off with a login page that gives us default credentials on it.

![Photo of the Login Page that gives login credentials `bob:s3cur3p@ss`](/assets/images/writeups_images/Early-Voting-System-v1/1.png)

We then get a page that displays a poll of all voting results

![Photo of the poll of voting results](/assets/images/writeups_images/Early-Voting-System-v1/2.png)

When editing Bob's profile to change his vote, the url is:

```text
http://redac.ted/edit_profile.php?user_id=2
```

This looks suspicous, so I changed the `user_id` to 1, and presto I got alice's profile.

![Image of Alice's profile page where we can change here vote](/assets/images/writeups_images/Early-Voting-System-v1/3.png)

So with how the description hints how something happens when someone gets all the votes, I set all user's to vote for `Elira Voss` 

That is the user ids of `1` `2` and `3`

This then results in the main page looking like this

![Image of the poll results after changing everyone to vote for Elira Voss, this results in the flag being displayed](/assets/images/writeups_images/Early-Voting-System-v1/4.png)

And there is the flag: `secedu{w0aw_dud3_th@t5_iD0r_4_ya_aa9s8}`
