import os
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

import models

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/projects")
def projects():
    data = {'id': 0, 'name': 'Delta Reporter', 'description': 'Real time testing reporting tool', 'created_at': 'timestamp'}
    return jsonify(data)

@app.route("/launches")
def launches():
    data = {'id': 0, 'name': 'Release Zero', 'changelog': '- Added rabbits\n- More cats'}
    return jsonify(data)

@app.route("/testsuites")
def testsuites():
    data = {'id': 0, 'title': 'Test Zero', 'test_type': 'integration', 'status': 'PASS', 'duration': '3 minutes 23 seconds', 'start': 'timestamp', 'end': 'timestamp'}
    return jsonify(data)

@app.route("/tests")
def tests():
    data = {'id': 0, 'suite_id': 0, 'launch_id': 0, 'title': "Test Zero", 'status': 'PASS', 'duration': '3 minutes 23 seconds', 'start': 'timestamp', 'end': 'timestamp', 'screenshots': ['s3://whatever0','s3://whatever1']}
    return jsonify(data)

if __name__ == "__main__":
    app.run(host=os.getenv("HOST", "0.0.0.0"), port=os.getenv("PORT", 5000))
