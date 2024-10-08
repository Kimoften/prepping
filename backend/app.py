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
from feedback import recommend_answer_generate, strong_point, weak_point, standard_fit_score, diction_score
import io

app = Flask(__name__)

load_dotenv()
UPSTAGE_API_KEY = os.getenv('UPSTAGE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

client = OpenAI(
    api_key=UPSTAGE_API_KEY,
    base_url="https://api.upstage.ai/v1/solar"
)


total_messages = []
main_questions = []

CORS(app)  # CORS 설정으로 Next.js와의 통신 허용

@app.route('/upload', methods=['POST'])
def upload():
    global main_questions
    if 'file' in request.files:
        file = request.files['file']
        print('Received file:', file.filename)
        url = "https://api.upstage.ai/v1/document-ai/ocr"
        headers = {"Authorization": f"Bearer {UPSTAGE_API_KEY}"}
        # 파일 데이터를 FileStorage 객체에서 읽어서 바로 업로드
        files = {"document": (file.filename, file.stream, file.mimetype)}
        response = requests.post(url, headers=headers, files=files)
        response_json = response.json()
        print(response_json)

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
        
        summary = {
                "job": "개발자",
                "company": "삼성",
                "traits": traits,
                "이력서": "안녕하세요 취업 준비생입니다."
            }

        total_messages.append(summary)
        main_question = main_question_generate(summary)
        main_questions.append(main_question)

    else:
        return jsonify({"status": "no_file"}), 404

        # 성공 응답 보내기
    return jsonify({"status": "success"}), 200


def main_question_generate(summary):
    generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""
                            > ###Role###
                            You are an interviewer for {summary['job']}. Generate relevant and insightful interview questions based on the user's {summary}, which includes their self-introduction, desired job role, target company's core values, and the number of questions requested. Focus solely on replicating the style and depth of questions a professional interviewer would ask, drawing inspiration from common job interview question types in the industry. While considering the target company's core values, avoid directly referencing these values in your questions.
                            > 
                            > 
                            > ###Input###
                            > 1. Self-Introduction: Utilize the user's personal experiences, skills, and background as described in their self-introduction to frame questions about their motivations, past challenges, and personal growth.
                            > 2. Desired Job Role: Generate questions specifically related to the tasks and responsibilities of the desired job role, evaluating the user's technical and soft skills relevant to the position.
                            > 3. Target Company's Core Values: Consider the target company's mission, vision, and values when assessing alignment, but avoid explicitly mentioning these values in the questions.
                            > 4. Number of Questions: Generate the specified number of interview questions.
                            > 
                            > ###Interview Question Criteria###
                            > 1. General Introduction Questions: Start with general questions to ease the user into the interview, such as "자기소개를 해주세요."
                            > 2. Behavioral Questions:
                            > - Generate questions that prompt the user to describe their experiences, focusing on specific scenarios that demonstrate their skills and problem-solving abilities.
                            > - Examples include:
                            > - "과거에 직장에서 큰 어려움을 겪었던 경험과 그것을 어떻게 극복했는지 말씀해 주세요."
                            > - "자신만의 경쟁력을 말해보세요."
                            > - "공백기간 동안 무엇을 했습니까?"
                            > 3. Technical and Role-Specific Questions:
                            > - Generate questions that evaluate the user’s knowledge, skills, and suitability for the desired job role, based on their technical background and desired responsibilities.
                            > - Examples include:
                            > - "지원 분야에서 일을 잘할 수 있는 이유는 무엇이라고 생각하십니까?"
                            > - "지원 분야에서 본인의 강점은 무엇인가요?"
                            > - "해당 직무를 선택한 이유는 무엇입니까?"
                            > 4. Company Fit:
                            > - Create questions that assess the user's fit with the company culture and values, but do so implicitly. Focus on broader behavioral and situational questions that would reveal whether the user’s values and behaviors align with the company's culture.
                            > - Examples include:
                            > - "왜 이 회사에 지원하게 되었나요?"
                            > - "회사의 성장에 어떻게 기여할 수 있을 것이라 생각하십니까?"
                            > - "어떤 환경에서 가장 잘 일할 수 있다고 생각하십니까?"
                            > 5. General Industry-Specific and Contextual Questions:
                            > - Utilize common industry interview questions as inspiration. You don’t need to include all the provided questions but refer to these types as examples:
                            > - "직무 지원 동기는 무엇인가요?"
                            > - "다른 지원자들에 비해 본인의 차별성을 어필한다면 어떤 점이 있겠습니까?"
                            > - "이 자리에 오기 위해 무엇을 준비했습니까?"
                            > 
                            > ###Output###
                            > 1. Tone and Style:
                            > - Professional: Maintain a professional tone, focusing only on asking questions as a real interviewer would.
                            > - Challenging but Fair: Structure the questions to challenge the user while ensuring they are clear and fair.
                            > - No Guidance: Avoid giving any tips or guidance; your role is purely to ask interview questions.
                            > 2. Language: All interview questions should be generated in Korean.
                            > 3. Question Count: Only four questions.
                            > 4. Inspiration from Industry Questions: Refer to common industry question types for interview scenarios, such as those involving skills, experience, motivations, and company-specific interests.
                            > 5. Core Values Consideration: Consider the company's core values when generating questions, but avoid directly mentioning them. Instead, focus on behaviors, motivations, and experiences that could imply alignment with these values.
                            > 
                            > Your goal is to provide a realistic interview experience, generating a diverse set of interview questions tailored to the user’s background, desired job role, and company alignment without explicitly mentioning core values. Focus solely on questioning to assess the user’s readiness and fit for the role comprehensively.
                            >
                            response_format must be ['첫번째 질문', '두번째 질문', '세번째 질문', '네번째 질문']
                            """
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



@app.route('/start_interview', methods=['GET'])
def start_interview():
    global main_questions, current_question_index, tail_question_count
    current_question_index = 0
    tail_question_count = 0
    # main_question_list = main_questions[0]
    print(main_questions)
    total_messages.append(main_questions[0])
    return jsonify({"first_question": main_questions[0]})  # 첫 질문 반환


# 꼬리 질문을 재귀적으로 처리하는 함수
def handle_tail_questions(summary):
    global main_questions, current_question_index, tail_question_count

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
    if current_question_index < len(main_questions[0]):
        total_messages.append({"main_question": main_questions[0][current_question_index]})
        return main_questions[0][current_question_index], "next_question"
    else:
        return None, "interview_complete"

answers = []  # 사용자의 답변만 모아 놓는 리스트
recommended_answers = []

@app.route('/process_audio', methods=['POST'])
def process_audio():
    global current_question_index, main_questions, tail_question_count

    if 'file' in request.files:
        audio_file = request.files['file']

        # Flask FileStorage -> bytes 변환
        audio_bytes = audio_file.read()

        # io.BytesIO로 감싸서 파일처럼 다룸
        audio_io = io.BytesIO(audio_bytes)
        audio_io.name = audio_file.filename

        # STT 변환
        transcript = speech_to_text(audio_io)

        # 답변만 별도로 answers 리스트에 추가
        answers.append(transcript)
        total_messages.append({"answer": transcript})
        
        summary = total_messages[0]  # 첫 번째 항목이 summary

        # 꼬리 질문이 있으면 먼저 처리
        if tail_question_count > 0 and tail_question_count < 3:
            tail_question, tail_status = handle_tail_questions(summary)

            if tail_status == "tail_question":
                return jsonify({"answer": transcript, "tail_question": tail_question, "status": "tail_question"})

        # 더 이상 꼬리 질문이 없으면 다음 메인 질문으로 넘어감
        current_question_index += 1  # 다음 메인 질문으로 인덱스 이동
        tail_question_count = 0  # 꼬리 질문 개수 초기화
        main_question, main_status = handle_main_questions()

        if main_status == "next_question":
            return jsonify({"answer": transcript, "main_question": main_question, "status": "next_question"})
        else:
            return jsonify({"answer": transcript, "status": "면접 완료"})  # 마지막 질문 처리 완료

    return jsonify({"error": "오디오 파일을 찾을 수 없습니다."}), 400


# 면접 완료 후 피드백 처리
@app.route('/feedback', methods=['GET'])
def feedback():
    summary = total_messages[0]
    strongpoint = strong_point(summary, total_messages)
    weakpoint = weak_point(summary, total_messages)
    standardfit_score = standard_fit_score(summary, total_messages)
    dictionscore = diction_score(summary, total_messages)

    # answers 리스트의 각 답변을 recommend_answer_generate 함수로 처리
    for answer in answers:
        recommended_answer = recommend_answer_generate(summary, total_messages, answer)  # 각 답변을 recommend_answer_generate로 처리
        recommended_answers.append(recommended_answer)  # 처리된 결과를 리스트에 추가

    return jsonify({"company": summary['company'], "strong_point": strongpoint, "weak_point": weakpoint, "standard_fit_score": standardfit_score, "diction_score": dictionscore, "answers": answers, "recommended_answers": recommended_answers})


if __name__ == '__main__':
    app.run(debug=True)

# host='0.0.0.0', port=5000, 