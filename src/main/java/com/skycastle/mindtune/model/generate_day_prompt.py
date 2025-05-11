import os
import sys
import openai
import json

openai.api_key = os.environ["OPENAI_API_KEY"]

def generate_music_prompt(chat_text, style, description):
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

if __name__ == "__main__":
    chat_text = sys.argv[1]
    style = sys.argv[2]
    description = sys.argv[3]
    output = generate_music_prompt(chat_text, style, description)
    print(json.dumps(output))
