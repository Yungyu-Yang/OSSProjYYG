import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import lockIcon from '/assets/etc/lock.png';
import avatar1 from '/assets/avatar/avatar1.png';
import avatar2 from '/assets/avatar/avatar2.png';
import avatar3 from '/assets/avatar/avatar3.png';
import avatar4 from '/assets/avatar/avatar4.png';
import avatar5 from '/assets/avatar/avatar5.png';
import avatar6 from '/assets/avatar/avatar6.png';
import avatar7 from '/assets/avatar/avatar7.png';
import avatar8 from '/assets/avatar/avatar8.png';
import avatar9 from '/assets/avatar/avatar9.png';
import avatar10 from '/assets/avatar/avatar10.png';

interface AvatarItemData {
  id: string;
  name: string;
  src: string;
  hashtag: string;
  unlocked: boolean;
}

const avatarItemsDefault: AvatarItemData[] = [
  { id: '1', name: '맴미', src: avatar1, hashtag: '# 산만 # 쾌활', unlocked: false },
  { id: '2', name: '뿌우', src: avatar2, hashtag: '# 침착 # 순수', unlocked: false },
  { id: '3', name: '늘이', src: avatar3, hashtag: '# 똑똑 # 차분', unlocked: false },
  { id: '4', name: '꽉꽉', src: avatar4, hashtag: '# 시끌 # 쾌활', unlocked: false },
  { id: '5', name: '삑삑', src: avatar5, hashtag: '# 밝음 # 반장', unlocked: false },
  { id: '6', name: '먐미', src: avatar6, hashtag: '# 시크 # 도도', unlocked: false },
  { id: '7', name: '멈무', src: avatar7, hashtag: '# 애교 # 행복', unlocked: false },
  { id: '8', name: '끼순', src: avatar8, hashtag: '# 시끌 # 산만', unlocked: false },
  { id: '9', name: '팔딱', src: avatar9, hashtag: '# 순수 # 밝음', unlocked: false },
  { id: '10', name: '코코', src: avatar10, hashtag: '# 침착 # 차분', unlocked: false },
];

