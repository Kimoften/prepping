from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI
import requests
import json
import ast

app = Flask(__name__)

load_dotenv()
UPSTAGE_API_KEY = os.getenv('UPSTAGE_API_KEY')

client = OpenAI(
    api_key=UPSTAGE_API_KEY,
    base_url="https://api.upstage.ai/v1/solar"
)

# class Questions(BaseModel):
#     first_question: str
#     second_question: str
#     third_question: str
#     fourth_question: str

class Response1:
    list[str]

total_messages = []

CORS(app)  # CORS 설정으로 Next.js와의 통신 허용

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' in request.files:
        file = request.files['file']
        summary = user_data_upload(file)
        main_question = main_question_generate(summary)

    print(main_question)

    # 성공 응답 보내기
    return "success"

def user_data_upload(file):
    file = request.files['file']
    # 파일 이름을 로그로 출력
    print('Received file:', file.filename)
    url = "https://api.upstage.ai/v1/document-ai/ocr"
    headers = {"Authorization": f"Bearer {UPSTAGE_API_KEY}"}
    # 파일 데이터를 FileStorage 객체에서 읽어서 바로 업로드
    files = {"document": (file.filename, file.stream, file.mimetype)}
    response = requests.post(url, headers=headers, files=files)
    response_json = response.json()
    
    # 텍스트 기반의 폼 데이터 받기
    job = request.form.get('job', 'No job specified')
    company = request.form.get('company', 'No company specified')
    traits = request.form.get('traits', 'No traits specified')

    # 유니코드 이스케이프 처리
    if 'text' in response_json:
        extracted_text = response_json['text'].encode().decode('unicode_escape').encode('latin1').decode('utf-8')

        summary = {
            "job": job,
            "company": company,
            "traits": traits,
            "이력서": extracted_text
        }
        
    else:
        summary = {
            "job": job,
            "company": company,
            "traits": traits
        }

    total_messages.append(summary)

    return summary

def main_question_generate(summary):
    generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer of the {summary['job']}. Read the user's {summary} and make a main question.
                                Make four questions.
                                Make it a list.
                                한글로 말해.
                                
                                response_format: ['첫번째 질문', '두번째 질문', '세번째 질문', '네번째 질문']"""
            },
            {
                "role": "user",
                "content": str(summary)
            }
        ]
    )

    main_question_response = generation.choices[0].message.content
    main_question = ast.literal_eval(main_question_response)


    return main_question



# @app.route('/interview', methods=['GET'])
# def main_question_generate(summary):
#     generation = client.chat.completions.create(
#         model="solar-pro",
#         messages=[
#             {
#                 "role": "system",
#                 "content": f"You are a interviewer of the {summary.job}. Read the user's {summary} and make a main question."
#             },
#             {
#                 "role": "user",
#                 "content": summary
#             }
#         ]
#     )

#     main_question = generation.choices[0].message['content']

#     return main_question

# print(main_question_generate(user_data_upload()))

if __name__ == '__main__':
    app.run(debug=True)
