"use client";

import { useState } from "react";
import { useLockBodyScroll, getRegionLabel, ProfileImage } from "@/shared";
import { deleteTravelPost } from "@/features/travel-post";
import ReactStars from "react-rating-stars-component";
import toast from "react-hot-toast";

const LocalCompanionCard = ({
  postData,
  isLoggedIn,
  onLoginModalOpen,
  onEdit,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useLockBodyScroll();

  // 더 보기 메뉴 관련 핸들러 (+ 수정, 삭제)
  const handleMoreMenuClick = (e) => {
    e.stopPropagation();
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleDeletePost = async () => {
    if (window.confirm("이 모집글을 삭제하시겠습니까?")) {
      try {
        await deleteTravelPost("NOW", postData.id);
        toast.success("모집글이 삭제되었습니다.");
        setIsMoreMenuOpen(false);

        onUpdateSuccess?.(); // ✅ PlannedCompanionPage 새로고침 트리거
      } catch (error) {
        toast.error("모집글 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="local-companion-card">
      <div className="card-row">
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
        {isLoggedIn && (
          <div className="more-menu-container">
            <button className="more-menu-button" onClick={handleMoreMenuClick}>
              ⋮
            </button>
            {isMoreMenuOpen && (
              <div className="more-menu-dropdown">
                <button
                  className="more-menu-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onEdit(postData);
                  }}
                >
                  수정
                </button>
                <button
                  className="more-menu-item delete"
                  onClick={async () => {
                    setIsMoreMenuOpen(false);
                    await handleDeletePost();
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
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
          <div className="author-details">
            <span className="author-name">{postData.author.nickname}</span>
            <p className="author-location">
              {getRegionLabel(postData.location)}
            </p>
          </div>
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
