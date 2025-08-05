"use client";

import { FeedPage } from "@/features/feed";
import {
  PlannedCompanionPage,
  LocalCompanionPage,
} from "@/features/travel-post";
import { ProfileManagementPage, ScheduleManagementPage } from "@/features/user";
import { ChatPage } from "@/features/chat";
import { ErrorPage } from "@/shared";

const MainContent = ({
  currentUser,
  sidebarOpen,
  currentPage,
  onFeedCountChange,
  onProfileUpdate,
  onLoginModalOpen,
}) => {
  const renderPage = () => {
    switch (currentPage) {
      case "planned-companion":
        return (
          <PlannedCompanionPage
            currentUser={currentUser}
            onLoginModalOpen={onLoginModalOpen}
          />
        );
      case "local-companion":
        return (
          <LocalCompanionPage
            currentUser={currentUser}
            onLoginModalOpen={onLoginModalOpen}
          />
        );
      case "profile":
        return (
          <ProfileManagementPage
            currentUser={currentUser}
            onProfileUpdate={onProfileUpdate}
          />
        );
      case "schedule":
        console.log("📅 현재 사용자:", currentUser);
        return <ScheduleManagementPage
          currentUser={currentUser}
          onProfileUpdate={onProfileUpdate} />;
      case "chat":
        return <ChatPage />;
      case "support":
        return (
          <ErrorPage
            statusCode={404}
            httpMessage="Not Found"
            message="고객센터 페이지는 아직 준비 중입니다."
            onGoHome={() => (window.location.href = "/")}
            onRetry={() => window.location.reload()}
          />
        );
      case "feed":
      default:
        return (
          <FeedPage
            currentUser={currentUser}
            onFeedCountChange={onFeedCountChange}
            onLoginModalOpen={onLoginModalOpen}
          />
        );
    }
  };

  return (
    <main
      className={`main-content bg-stone-300 ${
        sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      {renderPage()}
    </main>
  );
};

export default MainContent;
