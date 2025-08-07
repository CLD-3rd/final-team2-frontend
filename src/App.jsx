"use client";

import { useState, useEffect, useCallback } from "react";
import { Header, Sidebar } from "@/shared";
import AppRouter from "@/AppRouter";
import { LoginModal, getCurrentUser, logoutUser } from "@/features/user";
import "@/App.css";
import { Toaster, toast } from "react-hot-toast";
import { wsManager } from "@/features/chat/ws/wsManager";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("feed");
  const [feedCount, setFeedCount] = useState(0);

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

  const handleGlobalNotification = useCallback((notification) => {
  console.log("🔔 알림 수신 (전역):", notification);
  toast.success(
    <div>
      <strong>{notification.title || '새 알림'}</strong>
      <p>{notification.content}</p>
    </div>,
    { duration: 5000 }
  );
}, []);

const handleGlobalMessage = useCallback((message) => {
  console.log("📥 1:1 메시지 수신 (전역):", message);
}, []);

  // 👇 수정된 웹소켓 연결 로직
  useEffect(() => {
    if (!currentUser) return;


    const initWebSocket = async () => {
      try {
        await wsManager.connect();
        console.log("✅ App.jsx: WebSocket이 성공적으로 연결되었습니다.");
        wsManager.subscribe('/user/queue/notifications', handleGlobalNotification);
        wsManager.subscribe('/user/queue/messages', handleGlobalMessage);
      } catch (err) {
        console.error("❌ App.jsx: WebSocket 초기화 실패:", err);
      }
    };

    initWebSocket();

    // 정리(cleanup) 함수는 자신이 생성했던 바로 그 핸들러들을
    // 정확히 참조하여 안전하게 구독 취소할 수 있습니다.
    return () => {
      console.log("🧹 App.jsx의 useEffect 정리 실행. 구독을 취소합니다.");
      wsManager.unsubscribe('/user/queue/notifications', handleGlobalNotification);
      wsManager.unsubscribe('/user/queue/messages', handleGlobalMessage);
    };
  }, [currentUser, handleGlobalNotification, handleGlobalMessage]);

  const handleLogout = async () => {
    try {
      wsManager.disconnect(); // 로그아웃 시 웹소켓 연결 종료
      await logoutUser();
      setCurrentUser(null);
      window.location.reload();
    } catch (err) {
      console.error("로그아웃 실패:", err);
      toast.error("로그아웃 중 문제가 발생했습니다.");
    }
  };

  const handleProfileUpdate = async (updatedProfile) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedProfile }));
    try {
      const freshUser = await getCurrentUser();
      if (freshUser) setCurrentUser(freshUser);
    } catch (err) {
      console.error("유저 정보 재동기화 실패:", err);
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
      <Header currentUser={currentUser} onLogin={openLoginModal} onLogout={handleLogout} />
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
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />}
    </div>
  );
}

export default App;