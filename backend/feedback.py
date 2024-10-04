from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
UPSTAGE_API_KEY = os.getenv('UPSTAGE_API_KEY')

client = OpenAI(
    api_key=UPSTAGE_API_KEY,
    base_url="https://api.upstage.ai/v1/solar"
)


def feedback_generate(summary, total_message):
    feedback_generation = client.chat.completions.create(
        model="solar-pro",
        messages=[
            {
                "role": "system",
                "content": f"""You are a interviewer of the {summary['job']}.
                                유저의 {summary}, {total_message}를 읽고 면접을 피드백해줘."""
            },
            {
                "role": "user",
                "content": f"""user info: {str(summary)}, total message: {str(total_message)}"""
            }
        ]
    )
    feedback = feedback_generation.choices[0].message.content
    return feedback