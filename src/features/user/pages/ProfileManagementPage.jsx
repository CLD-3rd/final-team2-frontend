"use client";

import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { FallbackImage } from "@/shared";
import {
  getUserProfile,
  ProfileEditModal,
  TravelTagEditModal,
  BadgeEditModal,
} from "@/features/user";
import { toast } from "react-hot-toast";

const ProfileManagementPage = ({ currentUser, onProfileUpdate }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isTravelTagModalOpen, setIsTravelTagModalOpen] = useState(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [isBadgeEditModalOpen, setIsBadgeEditModalOpen] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [currentUser?.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await getUserProfile(currentUser.id);
      setUserProfile({
        ...profileData.user, // userId, nickname, profileImgUrl, email
        reviewCount: profileData.reviewCount,
        rating: profileData.averageRating,
        displayBadges: (profileData.displayBadges || []).map((b) => b.name), // 표시할 뱃지
        ownedBadges: (profileData.ownedBadges || []).map((b) => b.name), // 보유 뱃지
        travelTags: profileData.travelTags || [],
      });
      console.log(profileData);
    } catch (error) {
      toast.error(
        error.message || "프로필 정보를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return (
          <span key={index} className="profile-star filled">
            ★
          </span>
        );
      } else if (index === fullStars && hasHalfStar) {
        return (
          <span key={index} className="profile-star half">
            ★
          </span>
        );
      } else {
        return (
          <span key={index} className="profile-star">
            ★
          </span>
        );
      }
    });
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
    onProfileUpdate(updatedProfile); // ✅ 여기서 setCurrentUser 대신
  };

  // 뱃지 저장 핸들러 추가
  const handleBadgeSave = (selectedBadges) => {
    const updatedProfile = {
      ...userProfile,
      displayBadges: selectedBadges,
    };
    setUserProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
    console.log("Badge selection saved:", selectedBadges);
  };

  // ✅ 로딩 중이면 스피너 or 메시지 표시
  if (loading) {
    return <div className="loading">프로필 불러오는 중...</div>;
  }

  if (!userProfile) {
    return <div className="error">프로필 데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="profile-management-page">
      <div className="profile-header">
        <div className="profile-image-section">
          <div
            className="profile-image-container"
            style={{ position: "relative" }}
          >
            <FallbackImage
              src={userProfile.profileImgUrl}
              // alt 삭제
              className="profile-image-large"
            />
            <button
              className="profile-edit-icon absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={() => setIsProfileEditModalOpen(true)}
              title="프로필 편집"
              style={{ zIndex: 10 }}
            >
              <Edit size={20} strokeWidth={2} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="profile-info-section">
          <h1 className="profile-username">{userProfile.nickname}</h1>
          <div className="profile-badges">
            {userProfile.displayBadges.map((badge, index) => (
              <span key={index} className="profile-badge">
                {badge}
                {index < userProfile.displayBadges.length - 1}
              </span>
            ))}
          </div>

          <div className="profile-rating">
            <span className="rating-label">평가</span>
            <div className="rating-stars">
              {renderStars(userProfile.rating || 0)}
            </div>
            <span className="rating-count">
              ({userProfile.reviewCount || 0}명)
            </span>
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
                  {tag.description}
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
          onProfileUpdate={handleProfileSave}
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
