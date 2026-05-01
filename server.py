from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

PORT = int(os.environ.get("PORT", 8080))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

if __name__ == "__main__":
    print(f"Server running on port {PORT}")
    HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
