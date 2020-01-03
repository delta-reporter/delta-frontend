from os import getenv
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/testsuites")
def tests():
    return {'id': 0, 'title': 'Test Zero', 'test_type': 'integration', 'status': 'PASS', 'duration': '3 minutes 23 seconds', 'start': 'timestamp', 'end': 'timestamp'}


if __name__ == "__main__":
    app.run(host=getenv("HOST", "0.0.0.0"), port=getenv("PORT", 5000))
