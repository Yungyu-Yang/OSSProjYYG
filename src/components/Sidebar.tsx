import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-18 bg-gray-800 text-white min-h-screen">
      <div className="flex justify-center py-3">
        <Link to="/" className="block p-3">
          <svg className="bi pe-none" width="40" height="32" aria-hidden="true">
            {/* 아이콘을 직접 추가하거나 Tailwind CSS에서 제공하는 아이콘을 사용할 수 있습니다 */}
            <use xlinkHref="#bootstrap" />
          </svg>
          <span className="sr-only">Icon-only</span>
        </Link>
      </div>

      <ul className="flex flex-col items-center space-y-2 mb-auto">
        <li>
          <Link
            to="/home"
            className="nav-link py-3 px-4 text-center hover:bg-gray-600 rounded-md"
            aria-label="Home"
          >
            <svg
              className="bi pe-none"
              width="24"
              height="24"
              role="img"
              aria-label="Home"
            >
              <use xlinkHref="#home" />
            </svg>
          </Link>
        </li>
        <li>
          <Link
            to="/chat"
            className="nav-link py-3 px-4 text-center hover:bg-gray-600 rounded-md"
            aria-label="Chat"
          >
            <svg
              className="bi pe-none"
              width="24"
              height="24"
              role="img"
              aria-label="Chat"
            >
              <use xlinkHref="#chat" />
            </svg>
          </Link>
        </li>
        <li>
          <Link
            to="/calendar"
            className="nav-link py-3 px-4 text-center hover:bg-gray-600 rounded-md"
            aria-label="Calendar"
          >
            <svg
              className="bi pe-none"
              width="24"
              height="24"
              role="img"
              aria-label="Calendar"
            >
              <use xlinkHref="#calendar" />
            </svg>
          </Link>
        </li>
        <li>
          <Link
            to="/avatar"
            className="nav-link py-3 px-4 text-center hover:bg-gray-600 rounded-md"
            aria-label="Avatar"
          >
            <svg
              className="bi pe-none"
              width="24"
              height="24"
              role="img"
              aria-label="Avatar"
            >
              <use xlinkHref="#avatar" />
            </svg>
          </Link>
        </li>
        <li>
          <Link
            to="/mypage"
            className="nav-link py-3 px-4 text-center hover:bg-gray-600 rounded-md"
            aria-label="MyPage"
          >
            <svg
              className="bi pe-none"
              width="24"
              height="24"
              role="img"
              aria-label="MyPage"
            >
              <use xlinkHref="#person" />
            </svg>
          </Link>
        </li>
      </ul>

      <div className="border-t mt-auto">
        <div className="flex justify-center p-3">
          <button
            className="flex items-center justify-center p-2 w-12 h-12 bg-gray-700 rounded-full"
            aria-expanded={isDropdownOpen ? "true" : "false"}
            onClick={toggleDropdown} // 버튼 클릭 시 드롭다운 토글
          >
            <img
              src="https://github.com/mdo.png"
              alt="mdo"
              width="24"
              height="24"
              className="rounded-full"
            />
          </button>
        </div>

        {/* 드롭다운 메뉴, isDropdownOpen에 따라 보이거나 숨김 */}
        <div
          className={`dropdown-menu text-small shadow bg-gray-800 ${isDropdownOpen ? "block" : "hidden"}`}
        >
          <Link to="#" className="dropdown-item text-white">
            New project...
          </Link>
          <Link to="#" className="dropdown-item text-white">
            Settings
          </Link>
          <Link to="#" className="dropdown-item text-white">
            Profile
          </Link>
          <hr className="dropdown-divider" />
          <Link to="#" className="dropdown-item text-white">
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
