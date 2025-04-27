import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf8] p-4">

      {/* 로고 및 상단 */}
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="MindTune Logo" className="mx-auto w-32" />
        <p className="mb-3 text-lg text-gray-700 font-semibold text-center">로그인하고<br />오늘의 음악 만들러 가기</p>
      </div>

      {/* 입력창 */}
      <div className="space-y-4 w-full max-w-sm">
        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-[#4A3F35] mb-1">Email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border p-2 shadow-sm mb-3"
            />
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" className="block text-[#4A3F35] mb-1">Password</label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg border p-2 shadow-sm mb-10"
          />
        </div>

        {/* 제출 */}
        <div className="flex justify-center">
          <button onClick={() => navigate('/home')} className="mb-1 bg-[#ffb3ab] hover:bg-[#FF99A6] text-white px-20 py-2 rounded-lg font-semibold">
            Sign In</button>
        </div>

        {/* 신규 회원 회원가입 이동 */}
        <div className="text-center text-sm text-[#7C6F62] mt-2">
          아이디가 없으신가요? <a href="/signup" className="text-[#ffb3ab] font-medium hover:underline">회원가입하러가기</a>
        </div>
      </div>
    </div>
  );
}

  
  