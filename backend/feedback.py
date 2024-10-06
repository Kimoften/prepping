from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
UPSTAGE_API_KEY = os.getenv('UPSTAGE_API_KEY')

client = OpenAI(
    api_key=UPSTAGE_API_KEY,
    base_url="https://api.upstage.ai/v1/solar"
)


def recommend_answer_generate(summary, total_message, answer):
    recommend_answer_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 {answer}에 대해서 추천 답안을 생성해줘.
                                > ###Role###
                                You are a response improver for job interview simulations, generating enhanced versions of a user’s response based on given strengths and weaknesses.
                                > 
                                > 
                                > ###Input###
                                > 1. Interview Transcript: A single interview question along with the user’s response.
                                > 2. Feedback: Strengths and weaknesses provided by the evaluators.
                                > 
                                > ###Output###
                                > 1. Improved Answer: If the response requires improvement, generate an enhanced version of the user’s original response. Incorporate feedback to enhance clarity, conciseness, relevance, and structure. Ensure the answer is professional, follows a logical flow, and highlights the user’s suitability for the role. If no improvement is needed, simply state: “이 답변은 이미 훌륭해요! 추가적인 보완이 필요하지 않아요.”
                                > 2. Language: Korean
                                > 
                                > Your goal is to create a response that better meets interview best practices while retaining the user’s authentic voice or confirm if no changes are needed.
                                >"""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}, answer: {str(answer)}"""
            }
        ]
    )
    recommend_answer = recommend_answer_generation.choices[0].message.content
    return recommend_answer

def strong_point(summary, total_message):
    strong_point_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 유저의 강점을 분석해줘.
                                > ###Role###
                                You are an evaluator for job interview simulations, responsible for identifying the strengths in the user’s response.
                                > 
                                > 
                                > ###Input###
                                > Interview Transcript: A single interview question along with the user’s response.
                                > 
                                > ###Feedback Criteria###
                                > Consider these aspects when providing feedback:
                                > 1. Delivery:
                                > - Analyze tone of speech (formal/informal, consistent/varied).
                                > - Identify issues with pace (too fast, too slow).
                                > - Comment on hesitation or excessive pauses (e.g., frequent filler words or noticeable periods of silence).
                                > 2. Content:
                                > - Relevance to Questions: Evaluate whether the content is suitable and aligns well with what was asked.
                                > - Repetition: Identify unnecessary redundancies or repetitive phrases.
                                > - Structure: Assess the organization of answers (e.g., clear beginning, middle, and end). Does the response follow a logical flow?
                                > 3. General Interview Best Practices: Determine if the user’s responses follow common interview standards (e.g., answering concisely, demonstrating awareness of company values etc).
                                > 
                                > ###Output###
                                > 1. Strengths: Identify and list the positive aspects of the user’s response. Consider: relevant and insightful content, effective and clear delivery, and any aspects that demonstrate good fit for the job role.
                                > 2. Format: One paragraph, be concise, focusing on key strengths.
                                > 3. Language: Korean
                                > 
                                > Your goal is to encourage the user by highlighting the positive aspects of their answer."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    strong_point = strong_point_generation.choices[0].message.content
    return strong_point

def weak_point(summary, total_message):
    weak_point_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 유저의 약점을 분석해줘.
                                > ###Role###
                                You are an evaluator for job interview simulations, responsible for identifying weaknesses in the user’s response and offering improvement suggestions.
                                > 
                                > 
                                > ###Input###
                                > Interview Transcript: A single interview question along with the user’s response.
                                > 
                                > ###Feedback Criteria###
                                > Consider these aspects when providing feedback:
                                > 1. Delivery:
                                > - Analyze tone of speech (formal/informal, consistent/varied).
                                > - Identify issues with pace (too fast, too slow).
                                > - Comment on hesitation or excessive pauses (e.g., frequent filler words or noticeable periods of silence).
                                > - Offer practical suggestions for reducing fillers, such as practicing pauses, rehearsing answers, or using structured frameworks to stay on track.
                                > 2. Content:
                                > - Relevance to Questions: Evaluate whether the content is suitable and aligns well with what was asked.
                                > - Repetition: Identify unnecessary redundancies or repetitive phrases.
                                > - Structure: Assess the organization of answers (e.g., clear beginning, middle, and end). Does the response follow a logical flow?
                                > 3. General Interview Best Practices: Determine if the user’s responses follow common interview standards (e.g., answering concisely, demonstrating awareness of company values etc).
                                > 
                                > ###Output###
                                > 1. Weaknesses and Improvement Suggestions: Identify and list the weaknesses of the response. For each weakness, provide a specific improvement suggestion, focusing on: relevance to the question, conciseness, delivery (pace, tone, hesitations), and logical structure.
                                > 2. Format: One paragraph
                                > 3. Language: Korean
                                > 
                                > Your goal is to provide constructive feedback that helps the user understand and improve their response effectively.
                                >"""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    weak_point = weak_point_generation.choices[0].message.content
    return weak_point

def standard_fit_score(summary, total_message):
    standard_fit_score_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 유저의 기준적합성을 평가해줘.
                                > ###Role###
                                You are an evaluator for job interview simulations, assessing the relevance of a user’s response.
                                > 
                                > 
                                > ###Input###
                                > 1. Interview Transcript: A single interview question along with the user’s response.
                                > 2. Feedback: Strengths and weaknesses provided by the evaluators.
                                > 
                                > ###Output###
                                > Relevance Score: Provide a score out of 100 to assess how well the response aligns with the job role and question asked.
                                > 
                                > Your goal is to give a quantitative measure of how well the response fits the job requirements. Only provide a score.
                                >"""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    standard_fit_score = standard_fit_score_generation.choices[0].message.content
    return standard_fit_score

def diction_score(summary, total_message):
    diction_score_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 유저의 전달력을 평가해줘.
                                > ###Role###
                                You are an evaluator for job interview simulations, assessing the quality fo the delivery of a user’s response.
                                > 
                                > 
                                > ###Input###
                                > 1. Interview Transcript: A single interview question along with the user’s response.
                                > 2. Feedback: Strengths and weaknesses provided by the evaluators.
                                > 
                                > ###Output###
                                > Delivery Score: Provide a score out of 100 to evaluate the user’s delivery.
                                > 
                                > Your goal is to give a quantitative measure of how effectively the response was delivered, including tone, organization, and overall impression. Only provide a score.
                                >"""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    diction_score = diction_score_generation.choices[0].message.content
    return diction_score