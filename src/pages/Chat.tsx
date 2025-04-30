import { useState, useEffect } from "react";
import { PiMicrophoneBold, PiArrowRight, PiPlay, PiPause, PiSkipBack, PiSkipForward } from "react-icons/pi";
import avatar from '../assets/avatar/avatar1.png';

// 프로그레스 바 애니메이션 스타일
const progressBarStyles = `
  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;

const Chat = () => {
  // 사용자 입력, 음악 생성 및 재생 상태 관리
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // 3분 길이의 곡으로 가정

  // 음악 재생 중일 때, 시간을 1초씩 증가
  useEffect(() => {
    let timer: number;
    if (isPlaying && currentTime < duration) {
      timer = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTime, duration]);

  // 음악 생성 함수
  const handleGenerateMusic = () => {
    setIsGenerating(true);    // 음악 생성 중 상태로 변경
    setTimeout(() => {
      setIsGenerating(false); // 생성 완료 후 상태 변경
      // 임의의 곡 정보 설정
      setDuration(30);        // 임의의 음악 길이 (30초)
      setCurrentTime(0);      // 음악 시작 시간 0으로 초기화
      setIsPlaying(false);    // 음악 생성 완료 후 자동으로 멈춤
    }, 3000);                 // 임시로 3000ms(3초) 뒤에 완료 처리
  };

  // 시간을 "분:초" 형식으로 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 플레이/일시정지 버튼 클릭 시 상태 전환
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // 10초 뒤로 이동
  const handleSkipForward = () => {
    setCurrentTime(Math.min(currentTime + 10, duration));
  };

  // 10초 앞으로 이동
  const handleSkipBackward = () => {
    setCurrentTime(Math.max(currentTime - 10, 0));
  };

  return (
    <div className="flex h-screen bg-[#FFFDF8] text-[#333]">
      <style>{progressBarStyles}</style>
      
      {/* Main Chat Area */}
      <main className="flex flex-col flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Chat messages */}
        <div className="space-y-4 m-5 bg-[#F9F7F2] p-8">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img src={avatar} alt="Avatar" className="object-cover" />
          </div>
          
          <div className="flex flex-col">
            <div>맴미</div>
            <div className="bg-white p-4 rounded-xl shadow-sm max-w-lg">
              <p>어서와멤! 오늘 하루는 어땠는지 궁금하멤!</p>
            </div>
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
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img src={avatar} alt="Avatar" className="object-cover" />
          </div>
          
          <div className="flex flex-col">
            <div>맴미</div>
            <div className="bg-white p-4 rounded-xl shadow-sm max-w-lg">
              <p>
                그랬구멤! 너의 오늘 하루는<br />
                편안함, 즐거움, 상쾌한인 것 같멤!<br />
                이것들로 피아노 배경의 경쾌한 노래를 만들어볼까멤?
              </p>
            </div>
          </div>
        </div>

          <div className="flex flex-col items-center space-y-2 bg-[#FFE0D2] p-4 rounded-xl max-w-[300px] ml-auto mb-24">
            <button 
              className="bg-[#FFFDF8] text-sm px-4 py-2 rounded-xl shadow-sm max-w-[200px] w-full"
              onClick={handleGenerateMusic}   // 음악 생성 버튼 클릭 시 음악 생성 시작
            >
              좋아, 만들어줘!
            </button>
            <button className="bg-[#FFFDF8] text-sm px-4 py-2 rounded-xl shadow-sm max-w-[200px] w-full">
              다른 게 좋을 것 같아.
            </button>
          </div>

          {/* Input area */}
          <div className="flex justify-center items-center mt-24 space-x-2 w-full">
            <div className="flex items-center space-x-2 w-full max-w-[800px]">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full rounded-full px-4 py-2 pr-12 bg-[#FFE8D6] placeholder-white"
                placeholder="오늘 하루 어땠어?"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7C6F62]"
                title="전송" // 위치 조정
              >
                <PiArrowRight size={22} />
              </button>
            </div>

              <button 
                className="bg-[#FFE0D2] p-2 rounded-full shadow-sm"
                title="음성 입력"
              >
                <PiMicrophoneBold className="text-[#7C6F62] w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 음악 영역 */}
        <div
          className={`flex justify-center items-center mt-8 ${
            isGenerating
              ? "bg-[#FFE8D6] bg-opacity-70"
              : duration > 0
              ? "bg-[#FFB3AB] bg-opacity-70"
              : "bg-[#FFE8D6] bg-opacity-70"
          } p-8 rounded-3xl text-center shadow-md w-full max-w-[800px] mx-auto`}>
          {isGenerating ? (
            <div className="w-full">
              <p className="text-lg mb-4">음악을 만드는 중이에요...</p>
              <div className="w-full bg-[#FFB3AB] bg-opacity-30 h-2 rounded-full overflow-hidden">
                <div className="animate-progress bg-[#FFB3AB] h-full w-1/2"></div>
              </div>
            </div>
          ) : duration > 0 ? (
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-5">봄날의 산책</h3>
              
              <div className="w-full bg-[#FFE8D6] bg-opacity-90 h-2 rounded-full overflow-hidden mt-2 mb-2">
                <div 
                  className="bg-[#7C6F62] h-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-[#7C6F62]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <button 
                  onClick={handleSkipBackward}
                  className="text-black hover:text-[#7C6F62] transition-colors"
                  title="10초 뒤로"
                >
                  <PiSkipBack size={24} />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="text-black hover:text-[#7C6F62] transition-colors"
                  title={isPlaying ? "일시정지" : "재생"}
                >
                  {isPlaying ? <PiPause size={32} /> : <PiPlay size={32} />}
                </button>
                <button 
                  onClick={handleSkipForward}
                  className="text-black hover:text-[#7C6F62] transition-colors"
                  title="10초 앞으로"
                >
                  <PiSkipForward size={24} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-lg">아직 생성된 음악이 없어요.<br />맴미와 오늘 일상을 공유하고 만들어보세요!</p>
          )}
        </div>

      </main>
    </div>
  );
};

export default Chat;
  