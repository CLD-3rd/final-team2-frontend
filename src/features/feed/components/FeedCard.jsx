"use client";

import { FallbackImage, getLocationLabel } from "@/shared";

const FeedCard = ({
  title,
  location,
  author,
  date,
  images,
  views,
  onClick,
}) => {
  return (
    <div className="feed-card" onClick={onClick}>
      <div className="card-image">
        <FallbackImage src={images} alt={title} className="feed-card-image" />

        {/* 이미지 개수 뱃지 */}
        {images && images.length > 1 && (
          <div className="image-count-badge">+{images.length - 1}</div>
        )}

        {/* ✅ 조회수 & 좋아요 오버레이 */}
        <div className="card-overlay-stats">
          <span className="views">👁 {views}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-location">{getLocationLabel(location)}</p>
        <div className="card-meta">
          <span className="card-author">{author}</span>
          <span className="card-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
