import os
import sys
import openai

# 환경 변수에서 API 키 불러오기
openai.api_key = os.environ["OPENAI_API_KEY"]

def transcribe_audio(file_path: str) -> str:
    """
    Whisper API를 이용해 오디오 파일을 한국어로 텍스트 변환합니다.
    """
    with open(file_path, "rb") as audio_file:
        resp = openai.audio.transcriptions.create(
            file=audio_file,
            model="whisper-1",
            language="ko"  # 한국어 강제 지정
        )
    # OpenAIObject일 경우 .text, dict일 경우 ["text"]
    return resp.text if hasattr(resp, "text") else resp["text"]

if __name__ == "__main__":
    # 명령행 인자로 파일 경로를 받아 처리
    if len(sys.argv) < 2:
        print("오류: 변환할 오디오 파일 경로를 지정해주세요.")
        sys.exit(1)

    file_path = sys.argv[1]
    try:
        transcript = transcribe_audio(file_path)
        print(transcript)
    except Exception as e:
        print(f"오류 발생: {e}")
        sys.exit(1)