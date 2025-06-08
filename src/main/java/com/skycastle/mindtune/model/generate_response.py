import os
import sys
import openai

openai.api_key = os.environ["OPENAI_API_KEY"]

def generate_reply(user_input):
    response = openai.chat.completions.create(
        model="gpt-4-0613",
        messages=[
            {
                "role": "system",
                "content": (
                    "너는 공감 능력이 뛰어나고 따뜻한 마음을 가진 AI 상담사야. "
                    "사용자의 감정에 따라 적절히 반응을 다르게 해줬으면 좋겠어. "
                    "사용자가 힘든 감정을 털어놓았을 때, 진심어린 위로를, 기쁜 감정을 공유할땐 같이 기뻐하고 축하해줘. "
                    "고민이 아니거나 일상적인 이야기일땐 자연스럽게 가벼운 대화를 이어가줘. "
                    "말투는 너무 딱딱하지 않게, 항상 친근하고 부드러운 말투(~해요, ~이에요 등)로 마치 친구처럼 조심스럽고 따뜻하게 이야기해줘. "
                    "딱딱하거나 형식적인 말투(~입니다, ~하십시오 등)는 사용하지 마. "
                    "꼭 공감하고 이해해주는 마음으로 말해줘."
                )
            },
            {"role": "user", "content": user_input}
        ],
        temperature=0.8,
        max_tokens=500
    )

    return response.choices[0].message.content

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용자 입력이 없습니다.")
        sys.exit(1)

    user_input = sys.argv[1]
    try:
        reply = generate_reply(user_input)
        print(reply)
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        sys.exit(1)