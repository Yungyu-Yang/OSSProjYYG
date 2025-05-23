import { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNameAvailable, setIsNameAvailable] = useState<null | boolean>(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false); // 로딩 상태

  {/* 회원가입 */}
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/user/signup',
        {
          name,
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
      if (response.data.header?.resultCode === 1000) {
        alert(response.data.header.resultMsg || '회원가입에 성공했습니다!');
        navigate('/home');
      } else {
        alert(response.data.header.resultMsg || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
      console.error('회원가입 오류: ', error);
    } finally {
      setLoading(false);
    }
  };


  {/* 이름 중복확인 */}
  const handleNameCheck = async () => {
    if (!name) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/user/checkname`,
        {
          params: { name },
          withCredentials: true,
        }
      );
      const resultCode = response.data.header?.resultCode;
      const resultMsg = response.data.header?.resultMsg;
      alert(resultMsg);
      if (resultCode === 1000) {
        setIsNameAvailable(true);
      } else {
        setIsNameAvailable(false);
      }
    } catch (error: any) {
      const resultMsg = error.response?.data?.header?.resultMsg;
      if (resultMsg) {
        alert(resultMsg);
      } else {
        alert('닉네임 중복확인 중 오류가 발생했습니다.');
      }
      setIsNameAvailable(false);
      console.error('닉네임 중복확인 오류: ',error);
    } finally {
      setLoading(false);
    }
  };

  {/* 이메일 중복확인 */}
  const handleEmailCheck = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/user/checkemail`,
        {
          params: { email },
          withCredentials: true,
        }
      );
      const resultCode = response.data.header?.resultCode;
      const resultMsg = response.data.header?.resultMsg;
      alert(resultMsg);
      if (resultCode === 1000) {
        setIsEmailAvailable(true);
      } else {
        setIsEmailAvailable(false);
      }
    } catch (error: any) {
      const resultMsg = error.response?.data?.header?.resultMsg;
      if (resultMsg) {
        alert(resultMsg);
      } else {
        alert('이메일 중복확인 중 오류가 발생했습니다.');
      }
      setIsEmailAvailable(false);
      console.error('이메일 중복확인 오류: ',error);
    } finally {
      setLoading(false);
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
          <button
            onClick={handleSignUp}
            className="mb-1 bg-[#ffb3ab] hover:bg-[#FF99A6] text-white px-20 py-2 rounded-lg font-semibold"
            disabled={loading}>
            {loading ? '회원가입 중...' : 'Sign Up'}
          </button>
        </div>

        {/* 기존 회원 로그인 이동 */}
        <div className="text-center text-sm text-[#7C6F62] mt-2">
          아이디가 있으신가요? <a href="/signin" className="text-[#ffb3ab] font-medium hover:underline">로그인하러가기</a>
        </div>
      </div>
    </div>
  );
}
  