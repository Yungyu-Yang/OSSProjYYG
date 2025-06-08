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
                "content": """You are a sensitive and creative music assistant.
                
                Given the user's chat, detect their emotional state and suggest two music description styles:
                
                1. "expressive": a description that reflects or amplifies the user's current emotion
                2. "counter": a description that soothes, balances, or contrasts the current emotion
                
                Each description should be written in warm, natural Korean that emotionally resonates with the user.
                Do NOT copy preset phrases. Tailor each suggestion to the user's unique emotional state and context.
                
                Return your result using the function schema below.
                """
            },
            {"role": "user", "content": chat_text}
        ],
        functions=[
            {
                "name": "define_style",
                "description": "Suggest two emotional music description styles (expressive and counter) based on the user's feelings.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expressive": {
                            "type": "string",
                            "description": "A natural Korean description that musically expresses or amplifies the user's current emotion."
                        },
                        "counter": {
                            "type": "string",
                            "description": "A natural Korean description that musically softens or contrasts the user's current emotion."
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
                and generate an English music generation prompt suitable for the Suno AI V3_5 music generation model.
                
                The user has selected a music style: "{style}", which means: "{description}"
                
                Generate a detailed music prompt that includes:
                - musical genre/style,
                - mood/emotion,
                - instruments to be used,
                - tempo (BPM),
                - and any relevant details to guide Suno AI music generation.
                
                The prompt must be:
                - in natural, clear English
                - under 200 characters
                - and must NOT contain any Korean characters or words."""
            },
            {"role": "user", "content": chat_text}
        ],
        functions=[
            {
                "name": "extract_music_prompt",
                "description": "Extract emotion and generate a detailed music prompt in English for Suno AI V3_5 model based on user chat.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "emotion": {
                            "type": "string",
                            "enum": ["positive", "normal", "negative"]
                        },
                        "prompt": {
                            "type": "string",
                            "description": "A detailed music generation prompt in English suitable for the Suno AI V3_5 model (max 200 characters)."
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
                "content": """You are a music assistant.
                
                Given a full month of chat conversations from a user, analyze the emotional progression over time
                (e.g., happy at the beginning, stressed in the middle, and calm at the end), and generate a rich,
                evocative English music prompt suitable for the Suno AI V3_5 music generation model.
                
                The music prompt should:
                - reflect the emotional journey or shifts across the month
                - include musical style/genre, mood, instruments, and tempo (BPM)
                - be written in clear, natural English
                - be under 250 characters
                - and must NOT contain any Korean characters or words"""
            },
            {"role": "user", "content": chat_text}
        ],
        functions=[
            {
                "name": "extract_music_prompt",
                "description": "Generate a detailed English music prompt that reflects the user's monthly emotional journey.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "prompt": {
                            "type": "string",
                            "description": "A rich music generation prompt in English for Suno AI V3_5 reflecting the user's monthly emotional progression (max 250 characters)."
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
