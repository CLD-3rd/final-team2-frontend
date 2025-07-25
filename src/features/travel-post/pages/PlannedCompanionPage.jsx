"use client";

import { useState, useEffect } from "react";
import { Filterbar } from "@/shared";
import {
  PlannedCompanionCard,
  CreatePlannedModal,
  getTravelPosts,
  UpdatePlannedModal,
} from "@/features/travel-post";
import toast from "react-hot-toast";

const PlannedCompanionPage = ({ isLoggedIn, onLoginModalOpen }) => {
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

  // ✅ 모달 열기/닫기
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleEditRequest = (postData) => {
    setSelectedPost(postData);
    console.log(postData);
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
      const { posts } = await getTravelPosts("BEFORE", filters);
      console.log(posts);
      setPosts(posts);
    } catch (error) {
      toast.error("사전 동행 모집글 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters, sort]);

  const handlePostCreate = async () => {
    await fetchPosts(); // ✅ 새 글 등록 후 목록 갱신
    closeCreateModal();
  };

  return (
    <div className="planned-companion-page">
      <Filterbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange} // ✅ 정렬 변경 핸들러 전달
      />

      {/* ✅ 로딩 상태 처리 */}
      {loading ? (
        <p className="loading-text">로딩 중...</p>
      ) : posts.length === 0 ? (
        <p className="empty-text">사전 동행 모집글이 없습니다.</p>
      ) : (
        <div className="companion-grid">
          {posts.map((post) => (
            <PlannedCompanionCard
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

      {/* ✅ Create Modal */}
      {isCreateModalOpen && (
        <CreatePlannedModal
          onClose={closeCreateModal}
          onPostCreate={handlePostCreate}
        />
      )}
      {/* ✅ Update Modal */}
      {isEditModalOpen && selectedPost && (
        <UpdatePlannedModal
          onClose={() => setIsEditModalOpen(false)}
          initialData={selectedPost}
          onSuccess={handleEditSuccess}
          mode="edit"
        />
      )}
    </div>
  );
};

export default PlannedCompanionPage;
