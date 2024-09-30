from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI
import requests
import json

app = Flask(__name__)

load_dotenv()
UPSTAGE_API_KEY = os.getenv('UPSTAGE_API_KEY')

client = OpenAI(
    api_key="UPSTAGE_API_KEY",
    base_url="https://api.upstage.ai/v1/solar"
)

CORS(app)  # CORS 설정으로 Next.js와의 통신 허용


@app.route('/upload', methods=['POST'])
def user_data_upload():
    # 파일이 포함된 요청인지 확인
    if 'file' in request.files:
        file = request.files['file']
        # 파일 이름을 로그로 출력
        print('Received file:', file.filename)
        url = "https://api.upstage.ai/v1/document-ai/ocr"
        headers = {"Authorization": f"Bearer {UPSTAGE_API_KEY}"}
        files = {"document": open(file, "rb")}
        response = requests.post(url, headers=headers, files=files)
        response_json = response.json()
        # JSON 데이터를 텍스트로 변환하여 프롬프트에 전달
        json_text = json.dumps(response_json, indent=2)  # JSON을 문자열로 변환

    
    # 텍스트 기반의 폼 데이터 받기
    job = request.form.get('job', 'No job specified')
    company = request.form.get('company', 'No company specified')
    traits = request.form.get('traits', 'No traits specified')

    summary = f"job: {job}, company: {company}, traits: {traits}, 이력서: {json_text}" 

    # 데이터를 로그로 출력
    print('Job:', job)
    print('Company:', company)
    print('Traits:', traits)

    first_process = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": "You are a interviewer of company."
            },
            {
                "role": "user",
                "content": summary
            }
        ]
    )
    
    first_process_response = first_process.choices[0].message

    print(first_process_response)
    
    # 성공 응답 보내기
    return 'File and data uploaded successfully!'

if __name__ == '__main__':
    app.run(debug=True)
