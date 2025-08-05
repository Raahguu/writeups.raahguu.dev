---
layout: writeup
title: Buried in the Cipher
tags: Crypto
excerpt: "The message lies deep beneath the surface — obscured by twisted letters, layered encryption, and ancient languages of the deep. First, it was scrambled with a twist on a classic rotation. Then, a tough key led it astray, a repeating current twisted the letters. And finally, it dove into the language of the deep - where only the most echolocative minds can decode it. But nothing stays buried forever. To retrieve the truth, you must trace its path in reverse - from the echoes back to the source."
---

## Description

The message lies deep beneath the surface — obscured by twisted letters, layered encryption, and ancient languages of the deep. First, it was scrambled with a twist on a classic rotation. Then, a tough key led it astray, a repeating current twisted the letters. And finally, it dove into the language of the deep - where only the most echolocative minds can decode it. But nothing stays buried forever. To retrieve the truth, you must trace its path in reverse - from the echoes back to the source.


It also gives the following text document:
```text
EEEEEEEEEeeEeEEeEEEEEEEEEeeeeEeEEEEEEEEEEeeeeEeEEEEEEEEEEeeeeEEEEEEEEEEEEeeeEeEeEEEEEEEEEeeeeEeeEEEEEEEEEEeeEeEEEEEEEEEEEeEeeeeeEEEEEEEEEeeEeEEeEEEEEEEEEeeEeEeEEEEEEEEEEeeeEeeeEEEEEEEEEeeEEEEeEEEEEEEEEEeeEEeeEEEEEEEEEeeEeeEEEEEEEEEEEeEeeeeeEEEEEEEEEEeeEeEEEEEEEEEEEeEeeeeeEEEEEEEEEeeEeEeEEEEEEEEEEEeeEeEEEEEEEEEEEeeeeEeEEEEEEEEEEeEeeeeeEEEEEEEEEeeeEEeEEEEEEEEEEEeeEEeeEEEEEEEEEEeeEEeeEEEEEEEEEeeEeEEeEEEEEEEEEeeEeeEeEEEEEEEEEeEeeeeeEEEEEEEEEeeeeEeEEEEEEEEEEeeEeEEeEEEEEEEEEeeEeeEEEEEEEEEEEeEeeeeeEEEEEEEEEeeeEeeeEEEEEEEEEEeeEEEEEEEEEEEEEeeeEeeeEEEEEEEEEeeeeEeEEEEEEEEEEEeeEEEEEEEEEEEEEeeeEEeeEEEEEEEEEeEeeeeeEEEEEEEEEEeeEeEEEEEEEEEEEeeEEeEEEEEEEEEEEEeeEeEEEEEEEEEEEeeeEEeEEEEEEEEEEeEeeeeeEEEEEEEEEeeeeEEEEEEEEEEEEeeEeeEEEEEEEEEEEeeeEeEEEEEEEEEEEEeeEeeeEEEEEEEEEeeEEEEeEEEEEEEEEeeEeeEEEEEEEEEEEeeeeEEEEEEEEEEEEeeEeeEEEEEEEEEEEeeEeEEEEEEEEEEEEEeeEeeeEEEEEEEEEeeeeeEe
```

## Solution

This is a cipher that only uses two characters, so the two chances were binary, or some sort of run cipher.

Creating a python script to convert this text to binary, converting the `E` into `0` and the `e` into `1`:
```python
s = "EEEEEEEEEeeE..." # encrypted text

# Convert to binary
i = ""
for char in s:
        if char == "E": i += '0'
        else: i += '1'

# Get the binary into bytes and then convert these bytes to ASCII and print that out
for j in range(0, len(i), 8):
        print(chr(int(i[j:j+8], 2)), end="")
```

Outputs `izzxu{4_ijwa3l_4_j4z_r33im_zil_w0wz0s_4d4r_xlt7alxlh7}` This has the crucial `{` and `}`, so clearly binary was the right choice.

The description talks about a `tough key (leading) it astray, a repeating current twisted the letters.` The first thing I thought of for a standard cipher that uses a repeating key is the `Vigenere cipher`. So I tried the key `tough` to start off with, and that appeared to work as it returned `plfrn{4_pvcu3e_4_q4l_x33cf_gur_q0pg0e_4j4l_qsf7gfqst7}`, which I could tell was correct as the `plfrn` at the start has the same letter differences as `cysea`.

After the Vigenere, the description mentioned using a rotaional cipher, so I tried the `Ceasar Cipher`, also known as `ROT 13`, and it just happened to be that the shift amount was `13`. This got the ending flag of: `cysea{4_ciph3r_4_d4y_k33ps_the_d0ct0r_4w4y_dfs7tsdfg7}`