const AvatarGrid: React.FC = () => {
  const [avatars, setAvatars] = useState<AvatarItemData[]>(avatarItemsDefault);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setAttend] = useState(0); // 출석일수
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customModalMessage, setCustomModalMessage] = useState('');
  const baseURL = import.meta.env.VITE_API_BASE_URL;


  // accessToken
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchAvatarData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 출석일수, 선택 아바타 정보
        const userRes = await axios.get(`${baseURL}/user/mypage`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        if (userRes.data.header?.resultCode !== 1000) {
          setError(userRes.data.header?.resultMsg || '유저 정보 조회 실패');
          setLoading(false);
          return;
        }
        const userBody = userRes.data.body;
        setAttend(userBody.attend || 0);

        // 아바타 잠금 정보
        const lockRes = await axios.get(`${baseURL}/user/avatar/lock`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        if (lockRes.data.header?.resultCode !== 1000) {
          setError(lockRes.data.header?.resultMsg || '아바타 잠금 정보 조회 실패');
          setLoading(false);
          return;
        }
        const lockList = lockRes.data.body || [];

        // 아바타 선택 정보
        const selectRes = await axios.get(`${baseURL}/user/avatar`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        if (selectRes.data.header?.resultCode !== 1000) {
          setError(selectRes.data.header?.resultMsg || '아바타 선택 정보 조회 실패');
          setLoading(false);
          return;
        }
        const selectedAno = selectRes.data.body?.ano?.toString();
        setSelectedId(selectedAno);

        const unlockedCount = 2 + Math.floor((userBody.attend || 0) / 10);
        const newAvatars = avatarItemsDefault.map((item, idx) => {
          // 서버에서 받은 잠금 정보가 있으면 우선 적용
          const lockInfo = lockList.find((a: any) => a.ano?.toString() === item.id);
          if (lockInfo) {
            return { ...item, unlocked: lockInfo.status === 1 };
          }
          // 아니면 출석일수 기반 잠금 해제
          return { ...item, unlocked: idx < unlockedCount };
        });
        setAvatars(newAvatars);
      } catch (err: any) {
        setError('아바타 정보 조회 중 오류가 발생했습니다.');
        console.error('아바타 오류: ', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvatarData();
    // eslint-disable-next-line
  }, []);

  const handleClick = (id: string, unlocked: boolean) => {
    if (!unlocked) return;
    setSelectedId(id);
  };

  const handleSave = async () => {
    if (!selectedId) return;
    try {
      const response = await axios.patch(
        `${baseURL}/user/avatar/change`,
        { ano: selectedId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      console.log("응답 결과 : ", response.data);
      if (response.data.header?.resultCode === 1000) {
        setCustomModalMessage('아바타가 변경되었습니다!');
        setCustomModalOpen(true);
      } else {
        console.log(response.data.header?.resultMsg || '아바타 변경에 실패했습니다.');
      }
    } catch (e: any) {
      console.log(e?.response?.data?.header?.resultMsg || '아바타 변경 중 오류가 발생했습니다.');
    }
  };

  if (!accessToken) {
    return <Wrapper>로그인 후 이용 가능합니다.</Wrapper>;
  }
  if (loading) {
    return <Wrapper>로딩 중...</Wrapper>;
  }
  if (error) {
    return <Wrapper style={{ color: 'red' }}>{error}</Wrapper>;
  }

  return (
    <Wrapper>
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
      <Grid>
        {avatars.map(({ id, name, src, hashtag, unlocked }) => {
          const isSelected = selectedId === id;
          return (
            <AvatarWrapper
              key={id}
              unlocked={unlocked}
              onClick={() => handleClick(id, unlocked)}
            >
              <NamePill selected={isSelected}>{name}</NamePill>
              <AvatarCircle selected={isSelected} unlocked={unlocked}>
                <Character src={src} alt={name} locked={!unlocked} />
                {!unlocked && <LockImg src={lockIcon} alt="locked" />}
              </AvatarCircle>
              <HashtagText>{hashtag}</HashtagText>
            </AvatarWrapper>
          );
        })}
      </Grid>
      <SaveButton
        disabled={!selectedId}
        onClick={handleSave}
      >
        저장하기
      </SaveButton>
    </Wrapper>
  );
};

export default AvatarGrid;

// Styled Components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
  background: #fffdf8;
  border-radius: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 64px;
  justify-items: center;
`;

const AvatarWrapper = styled.div<{ unlocked: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ unlocked }) => (unlocked ? 'pointer' : 'not-allowed')};
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const NamePill = styled.div<{ selected: boolean }>`
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 14px;
  margin-bottom: 10px;
  border: ${({ selected }) => (selected ? '2px solid #FFB3AB' : '2px solid transparent')};
  color: #333;
  background: #FFE7D9;
  transition: border 0.2s;
`;

const AvatarCircle = styled.div<{ selected: boolean; unlocked: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ unlocked }) => (unlocked ? '#fffdf8' : '#757575')};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: ${({ selected }) => (selected ? '3px solid #FFB3AB' : '3px solid transparent')};
  overflow: hidden;
  transition: border 0.2s;
`;

const Character = styled.img<{ locked: boolean }>`
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: ${({ locked }) => (locked ? 'grayscale(50%) brightness(80%)' : 'none')};
`;

const LockImg = styled.img`
  position: absolute;
  width: 28px;
  height: 28px;
`;

const HashtagText = styled.div`
  font-size: 13px;
  color: #555;
  margin-top: 10px;
  text-align: center;
`;

const SaveButton = styled.button`
  margin-top: 32px;
  padding: 10px 28px;
  font-size: 15px;
  color: #fff;
  background: #FFB3AB;
  border: none;
  border-radius: 26px;
  cursor: pointer;
  opacity: ${({ disabled }: { disabled?: boolean }) => (disabled ? 0.5 : 1)};
  transition: background 0.2s, opacity 0.2s;
  &:hover {
    background: ${({ disabled }: { disabled?: boolean }) => (disabled ? '#FFB3AB' : '#FF99A6')};
  }
`;