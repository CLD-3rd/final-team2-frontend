"use client";

import { useEffect, useState } from "react";
import { Filterbar } from "@/shared";
import { FeedGrid, getFeeds, CreateFeedModal } from "@/features/feed";

const FeedPage = ({ onFeedCountChange, isLoggedIn, onFeedDelete }) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });

  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const fetchFeeds = async () => {
    try {
      const { feeds } = await getFeeds();
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
  }, []);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handlePostCreate = async () => {
    await fetchFeeds(); // ✅ 새 피드 작성 후 다시 목록 불러오기
    closeCreateModal();
  };

  return (
    <div className="feed-page">
      <Filterbar filters={filters} onFilterChange={handleFilterChange} />

      {!loading && feedData.length === 0 ? (
        <div className="empty-feed-message">
          아직 작성된 피드가 없습니다. 🥲
        </div>
      ) : (
        <FeedGrid
          filters={filters}
          onFeedCountChange={onFeedCountChange}
          isLoggedIn={isLoggedIn}
          feedData={feedData}
          onFeedDelete={onFeedDelete}
          loading={loading}
        />
      )}

      {/* ✅ + 버튼 */}
      {isLoggedIn && (
        <button className="fab" onClick={openCreateModal}>
          +
        </button>
      )}
      {/* ✅ CreateFeedModal (FeedPage에서 관리) */}
      {isCreateModalOpen && (
        <CreateFeedModal
          onClose={closeCreateModal}
          onPostCreate={handlePostCreate}
        />
      )}
    </div>
  );
};

export default FeedPage;
