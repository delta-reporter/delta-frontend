from os import getenv
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(host=getenv("HOST", "0.0.0.0"), port=getenv("PORT", 5000))
