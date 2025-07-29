"use client";

import { FallbackImage, getLocationLabel } from "@/shared";

const FeedCard = ({ feedData, onClick }) => {
  return (
    <div className="feed-card" onClick={onClick}>
      <div className="card-image">
        <FallbackImage
          src={feedData.imageUrls[0]}
          alt={feedData.title}
          className="feed-card-image"
        />

        {/* 이미지 개수 뱃지 */}
        {feedData.imageUrls && feedData.imageUrls.length > 1 && (
          <div className="image-count-badge">
            +{feedData.imageUrls.length - 1}
          </div>
        )}

        {/* ✅ 조회수 오버레이 */}
        <div className="card-overlay-stats">
          <span className="views">👁 {feedData.viewCount}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{feedData.title}</h3>
        <p className="card-location">{getLocationLabel(feedData.location)}</p>
        <div className="card-meta">
          <span className="card-author">{feedData.author.nickname}</span>
          <span className="card-date">{feedData.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
