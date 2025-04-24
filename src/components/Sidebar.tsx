import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PiHouseBold, PiChatCircleBold, PiDresserBold, PiSmileyBold, PiUserBold } from 'react-icons/pi';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar/avatar1.png';

const Sidebar = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const location = useLocation();
  const currentPath = location.pathname;


  return (
    <div className="flex flex-col w-20 bg-[rgba(255,232,214,0.8)] text-white min-h-screen z-10">
      <div className="flex justify-center py-3">
        <Link to="/" className="block p-3">
        <img src={logo} className="w-20 max-w-none" />
        </Link>
      </div>

      <ul className="flex flex-col items-center space-y-2 mb-auto">
        <li>
          <Link to="/home" className={`block p-3 rounded-md ${currentPath === '/home' ? 'bg-[rgba(255,179,171,0.5)]' : ''}`}>
            <PiHouseBold size={30} className={currentPath === '/home' ? 'text-white' : 'text-[#7C6F62]'} />
          </Link>
        </li>
        <li>
          <Link to="/chat" className={`block p-3 rounded-md ${currentPath === '/chat' ? 'bg-[rgba(255,179,171,0.5)]' : ''}`}>
            <PiChatCircleBold size={30} className={currentPath === '/chat' ? 'text-white' : 'text-[#7C6F62]'} />
          </Link>
        </li>
        <li>
          <Link to="/calendar" className={`block p-3 rounded-md ${currentPath === '/calendar' ? 'bg-[rgba(255,179,171,0.5)]' : ''}`}>
            <PiDresserBold size={30} className={currentPath === '/calendar' ? 'text-white' : 'text-[#7C6F62]'} />
          </Link>
        </li>
        <li>
          <Link to="/avatar" className={`block p-3 rounded-md ${currentPath === '/avatar' ? 'bg-[rgba(255,179,171,0.5)]' : ''}`}>
            <PiSmileyBold size={30} className={currentPath === '/avatar' ? 'text-white' : 'text-[#7C6F62]'} />
          </Link>
        </li>
        <li>
          <Link to="/mypage" className={`block p-3 rounded-md ${currentPath === '/mypage' ? 'bg-[rgba(255,179,171,0.5)]' : ''}`}>
            <PiUserBold size={30} className={currentPath === '/mypage' ? 'text-white' : 'text-[#7C6F62]'} />
          </Link>
        </li>
      </ul>



      <div className="mt-auto relative" style={{ borderTop: "0.5px solid #FFB3AB" }}>
        <div className="flex justify-center p-3">
          <button
            className="flex items-center justify-center p-2 w-12 h-12 rounded-full"
            style={{ backgroundColor: 'rgba(255, 179, 171, 0.5)' }}
            role="button"
            onClick={toggleDropdown}
          >
            <img src={avatar}/>
          </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white text-black rounded-md shadow-md px-3 py-2 z-10">
            <button className="text-sm hover:underline">
              Logout
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
