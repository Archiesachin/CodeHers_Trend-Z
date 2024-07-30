from flask import Flask, jsonify, request
from routes import *
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
CORS(app)

if __name__ == '__main__':
    app.run()