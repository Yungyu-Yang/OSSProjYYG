import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '/assets/etc/background.png';
import logo from '/assets/etc/logo.png';

const Start = () => {

  const navigate = useNavigate();
  
  const [avatarList, setAvatarList] = useState<string[]>([]);

  useEffect(() => {

    const loadAvatars = async () => {
      const avatars = await Promise.all(
        Array.from({ length: 10 }, (_, i) => import(`/assets/avatar/avatar${i + 1}.png`))
      );
      setAvatarList(avatars.map((avatar) => avatar.default)); 
    };

    loadAvatars();
  }, []);

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center z-0" style={{ backgroundImage: `url(${backgroundImage})` }}>

      {avatarList.map((src, idx) => {
      
        const positions = [
          { top: '62%', left: '10%' },
          { top: '58%', left: '90%' },
          { top: '90%', left: '30%' },
          { top: '65%', left: '80%' },
          { top: '80%', left: '25%' },
          { top: '80%', left: '83%' },
          { top: '75%', left: '14%' },
          { top: '85%', left: '73%' },
          { top: '71%', left: '88%' },
          { top: '67%', left: '20%' },
        ];

        const position = positions[idx];

        return (
          <img
            key={idx}
            src={src}
            alt={`avatar${idx + 1}`}
            className="absolute w-20 h-20"
            style={{
              top: position.top,
              left: position.left,
              transform: 'translate(-50%, -50%)', 
            }}
          />
        );
      })}

      <div className='text-center'>
        <img src={logo} alt="logo" className="mx-auto w-80 -mt-12" />
        <div className="text-[#4A3F35] text-lg mb-12 leading-relaxed bg-[#FFFDF8] bg-opacity-70 p-6 rounded-xl text-center z-10 w-[480px]">
          MindTune은 AI 캐릭터와 일상을 공유하고<br />
          감정 상담을 통해 자신만의 멜로디를<br />
          생성해주는 음악 생성 서비스입니다.<br />
          MindTune과 함께 나만의 음악을 만들어보세요!
        </div>
        <button 
          onClick={() => navigate('/signin')}
          className="w-[200px] bg-[#FFB3AB] hover:bg-[#FF99A6] text-white py-2 px-6 rounded-full font-semibold">
          시작하기
        </button>

      </div>
    </div>
  );
};

export default Start;
