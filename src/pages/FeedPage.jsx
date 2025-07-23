"use client";

import { useState } from "react";
import FilterBar from "@/components/Feed/FilterBar";
import FeedGrid from "@/components/Feed/FeedGrid";

const FeedPage = ({
  onFeedCountChange,
  isLoggedIn,
  feedData,
  onFeedDelete,
}) => {
  const [filters, setFilters] = useState({
    author: "",
    title: "",
    region: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <FeedGrid
        filters={filters}
        onFeedCountChange={onFeedCountChange}
        isLoggedIn={isLoggedIn}
        feedData={feedData}
        onFeedDelete={onFeedDelete}
      />
    </>
  );
};

export default FeedPage;
