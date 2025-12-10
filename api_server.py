from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow your Next.js frontend to call this


@app.route('/describe', methods=['POST'])
def describe():
    """Render NDEL descriptions from Python or SQL source code."""
    try:
        from ndel import describe_python_source, describe_sql_source

        data = request.json or {}
        source = data.get('source', '')
        language = (data.get('language') or 'python').lower()

        if not source.strip():
            return jsonify({'error': 'No source provided'}), 400

        if language == 'sql':
            output = describe_sql_source(source)
        else:
            output = describe_python_source(source)

        return jsonify({'output': output})

    except ImportError:
        return jsonify({
            'error': 'NDEL library not installed. Run: pip install git+https://github.com/tom-mcmillan/ndel.git'
        }), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    try:
        import ndel
        return jsonify({'status': 'ok', 'ndel_available': True})
    except ImportError:
        return jsonify({'status': 'ok', 'ndel_available': False, 'message': 'NDEL library not installed'})


if __name__ == '__main__':
    print("Starting NDEL API server on http://localhost:5000")
    print("Make sure you have installed the ndel library:")
    print("  pip install git+https://github.com/tom-mcmillan/ndel.git")
    app.run(host='0.0.0.0', port=5000, debug=True)
