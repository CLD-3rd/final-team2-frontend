"use client";

import { useState, useMemo } from "react";
import { useLockBodyScroll, getLocationLabel, ProfileImage } from "@/shared";
import { deleteTravelPost } from "@/features/travel-post";
import StarRatings from "react-star-ratings";
import toast from "react-hot-toast";
import { createDirectChatRoom } from '@/features/chat/api/chatApi';


const LocalCompanionCard = ({
  currentUser,
  postData,
  onLoginModalOpen,
  onEdit,
  onUpdateSuccess,
}) => {
  const [loading, setLoading] = useState(true);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const isLoggedIn = !!currentUser;
  const isOwner = useMemo(() => {
    return isLoggedIn && postData?.author.userId === currentUser?.userId;
  }, [isLoggedIn, postData, currentUser]);

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

        onUpdateSuccess?.(); // ✅ LocalCompanionPage 새로고침 트리거
      } catch (error) {
        toast.error(
          error.message || "모집글 삭제에 실패했습니다.\n다시 시도해주세요."
        );
      }
    }
  };

    const handleCardClick = async () => {
    const result = window.confirm("DM하시겠습니까?");
    if (result) {
      try {
        await createDirectChatRoom(postData.author.id);
        alert("DM 채팅방이 생성되었습니다!");
        // 필요하다면 채팅방으로 이동 등 추가 동작
      } catch (e) {
        alert("채팅방 생성에 실패했습니다.");
      }
    }
  };

  return (
    <div className="local-companion-card">
      <div className="card-row">
        {/* ⭐ 별점 표시 */}
        <div className="card-rating">
          <StarRatings
            rating={postData?.author?.rating || 0} // 기본값 0
            starRatedColor="#ffd700" // 별 색상 (골드)
            numberOfStars={5}
            name="rating"
            starDimension="20px" // 별 크기
            starSpacing="3px"
          />
        </div>
        {isOwner && (
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

        <div className="card-author-info" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          <ProfileImage
            src={postData.author.profileImgUrl}
            alt={postData.author.nickname}
            className="profile-image"
          />
          <div className="author-details">
            <span className="author-name">{postData.author.nickname}</span>
            <p className="author-location">
              {getLocationLabel(postData.location)}
            </p>
          </div>
        </div>
      </div>

      {/* 태그 */}
      {/* <div className="card-tags">
        {postData.author.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div> */}
    </div>
  );
};

export default LocalCompanionCard;
