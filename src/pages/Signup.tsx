// const Signup = () => {
//     return (
//       <div className="text-center text-2xl mt-10">
//         🚀 SignUp Page입니다!
//       </div>
//     );
// };
  
// export default Signup;

import React, { useState } from 'react';
import logo from '../assets/logo.png';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNameAvailable, setIsNameAvailable] = useState<null | boolean>(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false); // 로딩 상태

  {/* 이름 중복확인 */}
  const handleNameCheck = async () => {
    setLoading(true); // 로딩 시작
    try {
      // 여기에 실제 API 호출 넣으면 돼
      console.log('이름 중복확인 요청:', name);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsNameAvailable(true); // 또는 false로
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  {/* 이메일 중복확인 */}
  const handleEmailCheck = async () => {
    setLoading(true); // 로딩 시작
    try {
      // 여기에 실제 API 호출 넣으면 돼
      console.log('이메일 중복확인 요청:', email);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsEmailAvailable(true); // 또는 false로
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf8] p-4">

      {/* 로고 */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="MindTune Logo" className="mx-auto w-32" />
      </div>

      {/* 입력창 */}
      <div className="space-y-4 w-full max-w-sm">
        <div>
          <label htmlFor="name" className="block text-[#4A3F35] mb-1">Name</label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-2 pr-24 shadow-sm"
            />
            <button
              type="button"
              onClick={handleNameCheck}
              className="absolute top-1/2 right-3 -translate-y-1/2 px-3 py-1 bg-[#ffb3ab] text-white rounded-md text-sm"
              >중복확인</button>
          </div>

          {/* 이름 중복확인 결과 */}
          {isNameAvailable === true && (
            <p className="text-green-500 mt-2">사용 가능한 이름입니다!</p>
          )}
          {isNameAvailable === false && (
            <p className="text-red-500 mt-2">이미 사용중인 이름입니다!</p>
          )}
        </div>

        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-[#4A3F35] mb-1">Email</label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border p-2 pr-24 shadow-sm"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              className="absolute top-1/2 right-3 -translate-y-1/2 px-3 py-1 bg-[#ffb3ab] text-white rounded-md text-sm"
              >중복확인</button>
          </div>
          {/* 이메일 중복확인 결과 */}
          {isEmailAvailable === true && (
            <p className="text-green-500 mt-2">사용 가능한 이메일입니다!</p>
          )}
          {isEmailAvailable === false && (
            <p className="text-red-500 mt-2">이미 사용중인 이메일입니다!</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" className="block text-[#4A3F35] mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-2 shadow-sm mb-10"
          />
        </div>

        {/* 제출 */}
        <div className="flex justify-center">
          <button className="mb-1 bg-[#ffb3ab] text-white px-20 py-2 rounded-lg font-semibold">
            Sign Up</button>
        </div>

        {/* 기존 회원 로그인 이동 */}
        <div className="text-center text-sm text-[#7C6F62] mt-2">
          아이디가 있으신가요? <a href="/signin" className="text-[#ffb3ab] font-medium hover:underline">로그인하러가기</a>
        </div>
      </div>
    </div>
  );
}
  