---
layout: writeup
title: Jam Session
tags: Osint
excerpt: "I love a good public playlist. It's the perfect way to get the union working together effectively. Wanna take a listen?"
---

## Description

I love a good public playlist. It's the perfect way to get the union working together effectively. Wanna take a listen?


https://open.spotify.com/user/31qjibwognhzydlhnkt4ths2aaze

Note: Flag is case insensitive.


## Solution

Going to the spotify link takes you to one `Ken Goodman`'s spotify profile. He has three playlists public: `I'm Just Ken`, which is just the song `I'm Just Ken`; `Centrist Union Jams` which looks suspicious; and `Literally The Entire Bee Movie Script`.

Looking at the Bee move script album, it can be seen that that is just the bee movie script, word for word.

Looking at the suspicious `Centrist Union Jams` playlist, gets 19 songs:
```text
Cruel Summer - Taylor Swift
Your Love is My Drug - Kesha
Sapphire - Ed Sheeran
Espresso - Sabrina Carpenter
All The Starts (with SZA) - From "Bl... - Kendrick Lamar, SZA
{His Transmission} - Aaron Cherof
Sorry I'm Here For Someone Else - Benson Boone
Pink Pony Club - Chappel Roan
On The Floor - Jennifer Lopez, Pitbull
Opps!...I Did It Again - Britney Spears
Feel It (From "Invincible") - d4vd
You Belong With Me (Taylor's Vers... - Taylor Swift
Gnarly - KATSEYE
Obsessed - Mariah Carey
ocean eyes - Billie Eilish
Feel So Close - Radio Edit - Calvin Haris
I'm Just Ken - Ryan Gosling
No Diggity - Blackstreet, Dr. Dre, Queen Pen
} - Phoria Peaks
```

As you might have noticed the flag is the first character of each song: `cysea{spoofygoofin}`
