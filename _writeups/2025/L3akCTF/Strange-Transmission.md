---
layout: writeup
title: Strange Transmission
tags: Hardware-RF
excerpt: "I received this strange transmission and I'm not sure what to make of it! Weird beeps, static noise, then silence. Can you help me figure out what it all means?"
---

## Description

I received this strange transmission and I'm not sure what to make of it! Weird beeps, static noise, then silence. Can you help me figure out what it all means?

Author: Suvoni

The challenge then also provided a .wav file.

## Solution

Listening to the file reveals a bunch of beeps, that sounds like morse code. I at first listened to the more code and noted it down myself, I only wrote part of it, here is what I got

```text
--- .... .-. --- .-- -.-- --- ..- ..-. --- ..- .- -.. --- ..- .-. ... . ..-. .-. . - -- --- .-. ... . -.-. --- -.. .
```

I translated this and got:

```text
Ohrowyoufouadoursefretmorsecode

# Which with some cleaning it, I assumed meant

Oh wow you found our secret morse code
```

This proved to me that the transimssion, was definitely more code, and that I am not good at writing down morsecode, granted this was written down on the first listen, but I didn't want to spend a bunch of time, writing incorrect morse code, especially with how if the flag is incorrect it won't be accepted.

So I opened up the file in `Audacity` to view the `spectrogram`, this allowed me to visually see the morse code rather then having to listen to it. Note, I did need to slow down the speed of the wav file to about 10%.

![Spectrogram of a Wav file that shows dots and dashes, and also has embedded text at the end](/assets/images/writeups_images/Strange-Transmission/full.png)

This image also shows that there is an image that contains text that has been embeded into the spectrogram.

Here is a close up of some morsecode so you can see what I read:

![Some morse code in a wav file shown through the spectrogram](/assets/images/writeups_images/Strange-Transmission/morse.png)

And here is a closeup of that text at the end of the spectrogram, slowed down to 10% speed, so that text is legible.

![Hidden text that was at the end of the spetrogram, that says `c4teg0ry_w3_h0p3_you_h4ve_fun!}`](/assets/images/writeups_images/Strange-Transmission/Stegmessage.png)

This text reveals what appears to be the ending half of the flag

```text
c4teg0ry_w3_h0p3_you_h4ve_fun!}
```

So my guess was that the first half of the flag must be contained within the morse. Here is the morse code in its entirety, this uses a space between letters, and a '/' between words. The difference between letters vs. words was told from the morse code, by the space bewteen the characters. This is the standard for morse code which has very strict rules about the lengths of time in your message.

You can think of morse code as if it acts to a metronome, all the rules are in terms of beats:
One Beat long sound  = a dot '.'
Three Beats long sound = a dash '-'
One Beat of silence = the space between dots and dashes within a letter
Three Beats of silence = the space between letters
Seven Beats of silence = the space between words

```text
--- ... / .-- --- .-- / -.-- --- ..- / ..-. --- ..- -. -.. / --- ..- .-. / ... . -.-. .-. . - /
-- --- .-. ... . / -.-. --- -.. . / .- ..- -.. .. --- / .-- . .-.. .-.. / -.. --- -. . / .... . .-. . /
.. ... / - .... . / ..-. .. .-. ... - / .... .- .-.. ..-. / --- ..-. / - .... . / ..-. .-.. .- --. /
.-.. ...-- .- -.- / --- .--. . -. / -... .-. .- -.-. -.- . - / .-- . .-.. -.-. ----- -- ...-- /
..- -. -.. . .-. ... -.-. --- .-. . / . ----- / ..- -. -.. . .-. ... -.-. --- .-. . / - .... ...-- /
..- -. -.. . .-. ... -.-. --- .-. . / .... ....- .-. -.. .-- ....- .-. ...-- / ..- -. -.. . .-. ... -.-. --- .-. . /
.-. ..-. / ..- -. -.. . .-. ... -.-. --- .-. .
```

If you want to translate it yourself, here is a chart that shows the morse code to english mapping

![Chart that displays a mapping/how to translate from morse code to english letters or vice versa](/assets/images/writeups_images/Strange-Transmission/morseCodeChart.png)

The translated message ending up being (avert your eyes if you don't want spoilers!!)

```text
oh wow you found our secret morse code audio well done here is the first half of the flag 
l3ak open bracket welc0m3 underscore t0 underscore th3 underscore h4rdw4r3 underscore rf underscore
```

Translating the text into the proper flag format gets the first half of the flag:

```text
l3ak{welc0m3_t0_th3_h4rdw4r3_rf_
```

Joining this with the second half (which if you remember was hidden at the end of the spectrogram) gets us the full flag:

```text
l3ak{welc0m3_t0_th3_h4rdw4r3_rf_c4teg0ry_w3_h0p3_you_h4ve_fun!}
```
