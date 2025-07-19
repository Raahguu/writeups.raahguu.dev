---
layout: writeup
title: SSTI1
tags: WebX
---

## Description

I made a cool website where you can announce whatever you want! Try it out! I heard templating is a cool and modular way to build web apps! Check out my website here!

The challenge is then a website, where there is a text box that you can type into, anything that you submit in the form with the text box is then shown on a new page.

## Solution

### First glance

The challenge is called `SSTI`, which seems like a hint, but at first, lets just try some `XSS`. Inputing `<button>yes</button>` does return a webpage with just this code:

```html
<html>
	<head></head>
	<body>
		<h1 style="font-size:100px;" align="center"><button>yes</button></h1>
	</body>
</html>
```

So the input is vulnerable to `XSS` attacks, but where these attacks really shine is when you can get info your not supposed to, from other users. But on the initial Home page it seems there is some small text down in the bottom left

```text
*Announcements may only reach yourself
```

This seems to hint to the user that `XSS` will not be a viable option for this challenge, even if it is not protected against. So onto that strange title `SSTI`.

### SSTI

{% raw %}

SSTI, stands for `Server Side Template Injection`, it is making use of how when a dynamic webpage is loaded from a template using `jnija2`, `Twig`, `Freemaker` or some other templating tool, that any text within double curly braces is exectued like code. e.g. `{{ 7 * 7 }}` or `${ 7 * 7}` would be evaluated to `49` depending on which language they are using.

A way to test if something is vulnerable to this is to just input some arbitrary code that is language-agnostic e.g. it works in any language. A good example is `{{ 7 * 7 }}`, if the site is protected against SSTI then the text `{{ 7 * 7 }}` will be returned, but if it is not protected, it will evaulate to `49`.

Low and behold, when `{{ 7 * 7 }}` is input into the form, the reply is `49`. This proves, that SSTI is a possible route, which could mean that we can do RCE to get into the servers files.

The next step after determining that SSTI can be done, is figuring out what templating language the server uses, this is done by inputting commands that would have different outputs in different languages. Luckily, some else has already created a simple way to test what language the server might be using. Thank you [James Kettle at PortSwigger](https://portswigger.net/research/server-side-template-injection), where in the article he shows a very useful image:

![A Tree structure that shows the branching paths for what language a server with templating could use](/assets/images/writeups_images/SSTI1/SSTI_Template.png)

As you can see, we seem to have missed a step, that becuase I would have gone `{{7*7}}`, and then `${7*7}`, but I guess to make the diagram have a nice end point, they have those two the other way round. Anyway, as we have already proven that `{{7*7}}` is executed, that means that we're no onto the `{{7*'7'}}` step, which as you can see would then mean that the template langauge is either `Jinja2` or `Twig`.

Now what they don't show in the article is that `Jinja2` is for python backends while `Twig` is for PHP backends, as such they execute the code `{{7*'7'}}` differently. They do this becuase they try to follow the conventions of the language they are based in, so in python (and Jinja2) `7*'7'` evaluates to `7777777`, this is becuase python simply repeates the string '7', 7 times. In PHP (and Twig) on the other hand though, `7*'7'` evaulates to `49` this is becuase they implicitly interpret the string `'7'` into the integer `7`.

So inputing the command `{{7*'7'}}` returns `7777777`. This means that the backend templating language is `Jinja2`.

Now in Jinja2, as it is a fully fledged language, technically we could just chain Jinja2 command after Jinja2 command, to do whatever we want.
In Jinja2 there are two types of syntax, `expressions` which are done within `{{ /* Expression Here */ }}`, and `Block Statements` which are done with `{% /* Code goes Here */ %}`.
Luckily, for this challenge though, you can easily run os commands in python with `os.popen(/* Command */).read()`, the only trouble is that we can't do your standard import statement in Jinja2, we need to have it be one line. Luckily though, there is a way to import things in python without using the `import` command.

```python
self.__init__.__globals__.__builtins__.__import__('os')
```

This code grabs the `os` module from the global python builtins which are variables that exist in every python script that can be used to access all available python functions. While this code doesn't import the module to the program like normal, it just returns the module, so we could either assign this module to a variable or run commands directly on it. This is what python does behind the scenes

```python
import os
# This code becomes
os = self.__init__.__globals__.__builtins__.__import__('os')
```

This shows why an import cannot be used, becuase an import assigns a variable. Luckily if we just want to run a single command, when we dont need to save the output, and the only command we want to run is `.popen("").read()`. So the following injection, can just have the shell command changed, in order to do any RCE you want on the server

```python
{{ self.__init__.__globals__.__builtins__.__import__('os').popen("ls -la").read() }}
```

This returns

```text
__pycache__ app.py flag requirements.txt 
```

We can then read any of these files with "cat"

```python
{{ self.__init__.__globals__.__builtins__.__import__('os').popen("cat flag").read() }}
```

This returns the flag: `picoCTF{s4rv3r_s1d3_t3mp14t3_1nj3ct10n5_4r3_c001_df9a00a0}`

{% endraw %}
