"use client";
import StarRatings from "react-star-ratings";

const ProfileModal = ({ author, onClose }) => {
  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* 프로필 이미지 */}
        <img
          src={author.profileImgUrl}
          alt={author.nickname}
          className="profile-modal-image"
        />

        {/* 닉네임 */}
        <h2 className="profile-modal-nickname">{author.nickname}</h2>

        {/* 별점 */}
        <div className="profile-modal-rating">
          <StarRatings
            rating={author?.averageRating || 0}
            starRatedColor="#ffd700"
            numberOfStars={5}
            name="rating"
            starDimension="20px"
            starSpacing="3px"
          />
        </div>

        {/* 태그 */}
        <div className="profile-modal-tags">
          {author.travelTags?.map((tag, index) => (
            <span key={index} className="tag">
              {tag.description}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
