"use client";

import { useState, useEffect } from "react";
import { Header, Sidebar } from "@/shared";
import AppRouter from "@/AppRouter";
import { LoginModal, getCurrentUser, logoutUser } from "@/features/user";
import "@/App.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("feed");
  const [feedCount, setFeedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ 로그인 상태 유지 (서버에 요청)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user || null);
      setLoading(false);
    };
    fetchCurrentUser();
  }, []);

  const handleLogin = async () => {
    setIsLoginModalOpen(false);
    const user = await getCurrentUser();
    if (user) setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      const success = await logoutUser();
      if (success) {
        setCurrentUser(null);
        window.location.reload(); // ✅ 페이지 새로고침
      }
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setCurrentUser(updatedProfile); // ✅ 전역 currentUser 업데이트
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handlePageChange = (pageId) => setCurrentPage(pageId);
  const handleFeedCountChange = (count) => setFeedCount(count);

  return (
    <div className="app">
      <Toaster position="top-right" reverseOrder={false} />
      <Header
        currentUser={currentUser}
        onLogin={openLoginModal}
        onLogout={handleLogout}
      />

      <div className="app-body">
        <Sidebar
          isLoggedIn={!!currentUser}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          feedCount={feedCount}
        />
        <AppRouter
          currentUser={currentUser}
          sidebarOpen={sidebarOpen}
          currentPage={currentPage}
          onFeedCountChange={handleFeedCountChange}
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
