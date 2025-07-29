"use client";

import { useEffect, useState } from "react";
import {
  Filterbar,
  InfiniteScrollWrapper,
  LoadingIndicator,
  EndMessage,
} from "@/shared";
import {
  FeedGrid,
  getFeeds,
  CreateFeedModal,
  FeedDetailModal,
} from "@/features/feed";
import toast from "react-hot-toast";

const FeedPage = ({ onFeedCountChange, isLoggedIn }) => {
  const [feeds, setFeeds] = useState([]);
  const [filters, setFilters] = useState({
    sort: "recent",
  });

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedFeedId, setSelectedFeedId] = useState(null); // ✅ 상세 모달용 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  // ✅ 필터 변경 시 초기화
  useEffect(() => {
    setPage(0);
    setFeeds([]);
    fetchFeeds(0, false);
  }, [filters]);

  const fetchFeeds = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const { feeds: newFeeds, pageInfo } = await getFeeds(filters, pageNum);
      setFeeds((prev) => (append ? [...prev, ...newFeeds] : newFeeds));
      setHasMore(pageNum + 1 < pageInfo.totalPages);
      onFeedCountChange?.(pageInfo.totalElements);
    } catch (error) {
      toast.error("피드 데이터를 불러오는 데 실패했습니다.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ 더 불러오기 */
  const loadMoreFeeds = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeeds(nextPage, true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // ✅ 등록/수정 완료 시 새로고침
  const handleSuccess = () => {
    setPage(0);
    fetchFeeds(0, false);
    setIsCreateModalOpen(false);
    setSelectedFeedId(null);
  };

  const handleFeedClick = (feedId) => setSelectedFeedId(feedId);
  const closeDetailModal = () => setSelectedFeedId(null);

  return (
    <>
      <Filterbar filters={filters} onFilterChange={handleFilterChange} />

      {loading && feeds.length === 0 ? (
        <LoadingIndicator text="피드를 불러오는 중..." />
      ) : (
        <InfiniteScrollWrapper
          dataLength={feeds.length}
          next={loadMoreFeeds}
          hasMore={hasMore}
          loaderText={<LoadingIndicator text="피드를 불러오는 중..." />}
          endText={<EndMessage text="모든 피드를 확인했어요!" />}
        >
          <FeedGrid
            filters={filters}
            feeds={feeds}
            loading={loading}
            onFeedClick={handleFeedClick}
          />{" "}
        </InfiniteScrollWrapper>
      )}

      {/* ✅ + 버튼 */}
      {isLoggedIn && (
        <button className="fab" onClick={openCreateModal}>
          +
        </button>
      )}

      {/* ✅ 피드 작성 모달 */}
      {isCreateModalOpen && (
        <CreateFeedModal onClose={closeCreateModal} onSuccess={handleSuccess} />
      )}

      {/* ✅ 피드 상세 모달 */}
      {selectedFeedId && (
        <FeedDetailModal
          feedId={selectedFeedId}
          onClose={closeDetailModal}
          isLoggedIn={isLoggedIn}
          onUpdateSuccess={handleSuccess} // ✅ 수정 시 새로고침
        />
      )}
    </>
  );
};

export default FeedPage;
