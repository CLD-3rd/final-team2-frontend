"use client";
import { useState } from "react";
import {
  useLockBodyScroll,
  getLocationLabel,
  FallbackImage,
  ProfileImage,
} from "@/shared";
import {
  deleteTravelPost,
  requestTravelPostJoin,
} from "@/features/travel-post";
import toast from "react-hot-toast";

const PlannedCompanionCard = ({
  postData,
  isLoggedIn,
  onLoginModalOpen,
  onUpdateSuccess,
  onPostClick,
}) => {
  const handleJoinClick = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onLoginModalOpen();
      return;
    }
    if (window.confirm("이 모집글에 참여 신청하시겠습니까?")) {
      try {
        await requestTravelPostJoin("BEFORE", postData.id);
        toast.success("참여 신청이 완료되었습니다!");
      } catch (error) {
        toast.error(
          error.message ||
            "사전 동행 모집 참여 신청에 실패했습니다.\n다시 시도해주세요."
        );
      } finally {
        onUpdateSuccess?.();
      }
    }
  };

  return (
    <div className="companion-card" onClick={() => onPostClick(postData.id)}>
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
            <div className="post-row">
              <h3 className="post-title">{postData.title}</h3>
            </div>
            <div className="post-row">
              <p className="post-location">
                {getLocationLabel(postData.location)}
              </p>
              <p className="post-date">{postData.createdAt}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-image-container">
        <FallbackImage
          src={postData.imageUrl}
          alt={postData.title}
          className="companion-card-image"
        />
        {/* ✅ 조회수 오버레이 */}
        <div className="card-overlay-stats">
          <span className="views">👁 {postData.viewCount}</span>
        </div>
      </div>

      <div className="card-content">
        <div className="date-range">
          {postData.startTime} ~ {postData.endTime}
        </div>
        <div className="description">{postData.content}</div>
        <div className="card-actions">
          <button className="participants-count-btn">
            {postData.participants}/{postData.maxParticipants}
          </button>
          <button className="join-btn" onClick={(e) => handleJoinClick(e)}>
            같이 갈래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannedCompanionCard;
