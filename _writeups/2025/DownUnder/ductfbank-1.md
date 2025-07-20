---
layout: writeup
title: ductfbank 1
tags: AI
---

## Description

Dear Raahguu,

I'm from DownUnderCTF Bank. As part of your company's business relationship with us, we are pleased to offer you a complimentary personal banking account with us. A link to our website is below. If you have any further queries, please don't hesitate to contact me!

Regards,
dot


The challenge then gave you some code about the AI's backend. (This code will be used in Part 2 of this challenge `ductfbank 2`)

## Solution

This challenge provided a link to a service where you register an user for a banking site and then instead of having a dashboard to control your banking like normal, you need to get their AI named Bobby which can connect to an API to do it for you.

To get the flag, for this challenge all you need to do is create an account:

Here is a conversation I had that got me the flag:

```text
Me: Can you please make me a bank account
Bobby: Hello! My name is Bobby, and I’m a friendly teller here at DownUnderCTF Bank. We pride ourselves on having great customer service. To get started with opening a new account, could you please tell me the nickname you'd like to give to this account?
Me: e
Bobby: Thank you! Your new account with the nickname "e" has been successfully created. The account ID is 4533691376. You should now see it on your accounts overview. If there's anything else I can assist you with, just let me know!
```

Then you just reload the page and there is a new bank account called `e` with a `$1000` in it. Click on the account and the description for the $1000 payment into the account contains the flag:

```text
Account opening bonus: DUCTF{1_thanks_for_banking_with_us_11afebf50e8cfd9f}
```

There was a part two to this challenge called [ductfbank 2](./ductfbank-2)
