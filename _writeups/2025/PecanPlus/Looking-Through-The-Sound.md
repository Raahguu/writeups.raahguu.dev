---
layout: writeup
title: Looking through the Sound
tags: Steg
excerpt: "Not every message rides the waves of sound. You'll have to *look* through the noise. Let your eyes do the listening, and let the music spell it out for you. Note: You do *not* need to listen to the audio to do this challenge."
---

## Description

Not every message rides the waves of sound. You'll have to *look* through the noise. Let your eyes do the listening, and let the music spell it out for you. Note: You do *not* need to listen to the audio to do this challenge.


## Writeup

As always, when you download a stenography file, try checking the exif/meta data. For this I used `exiftool`. You can do this using a command like:

Once you run this you get an output along the lines of:

This reveals nothing special about the file except the comment which appears to be a hint:

This hint in viewing the data in a different 'way' likely refers to in a different format. This along with the part of the description that says `You’ll have to *look* through the noise.`, suggests that you need to view the .wav file in a method that shows the data visually rather then listening to it in some way.

Researching up, the two main ways to visually view audio files is through waveform and spectogram.
Opening up `Audacity` with the file as a waveform shows:

![Screenshot 2025-05-01 192152](/assets/images/writeups_images/2025/PecanPlus/LookingThroughTheSound/1.png)

That didn't work so let's try the spectogram:

![Screenshot 2025-05-01 192515](/assets/images/writeups_images/2025/PecanPlus/LookingThroughTheSound/2.png)

And from this we have the flag, just need to type it out!
