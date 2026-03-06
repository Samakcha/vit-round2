from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/sensor', methods=['POST'])
def receive_sensor():
    data = request.json

    heart_rate = data.get("heart_rate")
    spo2 = data.get("spo2")

    print("Received Data:")
    print("Heart Rate:", heart_rate)
    print("SpO2:", spo2)

    # ----- simple logic (replace with ML later) -----
    if heart_rate > 120 or spo2 < 92:
        risk = "HIGH"
    elif heart_rate > 100:
        risk = "MEDIUM"
    else:
        risk = "NORMAL"

    response = {
        "risk_level": risk
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002)