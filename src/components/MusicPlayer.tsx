import React, { useRef, useState, useEffect } from 'react';
import { PiPlay, PiPause, PiSkipBack, PiSkipForward } from 'react-icons/pi';

interface MusicPlayerProps {
  src: string;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ src, className = '' }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [src]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSkipForward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleSkipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-4 w-full max-w-[400px] bg-[#FFF1E6] rounded-xl p-6 shadow-md ${className}`}>
      <audio ref={audioRef} src={src} />
      <button
        onClick={handleSkipBackward}
        className="text-white bg-[#E29578] p-2 rounded-full"
        title="10초 뒤로"
      >
        <PiSkipBack size={20} />
      </button>
      <button
        onClick={handlePlayPause}
        className="text-white bg-[#E29578] p-4 rounded-full"
        title={isPlaying ? '일시정지' : '재생'}
      >
        {isPlaying ? <PiPause size={24} /> : <PiPlay size={24} />}
      </button>
      <button
        onClick={handleSkipForward}
        className="text-white bg-[#E29578] p-2 rounded-full"
        title="10초 앞으로"
      >
        <PiSkipForward size={20} />
      </button>
      <div className="flex-1">
        <div className="w-full bg-[#FFD6C4] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#FF867C] h-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-1 text-[#7C6F62]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 