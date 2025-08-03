"use client";

import { useState, useEffect } from "react";
import { useLockBodyScroll, ProfileImage } from "@/shared";
import { updateUserProfile } from "@/features/user";
import { toast } from "react-hot-toast";

const ProfileEditModal = ({ onClose, userProfile, onProfileUpdate }) => {
  useLockBodyScroll();

  const [nickname, setNickname] = useState(userProfile.nickname || "");
  const [imagePreview, setImagePreview] = useState(userProfile.profileImgUrl);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // ✅ FileReader 대신 사용
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      formPayload.append("nickname", nickname);
      if (selectedImage) {
        formPayload.append("profileImage", selectedImage);
      }

      const updatedUserProfile = await updateUserProfile(formPayload);

      onProfileUpdate({
        ...userProfile,
        nickname: updatedUserProfile.nickname,
        profileImgUrl: updatedUserProfile.profileImgUrl,
      });

      toast.success("프로필이 수정되었습니다!");
      onClose();
    } catch (error) {
      toast.error(error.message || "사용자 프로필 수정에 실패했습니다.");
    }
  };

  // ✅ 메모리 누수 방지 - 컴포넌트 unmount 시 revoke
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="profile-edit-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="닫기" onClick={onClose}>
          ×
        </button>

        <div className="profile-edit-modal-body">
          <h2 className="modal-title">프로필 편집</h2>

          <form onSubmit={handleSubmit}>
            {/* 프로필 이미지 섹션 */}
            <div className="form-section">
              <h3 className="section-title">프로필 사진</h3>
              <div className="profile-image-edit-container">
                <div className="profile-image-preview">
                  <ProfileImage
                    src={imagePreview}
                    alt="프로필 미리보기"
                    className="preview-image"
                  />
                </div>
                <div className="image-upload-section">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="profileImage" className="file-upload-btn">
                    사진 변경
                  </label>
                  <p className="file-help-text">
                    <br></br>JPG, PNG 파일만 업로드 가능합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 사용자명 섹션 */}
            <div className="form-section">
              <h3 className="section-title">사용자명</h3>
              <input
                type="text"
                name="username"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="username-input"
                placeholder="사용자명을 입력하세요"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                취소
              </button>
              <button type="submit" className="btn-submit">
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
