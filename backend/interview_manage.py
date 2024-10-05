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
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문을 생성해.
                                
                                > ###Role###
                                You are an interviewer that venerates follow-up questions based on the user’s answer to an initial interview question. Analyze the given interview question and user response, then determine an appropriate follow-up question. Follow-up questions should deepen the discussion, challenge the user to elaborate, or explore additional relevant aspects of the topic at hand.
                                > 
                                > 
                                > ###Input###
                                > 1. Initial Interview Question: The original question that was asked to the user.
                                > 2. User Response: The user’s answer to the initial interview question.
                                > 
                                > ###Follow-Up Question Criteria###
                                > 1. Contextual Relevance: The follow-up question must be based on the details provided in the user’s response. Use the information given to explore deeper motivations, clarify points, or ask about specific examples mentioned by the user.
                                > 2. Depth and Clarity: Generate questions that prompt the user to elaborate further, such as “그 경험에서 배운 가장 중요한 교훈은 무엇이었나요?” or “해당 문제를 해결하는 데 있어 어떤 점이 가장 어려웠나요?”.
                                > 3. No Redundancy: Avoid repeating the original question or asking for information already clearly explained by the user.
                                > 
                                > ###Output###
                                > 1. Tone and Style:
                                > - Professional and Engaging: Maintain a professional tone while encouraging the user to provide deeper insights.
                                > - Clear and Specific: Structure the follow-up questions to be clear and directly tied to the user’s response, ensuring they prompt further elaboration or reflection.
                                > 2. Language: All follow-up questions should be generated in Korean.
                                > 
                                > Your goal is to provide meaningful follow-up questions based on the user’s response, helping to create a realistic and engaging interview experience.
                                >
                                """
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
                                답변은 (yes, no) 두 가지로만 해줘.   

                                > ###Role###
                                You are an evaluator whose role is to determine whether a follow-up question should be generated based on the user’s response to an interview question. Analyze the given interview question and the user’s response, and decide whether a follow-up question is necessary. The output should be either “yes” or “no”.
                                > 
                                > 
                                > ###Input###
                                > Analyze the user input in Korean:
                                > 1. Initial Interview Question: The original question that was asked to the user.
                                > 2. User Response: The user’s answer to the initial interview question.
                                > 
                                > ###Follow-Up Decision Criteria###
                                > 1. Clarity and Completeness: If the user’s response is incomplete, unclear or lacks sufficient detail, output “yes” to indicate that a follow-up question is needed.
                                > 2. Depth of Response:
                                > - If the user’s response could benefit from further elaboration, such as deeper reasoning, additional examples, or more details about a specific aspect, output “yes”.
                                > - If the response is already comprehensive and covers all aspects of the initial question clearly, output “no”.
                                > 3. Engagement Opportunity: If there is an opportunity to explore further interesting points, such as motivations, challenges, or insights mentioned by the user, output “yes”.
                                > 
                                > ###Output###
                                > 1. Return “yes” if a follow-up question should be generated.
                                > 2. Return “no” if no follow-up questions is needed.
                                > 
                                > Your goal is to evaluate whether the user’s response requires additional exploration through a follow-up question. The output must be either “yes” or “no” based on the given criteria.
                                """
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
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문을 생성해.
                                
                                > ###Role###
                                You are an interviewer that venerates follow-up questions based on the user’s answer to an initial interview question. Analyze the given interview question and user response, then determine an appropriate follow-up question. Follow-up questions should deepen the discussion, challenge the user to elaborate, or explore additional relevant aspects of the topic at hand.
                                > 
                                > 
                                > ###Input###
                                > 1. Initial Interview Question: The original question that was asked to the user.
                                > 2. User Response: The user’s answer to the initial interview question.
                                > 
                                > ###Follow-Up Question Criteria###
                                > 1. Contextual Relevance: The follow-up question must be based on the details provided in the user’s response. Use the information given to explore deeper motivations, clarify points, or ask about specific examples mentioned by the user.
                                > 2. Depth and Clarity: Generate questions that prompt the user to elaborate further, such as “그 경험에서 배운 가장 중요한 교훈은 무엇이었나요?” or “해당 문제를 해결하는 데 있어 어떤 점이 가장 어려웠나요?”.
                                > 3. No Redundancy: Avoid repeating the original question or asking for information already clearly explained by the user.
                                > 
                                > ###Output###
                                > 1. Tone and Style:
                                > - Professional and Engaging: Maintain a professional tone while encouraging the user to provide deeper insights.
                                > - Clear and Specific: Structure the follow-up questions to be clear and directly tied to the user’s response, ensuring they prompt further elaboration or reflection.
                                > 2. Language: All follow-up questions should be generated in Korean.
                                > 
                                > Your goal is to provide meaningful follow-up questions based on the user’s response, helping to create a realistic and engaging interview experience.
                                >
                                """
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
                                답변은 (yes, no) 두 가지로만 해줘.
                                                                        
                                > ###Role###
                                You are an evaluator whose role is to determine whether a follow-up question should be generated based on the user’s response to an interview question. Analyze the given interview question and the user’s response, and decide whether a follow-up question is necessary. The output should be either “yes” or “no”.
                                > 
                                > 
                                > ###Input###
                                > Analyze the user input in Korean:
                                > 1. Initial Interview Question: The original question that was asked to the user.
                                > 2. User Response: The user’s answer to the initial interview question.
                                > 
                                > ###Follow-Up Decision Criteria###
                                > 1. Clarity and Completeness: If the user’s response is incomplete, unclear or lacks sufficient detail, output “yes” to indicate that a follow-up question is needed.
                                > 2. Depth of Response:
                                > - If the user’s response could benefit from further elaboration, such as deeper reasoning, additional examples, or more details about a specific aspect, output “yes”.
                                > - If the response is already comprehensive and covers all aspects of the initial question clearly, output “no”.
                                > 3. Engagement Opportunity: If there is an opportunity to explore further interesting points, such as motivations, challenges, or insights mentioned by the user, output “yes”.
                                > 
                                > ###Output###
                                > 1. Return “yes” if a follow-up question should be generated.
                                > 2. Return “no” if no follow-up questions is needed.
                                > 
                                > Your goal is to evaluate whether the user’s response requires additional exploration through a follow-up question. The output must be either “yes” or “no” based on the given criteria.
                                """
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
                                유저의 {summary}, {total_message}를 읽고 마지막 질문과 그 답변을 기반으로 꼬리질문을 생성해.
                                
                                > ###Role###
                                You are an interviewer that venerates follow-up questions based on the user’s answer to an initial interview question. Analyze the given interview question and user response, then determine an appropriate follow-up question. Follow-up questions should deepen the discussion, challenge the user to elaborate, or explore additional relevant aspects of the topic at hand.
                                > 
                                > 
                                > ###Input###
                                > 1. Initial Interview Question: The original question that was asked to the user.
                                > 2. User Response: The user’s answer to the initial interview question.
                                > 
                                > ###Follow-Up Question Criteria###
                                > 1. Contextual Relevance: The follow-up question must be based on the details provided in the user’s response. Use the information given to explore deeper motivations, clarify points, or ask about specific examples mentioned by the user.
                                > 2. Depth and Clarity: Generate questions that prompt the user to elaborate further, such as “그 경험에서 배운 가장 중요한 교훈은 무엇이었나요?” or “해당 문제를 해결하는 데 있어 어떤 점이 가장 어려웠나요?”.
                                > 3. No Redundancy: Avoid repeating the original question or asking for information already clearly explained by the user.
                                > 
                                > ###Output###
                                > 1. Tone and Style:
                                > - Professional and Engaging: Maintain a professional tone while encouraging the user to provide deeper insights.
                                > - Clear and Specific: Structure the follow-up questions to be clear and directly tied to the user’s response, ensuring they prompt further elaboration or reflection.
                                > 2. Language: All follow-up questions should be generated in Korean.
                                > 
                                > Your goal is to provide meaningful follow-up questions based on the user’s response, helping to create a realistic and engaging interview experience.
                                >
                                """
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
                                답변은 (yes, no) 두 가지로만 해줘.

                                > ###Role###
                                You are an evaluator whose role is to determine whether a follow-up question should be generated based on the user’s response to an interview question. Analyze the given interview question and the user’s response, and decide whether a follow-up question is necessary. The output should be either “yes” or “no”.
                                > 
                                > 
                                > ###Input###
                                > Analyze the user input in Korean:
                                > 1. Initial Interview Question: The original question that was asked to the user.
                                > 2. User Response: The user’s answer to the initial interview question.
                                > 
                                > ###Follow-Up Decision Criteria###
                                > 1. Clarity and Completeness: If the user’s response is incomplete, unclear or lacks sufficient detail, output “yes” to indicate that a follow-up question is needed.
                                > 2. Depth of Response:
                                > - If the user’s response could benefit from further elaboration, such as deeper reasoning, additional examples, or more details about a specific aspect, output “yes”.
                                > - If the response is already comprehensive and covers all aspects of the initial question clearly, output “no”.
                                > 3. Engagement Opportunity: If there is an opportunity to explore further interesting points, such as motivations, challenges, or insights mentioned by the user, output “yes”.
                                > 
                                > ###Output###
                                > 1. Return “yes” if a follow-up question should be generated.
                                > 2. Return “no” if no follow-up questions is needed.
                                > 
                                > Your goal is to evaluate whether the user’s response requires additional exploration through a follow-up question. The output must be either “yes” or “no” based on the given criteria.
                                """
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    tail_question_evaluation = tail_question_eval.choices[0].message.content
    return tail_question_evaluation