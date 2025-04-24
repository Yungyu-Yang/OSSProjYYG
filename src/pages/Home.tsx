import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background.png';
import avatar from '../assets/avatar/avatar1.png';

const Home = () => {
  const navigate = useNavigate();
  
  const [avatarList, setAvatarList] = useState<string[]>([]);

  useEffect(() => {

    const loadAvatars = async () => {
      const avatars = await Promise.all(
        Array.from({ length: 10 }, (_, i) => import(`../assets/avatar/avatar${i + 1}.png`))
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
        <div className="text-gray-800 text-lg mb-12 leading-relaxed bg-[#FFFDF8] p-6 rounded-md text-center z-10 inline-block relative w-[480px]">
          반가워, 나에게 너의 하루를 들려줘 !<br />
          오늘 너는 어떤 감정이었을까?

          <div className="absolute -right-44 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <img src={avatar} alt="Avatar" className="w-20 h-20 object-cover" />
          </div>
        </div>

        <div className="mt-0">
          <button 
            onClick={() => navigate('/chat')}
            className="w-[200px] bg-[#FFB3AB] hover:bg-[#FF99A6] text-white py-2 px-6 rounded-md font-semibold">
            상담하러가기
          </button>
        </div>
      </div>


    </div>
  );
};

export default Home;
