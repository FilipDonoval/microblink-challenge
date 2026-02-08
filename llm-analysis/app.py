import os
from flask import Flask, request, jsonify
from google import genai
from google.genai import types

app = Flask(__name__)

GEMENI_API_KEY = os.getenv('GEMENI_API_KEY', 'AIzaSyD0Ywfke_-8znQHydg3XcjHHKBHp9AsXSE')

client = genai.Client(api_key=GEMENI_API_KEY)


def llm_response(data):
    llm_response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=str(data),
        config=types.GenerateContentConfig(
            system_instruction="""
                Formatting rules:
                - Return PURE PLAIN TEXT only.
                - Do NOT use Markdown (no bolding, no asterisks, no hash signs).
                - Do NOT use bullet points or numbered lists; use full sentences.
                - Do NOT add line breaks for wrapping; allow text to flow naturally.

                You are a senior AppSec  Engineer. 
                Provide a conciese, professional security report. 
                Your are given the findings of secret types found in the codebase, 
                generate a mitigation report with actionable recommendations.
                Around 100 words or under.
            """
        )
    )

    return (llm_response.text)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200


@app.route('/generate-analysis', methods=['POST'])
def generate_analysis():
    data = request.get_json()

    if not data or 'findings' not in data:
        return jsonify({"error": "No data provided to llm"}), 400

    try:
        response_text = llm_response(data['findings'])
        return jsonify({"message": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002, debug=False)


