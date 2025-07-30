"use client";

import { useState, useEffect } from "react";
import {
  Filterbar,
  InfiniteScrollWrapper,
  LoadingIndicator,
  EndMessage,
} from "@/shared";
import {
  LocalCompanionCard,
  CreateLocalModal,
  UpdateLocalModal,
  getTravelPosts,
} from "@/features/travel-post";
import toast from "react-hot-toast";

const LocalCompanionPage = ({ isLoggedIn, onLoginModalOpen }) => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ sort: "recent" });

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ✅ 필터 변경 시 초기화
  useEffect(() => {
    setPage(0);
    setPosts([]);
    fetchPosts(0, false);
  }, [filters]);

  const fetchPosts = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const { posts: newPosts, pageInfo } = await getTravelPosts(
        "NOW",
        filters,
        pageNum
      );
      setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
      setHasMore(pageNum + 1 < pageInfo.totalPages);
    } catch (error) {
      toast.error("현지 동행 모집글 조회 실패");
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEditRequest = (postData) => {
    setSelectedPost(postData);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchPosts(0, false);
    setIsEditModalOpen(false);
    setSelectedPost(null);
  };

  const handlePostCreate = async () => {
    await fetchPosts(0, false);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="local-companion-page">
      <Filterbar filters={filters} onFilterChange={handleFilterChange} />

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
        </InfiniteScrollWrapper>
      )}

      {/* ✅ + 버튼 */}
      {isLoggedIn && (
        <button className="fab" onClick={() => setIsCreateModalOpen(true)}>
          +
        </button>
      )}

      {/* ✅ Create Modal */}
      {isCreateModalOpen && (
        <CreateLocalModal
          onClose={() => setIsCreateModalOpen(false)}
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
