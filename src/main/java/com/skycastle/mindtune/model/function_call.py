import os
import sys
import openai
import json

openai.api_key = os.environ["OPENAI_API_KEY"]

def define_prompt_style(chat_text):
    response = openai.chat.completions.create(
        model="gpt-4-0613",
        messages=[
            {
                "role": "system",
                "content": """주어진 사용자 채팅 내용을 바탕으로 사용자의 감정을 분석하고, 다음 두 가지 스타일의 음악 설명을 자연스럽고 감성적인 문장으로 제안해주세요.
                1. 감정을 그대로 표현하는 음악 스타일 (style: "expressive")
                2. 감정을 상쇄하거나 완화하는 음악 스타일 (style: "counter")
                각각 style 이름은 고정이고, 설명(description)은 감정에 맞는 음악 추천 설명으로 생성해주세요."""
            },
            {"role": "user", "content": chat_text}
        ],
        functions=[
            {
                "name": "define_style",
                "description": "",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expressive": {
                            "type": "string",
                            "description": "사용자의 현재 감정을 음악적으로 그대로 표현하거나 강화하는 방식의 설명"
                                           "예시 : 슬픔 (sad) expressive: 당신의 슬픈 마음을 부드럽게 감싸주는 잔잔한 피아노 선율로 감정을 자연스럽게 흘려보내보세요."
                                           "예시 : 분노 (angry) expressive: 격정적인 비트와 강렬한 리듬으로 당신의 분노를 있는 그대로 표현해보세요."
                                           "예시 : 안정 (calm) expressive: 잔잔하고 평화로운 분위기를 그대로 이어가는 따뜻한 선율로 하루를 마무리해보세요."
                                           "예시 : 기쁨 (happy) expressive: 즐겁고 리듬감 있는 멜로디로 지금의 기쁨을 한껏 만끽해보세요!"
                        },
                        "counter": {
                            "type": "string",
                            "description": "사용자의 감정을 다른 방향으로 완화시키거나 상쇄하는 방식의 음악 설명"
                                           "예시 : 슬픔 (sad) counter: 따뜻하고 밝은 멜로디로 오늘의 무거운 기분을 조금이나마 가볍게 덜어보는 건 어떨까요?"
                                           "예시 : 분노 (angry) counter: 차분한 스트링 사운드와 부드러운 리듬이 당신의 날 선 감정을 가라앉히는 데 도움이 될 거예요."
                                           "예시 : 안정 (calm) counter: 가벼운 템포의 활기찬 리듬으로 조용한 하루에 생기를 더해보세요."
                                           "예시 : 기쁨 (happy) counter: 잔잔하고 따뜻한 음색으로 들뜬 마음을 차분하게 가라앉혀보는 것도 좋은 선택이에요."
                        }
                    },
                    "required": ["expressive", "counter"]
                }
            }
        ],
        function_call={"name": "define_style"}
    )
    result = response.choices[0].message.function_call.arguments
    return json.loads(result)

def extract_music_prompt_daily(chat_text, style, description):
    response = openai.chat.completions.create(
        model="gpt-4-0613",
        messages=[
            {
                "role": "system",
                "content": f"""You are a music assistant. 
                Given a conversation with a user, extract the emotional tone (positive, normal, or negative), 
                and generate an English music generation prompt suitable for the Stable Audio Open model.
                The user has selected a music style: "{style}", which means: "{description}"
                Generate a prompt that reflects this style.
                Include musical style, mood, instruments, and tempo in the prompt. And must be in English. Do not use any Korean."""
            },
            {"role": "user", "content": chat_text}
        ],
        functions=[
            {
                "name": "extract_music_prompt",
                "description": "Extract emotion and generate a music prompt in English based on user chat.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "emotion": {
                            "type": "string",
                            "enum": ["positive", "normal", "negative"]
                        },
                        "prompt": {
                            "type": "string",
                            "description": "A detailed music generation prompt in English suitable for the Stable Audio Open model."
                        }
                    },
                    "required": ["emotion", "prompt"]
                }
            }
        ],
        function_call={"name": "extract_music_prompt"}
    )
    result = response.choices[0].message.function_call.arguments
    return json.loads(result)

def extract_music_prompt_monthly(chat_text):
    response = openai.chat.completions.create(
        model="gpt-4-0613",
        messages=[
            {
                "role": "system",
                "content": "You are a music assistant."
                           "Given a month's worth of conversations with a user, extract the emotional tone over time "
                           "(such as happy at the beginning, sad in the middle, and happy again at the end)."
                           "Then generate an English music generation prompt suitable for the Stable Audio Open model"
                           "that reflects this emotional progression."
                           "Include musical style, mood, instruments, and tempo in the prompt. And must be in English. Do not use any Korean."
            },
            {"role": "user", "content": chat_text}
        ],
        functions=[
            {
                "name": "extract_music_prompt",
                "description": "Generate a music prompt that reflects the user's monthly emotional progression.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "prompt": {
                            "type": "string",
                            "description": "A detailed music generation prompt in English suitable for the Stable Audio Open model."
                        }
                    },
                    "required": ["prompt"]
                }
            }
        ],
        function_call={"name": "extract_music_prompt"}
    )
    result = response.choices[0].message.function_call.arguments
    return json.loads(result)

# CLI Interface
if __name__ == "__main__":
    mode = sys.argv[1]
    chat_text = sys.argv[2]

    if mode == "style":
        output = define_prompt_style(chat_text)
    elif mode == "daily":
        style = sys.argv[3]
        description = sys.argv[4]
        output = extract_music_prompt_daily(chat_text, style, description)
    elif mode == "monthly":
        output = extract_music_prompt_monthly(chat_text)
    else:
        raise ValueError("Invalid mode. Use 'style', 'daily', or 'monthly'.")

    print(json.dumps(output))
