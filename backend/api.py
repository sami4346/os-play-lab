"""
API integration for ML Scheduler
Flask backend to serve ML-based algorithm suggestion
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_scheduler import MLScheduler
import os

app = Flask(__name__)
CORS(app)
ml = MLScheduler()
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_scheduler.pkl")

# Train and save model if not exists
if not os.path.exists(MODEL_PATH):
    ml.train()
    ml.save(MODEL_PATH)
else:
    ml.load(MODEL_PATH)

@app.route("/api/suggest-algorithm", methods=["POST"])
def suggest_algorithm():
    data = request.get_json()
    processes = data.get("processes", [])
    if not processes:
        return jsonify({"error": "No process data provided."}), 400
    algo = ml.predict(processes)
    return jsonify({"suggested_algorithm": algo})

if __name__ == "__main__":
    # Run on 0.0.0.0 to be reachable from other hosts if needed
    app.run(host='0.0.0.0', port=5000, debug=True)
