"use client";

import { useLockBodyScroll, ProfileImage } from "@/shared";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/features/user/api/userApi";
import { parseUserInfoResponse } from "@/features/user/dto/userDto";



const Header = ({ isLoggedIn, onLogin, onLogout }) => {
  const [userProfile, setUserProfile] = useState({
    username: "로딩중...",
    profileImage: "/images/default-user-profile.png",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 임시로 userId = 12 (로그인 상태라면 토큰이나 session에서 가져오는 것이 일반적)
        const rawData = await getUserInfo(12);
        const parsedData = parseUserInfoResponse(rawData);
        setUserProfile(parsedData);
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserInfo();
    }
  }, [isLoggedIn]);

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
          <div className="user-menu">
            <ProfileImage
              src={userProfile.profileImage}
              alt="프로필"
              className="profile-image"
              onError={(e) => {
                e.currentTarget.src = "/images/default-user-profile.png";
              }}
            />
            <span>{userProfile.username}</span>
            <button onClick={onLogout} className="auth-button font-medium">
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="auth-button font-medium text-gray-950 bg-neutral-300"
          >
            로그인/회원가입
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;