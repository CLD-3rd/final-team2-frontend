"use client";

import { useState, useEffect } from "react";
import { Header, Sidebar } from "@/shared";
import AppRouter from "@/AppRouter";
import { LoginModal } from "@/features/user";
import "@/App.css";
import { Toaster } from "react-hot-toast";
import { axiosInstance } from "@/shared"; // ✅ withCredentials: true 포함된 axios

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("feed");
  const [feedCount, setFeedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState(null);

  // const [userProfile, setUserProfile] = useState({
  //   id: 12,
  //   badges: [],
  //   travelTags: [],
  //   ownedBadges: [],
  // });

  // ✅ 로그인 상태 유지 (서버에 요청)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get("/api/users/me");
        setUserProfile(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.warn("로그인 상태 확인 실패:", error);
        setIsLoggedIn(false);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    // ✅ 로그인 직후 유저 정보 다시 가져오기
    axios.get("/api/users/me").then((res) => setUserProfile(res.data));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout"); // ✅ 로그아웃 API 필요
      setIsLoggedIn(false);
      setUserProfile(null);
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
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
