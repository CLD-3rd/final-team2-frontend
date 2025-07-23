"use client";

import { useEffect, useState } from "react";
import FilterBar from "@/components/Feed/FilterBar";
import FeedGrid from "@/components/Feed/FeedGrid";
import { getFeeds } from "@/api/feed"; // API 함수 import

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
    const fetchFeeds = async () => {
      try {
        const data = await getFeeds(); // API 호출
        setFeedData(data);
        onFeedCountChange?.(data.length); // 개수 전달
      } catch (error) {
        console.error("피드 데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, [onFeedCountChange]);

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
