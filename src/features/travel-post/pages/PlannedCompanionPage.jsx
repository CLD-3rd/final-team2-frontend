"use client";

import { useState, useEffect } from "react";
import {
  Filterbar,
  InfiniteScrollWrapper,
  LoadingIndicator,
  EndMessage,
} from "@/shared";
import {
  PlannedCompanionCard,
  CreatePlannedModal,
  getTravelPosts,
  UpdatePlannedModal,
  PostDetailModal,
} from "@/features/travel-post";
import toast from "react-hot-toast";

const PlannedCompanionPage = ({ isLoggedIn, onLoginModalOpen }) => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ sort: "recent" });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ✅ 필터 변경 시 초기화
  useEffect(() => {
    setPage(1);
    setPosts([]);
    fetchPosts(1, false);
  }, [filters]);

  // ✅ 모달 열기/닫기
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const fetchPosts = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const { posts: newPosts, pageInfo } = await getTravelPosts(
        "BEFORE",
        filters,
        pageNum,
        12
      );
      setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
      setHasMore(pageNum < pageInfo.totalPages);
    } catch (error) {
      toast.error("사전 동행 모집글 조회 실패");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

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

  const handlePostCreate = async () => {
    await fetchPosts(); // ✅ 새 글 등록 후 목록 갱신
    closeCreateModal();
  };

  // ✅ 등록/수정 완료 시 새로고침
  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setSelectedPostId(null);
  };

  // 모집글 상세 관련 핸들러
  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
  };

  const closeDetailModal = () => {
    setSelectedPostId(null);
  };

  return (
    <div className="planned-companion-page">
      <Filterbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange} // ✅ 정렬 변경 핸들러 전달
      />

      {loading && posts.length === 0 ? (
        <LoadingIndicator text="모집글을 불러오는 중..." />
      ) : (
        <InfiniteScrollWrapper
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loaderText={<LoadingIndicator text="모집글을 불러오는 중..." />}
          endText={<EndMessage text="모든 모집글을 확인했어요!" />}
        >
          <div className="companion-grid">
            {posts.map((post) => (
              <PlannedCompanionCard
                key={post.id}
                postData={post}
                isLoggedIn={isLoggedIn}
                onLoginModalOpen={onLoginModalOpen}
                onEdit={handleEditRequest}
                onUpdateSuccess={fetchPosts}
                onPostClick={handlePostClick}
              />
            ))}
          </div>
        </InfiniteScrollWrapper>
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
      {/* ✅ 피드 상세 모달 */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={closeDetailModal}
          isLoggedIn={isLoggedIn}
          onUpdateSuccess={handleSuccess} // ✅ 수정 시 새로고침
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
