from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import date
import requests, json


app = Flask(__name__)
CORS(app)


BOOKED_APPOINTMENTS = {}
OPEN_APPOINTMENTS = {}


@app.route("/today", methods=["GET"])
def today():
    return jsonify({"today": date.today().isoformat()})


def getAllAppointments():
    response = requests.get("https://www.thinkful.com/api/advisors/availability")
    advisor_availability_by_ids = {}
    if response:
        for value in json.loads(response.text).values():
            for date, advisor_id in value.items():
                if advisor_id not in advisor_availability_by_ids:
                    advisor_availability_by_ids[advisor_id] = []
                if date not in advisor_availability_by_ids[advisor_id]:
                    advisor_availability_by_ids[advisor_id].append(date)
        return advisor_availability_by_ids
    else:
        return False


@app.route("/getAvailability", methods=["GET"])
def getAvailability():
    advisor_availability_by_ids = getAllAppointments()
    for advisor_id, dates in advisor_availability_by_ids.items():
        if str(advisor_id) in BOOKED_APPOINTMENTS:
            for booking in BOOKED_APPOINTMENTS[str(advisor_id)]:
                if booking['time'] in advisor_availability_by_ids[advisor_id]:
                    advisor_availability_by_ids[advisor_id].remove(booking['time'])
    return json.dumps(advisor_availability_by_ids)


@app.route("/getBookings", methods=["GET"])
def getBookings():
    return json.dumps(BOOKED_APPOINTMENTS)


@app.route("/saveAppointment", methods=["POST"])
def postAppointment():
    response = json.loads(request.data)
    student_name = response['studentName']
    advisor_id = response['advisorId']
    time_slot = response['timeSlot']
    if advisor_id not in BOOKED_APPOINTMENTS.keys():
        BOOKED_APPOINTMENTS[advisor_id] = []
    BOOKED_APPOINTMENTS[advisor_id].append({'student': student_name, 'time': time_slot})
    return 'ok'
