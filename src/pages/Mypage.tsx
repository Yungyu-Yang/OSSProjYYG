import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import avatarDefault from '../assets/avatar/avatar1.png';

// 아바타 파일명에 맞는 이미지 src 반환
function getAvatarSrc(anoImg: string | undefined) {
  if (!anoImg) return avatarDefault;
  let fileName = anoImg.split('/').pop() || '';
  fileName = fileName.replace(/\.jpg$/, '.png');
  const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, as: 'url' });
  const path = `../assets/avatar/${fileName}`;
  return avatarImages[path] || avatarDefault;
}

export default function MyPage() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMypage = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/user/mypage', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (response.data.header?.resultCode === 1000) {
          setUserInfo(response.data.body);
        } else {
          setError(response.data.header?.resultMsg || '마이페이지 정보 조회 실패');
        }
      } catch (err: any) {
        setError('마이페이지 정보 조회 중 오류가 발생했습니다.');
        console.error('마이페이지 오류: ',error);
      } finally {
        setLoading(false);
      }
    };
    fetchMypage();
  }, []);

  const handleWithdraw = () => {
    navigate('/'); // '/'로 이동
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center bg-[#fffdf8] pt-[50px] min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8 max-w-[900px] w-full ml-[50px]">
        <div className="flex items-center mb-8 w-full max-w-[700px]">
          <img src={getAvatarSrc(userInfo?.anoImg)} alt="Avatar" className="w-24 h-24 rounded-full bg-[#DDDBD5] bg-opacity-80 object-cover ml-5" />
          <div className="ml-10 flex items-center bg-[#FFE8D6] p-4 pl-6 pr-6 rounded-2xl w-full">
            <div className="flex flex-col">
              <p className="text-lg text-[#4A3F35]">안녕하세요~!!</p>
              <p className="text-xl font-semibold text-[#4A3F35]">{userInfo?.name}님</p>
              <p className="text-sm text-[#4A3F35]">{userInfo?.email}</p>
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
            onClick={() => setIsPopupOpen(true)}
            className="w-full max-w-[750px] flex justify-between items-center border-b border-[#9C9C9C] py-4 text-[#4A3F35] p-3">
              탈퇴하기
          </button>
        </div>

        {/* 팝업창 */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
            <div className="bg-[#FFE8D6] p-8 rounded-2xl shadow-md w-[90%] max-w-md text-center relative">
              {/* 이미지 */}
              <img 
                src={getAvatarSrc(userInfo?.anoImg)} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full bg-[#DDDBD5] bg-opacity-80 object-cover mx-auto mb-6" 
              />

              {/* 문구 */}
              <p className="text-xl font-semibold mb-8">정말 탈퇴하시겠습니까?</p>

              {/* 버튼들 */}
              <div className="flex justify-center space-x-4">
                <button 
                  className="bg-[#FFB3AB] text-white px-6 py-2 rounded"
                  onClick={handleWithdraw}
                >
                  탈퇴하기
                </button>
                <button 
                  className="bg-[#FFFDF8] text-[#7C6F62] px-6 py-2 rounded"
                  onClick={() => setIsPopupOpen(false)}
                >
                  뒤로가기
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-12 text-center">
          <div className="flex items-center justify-between w-full max-w-[100px]">
            <p className="text-[#4A3F35] -ml-40 mb-2">누적 출석일</p>
            <div className="inline-flex items-center justify-center bg-[#FFE8D6] w-20 h-20 rounded-full text-2xl text-[#4A3F35]">
              {userInfo?.attend ?? 0}
            </div>
            <p className="text-[#4A3F35]">일</p>
          </div>
        </div>

      </div>
    </div>
  );
}
