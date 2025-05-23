from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Allows all origins.
# CORS(app)
# Allows for cross-origin with local web server.
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})


@app.route("/bobcat")
def view1():
    return render_template("bobcat.html")


@app.route("/eagle")
def view2():
    return render_template("eagle.html")


@app.route("/sandpiper")
def view3():
    return render_template("sandpiper.html")


@app.route("/consent")
def consent():
    return render_template("consent.html")


@app.route("/process")
def process():
    return render_template("process.html")


@app.route("/step3")
def step3():
    return render_template("step3.html")


@app.route("/step4")
def step4():
    return render_template("step4.html")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/landing")
def landing():
    return render_template("landing.html")


@app.route("/intake")
def intake():
    return render_template("intake.html")


# @app.route("/api/process", methods=["POST"])
# def process():
#     data = request.json
#     response = {"message": f"Received: {data.get('input')}"}
#     return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
