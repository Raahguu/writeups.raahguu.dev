---
layout: writeup
title: hashcrack
tags: Crypto
excerpt: "A company stored a secret message on a server which got breached due to the admin using weakly hashed passwords. Can you gain access to the secret stored within the server?"
---

## Description

A company stored a secret message on a server which got breached due to the admin using weakly hashed passwords. Can you gain access to the secret stored within the server? Access the server using nc verbal-sleep.picoctf.net 57192


## Solution

nc'ing the server gets you

```bash
$ nc verbal-sleep.picoctf.net 57192
Welcome!! Looking For the Secret?

We have identified a hash: 482c811da5d5b4bc6d497ffa98491e38 # A hash to crack
Enter the password for identified hash:
```

In order to crack the hash, I just inputed it into [Crack Station](https://crackstation.net/), and then the hash was cracked within about a second, it was an `MD5` hash of `password`. So lets continue with the nc

```bash
$ nc verbal-sleep.picoctf.net 57192
Welcome!! Looking For the Secret?

We have identified a hash: 482c811da5d5b4bc6d497ffa98491e38 # Hash we just cracked
Enter the password for identified hash: password123		 # Password we just got
Correct! You've cracked the MD5 hash with no secret found!

Flag is yet to be revealed!! Crack this hash: b7a875fc1ea228b9061041b7cec4bd3c52ab3ce3 # A new hash to crack
Enter the password for the identified hash:
```

We need to do it again, I used [Crack Station](https://crackstation.net/) again, and got that it was a `SHA-1` hash of `letmein`, lets continue

```bash
$ nc verbal-sleep.picoctf.net 57192

...

Flag is yet to be revealed!! Crack this hash: b7a875fc1ea228b9061041b7cec4bd3c52ab3ce3 # Hash we just cracked
Enter the password for the identified hash: letmein			# This is the password we just got
Correct! You've cracked the SHA-1 hash with no secret found!

Almost there!! Crack this hash: 916e8c4f79b25028c9e467f1eb8eee6d6bbdff965f9928310ad30a8d88697745 # A new hash to crack
Enter the password for the identified hash:
```

You know the drill, into [Crack Station](https://crackstation.net/), it is a `SHA-256` hash of `qwerty098`, lets continue

```bash
$ nc verbal-sleep.picoctf.net 57192

...

Almost there!! Crack this hash: 916e8c4f79b25028c9e467f1eb8eee6d6bbdff965f9928310ad30a8d88697745 # Hash we just cracked
Enter the password for the identified hash: qwerty098	 # Passwword we just got
Correct! You've cracked the SHA-256 hash with a secret found. 
The flag is: picoCTF{UseStr0nG_h@shEs_&PaSswDs!_29028be8} # The flag
```

And finally, after cracking three different hashes of three different types we get the flag `picoCTF{UseStr0nG_h@shEs_&PaSswDs!_29028be8}`
