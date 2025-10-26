# static/LAATSimMATLAB.py
from flask import Flask, jsonify
from flask_cors import CORS
import datetime
import atexit
import json  # Import the json module
import os

app = Flask(__name__, static_url_path='/')
CORS(app, resources={r"/run_python_script": {"origins": "http://localhost:1110"}})

def run_py_code():
    print(datetime.datetime.now())
   
@app.route('/run_python_script', methods=['GET'])
def run_python_script():
    return run_py_code()

if __name__ == '__main__':
    app.run(debug=True)
