"""
Enduring Mementos — Flask Backend
──────────────────────────────────
Storage: JSON file (no database needed yet)
Photos:  AWS S3 (ca-central-1)

Routes:
  POST /api/interview              — Claude interview conversation
  POST /api/tribute                — Generate tribute from conversation
  POST /api/memorials              — Save / update a memorial
  GET  /api/memorials/user/<uid>   — Load all memorials for a user
  DELETE /api/memorials/<id>       — Delete a memorial
  POST /api/memorials/<id>/photos  — Upload a photo to S3
  GET  /api/memorials/<id>/photos  — List photos for a memorial
  DELETE /api/memorials/<id>/photos/<key> — Delete a photo
  GET  /api/health                 — Health check
"""

from flask import Flask, request, jsonify
from anthropic import Anthropic
from dotenv import load_dotenv
from flask_cors import CORS
import os, json, uuid
from datetime import datetime
from pathlib import Path
import boto3
from botocore.exceptions import ClientError

load_dotenv()

app    = Flask(__name__)
CORS(app,
     origins="*",
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=False)
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

STORAGE_FILE = Path(__file__).parent / "memorials_data.json"

# ── S3 Client ──
s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_S3_REGION", "ca-central-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)
S3_BUCKET = os.getenv("AWS_S3_BUCKET", "enduring-mementos-photos-2026")

def load_storage():
    try:
        if STORAGE_FILE.exists():
            return json.loads(STORAGE_FILE.read_text())
    except Exception:
        pass
    return {}

def save_storage(data):
    try:
        STORAGE_FILE.write_text(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Storage save failed: {e}")

def get_presigned_url(key, expiry=3600):
    """Generate a presigned URL so photos display regardless of bucket policy."""
    try:
        return s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": key},
            ExpiresIn=expiry,
        )
    except ClientError as e:
        print(f"Presigned URL failed: {e}")
        return f"https://{S3_BUCKET}.s3.ca-central-1.amazonaws.com/{key}"

def build_interview_system_prompt(name, relationship):
    return f"""You are a compassionate, unhurried guide helping someone create a memorial for {name}, their {relationship}.

YOUR ROLE:
- Help them tell {name}'s story in their own words
- Ask one question at a time — never stack multiple questions
- Acknowledge what they share before moving to the next question
- Celebrate their memories warmly
- Read the room: if answers are short, stay gentle and don't push deeper
- Always offer permission to skip anything that feels too hard

EMOTIONAL GUIDANCE:
- Move at their pace — grief has no timeline
- Never imply they should feel differently than they do
- Never ask about how {name} died unless the user brings it up
- If someone expresses hopelessness, inability to function, or prolonged inability 
  to cope, gently acknowledge their pain with warmth and compassion, then 
  encourage them to reach out to a grief counselor or contact a support line 
  such as the Crisis Services Canada line (1-833-456-4566) or their local mental 
  health support before continuing

TONE: Warm, gentle, unhurried, celebratory of who {name} was.

FORMAT:
- Keep responses concise: acknowledge (1-2 sentences) + ask the next question
- Never ask more than one question per message"""

TRIBUTE_SYSTEM_PROMPT = """You are a compassionate writer creating a memorial tribute.
Based on the interview conversation, write a beautiful warm flowing tribute in third person.
Guidelines:
- Write 3 paragraphs, each 3-5 sentences
- Use the person's name throughout
- Draw only from what was shared — never invent details
- Warm literary tone like a eulogy written by someone who truly knew them
- No headings, bullet points, or formatting — pure flowing prose only"""


