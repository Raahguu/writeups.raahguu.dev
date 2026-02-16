---
layout: writeup
title: Xanarto
tags:
  - Rev
  - Osint
---

## Description

I found this guy on LinkedIn who claimed to have created an uncrackable algorithm. Prove him wrong. I have attached the post in an image.


## Writeup
The challange gives you a photo of a LinkedIn post, and you need to find the post first off.
![I have created an unbreakable code using my own encryption algorithm that you will never crack. '〈䕒峔嚶冪䒪䗺𪂪婂➸偔嗬㐂䏤寚☰𴲐' Go peasants, I will watch you flounder about as you attempt to solve even the simplest of problems. For I am Xanarto, programmer extrordanaire, and second to none.](assets/images/writeups_images/2025/PecanPlus/Xanarto/1.png)

By searching up `site:linkedin.com Xanarto`, the posters account comes up on linkedin.

looking at their linkedin, they link their github:

```
Github: https://github.com/Xanarto
```

Going to `all posts` gets you the encrypted message:

```
〈䕒峔嚶冪䒪䗺𪂪婂➸偔嗬㐂䏤寚☰𴲐
```

After this, there seems to be nothing else of import to find on linkedin.

So time to look at that Github link:

![There are four repos `ColoursClass` `HELPDebtCalculator` `UnitConverters` `HomemadeEncryptionAlgorithm`](assets/images/writeups_images/2025/PecanPlus/Xanarto/2.png)
Of the account's four repos, `HomemadeEncryptionAlgorithim` looks the most promising

The README.md file, mentions no one ever being able to break the ecnryption, which leads to more likely hood that this is teh encryption algorithim used. And, looking at the algorithim, it appears to do some math calcualtions on the Unicode values of characters, and then converts those back into unicode characters, which would explain why the encrypted message is made of weird unicode charcters.

The code for this encryption algorithim is:

```
import base64

_test_message = "Xanarto's_0wn_C1ph3r_T0_3ncrypt_Stuff_H1ms3lf!,.EH7sg"

def encrypt(message : str):
    z = ([ord("z")] + [ord(str(x)) for x in base64.b64encode(message.encode('utf-8')).decode('utf-8')])[::-1]
    return "".join(map(str,[chr(x * 2) for x in [int(str(x) + str(y)) for (x,y) in (zip(z[::2], z[1::2]))]]))

if __main__ == "__name__":
    print(encrypt(test_message))
```

With some deobfuscation this becomes:
```
import base64

_test_message = "Xanarto's_0wn_C1ph3r_T0_3ncrypt_Stuff_H1ms3lf!,.EH7sg"

def encrypt(message : str):
    #convert to base64
    base64_encrypted_message = str(base64.b64encode(message.encode('utf-8')).decode('utf-8'))
    
    ASCII_representation_of_enc = []
    for char in base64_encrypted_message:
        ASCII_representation_of_enc += ord(char)
        
    ASCII_representation_of_enc += [ord("z")]
    
    ASCII_representation_of_enc[::-1]
    
    encrypted_list = []
    concat_enc = [int(str(x) + str(y)) for (x,y) in (zip(ASCII_representation_of_enc[::2], ASCII_representation_of_enc[1::2]))]
    
    for char in concat_enc:
        encrypted_list += [chr(char * 2)]
    
    return "".join(encrypted_list)

print(encrypt(test_message))
```


Time to reverse:

```
enc_message = '〈䕒峔嚶冪䒪䗺𪂪婂➸偔嗬㐂䏤寚☰𴲐㠤'

def decrypt(enc: str):
    enc_list = list(enc)
    
    concat_enc = []
    for char in enc_list:
        concat_enc += [ord(char) // 2]
    print(concat_enc)

decrypt(enc_message)
```

Running this, prints out:

```
[6148, 8873, 11882, 11099, 10453, 8789, 8957, 86101, 11553, 5084, 10282, 10998, 6657, 8690, 11757, 4888, 108104, 7186]
```

This would be extremely hard to take as an input and then intelligently de concatonat, based off length, so lets do it by hand.
We know that the flag is enrypted in base64, so the Unicode values each charcter can be range from 48, to 122.
With this knowledge, unconcating by hand is easy. We get:

```
[61, 48, 88, 73, 118, 82, 110, 99, 104, 53, 87, 89, 89, 57, 86, 101, 115, 53, 50, 84, 102, 82, 109, 98, 66, 57, 86, 90, 117, 57, 48, 88, 108, 104, 71, 86]
```

just converting this into unicode and reversing the order gets `VGhlX09uZV9BbmRfT25seV9YYW5hcnRvIX0=`.
Converting this from base64, gets you `The_One_And_Only_Xanarto!}`.

This appears to be the second half to a flag. Back to OSINT.
Looking at the other Github Repos of this user reveals nothing, and the linkedin posts don't either. But, the `HomemadeEncryptionAlgorithim` repo has 8 commits, which is slightly suspicous. Looking at them reveals a `Removed confidential info` commit.
![6 commits `Update README.md` `Fixed importing issues` `removed confidential info` `Small edits` `The Actual algorithm` `Initial commit`](assets/images/writeups_images/2025/PecanPlus/Xanarto/3.png)

Looking at this commit, reveals what appears to be the first half of the flag `pecan{The_Xanarto`.
Making the final flag `pecan{The_XanartoThe_One_And_Only_Xanarto!}`
