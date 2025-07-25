"use client";
import { useState, useEffect } from "react";
import {
  useLockBodyScroll,
  getRegionLabel,
  FallbackImage,
  ProfileImage,
} from "@/shared";
import { deletePlannedCompanion } from "@/features/planned-companion";
import toast from "react-hot-toast";

const PlannedCompanionCard = ({
  postData,
  isLoggedIn,
  onLoginModalOpen,
  onEdit,
}) => {
  useLockBodyScroll();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleJoinClick = () => {
    if (!isLoggedIn) {
      onLoginModalOpen();
      return;
    }

    // 로그인된 유저의 경우 - 실제 신청 로직은 나중에 구현
    console.log("같이 갈래요 신청!");
  };

  // 더 보기 메뉴 관련 핸들러 (+ 수정, 삭제)
  const handleMoreMenuClick = (e) => {
    e.stopPropagation();
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleDeletePost = async () => {
    if (window.confirm("이 모집글을 삭제하시겠습니까?")) {
      try {
        await deletePlannedCompanion(postData.id);
        toast.success("모집글이 삭제되었습니다.");
        setIsMoreMenuOpen(false);

        onUpdateSuccess?.(); // ✅ PlannedCompanionPage 새로고침 트리거
      } catch (error) {
        toast.error("모집글 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="companion-card">
      <div className="card-header">
        <div className="author-info">
          <div className="author-avatar">
            <ProfileImage
              src={postData.author.profileImgUrl}
              alt={postData.author.nickname}
              className="avatar-image"
            />
          </div>
          <div className="post-info">
            <h3 className="post-title">{postData.title}</h3>
            <div className="post-row">
              <p className="post-location">
                {getRegionLabel(postData.location)}
              </p>
              <p className="post-date">{postData.createdAt}</p>
            </div>
          </div>
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
                  onClick={() => onEdit(postData)} // ✅ postData 전달
                >
                  수정
                </button>
                <button
                  className="more-menu-item delete"
                  onClick={handleDeletePost}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
        {/* <button className="more-options">⋮</button> */}
      </div>

      <div className="card-image-container">
        <FallbackImage
          src={postData.imageUrl}
          alt={postData.title}
          className="companion-card-image"
        />
      </div>

      <div className="card-content">
        <div className="date-range">
          {postData.startTime} ~ {postData.endTime}
        </div>
        <div className="description">
          {postData.content.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>

        <div className="card-actions">
          <button className="participants-count-btn">
            {postData.participants}/{postData.maxParticipants}
          </button>
          <button className="join-btn" onClick={handleJoinClick}>
            같이 갈래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannedCompanionCard;
