from flask import Flask, send_file, Response

app = Flask(__name__)

@app.route('/')
def serve_demo():
    return send_file('demo.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)