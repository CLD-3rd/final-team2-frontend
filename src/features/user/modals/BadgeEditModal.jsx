"use client";

import { useState } from "react";

const BadgeEditModal = ({ onClose, userProfile, onSave }) => {
  // 사용자가 보유한 모든 뱃지
  const allOwnedBadges = userProfile.ownedBadges || [];

  // 현재 프로필에 표시되는 뱃지들
  const [selectedBadges, setSelectedBadges] = useState(
    userProfile.badges || []
  );

  const handleBadgeToggle = (badge) => {
    if (selectedBadges.includes(badge)) {
      // 이미 선택된 뱃지면 제거
      setSelectedBadges((prev) => prev.filter((b) => b !== badge));
    } else {
      // 선택되지 않은 뱃지면 추가
      setSelectedBadges((prev) => [...prev, badge]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedBadges);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="badge-edit-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="badge-edit-modal-body">
          <h2 className="modal-title">프로필에 표시할 뱃지 선택</h2>
          <p className="modal-subtitle">
            보유 중인 뱃지 중에서 프로필에 표시할 뱃지를 선택하세요.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="badge-selection-grid">
              {allOwnedBadges.map((badge, index) => (
                <div
                  key={index}
                  className={`badge-selection-item ${
                    selectedBadges.includes(badge) ? "selected" : ""
                  }`}
                  onClick={() => handleBadgeToggle(badge)}
                >
                  <div className="badge-icon">🏅</div>
                  <div className="badge-info">
                    <span className="badge-name">{badge}</span>
                    {selectedBadges.includes(badge) && (
                      <span className="selected-indicator">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="selected-badges-preview">
              <h3>선택된 뱃지 ({selectedBadges.length}개)</h3>
              <div className="selected-badges-list">
                {selectedBadges.map((badge, index) => (
                  <span key={index} className="selected-badge-tag">
                    {badge}
                    <button
                      type="button"
                      className="remove-badge-btn"
                      onClick={() => handleBadgeToggle(badge)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
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

export default BadgeEditModal;
