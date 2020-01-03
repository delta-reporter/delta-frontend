from os import getenv
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/projects")
def tests():
    return {'id': 0, 'name': 'Delta Reporter', 'description': 'Real time testing reporting tool', 'created_at': 'timestamp'}


if __name__ == "__main__":
    app.run(host=getenv("HOST", "0.0.0.0"), port=getenv("PORT", 5000))
