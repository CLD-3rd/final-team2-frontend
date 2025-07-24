"use client";

import { useState } from "react";
import { Filterbar } from "@/shared";
import {
  LocalCompanionCard,
  CreateLocalModal,
} from "@/features/local-companion";

const LocalCompanionPage = ({ isLoggedIn }) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handlePostCreate = async () => {
    // await fetchFeeds(); // ✅ 새 현지 동행 모집글 작성 후 다시 목록 불러오기
    closeCreateModal();
  };

  // Sample data for local companion posts
  const localCompanionPosts = [
    {
      id: 1,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 4,
      author: "사용자A",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
    {
      id: 2,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 5,
      author: "사용자B",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
    {
      id: 3,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 5,
      author: "사용자C",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
    {
      id: 4,
      title: "25년 제주 여행 가실 분 여자분들",
      rating: 5,
      author: "사용자D",
      profileImage: "/placeholder.svg?height=40&width=40",
      tags: ["느긋해요", "술 좋아해요", "의상차이에요"],
    },
  ];

  return (
    <div className="local-companion-page">
      <Filterbar filters={filters} onFilterChange={handleFilterChange} />
      <div className="local-companion-grid">
        {localCompanionPosts.map((post) => (
          <LocalCompanionCard key={post.id} {...post} />
        ))}
      </div>
      {/* ✅ + 버튼 */}
      {isLoggedIn && (
        <button className="fab" onClick={openCreateModal}>
          +
        </button>
      )}
      {/* ✅ CreateFeedModal (FeedPage에서 관리) */}
      {isCreateModalOpen && (
        <CreateLocalModal
          onClose={closeCreateModal}
          onPostCreate={handlePostCreate}
        />
      )}
    </div>
  );
};

export default LocalCompanionPage;
