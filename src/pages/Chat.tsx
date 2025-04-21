// const Chat = () => {
//     return (
//       <div className="text-center text-2xl mt-10">
//         🚀 Chat Page입니다!
//       </div>
      // components/ChatPage.jsx
import { useState } from "react";
import { FaRegSmile, FaUser, FaHome, FaComments, FaCalendar } from "react-icons/fa";
import { PiMicrophoneBold } from "react-icons/pi";

const Chat = () => {
  const [userInput, setUserInput] = useState("");

  return (
    <div className="flex h-screen bg-[#FFF9F5] text-[#333]">
      {/* Sidebar */}
      {/* <aside className="w-20 bg-[#FFEFEA] flex flex-col items-center py-6 space-y-6">
        <img src="/logo.png" alt="MindTune Logo" className="w-10 h-10 mb-4" />
        <FaHome className="text-[#F4B8A7] w-6 h-6" />
        <FaComments className="text-[#F4B8A7] w-6 h-6" />
        <FaCalendar className="text-[#F4B8A7] w-6 h-6" />
        <FaRegSmile className="text-[#F4B8A7] w-6 h-6" />
        <FaUser className="text-[#F4B8A7] w-6 h-6" />
      </aside> */}

      {/* Main Chat Area */}
      <main className="flex flex-col flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Chat messages */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">🤖</div>
            <div className="bg-white p-4 rounded-xl shadow-sm max-w-lg">
              <p>어서와멤! 오늘 하루는 어땠는지 궁금하멤!</p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-[#FFE0D2] p-4 rounded-xl shadow-sm max-w-lg">
              <p>
                오늘은 날씨가 좋아서 산책을 했어!<br />
                머리가 복잡했는데, 상쾌한 봄 공기를 마시니까<br />
                머리가 맑아지는 것 같더라구~ <br />
                요즘 좀 지쳤었는데, 재충전된 기분이야!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">🤖</div>
            <div className="bg-white p-4 rounded-xl shadow-sm max-w-lg">
              <p>
                그랬구멤! 너의 오늘 하루는<br />
                편안함, 즐거움, 상쾌한인 것 같멤!<br />
                이것들로 피아노 배경의 경쾌한 노래를 만들어볼까멤?
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button className="bg-[#FFE0D2] text-sm px-4 py-2 rounded-xl shadow-sm">좋아, 만들어줘!</button>
            <button className="bg-[#FFE0D2] text-sm px-4 py-2 rounded-xl shadow-sm">다른 게 좋을 것 같아.</button>
          </div>
        </div>

        {/* Input area */}
        <div className="flex items-center mt-auto space-x-2">
          <input
            type="text"
            className="flex-1 rounded-full px-4 py-2 border border-gray-300 shadow-sm"
            placeholder="오늘 하루 어땠어?"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button 
            className="bg-[#FFE0D2] p-2 rounded-full shadow-sm"
            title="음성 입력"
          >
            <PiMicrophoneBold className="text-red-500 w-5 h-5" />
          </button>
        </div>

        {/* Music placeholder */}
        <div className="mt-8 bg-[#FFE0D2] p-8 rounded-3xl text-center shadow-md">
          <p className="text-lg">아직 생성된 음악이 없어요.<br />맴미와 오늘 일상을 공유하고 만들어보세요!</p>
        </div>
      </main>
    </div>
  );
};

export default Chat;
  