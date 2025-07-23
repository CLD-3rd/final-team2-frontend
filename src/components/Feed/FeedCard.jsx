"use client";

import { useState } from "react";
import FallbackImage from "@/components/common/FallbackImage";
import { getRegionLabel } from "@/utils/regionMapper";

const FeedCard = ({
  title,
  region,
  author,
  date,
  images,
  views,
  likes,
  onClick,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const displayImage =
    images && images.length > 0 ? images[0] : "/images/image-not-found.png";

  const handleImageError = (e) => {
    e.currentTarget.src = "/images/image-not-found.png";
  };

  const handleLikeClick = (e) => {
    e.stopPropagation(); // 모달 열림 방지
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(id, !isLiked); // API 호출
  };

  return (
    <div className="feed-card" onClick={onClick}>
      <div className="card-image">
        <FallbackImage
          src={displayImage}
          alt={title}
          onError={handleImageError}
          className="feed-card-image"
        />

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
        <p className="card-region">{getRegionLabel(region)}</p>
        <div className="card-meta">
          <span className="card-author">{author}</span>
          <span className="card-date">{date}</span>
        </div>
        {/* ✅ 좋아요 버튼 */}
      </div>
    </div>
  );
};

export default FeedCard;
