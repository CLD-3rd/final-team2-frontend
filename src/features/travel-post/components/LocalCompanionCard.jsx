"use client";

import { ProfileImage } from "@/shared";

const LocalCompanionCard = ({ postData }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="local-companion-card">
      <div className="card-rating">{renderStars(postData.author.rating)}</div>

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

      <div className="card-tags">
        {postData.author.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag} ×
          </span>
        ))}
      </div>
    </div>
  );
};

export default LocalCompanionCard;
