---
layout: writeup
title: The Soldier of God, Rick
tags:
  - WebX
  - Rev
excrpt: Can you defeat the Soldier of God, Rick? - dimas
---
## Description
Can you defeat the Soldier of God, Rick? - dimas

This challenge gave a compiled go binary which was an HTTP server to play a small webgame.

## Disclaimer
This writeup did not use Generative AI to write or to aid in the writing of it, and the solution to this CTF challenge was not found using or aided by the use of Generative AI

## Solution
The challenge linked multiple tools that would help with the solving of this challenge, the tools it linked were:
-  [Ghidra](https://github.com/NationalSecurityAgency/ghidra)
- [Ghidra Goland Extension](https://github.com/mooncat-greenpy/Ghidra_GolangAnalyzerExtension) - an extension so that Ghidra, can decompile golang binaries
- [IDA](https://hex-rays.com/ida-pro)
- [go_embeded_extractor.py](https://github.com/dimasma0305/Go-Embed-Extractor) - a python script that extracts embeded files from golang binaries made by `dimasma0305`
- [Burp Suite](https://portswigger.net/burp)

So I downloaded the `go_embeded_extractor.py` script, and extracted the files embedded within.
These were the files:
```bash
$ tree .   
.
|--static
|	  |--rick_soldier_sprite.png
|	  L--style.css
|
L--templates
      L--index.html
```
(Yes I made that because the special symbols `tree` uses were showing up as their unicode codes)

The files were a normal image, a `.css` file, and a `index.html` file, these files didn't reveal anything, but there is a hidden file, namely `.env`:
```bash
$ cat .env          
SECRET_PHRASE=Morty_Is_The_Real_One
```

This looks like a hint for later.


Next, I installed the ghidra `golang` extension and this allowed me to see that first off, there were multiple files in this project, the ones created by the user seemed to be the ones in the `/app` folder
- /app/router/handler.go
- /app/main.go
- /app/interactor/game_logic.go
- /app/entity/game_state.go
![](/assets/images/writeups_images/2026/C2C-qualifiers/Rick/1.png)



Analysing at the `main.main` function revealed the main loop of the game:
1. There is an enemy called `Rick, soldier of God`
2. Rick is `invincible`
3. Rick has `0xf423f000f423f` health which is a lot
4. The main character is called `Tarnished` (Dark souls Reference?)
5. It is just a standard HTTP server
6. There is a route at `/` (probably the `index`)
7. There is a route `/fight` (probably where you fight Rick)
8. There is a route at `/internal/offer-runes` (looks promising)

I then looked at the functions, and luckily all the relevant functions start `rick/` so they were all grouped together

The functions are (not including wrappers that do anything meanigful):
- rick/entity.IsDead
- rick/entity.Scout
- rick/router.BattleView.Secret
- rick/router.BattleView.String
- rick/router.Handler.Fight
- rick/router.Handler.Index
- rick/router.Handler.InternalOfferRunes
- rick/router.Hanlder.renderTemplate

Looking at these one by one they form a full picture:

#### Is Dead
The code doesn't decompile, but it isn't too much of a stretch to think it outs true or false for if Rick is dead

#### Scout
Preforms an `HTTP Get` request

#### Secret
Doesn't decompile properly except for a check if Rick's HP is less then 1, so likely we get the flag from it after Rick is dead

#### String
Returns Rick's current stats in a string format, likely this is the standard for golang for type conversion to a string

#### Fight
Grabs a form value submitted to it called `secret` and checks it against a value, if it is incorrect it throws an error for the user saying `You are not worthy. The Golden Order rejects your entry.`

Afterwards it grabs another form value called `battle_cry`, it then parses that as an HTML template, calling `html/template.Parse` on it, so that looks like a possible SSTI vulnerability.

If there is an error in your `battle_cry` when it gets parsed, that gets passed on, so it won't be blind injection

Then the parsed `battle_cry` is concatenated into a string, which is then executed as a template and returned to the user.

So that is an SSTI vulnerability

#### Index
It just renders `templates/index.html`

#### Internal Offer Runes
This appears to have some sort of check to ensure connections to it are internally only ( I don't know how that works)

It then called `url.Values.Get` on a string called `amount` which seems to mean that a value called `amount` can be passed to it like `/internal/offer-runes?amount=17`

Amount is converted to an integer, and is checked if it is above 0, before it is set to be Rick's Health.

But, when assigning it to rick's health, it gets converted into an `int4`, from a `long`, so as there are no checks against it it seems possible to cause an integer overflow by giving Rick a very large amount of health and that overflowing into negative health, meaning he is now Dead

### Time to try out the program
Creating an instance and going to it on the index page you can enter a `Secret` and a `Battle Cry`.
![](/assets/images/writeups_images/2026/C2C-qualifiers/Rick/2.png)

Passing in the environment variable from before:
```bash
$ cat .env          
SECRET_PHRASE=Morty_Is_The_Real_One
```

as the `Secret Key` and then trying for SSTI just `{{ . }}` as the `Battle Cry`
![](/assets/images/writeups_images/2026/C2C-qualifiers/Rick/3.png)

That ended up outputing the return of `rick/router.String`

Now that SSTI is confirmed, time to defeat Rick.

To defeat him we need to set his health to a negative number from `offer-runes`, but `offer-runes` only accepts internal requests, luckily `Scout` sends a Get request that would be internal, so we need to call scout and pass in the url for `offer-runes` with an `amount` that would cause an `int4` overflow,  which as it is `32` bits (`4` bytes = `32` bits) would be `2 147 483 648`

```txt
Battle Cry: 
{{ .Rick.Scout "http://localhost:8080/internal/offer-runes?amount=2147483648"}}
```

The port number is `8080` becuase `main.main` reveals that internally the service runs on port `8080` even if externally the port is different.

This request then reveals something:
![](/assets/images/writeups_images/2026/C2C-qualifiers/Rick/4.png)

The request worked, his health overflowed and we got the flag
```flag
C2C{R1ck_S0ld13r_0f_G0d_H4s_F4ll3n_v14_SST1_SSR7_0bde139b9baf}
```
