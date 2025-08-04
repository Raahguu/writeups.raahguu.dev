---
layout: writeup
title: Master of Time and Space
tags: WebX
---

## Description

While the government has provided the source code to the world, the mobile app won't run properly because of geolocation and time restrictions! Can you identify the time and coordinates required for spoofing? Don't forget to submit it to the relevant APIs to double check it's correct (and get the flag).

<!--more-->

This challenge also gave a png file, that you just need the visible text on.

![PScreenshot of the pdf in Master of Time and Space which details the when and where an election booth will be for the freedonia election](/assets/images/writeups_images/Master-of-Time-and-Space/1.png)

The backend code for all of week 4 was the same, so we had that aswell.


## Solution

The poster has on it the time zone: `2030-01-01T08:00:00Z` till `2030-01-01T18:00:00Z`

And it also has the location of a voting booth: `Croydon Public School`

The code on the backend for submitting the time and location to is the following

```python
##### POLLING LOCATION CHECKS
@voting_bp.route("/check-hours", methods=["POST"])
def check_polling_hours():
    """
    Check if given timestamp is within polling location operating hours.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        timestamp = data.get("timestamp")

        if not timestamp:
            return jsonify({"error": "Missing required field: timestamp"}), 400

        db = Database()
        is_open, message = db.check_timestamp_in_polling_hours(timestamp)

        return jsonify({
            "polling_open": is_open,
            "message": message
        })

    except Exception as e:
        return jsonify({"error": f"Failed to check polling hours: {str(e)}"}), 500

@voting_bp.route("/check-location", methods=["POST"])
def check_location_in_polling_area():
    """
    Check if given coordinates are within any polling location"s geolocation box.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is None or longitude is None:
            return jsonify({"error": "Missing required fields: latitude, longitude"}), 400

        try:
            lat = float(latitude)
            lng = float(longitude)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid latitude or longitude format"}), 400

        db = Database()
        found, location_data = db.check_geolocation_in_polling_area(lat, lng)

        if found:
            return jsonify({
                "within_polling_area": True,
                "polling_location": location_data,
                "master_of_time_and_space_flag": current_app.config["MASTER_OF_TIME_AND_SPACE_FLAG"]
            })
        else:
            return jsonify({
                "within_polling_area": False,
                "polling_location": None
            })

    except Exception as e:
        return jsonify({"error": f"Failed to check location: {str(e)}"}), 500
```

So we just need to submit json data to the API in order to get the flag. The time is very easy, as we get given the exact timestamp, lets just submit one an hour after voting begins

```bash
$ curl -X POST "http://mobile-app.commission.freedonia.vote/api/voting/check-hours" -H "Content-Type: application/json" -d '{"timestamp":"2030-01-01T09:00:00Z"}'
{"message":"Polling location is open","polling_open":true}
```

So clearly, the messages work, lets get the location now. Searching `Croydon Public School` on google maps and then zooming in gets me to the link

```text
https://www.google.com/maps/@-33.8803213,151.1149813,41m
```

This URL contains the lattitude and longitude `-33.8803213,151.1149813` now I mixed these two up a lot and has a lot of trouble, but the numbers here go `lattitude` then `longitude`

So we just need to submit the location in a post request

```bash
$ curl "http://mobile-app.commission.freedonia.vote/api/voting/check-location" -X POST -H "Content-Type: application/json" \
        -d '{"latitude": -33.8803213, "longitude": 151.1149813}'
{"master_of_time_and_space_flag":"cysea{what_time_is_it_fr_tho_faca748a2d}","polling_location":{"geolocation_box":{"northeast":{"lat":-33.876598,"lng":151.118939},"northwest":{"lat":-33.876598,"lng":151.110849},"southeast":{"lat":-33.882984,"lng":151.118939},"southwest":{"lat":-33.882984,"lng":151.110849}},"id":1,"key":"POL001","polling_location":"Croydon Public School","state":"Izzi","voting_status":"Not Started"},"within_polling_area":true}
```

That gets us the flag `cysea{what_time_is_it_fr_tho_faca748a2d}`
