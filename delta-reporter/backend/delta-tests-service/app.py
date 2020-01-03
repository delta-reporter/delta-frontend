from os import getenv
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/tests")
def tests():
    return {'id': 0, 'suite_id': 0, 'launch_id': 0, 'title': "Test Zero", 'status': 'PASS', 'duration': '3 minutes 23 seconds', 'start': 'timestamp', 'end': 'timestamp', 'screenshots': ['s3://whatever0','s3://whatever1']}


if __name__ == "__main__":
    app.run(host=getenv("HOST", "0.0.0.0"), port=getenv("PORT", 5000))
