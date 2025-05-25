import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import avatar from '../assets/avatar/avatar1.png';
import { PiXCircle } from 'react-icons/pi';
import axios from 'axios';
import MusicPlayer from '../components/MusicPlayer';

// FullCalendar 스타일 커스터마이징
const calendarStyles = `
  .fc-button-primary {
    background-color: #FFB3AB !important;
    border-color: #FFB3AB !important;
    color: white !important;
  }
  
  .fc-button-primary:hover {
    background-color: #ff9c92 !important;
    border-color: #ff9c92 !important;
  }
  
  .fc-button-primary:not(:disabled).fc-button-active {
    background-color: #ff8a7d !important;
    border-color: #ff8a7d !important;
  }
`;

const Calendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 팝업 창 상태 관리
  const [selectedDate, setSelectedDate] = useState<string>(''); // 선택된 날짜 상태 관리
  const [events, setEvents] = useState<any[]>([]); // 월별 이벤트 상태
  const [currentMonth, setCurrentMonth] = useState<string>(''); // 현재 월 상태
  const [monthlyMusicUrl, setMonthlyMusicUrl] = useState<string | null>(null);
  const [isLastDayPassed, setIsLastDayPassed] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  // 하루 기록 상세 정보 상태
  const [dayDetail, setDayDetail] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  // 팝업 음악 플레이어 상태
  const [popupIsPlaying, setPopupIsPlaying] = useState(false);
  const [popupCurrentTime, setPopupCurrentTime] = useState(0);
  const [popupDuration, setPopupDuration] = useState(0);
  const popupAudioRef = React.useRef<HTMLAudioElement | null>(null);
  // 회원 아바타 이미지 상태
  const [userAvatar, setUserAvatar] = useState<string>(avatar);

  // 월별 데이터 불러오기 함수
  const fetchCalendarData = async (month: string) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(`http://localhost:8080/calendar?month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data.header?.resultCode === 1000) {
        // dates 배열을 FullCalendar 이벤트로 변환
        const body = res.data.body;
        const avatarImg = body.anomg;
        const dates = body.dates || [];
        const newEvents = dates.map((dateObj: any) => ({
          date: dateObj.created_at,
      extendedProps: {
            imageSrc1: avatarImg, // 아바타 이미지
            emojiImg: dateObj.einoimg, // 감정 아이콘 이미지
            voteImg: dateObj.ninoimg, // 음표 아이콘 이미지
      },
      backgroundColor: 'transparent',
          borderColor: 'transparent',
        }));
        setEvents(newEvents);
      } else {
        setEvents([]);
      }
    } catch (err) {
      setEvents([]);
      // 에러 핸들링 필요시 추가
    }
  };

  // 월간 음악 정보 불러오기
  const fetchMonthlyMusic = async (month: string) => {
    setIsLoadingMusic(true);
    setMonthlyMusicUrl(null);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(`http://localhost:8080/calendar/music?month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data.header?.resultCode === 1000 && res.data.body?.music) {
        setMonthlyMusicUrl(res.data.body.music);
      } else {
        setMonthlyMusicUrl(null);
      }
    } catch (err) {
      setMonthlyMusicUrl(null);
    } finally {
      setIsLoadingMusic(false);
    }
  };

  // 월 마지막 날짜 지났는지 계산
  const checkLastDayPassed = (month: string) => {
    const [year, mm] = month.split('-').map(Number);
    const lastDay = new Date(year, mm, 0); // JS에서 월은 0-indexed
    const today = new Date(); // 항상 최신 날짜 사용
    // 오늘이 해당 월에 속하는지 체크 (예: 5월을 보고 있는데 오늘이 5월인지)
    const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === mm;
    // 오늘이 해당 월에 속하면 오늘 날짜 기준, 아니면 무조건 마지막 날 지남으로 처리
    if (isCurrentMonth) {
      setIsLastDayPassed(today > lastDay);
    } else {
      setIsLastDayPassed(true);
    }
  };

  // 컴포넌트 마운트 시 현재 월 데이터 요청
  useEffect(() => {
    const today = new Date();
    const month = today.toISOString().slice(0, 7); // 'YYYY-MM'
    setCurrentMonth(month);
    fetchCalendarData(month);
    fetchMonthlyMusic(month);
    checkLastDayPassed(month);
  }, []);

  // 회원 정보에서 아바타 이미지 가져오기
  useEffect(() => {
    const fetchUserAvatar = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await axios.get('http://localhost:8080/user/mypage', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (res.data.header?.resultCode === 1000 && res.data.body?.anoImg) {
          // public/assets/avatar/ 경로로 맞추기
          const imgPath = res.data.body.anoImg;
          setUserAvatar(`/assets/avatar/${imgPath.split('/').pop()}`);
        }
      } catch (err) {
        // 실패 시 기본 아바타 유지
      }
    };
    fetchUserAvatar();
  }, []);

  // FullCalendar의 month 변경 이벤트 핸들러
  const handleDatesSet = (arg: any) => {
    const start = arg.start;
    const month = start.toISOString().slice(0, 7); // 'YYYY-MM'
    setCurrentMonth(month); // 항상 현재 월 갱신
    fetchCalendarData(month);
    fetchMonthlyMusic(month);
    checkLastDayPassed(month);
  };

  // 음악 플레이어 관련 핸들러 (Chat.tsx 참고)
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [monthlyMusicUrl]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 이미지 스타일을 설정하는 함수
  const createImageElement = (src: string, position = 'absolute', width = '30px', height = '30px', top = '0', left = '10px') => {
    const img = document.createElement('img');
    img.src = src;
    img.style.width = width;
    img.style.height = height;
    img.style.objectFit = 'cover';
    img.style.position = position;
    img.style.top = top;
    img.style.left = left;
    return img;
  };

  // 감정/음표 아이콘 실제 public 경로로 변환
  const getEmotionImg = (imgPath: string | undefined) => imgPath ? `/assets/emotion/${imgPath.split('/').pop()}` : undefined;
  const getNoteImg = (imgPath: string | undefined) => imgPath ? `/assets/note/${imgPath.split('/').pop()}` : undefined;

  const eventContent = (eventInfo: any) => {
    const customContent = document.createElement('div');
    customContent.style.position = 'relative';
    customContent.style.backgroundColor = 'transparent'; // 배경색 제거
  
    // 감정 아이콘 (왼쪽)
    const emotionImgSrc = getEmotionImg(eventInfo.event.extendedProps.emojiImg);
    if (emotionImgSrc) {
      const emojiImg = createImageElement(emotionImgSrc, 'absolute', '24px', '24px', '0', '2px');
      customContent.appendChild(emojiImg);
    }
    // 음표 아이콘 (오른쪽)
    const noteImgSrc = getNoteImg(eventInfo.event.extendedProps.voteImg);
    if (noteImgSrc) {
      const voteImg = createImageElement(noteImgSrc, 'absolute', '24px', '24px', '0', '28px');
      customContent.appendChild(voteImg);
    }
    // (필요시 텍스트 등 추가)
    return { domNodes: [customContent] };
  };

  // 날짜 클릭 시 상세 정보 조회
  const handleDateClick = async (info: any) => {
    setSelectedDate(info.dateStr); // 클릭된 날짜 저장
    setIsModalOpen(true); // 팝업 열기
    setIsDetailLoading(true);
    setDayDetail(null);
    setDetailError(null);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(`http://localhost:8080/calendar/detail?date=${info.dateStr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data.header?.resultCode === 1000 && res.data.body) {
        setDayDetail(res.data.body);
      } else {
        setDayDetail(null);
        setDetailError('저장된 정보가 없어요.');
      }
    } catch (err) {
      setDayDetail(null);
      setDetailError('저장된 정보가 없어요.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 월간 음악 생성 요청
  const handleGenerateMonthlyMusic = async () => {
    // 현재 월의 마지막 날짜를 즉시 계산
    const [year, mm] = currentMonth.split('-').map(Number);
    const lastDay = new Date(year, mm, 0);
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === mm;
    const lastDayPassed = isCurrentMonth ? today > lastDay : true;

    if (!lastDayPassed) {
      alert('아직 기록할 날들이 남아있어. 조금만 더 함께해줘!');
      return;
    }
    const token = localStorage.getItem('accessToken');
    try {
      setIsLoadingMusic(true);
      const res = await axios.post('http://localhost:8080/calendar/music/generate', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data.header?.resultCode === 1000 && res.data.body?.music) {
        setMonthlyMusicUrl(res.data.body.music);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        alert('음악이 성공적으로 생성되었습니다!');
      } else {
        alert(res.data.header?.resultMsg || '음악 생성에 실패했습니다.');
      }
    } catch (err) {
      alert('음악 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingMusic(false);
    }
  };

  // 팝업 음악 플레이어 핸들러
  React.useEffect(() => {
    if (!popupAudioRef.current) return;
    if (popupIsPlaying) {
      popupAudioRef.current.play();
    } else {
      popupAudioRef.current.pause();
    }
  }, [popupIsPlaying, dayDetail?.music]);

  React.useEffect(() => {
    const audio = popupAudioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setPopupCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setPopupDuration(audio.duration);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [dayDetail?.music]);

  const handlePopupPlayPause = () => setPopupIsPlaying(!popupIsPlaying);
  const handlePopupSkipForward = () => {
    if (!popupAudioRef.current) return;
    const newTime = Math.min(popupCurrentTime + 10, popupDuration);
    popupAudioRef.current.currentTime = newTime;
    setPopupCurrentTime(newTime);
  };
  const handlePopupSkipBackward = () => {
    if (!popupAudioRef.current) return;
    const newTime = Math.max(popupCurrentTime - 10, 0);
    popupAudioRef.current.currentTime = newTime;
    setPopupCurrentTime(newTime);
  };
  const formatPopupTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 아바타/감정 아이콘 경로 변환
  const getAvatarImg = (imgPath: string | undefined) => imgPath ? `/assets/avatar/${imgPath.split('/').pop()}` : undefined;

  return (
    <div className="p-[30px] min-h-screen bg-[#FFFDF8] max-h-screen">
      <style>{calendarStyles}</style>
      <div className="flex items-center">
        <img src={userAvatar} alt="Avatar" className="w-16 h-16 rounded-full bg-[#DDDBD5] bg-opacity-80 object-cover ml-5" />
        <p className="ml-4 bg-[#FFF1E6] rounded-xl p-[13px]"> 어떤 기억을 찾으러 왔어??</p>
      </div>

      <div className='flex justify-center items-center rounded-3xl bg-[#F9F7F2] pl-[50px] pr-[50px] pb-10 pt-10 mt-[20px] mb-[20px] max-h-[450px]'>
        <div className='w-full max-w-[800px]'>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="426px"
            events={events} // 이벤트 전달
            eventContent={eventContent} // 이벤트 콘텐츠 커스터마이징
            dateClick={handleDateClick} // 올바르게 dateClick 이벤트 핸들러 추가
            datesSet={handleDatesSet} // 월 변경 감지 핸들러 추가
            headerToolbar={{
              left: "title",
              // center: "title",
              right: "today prev,next"
            }}
          />
        </div>
      </div>

      {/* 팝업 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-50 z-50 pt-[30px]">
          <main className="bg-[#F9F7F2] rounded-3xl p-6 w-[80%] max-w-[1000px] max-h-[90vh] overflow-y-auto flex flex-col relative z-50 pt-0">
            {/* 선택한 날짜와 상세 정보 표시 */}
            <div className="flex justify-between items-center space-x-4 mt-6 ml-10">
              <div className="flex items-center space-x-4">
                <p className="text-lg font-semibold">{selectedDate}</p>
                {/* 상세 정보가 있을 때 아바타/감정 아이콘 표시 */}
                {isDetailLoading ? (
                  <span className="ml-4">불러오는 중...</span>
                ) : dayDetail ? (
                  <>
                    {dayDetail.anomg && (
                      <img src={getAvatarImg(dayDetail.anomg)} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                    )}
                    {dayDetail.einolmg && (
                      <img src={getEmotionImg(dayDetail.einolmg)} alt="Emotion" className="w-10 h-10 object-cover" />
                    )}
                  </>
                ) : null}
              </div>
              <button 
                className="text-gray-500 p-2 rounded" 
                onClick={() => setIsModalOpen(false)}
                title="닫기"
              >
                <PiXCircle size={30} />
              </button>
            </div>
            {/* 상세 정보 본문 */}
            <div className="flex flex-col justify-between p-10 flex-1 min-h-[300px]">
              <div className="flex-1 flex flex-col gap-5 justify-end">
                {isDetailLoading ? (
                  <div>불러오는 중...</div>
                ) : detailError ? (
                  <div className="text-center text-gray-500">{detailError}</div>
                ) : dayDetail ? (
                  <>
                    {/* 채팅 기록 */}
                    {Array.isArray(dayDetail.chats) && dayDetail.chats.length > 0 ? (
                      <div className="flex flex-col gap-5">
                        {dayDetail.chats.map((chat: any, idx: number) => (
                          <div
                            key={idx}
                            className={`flex ${chat.isbot === 1 ? 'justify-start' : 'justify-end'} w-full`}
                          >
                            <span
                              className={
                                (chat.isbot === 1
                                  ? 'bg-white text-[#333]'
                                  : 'bg-[#FFE0D2] text-[#333]') +
                                ' p-5 rounded-xl max-w-[80%] break-words shadow-sm'
                              }
                            >
                              {chat.chat}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">채팅 기록이 없습니다.</div>
                    )}
                  </>
                ) : null}
              </div>
              {/* 음악 파일 - Chat.tsx 스타일 플레이어 */}
              {dayDetail && dayDetail.music && (
                <div className="flex justify-center mt-12 mb-10">
                  <MusicPlayer src={dayDetail.music} />
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* 월간 음악 플레이어/생성 UI */}
      {monthlyMusicUrl ? (
        <div className="flex justify-center items-center mt-8 mb-8">
          <MusicPlayer src={monthlyMusicUrl} />
        </div>
      ) : (
      <div className="flex items-center">
        <img src={userAvatar} alt="Avatar" className="w-16 h-16 rounded-full bg-[#DDDBD5] bg-opacity-80 object-cover ml-5" />
        <div className="flex items-center space-x-4 ml-4 bg-[#FFF1E6] rounded-xl pr-3">
          <p className="p-[13px]"> 이 달의 기억으로 음악을 만들어볼까? </p>
            <button
              className="bg-[#FFB3AB] rounded-2xl text-white p-1 pl-3 pr-3"
              disabled={isLoadingMusic}
              onClick={handleGenerateMonthlyMusic}
            >
              {isLoadingMusic ? '생성 중...' : '음악 생성하기'}
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default Calendar;