@app.route("/api/interview", methods=["POST", "OPTIONS"])
def interview():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data         = request.get_json()
    messages     = data.get("messages", [])
    name         = data.get("name", "them")
    relationship = data.get("relationship", "loved one")
    system       = data.get("system") or build_interview_system_prompt(name, relationship)
    if not messages:
        return jsonify({"error": "No messages provided"}), 400
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1000,
            system=system,
            messages=messages,
        )
        return jsonify({"reply": response.content[0].text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/tribute", methods=["POST", "OPTIONS"])
def tribute():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data         = request.get_json()
    name         = data.get("name", "")
    relationship = data.get("relationship", "loved one")
    conversation = data.get("conversation", "")
    if not name or not conversation:
        return jsonify({"error": "Name and conversation required"}), 400
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1000,
            system=TRIBUTE_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": f"Write a memorial tribute for {name}, based on this interview with their {relationship}:\n\n{conversation}"}]
        )
        return jsonify({"tribute": response.content[0].text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/memorials", methods=["POST", "OPTIONS"])
def save_memorial():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data    = request.get_json()
    storage = load_storage()
    memorial_id = data.get("id") or str(uuid.uuid4())
    user_id     = data.get("user_id", "default")
    existing    = storage.get(memorial_id, {})
    memorial = {
        **existing,
        "id":             memorial_id,
        "user_id":        user_id,
        "name":           data.get("name",           existing.get("name", "")),
        "relationship":   data.get("relationship",   existing.get("relationship", "")),
        "messages":       data.get("messages",       existing.get("messages", [])),
        "used_ids":       data.get("used_ids",       existing.get("used_ids", [])),
        "answered_count": data.get("answered_count", existing.get("answered_count", 0)),
        "last_category":  data.get("last_category",  existing.get("last_category", None)),
        "tribute_text":   data.get("tribute_text",   existing.get("tribute_text", None)),
        "status":         data.get("status",         existing.get("status", "in_progress")),
        "photos":         existing.get("photos", []),
        "created_at":     existing.get("created_at", datetime.utcnow().isoformat()),
        "updated_at":     datetime.utcnow().isoformat(),
    }
    storage[memorial_id] = memorial
    save_storage(storage)
    return jsonify(memorial), 200

@app.route("/api/memorials/user/<user_id>", methods=["GET", "OPTIONS"])
def list_memorials(user_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    storage   = load_storage()
    memorials = [m for m in storage.values() if m.get("user_id") == user_id]
    memorials.sort(key=lambda m: m.get("updated_at", ""), reverse=True)
    in_progress = [m for m in memorials if m.get("status") == "in_progress"]
    completed   = [m for m in memorials if m.get("status") == "complete"]
    return jsonify({"in_progress": in_progress, "completed": completed}), 200

@app.route("/api/memorials/<memorial_id>", methods=["DELETE", "OPTIONS"])
def delete_memorial(memorial_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    storage = load_storage()
    if memorial_id not in storage:
        return jsonify({"error": "Memorial not found"}), 404
    del storage[memorial_id]
    save_storage(storage)
    return jsonify({"deleted": True}), 200


# ── FIX: Separate GET and POST into their own functions ──

@app.route("/api/memorials/<memorial_id>/photos", methods=["GET", "OPTIONS"])
def get_photos(memorial_id):
    """Return photo list with fresh presigned URLs so images display in browser."""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    storage = load_storage()
    photos  = storage.get(memorial_id, {}).get("photos", [])
    # Refresh presigned URLs so they don't expire
    refreshed = []
    for p in photos:
        refreshed.append({
            **p,
            "url": get_presigned_url(p["key"]),
        })
    return jsonify({"photos": refreshed}), 200


@app.route("/api/memorials/<memorial_id>/photos", methods=["POST", "OPTIONS"])
def upload_photo(memorial_id):
    """Upload a photo to S3 and save the record."""
    if request.method == "OPTIONS":
        return jsonify({}), 200

    if "photo" not in request.files:
        return jsonify({"error": "No photo provided"}), 400

    file    = request.files["photo"]
    ext     = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    allowed = {"jpg", "jpeg", "png", "gif", "webp"}

    if ext not in allowed:
        return jsonify({"error": "File type not allowed"}), 400

    key = f"memorials/{memorial_id}/{uuid.uuid4()}.{ext}"
    try:
        s3_client.upload_fileobj(
            file,
            S3_BUCKET,
            key,
            ExtraArgs={"ContentType": file.content_type},
        )

        # Generate presigned URL so it renders immediately in the browser
        url = get_presigned_url(key)

        # Save record — indentation fixed
        storage = load_storage()
        if memorial_id not in storage:
            storage[memorial_id] = {}
        storage[memorial_id].setdefault("photos", []).append({
            "url":          url,
            "key":          key,
            "uploaded_at":  datetime.utcnow().isoformat(),
        })
        save_storage(storage)

        return jsonify({"url": url, "key": key}), 200

    except ClientError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/memorials/<memorial_id>/photos/<path:key>", methods=["DELETE", "OPTIONS"])
def delete_photo(memorial_id, key):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        s3_client.delete_object(Bucket=S3_BUCKET, Key=key)
        storage = load_storage()
        if memorial_id in storage:
            storage[memorial_id]["photos"] = [
                p for p in storage[memorial_id].get("photos", [])
                if p.get("key") != key
            ]
            save_storage(storage)
        return jsonify({"deleted": True}), 200
    except ClientError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    storage = load_storage()
    return jsonify({
        "status":          "ok",
        "storage":         "json_file",
        "memorials_saved": len(storage),
        "storage_file":    str(STORAGE_FILE),
    })

if __name__ == "__main__":
    print("✓ Enduring Mementos backend starting...")
    print(f"✓ Memorials will be saved to: {STORAGE_FILE}")
    app.run(debug=True, port=5000)
