"use client";

import { useEffect, useState } from "react";
import { Filterbar } from "@/shared";
import {
  FeedGrid,
  getFeeds,
  CreateFeedModal,
  FeedDetailModal,
} from "@/features/feed";
import toast from "react-hot-toast";

const FeedPage = ({ onFeedCountChange, isLoggedIn }) => {
  const [filters, setFilters] = useState({
    sort: "recent",
  });
  // console.log("[FeedPage] login : ", isLoggedIn);

  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState(null); // ✅ 상세 모달용 상태

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const { feeds } = await getFeeds(filters);
      console.log(feeds);
      setFeeds(feeds);
      onFeedCountChange?.(feeds.length);
    } catch (error) {
      toast.error("피드 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [filters]);

  // ✅ 등록/수정 완료 시 새로고침
  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
    setIsCreateModalOpen(false);
    setSelectedFeedId(null);
  };

  const handleFeedClick = (feedId) => {
    setSelectedFeedId(feedId);
  };

  const closeDetailModal = () => {
    setSelectedFeedId(null);
  };

  return (
    <>
      <Filterbar filters={filters} onFilterChange={handleFilterChange} />

      {!loading && feeds.length === 0 ? (
        <div className="empty-feed-message">
          아직 작성된 피드가 없습니다. 🥲
        </div>
      ) : (
        <FeedGrid
          filters={filters}
          feeds={feeds}
          loading={loading}
          onFeedClick={handleFeedClick}
        />
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
