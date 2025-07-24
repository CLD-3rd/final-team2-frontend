"use client";

import { useState, useEffect } from "react";
import { FeedCard, FeedDetailModal } from "@/features/feed";

const FeedGrid = ({
  filters,
  onFeedCountChange,
  isLoggedIn,
  feedData,
  onFeedDelete,
}) => {
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allFeedData = Array.isArray(feedData) ? feedData : [];

  // Filter logic
  const filteredData = allFeedData.filter((item) => {
    if (filters.location && item.region !== filters.location) return false;
    if (filters.author && !item.author.includes(filters.author)) return false;
    return true;
  });

  // 피드 갯수를 상위 컴포넌트로 전달
  useEffect(() => {
    onFeedCountChange?.(allFeedData.length);
  }, [allFeedData.length, onFeedCountChange]);

  const handleFeedClick = (feedId) => {
    setSelectedFeedId(feedId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedId(null);
  };

  return (
    <>
      <div className="feed-grid">
        {filteredData.map((item) => (
          <FeedCard
            key={item.id}
            title={item.title}
            region={item.region}
            author={`유저 ${item.userId}`}
            date={item.createdAt}
            images={[item.image]} // FeedCard expects images: []
            views={item.views}
            likes={item.likes}
            onClick={() => handleFeedClick(item.id)} // ✅ feedId만 넘김
          />
        ))}
      </div>

      {isModalOpen && selectedFeedId && (
        <FeedDetailModal
          onClose={handleCloseModal}
          feedId={selectedFeedId} // ✅ feedId 전달
          isLoggedIn={isLoggedIn}
          onFeedDelete={onFeedDelete}
        />
      )}
    </>
  );
};

export default FeedGrid;
