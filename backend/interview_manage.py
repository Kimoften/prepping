from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
UPSTAGE_API_KEY = os.getenv('UPSTAGE_API_KEY')

client = OpenAI(
    api_key=UPSTAGE_API_KEY,
    base_url="https://api.upstage.ai/v1/solar"
)



def tail_question_generate_A(summary, total_message):
    tail_question_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer A of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문을 생성해."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    tail_question = tail_question_generation.choices[0].message.content
    return tail_question

def tail_question_eval_A(summary, total_message):
    tail_question_eval = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer A of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문이 필요할지를 결정해줘.
                                답변은 (yes, no) 두 가지로만 해줘."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    tail_question_evaluation = tail_question_eval.choices[0].message.content
    return tail_question_evaluation

def tail_question_generate_B(summary, total_message):
    tail_question_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer B of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문을 생성해."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    tail_question = tail_question_generation.choices[0].message.content
    return tail_question

def tail_question_eval_B(summary, total_message):
    tail_question_eval = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer B of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문이 필요할지를 결정해줘.
                                답변은 (yes, no) 두 가지로만 해줘."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    tail_question_evaluation = tail_question_eval.choices[0].message.content
    return tail_question_evaluation

def tail_question_generate_C(summary, total_message):
    tail_question_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer C of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문을 생성해."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    tail_question = tail_question_generation.choices[0].message.content
    return tail_question

def tail_question_eval_C(summary, total_message):
    tail_question_eval = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer C of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문이 필요할지를 결정해줘.
                                답변은 (yes, no) 두 가지로만 해줘."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    tail_question_evaluation = tail_question_eval.choices[0].message.content
    return tail_question_evaluation