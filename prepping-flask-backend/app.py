from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORS 설정으로 Next.js와의 통신 허용

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    job = request.form.get('job')
    company = request.form.get('company')
    traits = request.form.get('traits')

    # 여기에서 파일 저장 및 처리 로직 추가
    # 예시: 파일 이름 출력
    print(f"Received file: {file.filename}")
    print(f"Job: {job}, Company: {company}, Traits: {traits}")

    return jsonify({'message': 'File uploaded successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
