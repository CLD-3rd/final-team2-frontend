"use client";

import { useState } from "react";
import FilterBar from "@/components/Feed/FilterBar";
import FeedGrid from "@/components/Feed/FeedGrid";
import PhotoCompanionPage from "@/pages/PhotoCompanionPage";
import LocalCompanionPage from "@/pages/LocalCompanionPage";
import ProfileManagementPage from "@/pages/ProfileManagementPage";
import ScheduleManagementPage from "@/pages/ScheduleManagementPage";
import ChatPage from "@/pages/ChatPage";
import ErrorPage from "@/pages/ErrorPage";

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
          <PhotoCompanionPage
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
            onFeedCountChange={onFeedCountChange}
            isLoggedIn={isLoggedIn}
            feedData={feedData}
            onFeedDelete={onFeedDelete}
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

const FeedPage = ({
  onFeedCountChange,
  isLoggedIn,
  feedData,
  onFeedDelete,
}) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <FeedGrid
        filters={filters}
        onFeedCountChange={onFeedCountChange}
        isLoggedIn={isLoggedIn}
        feedData={feedData}
        onFeedDelete={onFeedDelete}
      />
    </>
  );
};

export default MainContent;
