"""
ATELIER PROMPT ENGINE — LOCAL & RENDER PYTHON BACKEND
Zero External Dependencies (Standard Library Only)
Supports environment variable OPENROUTER_API_KEY
"""

import http.server
import json
import os
import urllib.error
import urllib.request
from urllib.parse import urlparse

PORT = int(os.environ.get("PORT", 8080))
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")

MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8"
}

class AtelierHandler(http.server.BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        pathname = parsed.path

        if pathname == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            resp = json.dumps({
                "status": "online",
                "hasServerKey": bool(OPENROUTER_API_KEY),
                "envKeyConfigured": bool(os.environ.get("OPENROUTER_API_KEY"))
            })
            self.wfile.write(resp.encode("utf-8"))
            return

        # Static file routing
        rel_path = "index.html" if pathname in ["", "/"] else pathname.lstrip("/")
        base_dir = os.path.dirname(os.path.abspath(__file__))
        target_path = os.path.abspath(os.path.join(base_dir, rel_path))

        if not target_path.startswith(base_dir) or not os.path.isfile(target_path):
            target_path = os.path.join(base_dir, "index.html")

        ext = os.path.splitext(target_path)[1].lower()
        content_type = MIME_TYPES.get(ext, "application/octet-stream")

        try:
            with open(target_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(b"Server Error")

    def do_POST(self):
        parsed = urlparse(self.path)
        pathname = parsed.path

        if pathname == "/api/vision":
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)

            try:
                payload = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                payload = {}

            api_key = OPENROUTER_API_KEY or self.headers.get("Authorization", "").replace("Bearer ", "").strip()

            if not api_key:
                self.send_response(401)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                err = json.dumps({
                    "error": "OPENROUTER_API_KEY is not set in Render Environment Variables. Please set it in your Render dashboard."
                })
                self.wfile.write(err.encode("utf-8"))
                return

            model = payload.get("model") or "nvidia/llama-3.1-nemotron-70b-instruct"
            image_b64 = payload.get("image")
            ref_type = payload.get("type", "look")

            if not image_b64:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Image is required"}).encode("utf-8"))
                return

            system_prompt = (
                "Analyze this LOOK image. Extract: FRAMING, POSE AND ACTION (use screen-left and screen-right), "
                "AND GAZE, LIGHTING AND CAMERA, BACKGROUND AND ENVIRONMENT, MAKEUP. Keep it short and factual."
                if ref_type == "look" else
                "Analyze this OUTFIT image. Extract: GARMENTS, FABRIC WEAVE & WEIGHT, SILHOUETTE, DRAPING, JEWELLERY AND ACCESSORIES. Keep it concise."
            )

            req_payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Extract features from this fashion reference photo:"},
                            {"type": "image_url", "image_url": {"url": image_b64}}
                        ]
                    }
                ],
                "max_tokens": 800
            }

            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": self.headers.get("Referer", "https://render.com"),
                "X-Title": "Atelier Prompt Engine"
            }

            try:
                req = urllib.request.Request(
                    "https://openrouter.ai/api/v1/chat/completions",
                    data=json.dumps(req_payload).encode("utf-8"),
                    headers=headers,
                    method="POST"
                )
                with urllib.request.urlopen(req) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    content = resp_data.get("choices", [{}])[0].get("message", {}).get("content", "")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "model": model, "content": content}).encode("utf-8"))
            except urllib.error.HTTPError as e:
                err_body = e.read().decode("utf-8")
                try:
                    err_json = json.loads(err_body)
                    msg = err_json.get("error", {}).get("message", f"HTTP {e.code}")
                except Exception:
                    msg = f"HTTP {e.code}"
                self.send_response(e.code)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": msg}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

def run_server():
    server_address = ("", PORT)
    httpd = http.server.HTTPServer(server_address, AtelierHandler)
    print(f"[Atelier Prompt Engine] Python server running on port {PORT}")
    print(f"[Atelier Prompt Engine] OPENROUTER_API_KEY configured: {bool(OPENROUTER_API_KEY)}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
