import { useState, useEffect } from 'react';
import logo from '/assets/etc/logo.png';
import axios from 'axios';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customModalMessage, setCustomModalMessage] = useState('');

  // 회원 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/user/info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (response.data.header?.resultCode === 1000) {
          setName(response.data.body?.name || '');
          setEmail(response.data.body?.email || '');
          setPassword(''); // 비밀번호는 빈 값으로
        } else {
          setError(response.data.header?.resultMsg || '회원 정보 조회 실패');
        }
      } catch (err: any) {
        setError('회원 정보 조회 중 오류가 발생했습니다.');
        console.log('회원 정보 조회 오류: ',err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(
        'http://localhost:8080/user/changeinfo',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.data.header?.resultCode === 1000) {
        setCustomModalMessage('회원 정보가 성공적으로 수정되었습니다!');
        setCustomModalOpen(true);
      } else {
        console.log(response.data.header?.resultMsg || '회원 정보 수정에 실패했습니다.');
      }
    } catch (err: any) {
      const resultMsg = err.response?.data?.header?.resultMsg;
      if (resultMsg) {
        console.log(resultMsg);
      } else {
        console.log('회원 정보 수정 중 오류가 발생했습니다.');
        console.log('회원 정보 수정 오류: ', err);
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf8] p-4">
      {customModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#FFF1E6] rounded-2xl p-6 w-[90%] max-w-[400px] text-center shadow-xl">
            <p className="text-lg mb-4">{customModalMessage}</p>
            <button
              className="mt-2 px-4 py-2 bg-[#FF8A65] text-white rounded-xl hover:bg-[#e56e4f]"
              onClick={() => setCustomModalOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}


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
            disabled={updating}
          >
            {updating ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
