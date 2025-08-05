---
layout: writeup
title: Beneath the Surface
tags: Hardware-RF
excerpt: "On the surface, this signal is nothing but meaningless noise — a mere whisper of the wind. But dive deeper into this transmission, and a storm begins to take shape, with gray skies gathering on the horizon. Can you navigate through the static and uncover what lurks beneath the surface of the wav — before it’s too late?"
---

## Description

On the surface, this signal is nothing but meaningless noise — a mere whisper of the wind. But dive deeper into this transmission, and a storm begins to take shape, with gray skies gathering on the horizon. Can you navigate through the static and uncover what lurks beneath the surface of the wav — before it’s too late?

Author: Suvoni


The challenge then gave a .wav file that was 6.1Mb.

## Soltuion

Listening to the file, it seems like a bunch of random tones, but it also reminded me of the sounds fax machines and the like make. I started by running an exif on the file:

```text
$ exiftool beneath_the_surface.wav
ExifTool Version Number         : 13.25
File Name                       : beneath_the_surface.wav
Directory                       : .
File Size                       : 6.3 MB
File Modification Date/Time     : 2025:07:11 18:48:18+08:00
File Access Date/Time           : 2025:07:13 14:44:50+08:00
File Inode Change Date/Time     : 2025:07:13 14:44:43+08:00
File Permissions                : -rw-rw-r--
File Type                       : WAV
File Type Extension             : wav
MIME Type                       : audio/x-wav
Encoding                        : Microsoft PCM
Num Channels                    : 1
Sample Rate                     : 8000
Avg Bytes Per Sec               : 16000
Bits Per Sample                 : 16
Title                           : Generated audio
Software                        : fldigi-4.2.07 (libsndfile-1.0.28)
Comment                         : WEFAX576 freq=14011.900
Date Created                    : 2025:07:11T10:21:36z
Duration                        : 0:06:35
```

This shows something very intresting, the three parts that seemed valuable were `Title`, `Software`, and `Comment`. They say that the sound was `generated`, that the software used to make it was `fldigi`, and that it uses `WEFAX576 freq=14011.900` as the encryption method.

Searching up `WEFAX576` gets me that it is anlso called `Weatherfax`, or `Radiofax`. It is a way to transmit weather forcats or maps in the form of images, this immediately sparked my intrest, as it seems that the `.wav` file is actuall an image being stored as sound.

So I downloaded `fldigi` and used it to decrypt the message, here's how you do it.

1. Download fldigi, I cant help you here as I don't know your OS
2. Open it up and up the top click `Op Mode`, then `WEFAX`, and finally `WEFAX-IOC576`. This tells fldigi to decrypt your file as a WEFAX576 transmission.
![Image of fldigi GUI, where the menu `Op Mode` has been selected, then `WEFAX`, showing the `WEFAX-IOC576` option](/assets/images/writeups_images/Beneath-the-Surface/WEFAX-IOC576.png)

3. Click `file`, `Audio`, and then `playback`
![Image of fldigi GUI where the menu `file` and then the submenu `Audio` have been selected in order to show the `playback` option](/assets/images/writeups_images/Beneath-the-Surface/playback.png)

4. In the new window, select the WEFAX file. You can then click yes to looping if you want, anyway, after the audio file is over the image will disappear
5. Wait about 6 minutes for the image to be drawn, it should be drawn pixel by pixel left to right top to bottom, so the entire top row is drawn left to right, then the next row down, and the next row down etc.

6. There's your flag
![Image of the transmitted image that contains the flag in diagonal text accross it](/assets/images/writeups_images/Beneath-the-Surface/transmitted_image.png)

And thats you done. The final flag was `L3AK{R4diOF4X_1S_G00d_4_ImAG3_Tr4nsM1sSiON}`
