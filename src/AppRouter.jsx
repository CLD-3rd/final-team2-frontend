"use client";

import FeedPage from "@/features/feed";
import { LocalCompanionPage } from "@/features/local-companion";
import { PlannedCompanionPage } from "@/features/planned-companion";
import { ProfileManagementPage, ScheduleManagementPage } from "@/features/user";
import { ChatPage } from "@/features/chat";
import { ErrorPage } from "@/shared";

const MainContent = ({
  sidebarOpen,
  currentPage,
  onFeedCountChange,
  isLoggedIn,
  feedData,
  onFeedDelete,
  userProfile,
  onProfileUpdate,
  onLoginModalOpen,
}) => {
  const renderPage = () => {
    switch (currentPage) {
      case "photo":
        return (
          <PlannedCompanionPage
            isLoggedIn={isLoggedIn}
            onLoginModalOpen={onLoginModalOpen}
          />
        );
      case "friend":
        return <LocalCompanionPage />;
      case "profile":
        return (
          <ProfileManagementPage
            userProfile={userProfile}
            onProfileUpdate={onProfileUpdate}
          />
        );
      case "schedule":
        return <ScheduleManagementPage />;
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
            isLoggedIn={isLoggedIn}
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
