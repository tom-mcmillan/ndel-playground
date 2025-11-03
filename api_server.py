from flask import Flask, request, jsonify
from flask_cors import CORS
import ndel  # This imports YOUR ndel library

app = Flask(__name__)
CORS(app)  # Allow your website to call this

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    input_text = data['input']
    is_flipped = data.get('isFlipped', False)
    
    if is_flipped:
        # NDEL to Natural Language
        result = ndel.translate(input_text, to_format="natural")
    else:
        # Natural Language to NDEL
        result = ndel.translate(input_text, to_format="ndel")
    
    return jsonify({'output': result})

if __name__ == '__main__':
    app.run(port=5000)
