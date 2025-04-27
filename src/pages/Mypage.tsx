import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar/avatar1.png';

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center bg-[#fefcf7] pt-[50px] min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8 max-w-[900px] w-full ml-[50px]">
        <div className="flex items-center mb-8 w-full max-w-[700px]">
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full bg-[#DDDBD5] bg-opacity-80 object-cover ml-5" />
          <div className="ml-10 flex items-center bg-[#FFE8D6] p-4 pl-6 pr-6 rounded-2xl w-full">
            <div className="flex flex-col">
              <p className="text-lg text-[#4A3F35]">안녕하세요~!!</p>
              <p className="text-xl font-semibold text-[#4A3F35]">MAMMAM님</p>
              <p className="text-sm text-[#4A3F35]">abc@gmail.com</p>
            </div>
            <button onClick={() => navigate('/')} className="ml-auto bg-[#ffb3ab] text-white px-4 py-2 rounded-3xl shadow-sm">로그아웃</button>
          </div>
        </div>





        <div className="space-y-4">
          <button
            onClick={() => navigate('/editprofile')}
            className="w-full max-w-[750px] flex justify-between items-center border-b border-[#9C9C9C] py-4 text-[#4A3F35] p-3">
              회원 정보 수정
          </button>
          <button 
            onClick={() => navigate('/avatar')}
            className="w-full max-w-[750px] flex justify-between items-center border-b border-[#9C9C9C] py-4 text-[#4A3F35] p-3">
              아바타 수정
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="w-full max-w-[750px] flex justify-between items-center border-b border-[#9C9C9C] py-4 text-[#4A3F35] p-3">
              탈퇴하기
          </button>
        </div>

        <div className="flex justify-center mt-12 text-center">
          <div className="flex items-center justify-between w-full max-w-[100px]">
            <p className="text-[#4A3F35] -ml-40 mb-2">누적 출석일</p>
            <div className="inline-flex items-center justify-center bg-[#FFE8D6] w-20 h-20 rounded-full text-2xl text-[#4A3F35]">
              17
            </div>
            <p className="text-[#4A3F35]">일</p>
          </div>
        </div>


      </div>
    </div>
  );
}
