"use client";

import { useEffect, useState } from "react";
import { Filterbar } from "@/shared";
import {
  FeedGrid,
  getFeeds,
  CreateFeedModal,
  FeedDetailModal,
} from "@/features/feed";

const FeedPage = ({ onFeedCountChange, isLoggedIn }) => {
  const [filters, setFilters] = useState({
    sort: "recent",
  });
  // console.log("[FeedPage] login : ", isLoggedIn);

  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState(null); // ✅ 상세 모달용 상태

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // const filteredFeedData = feedData
  //   .filter((feed) => {
  //     if (filters.title && !feed.title.includes(filters.title)) return false;
  //     if (filters.author && !feed.author.nickname.includes(filters.author))
  //       return false;
  //     if (filters.region && feed.region !== filters.region) return false;
  //     return true;
  //   })
  //   .sort((a, b) => {
  //     if (filters.sort === "recent") {
  //       return new Date(b.createdAt) - new Date(a.createdAt);
  //     } else if (filters.sort === "view") {
  //       return b.views - a.views;
  //     }
  //     return 0;
  //   });

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      console.log("[GetFeed] Sort : ", filters.sort);
      const { feeds } = await getFeeds(filters);
      setFeedData(feeds);
      onFeedCountChange?.(feeds.length);
    } catch (error) {
      console.error("피드 데이터를 불러오는 데 실패했습니다.", error);
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

      {!loading && feedData.length === 0 ? (
        <div className="empty-feed-message">
          아직 작성된 피드가 없습니다. 🥲
        </div>
      ) : (
        <FeedGrid
          filters={filters}
          feedData={feedData}
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
