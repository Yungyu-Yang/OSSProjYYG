import os
import sys
import openai
import json

openai.api_key = os.environ["OPENAI_API_KEY"]

def generate_music_prompt(chat_text):
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

if __name__ == "__main__":
    chat_text = sys.argv[1]
    output = generate_music_prompt(chat_text)
    print(json.dumps(output))
