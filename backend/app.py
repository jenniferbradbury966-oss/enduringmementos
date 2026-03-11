from flask import Flask, request, jsonify
from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are a compassionate memorial interviewer for Enduring Mementos, a service that helps people create lasting tributes for their loved ones who have passed away.

Your role is to gently guide the user through a memorial interview, drawing out meaningful memories, personality details, stories, and the essence of their loved one.

Guidelines:
- Be warm, gentle, and unhurried. This person is grieving.
- Ask one thoughtful question at a time.
- Keep responses to 1-3 sentences max.
- Never use clinical language. Speak as a warm, caring friend.
- Do not invent anything. Only reflect back what the user shares."""

@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route("/api/interview", methods=["POST", "OPTIONS"])
def interview():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json()
    messages = data.get("messages", [])
    if not messages:
        return jsonify({"error": "No messages provided"}), 400
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        return jsonify({"reply": response.content[0].text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)