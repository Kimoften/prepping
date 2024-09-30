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
        # 파일 데이터를 FileStorage 객체에서 읽어서 바로 업로드
        files = {"document": (file.filename, file.stream, file.mimetype)}
        response = requests.post(url, headers=headers, files=files)
        response_json = response.json()
        
        # 유니코드 이스케이프 처리
        if 'text' in response_json:
            extracted_text = response_json['text'].encode().decode('unicode_escape').encode('latin1').decode('utf-8')
            print(extracted_text)  # 유니코드 이스케이프를 일반 텍스트로 변환하여 출력


    # 텍스트 기반의 폼 데이터 받기
    job = request.form.get('job', 'No job specified')
    company = request.form.get('company', 'No company specified')
    traits = request.form.get('traits', 'No traits specified')

    summary = f"job: {job}, company: {company}, traits: {traits}, 이력서: {extracted_text}" 

    print(summary)

    # 성공 응답 보내기
    return "success"

def main_question_generate():
    generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"You are a interviewer of the {user_data_upload.company}. Read the user's {user_data_upload.summary} and make a main question."
            },
            {
                "role": "user",
                "content": user_data_upload.summary
            }
        ]
    )

    main_question = generation.choices[0].message

    return main_question

print(main_question_generate)

if __name__ == '__main__':
    app.run(debug=True)
