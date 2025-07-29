"use client";

import { useState } from "react";
import { Header, Sidebar } from "@/shared";
import AppRouter from "@/AppRouter";
import { CreateLocalModal } from "@/features/travel-post";
import { LoginModal } from "@/features/user";
import "@/App.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("feed");
  const [feedCount, setFeedCount] = useState(0);

  const [userProfile, setUserProfile] = useState({
    id : 12,
    badges: [],    
    travelTags: [],
    ownedBadges: [],
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

  return (
    <div className="app">
      <Toaster position="top-right" reverseOrder={false} />
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

      {isLoginModalOpen && (
        <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;