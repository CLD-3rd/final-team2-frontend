"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/Feed/FilterBar";
import { FeedGrid, getFeeds } from "@/features/feed";

const FeedPage = ({ onFeedCountChange, isLoggedIn, onFeedDelete }) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });

  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const updateFeeds = async () => {
      try {
        const { feeds, pageInfo } = await getFeeds(); // ✅ 구조 분해
        setFeedData(feeds); // ✅ 진짜 피드 배열만 저장
        onFeedCountChange?.(feeds.length);
      } catch (error) {
        console.error("피드 데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    updateFeeds();
  }, []);

  return (
    <>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
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
    </>
  );
};

export default FeedPage;
