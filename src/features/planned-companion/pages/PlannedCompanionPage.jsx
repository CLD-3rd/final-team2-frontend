"use client";

import { useState } from "react";
import { Filterbar } from "@/shared";
import {
  PlannedCompanionCard,
  CreatePlannedModal,
} from "@/features/planned-companion";

const PhotoCompanionPage = ({ isLoggedIn, onLoginModalOpen }) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePostCreate = async () => {
    // await fetch(); // ✅ 새 현지 동행 모집글 작성 후 다시 목록 불러오기
    closeCreateModal();
  };

  // Sample data for 사전 동행 모집 posts
  const companionPosts = [
    {
      id: 1,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      authorImage: "/images/user-a.png", // 이미지 없을 경우 undefined
      participants: 2,
      maxParticipants: 4,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
    {
      id: 2,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      participants: 1,
      maxParticipants: 3,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
    {
      id: 3,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      participants: 3,
      maxParticipants: 5,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
    {
      id: 4,
      title: "프랑스 1박2일 가성비",
      location: "김해시",
      dateRange: "25.7.18~25.7.19",
      description:
        "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항",
      author: "A",
      participants: 0,
      maxParticipants: 2,
      image: "/placeholder.svg?height=200&width=300&text=여행+이미지",
    },
  ];

  return (
    <div className="photo-companion-page">
      <Filterbar filters={filters} onFilterChange={handleFilterChange} />
      <div className="companion-grid">
        {companionPosts.map((post) => (
          <PlannedCompanionCard
            key={post.id}
            {...post}
            isLoggedIn={isLoggedIn}
            onLoginModalOpen={onLoginModalOpen}
          />
        ))}
      </div>
      {/* ✅ + 버튼 */}
      {isLoggedIn && (
        <button className="fab" onClick={openCreateModal}>
          +
        </button>
      )}
      {/* ✅ CreateFeedModal (PlannedCompanionPage에서 관리) */}
      {isCreateModalOpen && (
        <CreatePlannedModal
          onClose={closeCreateModal}
          onPostCreate={handlePostCreate}
        />
      )}
    </div>
  );
};

export default PhotoCompanionPage;
