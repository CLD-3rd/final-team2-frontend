"use client";

import { useState } from "react";
import {
  BadgeEditModal,
  ProfileEditModal,
  TravelTagEditModal,
} from "@/features/user";

const ProfileManagementPage = ({
  userProfile: globalUserProfile,
  onProfileUpdate,
}) => {
  const [userProfile, setUserProfile] = useState(globalUserProfile);

  const [isTravelTagModalOpen, setIsTravelTagModalOpen] = useState(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  // 상태 추가
  const [isBadgeEditModalOpen, setIsBadgeEditModalOpen] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`profile-star ${index < rating ? "filled" : ""}`}
      >
        ★
      </span>
    ));
  };

  const handleTravelTagSave = (finalTags) => {
    const updatedProfile = {
      ...userProfile,
      travelTags: finalTags,
    };
    setUserProfile(updatedProfile);
    onProfileUpdate(updatedProfile); // 전역 상태 업데이트
    console.log("Travel tag data saved:", finalTags);
  };

  const handleProfileSave = (updatedProfile) => {
    setUserProfile(updatedProfile);
    onProfileUpdate(updatedProfile); // 전역 상태 업데이트
    console.log("Profile updated:", updatedProfile);
  };

  // 뱃지 저장 핸들러 추가
  const handleBadgeSave = (selectedBadges) => {
    const updatedProfile = {
      ...userProfile,
      badges: selectedBadges,
    };
    setUserProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
    console.log("Badge selection saved:", selectedBadges);
  };

  return (
    <div className="profile-management-page">
      <div className="profile-header">
        <div className="profile-image-section">
          <div
            className="profile-image-container"
            style={{ position: "relative" }}
          >
            <img
              src={userProfile.profileImage || "/placeholder.svg"}
              // alt 삭제
              className="profile-image-large"
            />
            <button
              className="profile-edit-icon"
              onClick={() => setIsProfileEditModalOpen(true)}
              title="프로필 편집"
              style={{ zIndex: 10 }}
            >
              <img src="/images/edit-icon.png" alt="편집" />
            </button>
          </div>
        </div>

        <div className="profile-info-section">
          <h1 className="profile-username">{userProfile.username}</h1>
          <div className="profile-badges">
            {userProfile.badges.map((badge, index) => (
              <span key={index} className="profile-badge">
                {badge}
                {index < userProfile.badges.length - 1}
              </span>
            ))}
          </div>

          <div className="profile-rating">
            <span className="rating-label">평가</span>
            <div className="rating-stars">
              {renderStars(userProfile.rating)}
            </div>
            <span className="rating-count">({userProfile.reviewCount}명)</span>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-section bg-gray-300">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">✨</span>
              여행 성향 태그
            </h2>
            <button
              className="edit-button"
              onClick={() => setIsTravelTagModalOpen(true)}
            >
              편집
            </button>
          </div>
          <div className="section-content">
            <div className="travel-tags">
              {userProfile.travelTags.map((tag, index) => (
                <span key={index} className="travel-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-section bg-gray-300">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🏅</span>
              현재 보유 중인 뱃지 목록
            </h2>
            {/* badgemodal추가 */}
            <button
              className="edit-button text-white bg-yellow-600"
              onClick={() => setIsBadgeEditModalOpen(true)}
            >
              편집
            </button>
          </div>
          <div className="section-content">
            <div className="badge-list">
              {userProfile.ownedBadges.map((badge, index) => (
                <div key={index} className="badge-item">
                  <span className="badge-icon">🏅</span>
                  <span className="badge-name">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isTravelTagModalOpen && (
        <TravelTagEditModal
          onClose={() => setIsTravelTagModalOpen(false)}
          userProfile={userProfile}
          onSave={handleTravelTagSave}
        />
      )}
      {isProfileEditModalOpen && (
        <ProfileEditModal
          onClose={() => setIsProfileEditModalOpen(false)}
          userProfile={userProfile}
          onSave={handleProfileSave}
        />
      )}
      {/* 모달 추가 */}
      {isBadgeEditModalOpen && (
        <BadgeEditModal
          onClose={() => setIsBadgeEditModalOpen(false)}
          userProfile={userProfile}
          onSave={handleBadgeSave}
        />
      )}
    </div>
  );
};

export default ProfileManagementPage;
