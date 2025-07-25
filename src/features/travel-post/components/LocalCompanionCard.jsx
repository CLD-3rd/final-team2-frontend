"use client";

import { ProfileImage } from "@/shared";
import ReactStars from "react-rating-stars-component";

const LocalCompanionCard = ({ postData }) => {
  return (
    <div className="local-companion-card">
      {/* ⭐ 별점 표시 */}
      <div className="card-rating">
        <ReactStars
          count={5}
          value={postData.author.rating} // ✅ 소수점 반영
          isHalf={true} // ✅ 반 별 지원
          size={20} // 별 크기
          edit={false} // 읽기 전용
          activeColor="#ffd700" // 골드 색상
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="card-main-content">
        <h3 className="card-title">{postData.title}</h3>

        <div className="card-author-info">
          <ProfileImage
            src={postData.author.profileImgUrl}
            alt={postData.author.nickname}
            className="profile-image"
          />
          <span className="author-name">{postData.author.nickname}</span>
        </div>
      </div>

      {/* 태그 */}
      <div className="card-tags">
        {postData.author.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LocalCompanionCard;
