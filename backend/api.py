import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_scheduler import MLScheduler
from google.generativeai.client import configure
from google.generativeai.generative_models import GenerativeModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    print("GEMINI_API_KEY not found. Falling back to local knowledge base.")
    model = None
else:
    try:
        configure(api_key=gemini_api_key)
        # Updated to use current Gemini model name
        model = GenerativeModel("gemini-2.5-flash")
        print("Gemini AI initialized successfully with model: gemini-2.5-flash")
    except Exception as e:
        print(f"Error initializing Gemini: {e}")
        print("Chatbot will fall back to local knowledge base")
        model = None

app = Flask(__name__)
# Allow all origins for development
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:8081",
            "http://127.0.0.1:8081",
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
    }
})

# Local knowledge base for OS concepts
OS_KNOWLEDGE_BASE = {
    'process': 'A **process** is a program in execution. It includes the program code and its current activity. Each process has its own memory space, file handles, and system resources.',
    'thread': 'A **thread** is the smallest unit of processing that can be performed in an OS. Threads within the same process share the same memory space but have their own program counters and stack.',
    'scheduling': '**CPU Scheduling** is the process of determining which process will use the CPU when multiple processes are ready to execute. Common algorithms include FCFS, SJF, Priority, Round Robin, and Multilevel Queue.',
    'paging': '**Paging** is a memory management scheme that divides memory into fixed-size blocks called pages. It allows the physical address space of a process to be non-contiguous.',
    'segmentation': '**Segmentation** is a memory management technique that divides memory into segments of varying sizes. Each segment represents a logical unit like code, data, or stack.',
    'virtual memory': '**Virtual Memory** is a memory management technique that provides an idealized abstraction of the storage resources available on a machine, allowing execution of processes that may not be completely in memory.',
    'deadlock': 'A **deadlock** is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.',
    'synchronization': '**Synchronization** is the coordination of multiple processes or threads to ensure proper execution order and prevent race conditions.',
    'concurrency': '**Concurrency** is the ability of different parts or units of a program to be executed out-of-order or in partial order, without affecting the final outcome.',
    'file system': 'A **file system** is a method for storing and organizing computer files and the data they contain, including file attributes, directory structure, and file allocation methods.',
    'memory management': "**Memory Management** involves managing the computer's primary memory, including memory allocation, swapping, and memory protection.",
    'disk scheduling': '**Disk Scheduling** algorithms determine the order in which disk I/O requests are processed, including FCFS, SSTF, SCAN, and C-SCAN algorithms.',
    'interprocess communication': '**Interprocess Communication (IPC)** mechanisms allow processes to communicate and synchronize their actions, including shared memory, message passing, pipes, and sockets.'
}

def generate_gemini_response(prompt):
    """Generate a response using Gemini AI"""
    if not model:
        return None

    try:
        response = model.generate_content(
            f"""You are an expert in Operating Systems.
            Provide a clear, concise, and accurate response to the following question about operating systems:
            {prompt}

            If the question is not related to operating systems, politely explain that you specialize in OS topics.
            Keep your response focused and educational.""",
            generation_config={
                "temperature": 0.5,
                "max_output_tokens": 2048,  # allow longer answers to avoid mid-sentence cut-offs
            },
        )

        response_text = response.text or ""

        # Log usage/finish info to help diagnose truncation
        usage = getattr(response, "usage_metadata", None)
        finish_reason = None
        if getattr(response, "candidates", None):
            finish_reason = getattr(response.candidates[0], "finish_reason", None)
        if usage or finish_reason:
            print(f"[Gemini] finish_reason={finish_reason}, usage={usage}")

        # If the model stopped due to token limit, try to continue once
        if finish_reason and str(finish_reason).upper() == "MAX_TOKENS":
            try:
                continuation = model.generate_content(
                    f"Continue and complete the previous answer without repeating it. Prior content: {response_text}",
                    generation_config={
                        "temperature": 0.5,
                        "max_output_tokens": 1024,
                    },
                )
                response_text += "\n\n" + (continuation.text or "")
            except Exception as cont_err:
                print(f"[Gemini] Error requesting continuation: {cont_err}")

        return response_text
    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "quota" in error_str.lower():
            print("Gemini API quota exceeded - falling back to local knowledge base")
            return None
        else:
            print(f"Error generating Gemini response: {e}")
            return None

@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    # Handle preflight request
    if request.method == "OPTIONS":
        response = jsonify({"status": "success"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        print(f"[Chat Request] Message: {user_message}")

        # First try to get a response from Gemini
        response_text = generate_gemini_response(user_message)

        if response_text:
            print("[Chat Response] Response from Gemini AI")
        else:
            print("[Chat Response] Gemini unavailable, using knowledge base")

        # If Gemini fails or returns None, fall back to the knowledge base
        if not response_text:
            user_message_lower = user_message.lower()
            for term, explanation in OS_KNOWLEDGE_BASE.items():
                if term in user_message_lower:
                    response_text = explanation
                    print(f"[Chat Response] Matched knowledge base term: {term}")
                    break

        # If still no response, use a fallback
        if not response_text:
            fallback_responses = [
                "I'm having trouble generating a response. Could you rephrase your question about operating systems?",
                "That's an interesting question! I'm having some technical difficulties right now. Could you try asking in a different way?",
                "I specialize in operating system concepts. Could you ask me something about processes, memory management, or file systems?"
            ]
            response_text = fallback_responses[len(user_message) % len(fallback_responses)]
            print("[Chat Response] Using fallback response")

        return jsonify({"response": response_text})

    except Exception as e:
        print(f"[Chat Error] {str(e)}")
        return jsonify({
            "error": str(e),
            "message": "Error processing your request."
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
    print("\n" + "="*50)
    print("OS Learning Assistant Backend")
    print("="*50)
    print("Backend running on: http://localhost:5000")
    print("Chat endpoint: http://localhost:5000/api/chat")
    print(f"Gemini AI: {'Enabled' if model else 'Disabled (using fallback)'}")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
