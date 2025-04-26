import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 예시로 현재 저장된 유저 정보 불러오기
  useEffect(() => {
    // 실제로는 API 호출해서 유저 정보 받아올 부분!
    const fetchUserInfo = async () => {
      // 임시로 하드코딩 (ex. 서버에서 가져왔다고 가정)
      const userData = {
        name: '홍길동',
        email: 'hong@example.com',
        password: 'password123', // 실제 서비스에서는 비밀번호는 이렇게 불러오지 않음!
      };
      setName(userData.name);
      setEmail(userData.email);
      setPassword(userData.password);
    };

    fetchUserInfo();
  }, []);

  const handleUpdate = () => {
    // 수정 버튼 클릭 시 처리할 로직
    console.log('수정된 정보:', { name, email, password });
    // 여기서 API로 수정 요청
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf8] p-4">

      {/* 로고 */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="MindTune Logo" className="mx-auto w-32" />
      </div>

      {/* 입력창 */}
      <div className="space-y-4 w-full max-w-sm">
        
        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-[#4A3F35] mb-1">Name</label>
          <input
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-2 shadow-sm"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-[#4A3F35] mb-1">Email</label>
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-2 shadow-sm"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" className="block text-[#4A3F35] mb-1">Password</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-2 shadow-sm mb-10"
          />
        </div>

        {/* 수정 제출 */}
        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            className="mb-1 bg-[#ffb3ab] text-white px-20 py-2 rounded-lg font-semibold"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
