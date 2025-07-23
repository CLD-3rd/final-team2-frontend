"use client";

import { useState } from "react";
import React from "react";
import FeedCard from "@/components/Feed/FeedCard";
import FeedDetailModal from "@/components/modals/FeedDetailModal";

const FeedGrid = ({
  filters,
  onFeedCountChange,
  isLoggedIn,
  feedData,
  onFeedDelete,
}) => {
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // initialFeedData 제거하고 feedData 사용
  // const initialFeedData = [...] 이 부분 삭제

  // newPosts와 합치는 로직 제거하고 feedData 직접 사용
  // const allFeedData = [...newPosts, ...initialFeedData] 이 부분을
  const allFeedData = Array.isArray(feedData) ? feedData : [];

  // Filter logic
  const filteredData = allFeedData.filter((item) => {
    if (filters.location && item.location !== filters.location) return false;
    if (filters.author && !item.author.includes(filters.author)) return false;
    return true;
  });

  // 피드 갯수를 상위 컴포넌트로 전달
  React.useEffect(() => {
    if (onFeedCountChange) {
      onFeedCountChange(allFeedData.length);
    }
  }, [allFeedData.length, onFeedCountChange]);

  const handleFeedClick = (feedItem) => {
    setSelectedFeed(feedItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeed(null);
  };

  return (
    <>
      <div className="feed-grid">
        {filteredData.map((item) => (
          <FeedCard
            key={item.id}
            title={item.title}
            region={item.location}
            author={`유저 ${item.userId}`}
            date={item.createdAt}
            images={[item.image]} // FeedCard expects images: [], even if one
            onClick={() => handleFeedClick(item)}
          />
        ))}
      </div>

      {isModalOpen && selectedFeed && (
        <FeedDetailModal
          onClose={handleCloseModal}
          feedData={selectedFeed}
          isLoggedIn={isLoggedIn}
          onFeedDelete={onFeedDelete}
        />
      )}
    </>
  );
};

export default FeedGrid;
