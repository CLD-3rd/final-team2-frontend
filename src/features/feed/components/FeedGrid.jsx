"use client";

import { FeedCard } from "@/features/feed";

const FeedGrid = ({ feeds, onFeedClick }) => {
  return (
    <div className="feed-grid">
      {feeds.map((feedData) => (
        <FeedCard
          key={feedData.id}
          feedData={feedData}
          onClick={() => onFeedClick(feedData.id)}
        />
      ))}
    </div>
  );
};

export default FeedGrid;