from flask import Flask, request, jsonify

app = Flask(__name__)

# Global variables to store the latest vitals
latest_vitals = {
    "heart_rate": None,
    "spo2": None
}

@app.route('/sensor', methods=['POST'])
def receive_sensor():
    global latest_vitals
    data = request.json

    heart_rate = data.get("heart_rate")
    spo2 = data.get("spo2")

    latest_vitals["heart_rate"] = heart_rate
    latest_vitals["spo2"] = spo2

    print("Received Data:")
    print("Heart Rate:", heart_rate)
    print("SpO2:", spo2)

    # ----- simple logic (replace with ML later) -----
    if heart_rate and spo2 and (heart_rate > 120 or spo2 < 92):
        risk = "HIGH"
    elif heart_rate and heart_rate > 100:
        risk = "MEDIUM"
    else:
        risk = "NORMAL"

    response = {
        "risk_level": risk
    }

    return jsonify(response)

@app.route('/vitals', methods=['GET'])
def get_latest_vitals():
    return jsonify(latest_vitals)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002)