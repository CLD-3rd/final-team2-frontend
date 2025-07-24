"use client";

import { FeedCard } from "@/features/feed";

const FeedGrid = ({ filters, feedData, onFeedClick }) => {
  const allFeedData = Array.isArray(feedData) ? feedData : [];

  // Filter logic
  const filteredData = allFeedData.filter((item) => {
    if (filters.location && item.region !== filters.location) return false;
    if (filters.author && !item.author.includes(filters.author)) return false;
    return true;
  });

  return (
    <div className="feed-grid">
      {filteredData.map((item) => (
        <FeedCard
          key={item.id}
          title={item.title}
          region={item.region}
          author={`유저 ${item.userId}`}
          date={item.createdAt}
          images={[item.image]}
          views={item.views}
          likes={item.likes}
          onClick={() => onFeedClick(item.id)}
        />
      ))}
    </div>
  );
};

export default FeedGrid;
