from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/generate-analysis', methods=['POST'])
def generate_analysis():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided to llm"}), 400

    return jsonify({"message": "llm function working"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002, debug=False)


