import React, { useState } from 'react';
import styled from 'styled-components';
import lockIcon from '../assets/avatar/lock.png';
import avatar1 from '../assets/avatar/avatar1.png';
import avatar2 from '../assets/avatar/avatar2.png';
import avatar3 from '../assets/avatar/avatar3.png';
import avatar4 from '../assets/avatar/avatar4.png';
import avatar5 from '../assets/avatar/avatar5.png';
import avatar6 from '../assets/avatar/avatar6.png';
import avatar7 from '../assets/avatar/avatar7.png';
import avatar8 from '../assets/avatar/avatar8.png';
import avatar9 from '../assets/avatar/avatar9.png';
import avatar10 from '../assets/avatar/avatar10.png';

interface AvatarItemData {
  id: string;
  name: string;
  src: string;
  hashtag: string;
  unlocked: boolean;
}

const avatarItems: AvatarItemData[] = [
  { id: '1', name: '맴미', src: avatar1, hashtag: '# 산만 # 쾌활', unlocked: true },
  { id: '2', name: '뿌우', src: avatar2, hashtag: '# 침착 # 순수', unlocked: true },
  { id: '3', name: '늘보', src: avatar3, hashtag: '# 똑똑 # 차분', unlocked: false },
  { id: '4', name: '꽉꽉', src: avatar4, hashtag: '# 시끌 # 깨끗', unlocked: false },
  { id: '5', name: '짹짹', src: avatar5, hashtag: '# 밝음 # 반짝', unlocked: false },
  { id: '6', name: '먐미', src: avatar6, hashtag: '# 시크 # 도도', unlocked: false },
  { id: '7', name: '멈무', src: avatar7, hashtag: '# 애교 # 행복', unlocked: false },
  { id: '8', name: '끼순', src: avatar8, hashtag: '# 시끌 # 산만', unlocked: false },
  { id: '9', name: '팔딱', src: avatar9, hashtag: '# 순수 # 밝음', unlocked: false },
  { id: '10', name: '코코', src: avatar10, hashtag: '# 침착 # 차분', unlocked: false },
];

interface AvatarGridProps {
  /** 선택이 저장되었을 때 호출됩니다 */
  onSave?: (id: string) => void;
}

const AvatarGrid: React.FC<AvatarGridProps> = ({ onSave }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (id: string, unlocked: boolean) => {
    if (!unlocked) return;
    setSelectedId(id);
  };

  return (
    <Wrapper>
      <Grid>
        {avatarItems.map(({ id, name, src, hashtag, unlocked }) => {
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
        onClick={() => selectedId && onSave?.(selectedId)}
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