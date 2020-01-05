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

@app.route("/launches")
def launches():
    data = {'id': 0, 'name': 'Release Zero', 'changelog': '- Added rabbits\n- More cats'}
    return jsonify(data)    


if __name__ == "__main__":
    app.run(host=os.getenv("HOST", "0.0.0.0"), port=os.getenv("PORT", 5000))
