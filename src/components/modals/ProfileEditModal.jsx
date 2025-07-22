"use client";

import { useState } from "react";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

const ProfileEditModal = ({ onClose, userProfile, onSave }) => {
  useLockBodyScroll();
  const [formData, setFormData] = useState({
    username: userProfile.username,
    profileImage: null,
    currentImageUrl: userProfile.profileImage,
  });

  const [imagePreview, setImagePreview] = useState(userProfile.profileImage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 새 프로필 데이터 생성
    const updatedProfile = {
      ...userProfile,
      username: formData.username,
      profileImage: formData.profileImage
        ? imagePreview
        : formData.currentImageUrl,
    };

    onSave(updatedProfile);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="profile-edit-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
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
                  <img
                    src={imagePreview || "/placeholder.svg"}
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
                    JPG, PNG 파일만 업로드 가능합니다.
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
                value={formData.username}
                onChange={handleInputChange}
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
