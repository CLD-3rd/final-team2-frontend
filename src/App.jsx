"use client";

import { useState } from "react";
import { Header, Sidebar } from "@/shared";
import AppRouter from "@/AppRouter";
import { CreateLocalModal } from "@/features/local-companion";
import { LoginModal } from "@/features/user";
import "@/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("feed");
  const [feedCount, setFeedCount] = useState(0);

  const [userProfile, setUserProfile] = useState({
    username: "사용자님",
    profileImage: "/images/user-profile.jpg",
    badges: ["브론즈 뱃지", "랜드마크 뱃지"],
    rating: 4,
    reviewCount: 20,
    travelTags: [],
    ownedBadges: ["브론즈 뱃지", "랜드마크 뱃지", "여행 마니아", "사진 전문가"],
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const handleFeedCountChange = (count) => {
    setFeedCount(count);
  };

  // + 버튼을 보여줄 페이지들 정의
  const showFabPages = ["feed", "planned-companion", "local-companion"];
  const shouldShowFab = isLoggedIn && showFabPages.includes(currentPage);
  console.log("[App] login : ", isLoggedIn);

  return (
    <div className="app">
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={openLoginModal}
        onLogout={handleLogout}
        userProfile={userProfile}
      />

      <div className="app-body">
        <Sidebar
          isLoggedIn={isLoggedIn}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          feedCount={feedCount}
        />
        <AppRouter
          sidebarOpen={sidebarOpen}
          currentPage={currentPage}
          onFeedCountChange={handleFeedCountChange}
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
          onLoginModalOpen={openLoginModal}
        />
      </div>

      {isCreateModalOpen && (
        <>
          {currentPage === "local-companion" && (
            <CreateLocalModal
              onClose={closeCreateModal}
              onPostCreate={handlePostCreate}
            />
          )}
        </>
      )}

      {isLoginModalOpen && (
        <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;