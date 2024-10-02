from openai import OpenAI
client = OpenAI()

audio_file= open("/path/to/file/audio.mp3", "rb")

def speech_to_text(audio_file):
    transcription_response = client.audio.transcriptions.create(
    model="whisper-1", 
    file=audio_file
    )
    transcription = transcription_response.text
    return transcription

print(speech_to_text(audio_file))