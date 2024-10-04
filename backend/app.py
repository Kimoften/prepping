from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI
import requests
import json
import ast
from stt import speech_to_text
from interview_manage import tail_question_eval_A, tail_question_eval_B, tail_question_eval_C, tail_question_generate_A, tail_question_generate_B, tail_question_generate_C
import random
from feedback import feedback_generate

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
main_questions = []

CORS(app)  # CORS 설정으로 Next.js와의 통신 허용

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' in request.files:
        file = request.files['file']
        summary = user_data_upload(file)
        total_messages.append(summary)
        main_question = main_question_generate(summary)
        main_questions.append(main_question)

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



@app.route('/start_interview', methods=['POST'])
def start_interview():
    global main_questions, current_question_index, tail_question_count
    current_question_index = 0
    tail_question_count = 0
    total_messages.append(main_questions[0])
    return jsonify({"main_question": main_questions[0]})  # 첫 질문 반환


# 꼬리 질문을 재귀적으로 처리하는 함수
def handle_tail_questions(summary):
    global tail_question_count

    # 꼬리 질문 판단
    eval_A = tail_question_eval_A(summary, total_messages)
    eval_B = tail_question_eval_B(summary, total_messages)
    eval_C = tail_question_eval_C(summary, total_messages)

    eval_results = [eval_A, eval_B, eval_C]
    available_tail_questions = [i for i, x in enumerate(eval_results) if x == "yes"]

    # 꼬리 질문 생성 여부 확인
    if available_tail_questions and tail_question_count < 3:
        selected_index = random.choice(available_tail_questions)
        if selected_index == 0:
            tail_question = tail_question_generate_A()
        elif selected_index == 1:
            tail_question = tail_question_generate_B()
        elif selected_index == 2:
            tail_question = tail_question_generate_C()

        total_messages.append({"tail_question": tail_question})
        tail_question_count += 1  # 꼬리 질문 개수 증가

        return tail_question, "tail_question"
    else:
        return None, "no_more_tail_questions"

# 메인 질문을 처리하는 함수
def handle_main_questions():
    global current_question_index, tail_question_count

    # 현재 질문 인덱스가 남아있으면 계속 진행
    if current_question_index < len(main_questions):
        total_messages.append({"main_question": main_questions[current_question_index]})
        return main_questions[current_question_index], "next_question"
    else:
        return None, "interview_complete"


@app.route('/process_audio', methods=['POST'])
def process_audio():
    global current_question_index, main_questions, tail_question_count

    if 'file' in request.files:
        audio_file = request.files['file']
        # STT 변환
        transcript = speech_to_text(audio_file)
        total_messages.append({"answer": transcript})
        
        summary = total_messages[0]  # 첫 번째 항목이 summary

        # 꼬리 질문이 있으면 먼저 처리
        if tail_question_count > 0 and tail_question_count < 3:
            tail_question, tail_status = handle_tail_questions(summary)

            if tail_status == "tail_question":
                return jsonify({"tail_question": tail_question, "status": "tail_question"})

        # 더 이상 꼬리 질문이 없으면 다음 메인 질문으로 넘어감
        current_question_index += 1  # 다음 메인 질문으로 인덱스 이동
        tail_question_count = 0  # 꼬리 질문 개수 초기화
        main_question, main_status = handle_main_questions()

        if main_status == "next_question":
            return jsonify({"main_question": main_question, "status": "next_question"})
        else:
            return jsonify({"status": "면접 완료"})  # 마지막 질문 처리 완료

    return jsonify({"error": "오디오 파일을 찾을 수 없습니다."}), 400


# 면접 완료 후 피드백 처리
@app.route('/feedback', methods=['POST'])
def feedback():
    summary = total_messages[0]
    final_feedback = feedback_generate(summary, total_messages)
    return jsonify({"feedback": final_feedback})


if __name__ == '__main__':
    app.run(debug=True)
