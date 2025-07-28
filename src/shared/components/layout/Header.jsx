"use client";

import { ProfileImage } from "@/shared";

const Header = ({ isLoggedIn, onLogin, onLogout, userProfile }) => {
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
        {isLoggedIn && userProfile ? (
          <div className="user-menu flex items-center gap-3">
            <ProfileImage
              src={
                userProfile.profileImage || "/images/default-user-profile.png"
              }
              alt="프로필"
              className="profile-image"
              onError={(e) => {
                e.currentTarget.src = "/images/default-user-profile.png";
              }}
            />
            <span className="username font-semibold">
              {userProfile.nickname || "사용자"}
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
