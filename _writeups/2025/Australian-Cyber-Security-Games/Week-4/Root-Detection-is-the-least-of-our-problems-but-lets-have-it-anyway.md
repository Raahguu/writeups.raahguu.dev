---
layout: writeup
title: Root Detection is the least of our problems but let's have it anyway
tags:
  - Mobile
  - Rev
excerpt: In an attempt to implement security best practices, the mobile developers has implemented a root detection mechanism. Can you identify all the binaries that they check for? The flag may or may not be in that list :)
---

As this challenge was the only one about reverse enginering the binary, I put the action of finding the domain that all the other challenges use within this writeup as well


## Description

In an attempt to implement security best practices, the mobile developers has implemented a root detection mechanism. Can you identify all the binaries that they check for? The flag may or may not be in that list :)


The challenge also provided a `.apk` file


## Solution

The first thing I did with the `.apk` was unzip it, as `.apk` files are really just renamed `.zip` files.

I then decompiled it back into java

```bash
$ d2j-dex2jar voting-app.apk        
dex2jar voting-app.apk -> ./voting-app-dex2jar.jar
Detail Error Information in File ./voting-app-error.zip
Please report this file to one of following link if possible (any one).
    https://sourceforge.net/p/dex2jar/tickets/
    https://bitbucket.org/pxb1988/dex2jar/issues
    https://github.com/pxb1988/dex2jar/issues
    dex2jar@googlegroups.com
```

Looking at the java files tells me some useful info, namely, that this is actually a react app, and as such I am not looking at the actual code as react apps are coded in javascript, not java. But we can find the compiled js code in `/assets/index.android.bundle`

```bash
$ file index.android.bundle
index.android.bundle: Hermes JavaScript bytecode, version 96
```

And this tells us that the code is compiled in `Hermes version 96` so I decompiled it using an opensource tool by p1-mmr [Hermes-dec](https://github.com/P1sec/hermes-dec)

decompiling it gets me some horrid js code that is all one big switch case statement. But grepping through this for any `freedonia.vote` subdomains shows some results

```bash
$ grep -E "https?://.*freedonia.vote" decompiledreact
        r4 = 'http://mobile-app.commission.freedonia.vote';
```

This gets us the domain that we need to use for all the other challenges in week 4 of this ctf `http://mobile-app.commission.freedonia.vote`

Next, its time to get the flag for this challenge.

Researching up on how andorid apps detect if they are being run in a root environment returns a few results. The most common ways seem to be about searching if certain files exist on the device. namely `/system/app/Superuser.apk`, `/system/xbin/su`, and `system/bin/su` were the most common files looked for. So lets see if these paths exist in the decompiled code

```bash
$ grep -E "/system/app/Superuser.apk" decompiledreact
        r3 = ['/system/of/a/down/su', '/oops/system/bin/su', '/oops/system/xbin/su', '/oops/sbin/su', '/oops/system/su', '/oops/vendor/bin/su', '/oops/system/app/Superuser.apk', '/oops/system/app/SuperSU.apk', '/oops/system/xbin/which', '/oops/data/local/xbin/su', '/oops/data/local/bin/su', '/oops/system/sd/xbin/su', '/oops/system/bin/failsafe/su', 'Y3lzZWF7dWhfdGhpc19haW50X2FfYmluYXJ5X2J1dF9oZXJlJ3NfYV9mbGFnX2M4YWRmYmZmY2R9Cg=='];
```

And that grep gets us, that all three of the common ones I found, and most of the others I found are alos in that list. Along with there being what I believe is a `System of a Down` reference with the `/system/of/a/down/su`

But anyway there is a suspicious base64 code in here which when decoded gets:

```bash
$ echo "Y3lzZWF7dWhfdGhpc19haW50X2FfYmluYXJ5X2J1dF9oZXJlJ3NfYV9mbGFnX2M4YWRmYmZmY2R9Cg==" | base64 -d
cysea{uh_this_aint_a_binary_but_here's_a_flag_c8adfbffcd}
```

There is the flag `cysea{uh_this_aint_a_binary_but_here's_a_flag_c8adfbffcd}`
