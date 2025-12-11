from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
from ml_scheduler import MLScheduler

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])

# HuggingFace API configuration
HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

# System prompt for OS expert
SYSTEM_PROMPT = """You are an expert in Operating Systems. 
Provide clear, concise, and accurate explanations about OS concepts including:
- Processes and Threads
- CPU Scheduling
- Memory Management
- File Systems
- Deadlocks
- Synchronization
- Virtual Memory
- Paging and Segmentation

Keep your responses educational and suitable for students learning operating systems."""

def query_hf(payload):
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    response = requests.post(HF_API_URL, headers=headers, json=payload)
    return response.json()

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Format the prompt for the model
        prompt = f"""You are an expert in Operating Systems. Answer the following question clearly and concisely.
        
        Question: {user_message}
        
        Answer:"""
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_length": 200,
                "temperature": 0.7,
                "do_sample": True,
                "top_p": 0.9
            }
        }

        output = query_hf(payload)

        # For Flan-T5, the response is a list with a dictionary containing 'generated_text'
        if isinstance(output, list) and len(output) > 0 and 'generated_text' in output[0]:
            response_text = output[0]['generated_text'].strip()
            return jsonify({"response": response_text})
        else:
            return jsonify({"error": "Unexpected response format from model"}), 500

    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Error processing your request. The model might be loading. Please try again in a few seconds."
        }), 500

@app.route("/api/suggest-algorithm", methods=["POST"])
def suggest_algorithm():
    try:
        data = request.get_json()
        processes = data.get("processes", [])

        if not processes:
            return jsonify({"error": "No processes provided"}), 400

        # Initialize ML scheduler
        ml_scheduler = MLScheduler()
        suggested_algorithm = ml_scheduler.predict(processes)

        return jsonify({"suggested_algorithm": suggested_algorithm})

    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Error processing your request."
        }), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)