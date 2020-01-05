from os import getenv
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/launches")
def tests():
    return {'id': 0, 'name': 'Release Zero', 'changelog': '- Added rabbits\n- More cats'}


if __name__ == "__main__":
    app.run(host=getenv("HOST", "0.0.0.0"), port=getenv("PORT", 5000))
