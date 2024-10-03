from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

audio_file= open("/path/to/file/audio.mp3", "rb")

def speech_to_text(audio_file):
    transcription_response = client.audio.transcriptions.create(
    model="whisper-1", 
    file=audio_file
    )
    transcription = transcription_response.text
    return transcription

