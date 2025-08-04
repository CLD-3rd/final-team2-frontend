"use client";

import { useState, useEffect } from "react";
import { Header, Sidebar } from "@/shared";
import AppRouter from "@/AppRouter";
import { LoginModal, getCurrentUser, logoutUser } from "@/features/user";
import "@/App.css";
import { Toaster } from "react-hot-toast";
import { wsManager } from "@/features/chat/ws/wsManager";


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

  useEffect(() => {
    if (!currentUser) return;

    const initWebSocket = async () => {
      try {
        await wsManager.connect();

        // ✅ 알림 구독
        wsManager.subscribeNotifications((msg) => {
          console.log("🔔 알림 수신:", msg);
          // 알림 토스트나 UI 업데이트 등 가능
        });

        // ✅ 모든 채팅방 구독
        const directRooms = await getDirectChatRooms();
        const groupRooms = await getGroupChatRooms();
        const allRooms = [...(directRooms || []), ...(groupRooms || [])];

        allRooms.forEach((room) => {
          const isGroup = room.type === "GROUP" || !!room.groupName;
          wsManager.subscribeChat(room.roomId, isGroup, (msg) => {
            console.log("📥 채팅 수신:", msg);
            // 알림이든 전역상태 저장이든 여기에 구현 가능
          });
        });

        // ✅ 헬스체크 시작
        wsManager.startHealthCheck?.();
      } catch (err) {
        console.error("❌ WebSocket 초기화 실패:", err);
      }
    };

    initWebSocket();

    return () => {
      wsManager.disconnect();
      wsManager.stopHealthCheck?.();
    };
  }, [currentUser]);



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

  const handleProfileUpdate = async (updatedProfile) => {
    // 기존 데이터와 병합
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedProfile,
    }));

    // 서버에서 최신 정보 다시 가져오기 (비동기)
    try {
      const freshUser = await getCurrentUser();
      if (freshUser) {
        setCurrentUser(freshUser);
      }
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