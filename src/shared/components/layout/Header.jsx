"use client";

import { ProfileImage } from "@/shared";

const Header = ({ currentUser, onLogin, onLogout }) => {
  const isLoggedIn = !!currentUser;

  return (
    <header className="header bg-white">
      <div className="header-left">
        <div className="logo">
          <img
            src="https://raw.githubusercontent.com/han199805/personal/main/logo1.png"
            alt="GotEEgo Logo"
            className="header-logo-image"
          />
          <span className="logo-text">GotEEgo</span>
        </div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <div className="user-menu flex items-center gap-3">
            <ProfileImage
              src={currentUser.profileImgUrl}
              alt="프로필"
              className="profile-image"
            />
            <span className="username font-semibold">
              {currentUser.nickname || "사용자"}
            </span>
            <button
              onClick={onLogout}
              className="auth-button font-medium bg-gray-200 px-3 py-1 rounded"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="auth-button font-medium text-gray-950 bg-neutral-300 px-3 py-1 rounded"
          >
            로그인/회원가입
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
