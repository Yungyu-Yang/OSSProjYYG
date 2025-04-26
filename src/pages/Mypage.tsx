// const Mypage = () => {
//     return (
//       <div className="text-center text-2xl mt-10">
//         🚀 My Page입니다!
//       </div>
//     );
// };
  
// export default Mypage;
  
import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar/avatar1.png';

export default function MyPage() {
  const navigate = useNavigate();
  const goToEditProfile = () => {
    navigate('/EditProfile');
  }

  return (
    <div className="flex min-h-screen bg-[#fefcf7]">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center mb-8">
          <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
          <div className="ml-4">
            <p className="text-lg text-gray-600">안녕하세요~!!</p>
            <p className="text-xl font-semibold text-gray-800">MAMMAM님</p>
            <p className="text-sm text-gray-500">abc@gmail.com</p>
          </div>
          <button className="ml-auto bg-[#ffb3ab] text-white px-4 py-2 rounded-lg shadow-sm">로그아웃</button>
        </div>

        <div className="space-y-4">
          <button
            onClick={goToEditProfile}
            className="w-full flex justify-between items-center border-b py-4 text-gray-700">
              회원 정보 수정</button>
          <button className="w-full flex justify-between items-center border-b py-4 text-gray-700">아바타 수정</button>
          <button className="w-full flex justify-between items-center border-b py-4 text-gray-700">탈퇴하기</button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">누적 출석일</p>
          <div className="inline-flex items-center justify-center bg-[#fdeae5] w-20 h-20 rounded-full text-2xl font-bold text-gray-700">
            17
          </div>
          <p className="text-gray-600 mt-2">일</p>
        </div>
      </div>
    </div>
  );
}
