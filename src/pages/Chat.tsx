import { useState, useEffect, useRef } from "react";
import { PiMicrophoneBold, PiArrowRight, PiPlay, PiPause, PiSkipBack, PiSkipForward } from "react-icons/pi";
import axios from "axios";
import MusicPlayer from '../components/MusicPlayer';

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

type Chat = {
  chat: string;
  isbot: number;
  created_at: string;
};


const Chat = () => {
  // 사용자 입력, 음악 생성 및 재생 상태 관리
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // 3분 길이의 곡으로 가정
  const [chatList, setChatList] = useState<Chat[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [analyzeResult, setAnalyzeResult] = useState<
    { style: string; description: string }[] | null
  >(null);
  const [lastStyle, setLastStyle] = useState<string | null>(null);
  const [lastDescription, setLastDescription] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [showSaveAndRetry, setShowSaveAndRetry] = useState(false);
  const [botAudioUrl, setBotAudioUrl] = useState<string | null>(null);
  const [anoImg, setAnoImg] = useState("");
  const [anoName, setAnoName] = useState("");
  const [isMusicSaved, setIsMusicSaved] = useState(false);



const handleGenerateMusicByStyleAgain = () => {
  if (lastStyle && lastDescription) {
    handleGenerateMusicByStyle(lastStyle, lastDescription);
  } else {
    alert("먼저 음악을 생성해주세요.");
  }
};

  const handleCreateMusic = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      setIsGenerating(true);
      setAnalyzeResult(null); // 초기화

      const res = await axios.post(
        "http://localhost:8080/music/analyze",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("음악 분석 결과 : ", res.data)

      if (res.data.header.resultCode === 1000 && Array.isArray(res.data.body)) {
        setAnalyzeResult(res.data.body);
      } else {
        console.warn("분석 결과가 올바르지 않습니다:", res.data);
      }
    } catch (error) {
      console.error("음악 스타일 분석 실패:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 음악 생성 요청 함수 (버튼 클릭 시 호출)
  const handleGenerateMusicByStyle = async (
    selectedStyle: string,
    selectedDescription: string
  ) => {
    setLastStyle(selectedStyle);
    setLastDescription(selectedDescription);
    const token = localStorage.getItem("accessToken");
    try {
      setIsGenerating(true);

      const res = await axios.post(
        "http://localhost:8080/music/generate",
        { style: selectedStyle, description: selectedDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.header.resultCode === 1000 && res.data.body?.music) {
        setMusicUrl(res.data.body.music);
        setCurrentTime(0);
        setIsPlaying(true);
        setAnalyzeResult(null);
        setShowSaveAndRetry(true);
        setIsMusicSaved(false)
      } else {
        console.warn("음악 생성 실패 또는 잘못된 응답:", res.data);
        setShowSaveAndRetry(false);
      }
    } catch (error) {
      console.error("음악 생성 요청 실패:", error);
      setShowSaveAndRetry(false);
    } finally {
      setIsGenerating(false);
      setIsGenerating(false);
    }
  };


  const handleMicClick = async () => {
    if (isRecording) {
      // 녹음 중지
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      // 마이크 권한 요청
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
          await sendVoice(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("🎤 마이크 권한 요청 실패:", err);
      }
    }
  };


  // 음악 재생/일시정지 상태를 실제 오디오에 반영 🔹
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 오디오 재생 시간 업데이트 핸들링 🔹
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [musicUrl]);

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

  // 시간을 "분:초" 형식으로 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 플레이/일시정지 버튼 클릭 시 상태 전환
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };


  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("accessToken");
      const today = new Date().toLocaleDateString('sv-SE'); 

      try {
        const res = await axios.get(`http://localhost:8080/chat?date=${today}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("📩 채팅 응답 전체:", res.data);
        const body = res.data.body;
        setAnoImg(body.anoImg);
        setAnoName(body.anoName);


        if (res.data.body?.chats) {
          setChatList(res.data.body.chats);
          console.log("✅ 조회된 채팅 목록:", res.data.body.chats);
        } else {
          console.warn("⚠️ 채팅 조회 실패 또는 채팅 없음:", res.data);
        }
      } catch (error) {
        console.error("❌ 채팅 조회 중 에러 발생:", error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
  const fetchMusic = async () => {
    const token = localStorage.getItem("accessToken");
    const today = new Date().toLocaleDateString('sv-SE'); 

    try {
      const res = await axios.get(`http://localhost:8080/music?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("음악 응답 전체:", res.data);

      if (res.data.body?.music) {
        console.log("🎵 조회된 음악 경로:", res.data.body.music);
        setMusicUrl(res.data.body.music)
        setShowSaveAndRetry(false);
      } 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.header?.resultCode === 2004) {
        console.warn("❗ 오늘 날짜의 음악 없음:", error.response.data.header.resultMsg);
      } else {
        console.error("❌ 음악 조회 중 에러 발생:", error);
      }
    }
  };

  fetchMusic();
}, []);

  // 🔹 Chat 컴포넌트 내부에 추가할 함수
  const handleSendChat = async () => {
    const token = localStorage.getItem("accessToken");

    if (!userInput.trim()) return;

    const userMessage = userInput.trim();

    // 사용자 입력 채팅 바로 화면에 추가
    const newUserChat: Chat = {
      chat: userMessage,
      isbot: 0,
      created_at: new Date().toISOString(),
    };
    setChatList((prev) => [...prev, newUserChat]);
    setUserInput(""); // 입력창 초기화

    try {
      const res = await axios.post(
        "http://localhost:8080/chat/text",
        { message: userMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("💬 채팅 전송 응답:", res.data);

      if (res.data.header?.resultCode === 1000 && res.data.body) {
        const botChat: Chat = {
          chat: res.data.body.chat,
          isbot: res.data.body.isbot,
          created_at: res.data.body.created_at,
        };

        setChatList((prev) => [...prev, botChat]);
      } else {
        console.warn("⚠️ 예상 외 응답:", res.data);
      }
    } catch (error) {
      console.error("❌ 채팅 전송 중 에러 발생:", error);
    }
  };

  const sendVoice = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("voice", audioBlob, "recording.m4a");
      const token = localStorage.getItem("accessToken");

      const sttRes = await axios.post("http://localhost:8080/chat/voice", formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      const responseData = sttRes.data;
      console.log("✅ STT 결과:", responseData);
      setBotAudioUrl(responseData.body.audio_url);

      if (responseData.body?.userChat) {
        const userChat: Chat = {
          chat: responseData.body.userChat,
          isbot: 0,
          created_at: new Date().toISOString(),
        };
        setChatList((prev) => [...prev, userChat]);
      }

      if (responseData.body?.chat) {
        const botChat: Chat = {
          chat: responseData.body.chat,
          isbot: 1,
          created_at: new Date().toISOString(),
        };
        setChatList((prev) => [...prev, botChat]);
      }

    } catch (error) {
      console.error("🚨 오류 발생:", error);
    }
  };

  const handleSaveMusic = async () => {
    const token = localStorage.getItem("accessToken");
    const today = new Date().toLocaleDateString('sv-SE'); 
    try {
      const response = await axios.post(
        `http://localhost:8080/music/save?date=${today}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("저장 응답 : ", response.data);
      setIsMusicSaved(true)
      if(response.data.body){
        console.log('음악이 저장되었습니다!');
      }
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };


  return (
    <div className="flex h-screen bg-[#FFFDF8] text-[#333]">
      <style>{progressBarStyles}</style>
      
      {/* Main Chat Area */}
      <main className="flex flex-col flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Chat messages */}
        <div className="space-y-4 m-5 bg-[#F9F7F2] p-8">
          {chatList.map((chat, index) => (
                chat.isbot === 1 ? (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <img src={anoImg} alt="Avatar" className="object-cover w-10 h-10 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-600 font-semibold">{anoName}</div>
                      <div className="bg-white p-4 rounded-xl shadow-sm max-w-lg">
                        <p>{chat.chat}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex justify-end">
                    <div className="bg-[#FFE0D2] p-4 rounded-xl shadow-sm max-w-lg">
                      <p>{chat.chat}</p>
                    </div>
                  </div>
                )
          ))}
          {/* 봇 오디오 자동 재생 */}
          {botAudioUrl && (
            <audio 
            src={`data:audio/mp3;base64,${botAudioUrl}`}
            autoPlay 
            />
          )}

          {/* Input area */}
          <div className="flex justify-center items-center mt-24 space-x-2 w-full">
            <div className="flex items-center space-x-2 w-full max-w-[800px]">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full rounded-full px-4 py-2 pr-12 bg-[#FFE8D6] placeholder-white"
                placeholder="오늘은 무슨일이 있으셨나요?"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7C6F62]"
                title="전송" 
                onClick={handleSendChat}
              >
                <PiArrowRight size={22} />
              </button>
            </div>

              <button 
                className="bg-[#FFE0D2] p-2 rounded-full shadow-sm"
                title="음성 입력"
                onClick={handleMicClick}
              >
                <PiMicrophoneBold className={`text-[#7C6F62] w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 음악 영역 */}
        <div
          className={`flex justify-center items-center mt-8 ${
            isGenerating
              ? "bg-[#FFE8D6] bg-opacity-70"
              : musicUrl
              ? "bg-[#FFB3AB] bg-opacity-70"
              : "bg-[#FFE8D6] bg-opacity-70"
          } p-8 rounded-3xl text-center shadow-md w-full max-w-[800px] mx-auto`}
        >
          {isGenerating ? (
            <div className="w-full">
              <p className="text-lg mb-4">음악을 만드는 중이에요...</p>
              <div className="w-full h-2 bg-[#FFB3AB] rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-[#FF867C] animate-progress"></div>
              </div>
            </div>
          ) : musicUrl ? (
            <div className="flex flex-col items-center w-full">
              <MusicPlayer src={musicUrl} />
              {showSaveAndRetry && !isMusicSaved && (
                <div className="flex justify-center gap-4 mt-2">
                  <button
                    onClick={handleGenerateMusicByStyleAgain}
                    className="px-4 py-2 bg-[#FF867C] text-white rounded-xl shadow transition hover:bg-[#FF6B6B]"
                  >
                    다시 만들기
                  </button>
                  <button
                    onClick={handleSaveMusic}
                    className="px-4 py-2 bg-[#6D9886] text-white rounded-xl shadow transition hover:bg-[#59887a]"
                  >
                    저장하기
                  </button>
                </div>
              )}
            </div>
          ) : analyzeResult ? (
            <div className="w-full space-y-3">
              <p className="text-lg">어떤 스타일의 음악으로 들어볼까요?</p>
              <div className="grid grid-cols-2 gap-4">
                {analyzeResult.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGenerateMusicByStyle(item.style, item.description)}
                    className="p-4 bg-[#FFD6C4] hover:bg-[#FFC4B2] rounded-xl shadow-sm transition"
                  >
                    <div className="font-semibold">{item.style}</div>
                    <div className="text-sm mt-1 text-[#7C6F62]">{item.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={handleCreateMusic}
              className="bg-[#FF867C] hover:bg-[#FF6B6B] text-white px-6 py-3 rounded-full shadow-md transition"
            >
              오늘 하루를 담은 음악을 만들어보세요 🎵
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;