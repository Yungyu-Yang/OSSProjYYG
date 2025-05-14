import sys
import time
import json
import http.client
import os

def post_generate_music(prompt, api_key):
    payload = json.dumps({
        "prompt": prompt,
        "customMode": False,
        "instrumental": False,
        "model": "V3_5",
        "callBackUrl": "https://api.example.com/callback"
    })
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f"Bearer {api_key}"
    }

    conn = http.client.HTTPSConnection("apibox.erweima.ai")
    conn.request("POST", "/api/v1/generate", payload, headers)
    res = conn.getresponse()
    return json.loads(res.read().decode("utf-8"))

def get_music_result(task_id, api_key):
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f"Bearer {api_key}"
    }

    conn = http.client.HTTPSConnection("apibox.erweima.ai")
    endpoint = f"/api/v1/generate/record-info?taskId={task_id}"
    conn.request("GET", endpoint, "", headers)
    return json.loads(conn.getresponse().read().decode("utf-8"))

def extract_audio_url(result):
    try:
        suno_data = result["data"]["response"]["sunoData"]
        for item in suno_data:
            url = item.get("sourceAudioUrl") or item.get("audioUrl")
            if url and url.endswith(".mp3"):
                return url
    except Exception:
        pass
    raise RuntimeError(f".mp3 URL을 찾을 수 없음: {result}")

def generate_music(prompt):
    api_key = os.environ["SUNOAI_API_KEY"]

    data = post_generate_music(prompt, api_key)
    if data.get("code") != 200:
        raise RuntimeError(f"API 실패: {data.get('msg')} (code: {data.get('code')})")

    task_id = data.get("data", {}).get("taskId")
    if not task_id:
        raise RuntimeError("task_id가 응답에 없음")

    time.sleep(180)
    result = get_music_result(task_id, api_key)
    audio_url = extract_audio_url(result)
    print(audio_url)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_music.py <prompt>")
        sys.exit(1)
    generate_music(sys.argv[1])
