import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import avatar from '../assets/avatar/avatar1.png';
import avatar2 from '../assets/avatar/avatar2.png'; 
import { PiXCircle } from 'react-icons/pi';

const Calendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 팝업 창 상태 관리
  const [selectedDate, setSelectedDate] = useState<string>(''); // 선택된 날짜 상태 관리

  // 이벤트 데이터를 추가합니다.
  const events = [
    {
      date: '2025-04-01', // 특정 날짜 설정
      extendedProps: {
        imageSrc1: avatar, // 첫 번째 이미지
        imageSrc2: avatar2, // 두 번째 이미지
      },
      backgroundColor: 'transparent',
      borderColor:'transparent'
    },
  ];

  // 이미지 스타일을 설정하는 함수
  const createImageElement = (src, position = 'absolute', width = '30px', height = '30px', top = '0', left = '10px') => {
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

  const eventContent = (eventInfo: any) => {
    const customContent = document.createElement('div');
    customContent.style.position = 'relative';
    customContent.style.backgroundColor = 'transparent'; // 배경색 제거
  
    // 첫 번째 이미지 (왼쪽에 배치)
    const imageElement1 = createImageElement(eventInfo.event.extendedProps.imageSrc1, 'absolute', '30px', '30px', '0', '10px');
    
    // 두 번째 이미지 (오른쪽에 배치, 첫 번째 이미지 옆)
    const imageElement2 = createImageElement(eventInfo.event.extendedProps.imageSrc2, 'absolute', '30px', '30px', '0', '50px'); // 왼쪽 이미지에서 40px 정도 떨어짐
  
    // 텍스트 추가
    const textContent = document.createElement('span');
    textContent.innerText = eventInfo.event.title;
    customContent.appendChild(textContent);
  
    // 이미지 추가
    customContent.appendChild(imageElement1);
    customContent.appendChild(imageElement2);
  
    return { domNodes: [customContent] };
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr); // 클릭된 날짜 저장
    setIsModalOpen(true); // 팝업 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-[30px] min-h-screen bg-[#FFFDF8] max-h-screen">
      <div className="flex items-center">
        <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-[#DDDBD5] bg-opacity-80 object-cover ml-5" />
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
          />
        </div>
      </div>

      {/* 팝업 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-50 z-50 pt-[30px]">
        
          {/* Main Chat Area */}
          <main className="bg-[#FFE8D6] rounded-3xl p-6 w-[80%] max-w-[1000px] max-h-[90vh] overflow-auto flex flex-col relative z-50 pt-0">

            {/* 선택한 날짜와 이미지 표시 */}
            <div className="flex justify-between items-center space-x-4 mt-6 ml-10">
              {/* 왼쪽 부분: 날짜와 이미지들 */}
              <div className="flex items-center space-x-4">
                <p className="text-lg font-semibold">{selectedDate}</p> {/* 선택된 날짜 */}
                {/* 이미지들 */}
                {events.map((event, index) => (
                  <img 
                    key={index}
                    src={event.extendedProps.imageSrc1} // 이미지 URL
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ))}
              </div>

              {/* 오른쪽 끝에 위치한 모달 상단 닫기 버튼 */}
              <button 
                className="text-gray-500 p-2 rounded" 
                onClick={() => setIsModalOpen(false)}
              >
                <PiXCircle size={30} />
              </button>
            </div>

            
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
              <button className="bg-[#FFFDF8] text-sm px-4 py-2 rounded-xl shadow-sm max-w-[200px] w-full">
                좋아, 만들어줘!
              </button>
              <button className="bg-[#FFFDF8] text-sm px-4 py-2 rounded-xl shadow-sm max-w-[200px] w-full">
                다른 게 좋을 것 같아.
              </button>
            </div>
            
          </div>
  
          <div className="flex justify-center items-center mt-8 bg-[#FFB3AB] bg-opacity-70 p-8 rounded-3xl text-center shadow-md w-full max-w-[1000px] mx-auto">
            <p className="text-lg">음악 생성 창</p>
          </div>
  
        </main>
      </div>
      )}

      <div className="flex items-center">
        <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-[#DDDBD5] bg-opacity-80 object-cover ml-5" />
        <div className="flex items-center space-x-4 ml-4 bg-[#FFF1E6] rounded-xl pr-3">
          <p className="p-[13px]"> 이 달의 기억으로 음악을 만들어볼까? </p>
          <button className='bg-[#FFB3AB] rounded-2xl text-white p-1 pl-3 pr-3'>
            음악 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
