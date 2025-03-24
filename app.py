from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Allows all origins.
# CORS(app)
# Allows for cross-origin with local web server.
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/process', methods=['POST'])
def process():
    data = request.json
    response = {"message": f"Received: {data.get('input')}"}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
