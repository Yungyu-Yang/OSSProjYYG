import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/user/login',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('✅ 전체 응답:', response);
      // 헤더에서 accessToken 추출
      const token = response.headers['authorization'];
      const uno = response.data.body?.uno;

      if (token) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('uno', uno);
        navigate('/home');
      } else {
        alert('로그인 실패: 토큰이 없습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf8] p-4">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="MindTune Logo" className="mx-auto w-32" />
        <p className="mb-3 text-lg text-gray-700 font-semibold text-center">
          로그인하고<br />오늘의 음악 만들러 가기
        </p>
      </div>

      <div className="space-y-4 w-full max-w-sm">
        <div>
          <label htmlFor="email" className="block text-[#4A3F35] mb-1">Email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border p-2 shadow-sm mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-[#4A3F35] mb-1">Password</label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg border p-2 shadow-sm mb-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="mb-1 bg-[#ffb3ab] hover:bg-[#FF99A6] text-white px-20 py-2 rounded-lg font-semibold"
          >
            Sign In
          </button>
        </div>

        <div className="text-center text-sm text-[#7C6F62] mt-2">
          아이디가 없으신가요? <a href="/signup" className="text-[#ffb3ab] font-medium hover:underline">회원가입하러가기</a>
        </div>
      </div>
    </div>
  );
}
