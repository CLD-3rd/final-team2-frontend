"use client";

import { useState, useEffect } from "react";
import { Filterbar } from "@/shared";
import {
  LocalCompanionCard,
  CreateLocalModal,
  UpdateLocalModal,
  getTravelPosts,
} from "@/features/travel-post";
import toast from "react-hot-toast";

const LocalCompanionPage = ({ isLoggedIn, onLoginModalOpen }) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });
  const [sort, setSort] = useState("recent"); // ✅ 정렬 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]); // ✅ 서버 데이터 저장
  const [loading, setLoading] = useState(true);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleEditRequest = (postData) => {
    setSelectedPost(postData);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchPosts();
    setIsEditModalOpen(false);
    setSelectedPost(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  // ✅ API 호출 (조회)
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { posts } = await getTravelPosts("NOW", filters);
      setPosts(posts);
    } catch (error) {
      toast.error("현지 동행 모집글 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters, sort]);

  const handlePostCreate = async () => {
    await fetchPosts();
    closeCreateModal();
  };

  return (
    <div className="local-companion-page">
      <Filterbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* ✅ 로딩 상태 처리 */}
      {loading ? (
        <p className="loading-text">로딩 중...</p>
      ) : posts.length === 0 ? (
        <p className="empty-text">현지 동행 모집글이 없습니다.</p>
      ) : (
        <div className="local-companion-grid">
          {posts.map((post) => (
            <LocalCompanionCard
              key={post.id}
              postData={post}
              isLoggedIn={isLoggedIn}
              onLoginModalOpen={onLoginModalOpen}
              onEdit={handleEditRequest}
            />
          ))}
        </div>
      )}

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
      {/* ✅ Update Modal */}
      {isEditModalOpen && selectedPost && (
        <UpdateLocalModal
          onClose={() => setIsEditModalOpen(false)}
          initialData={selectedPost}
          onSuccess={handleEditSuccess}
          mode="edit"
        />
      )}
    </div>
  );
};

export default LocalCompanionPage;
