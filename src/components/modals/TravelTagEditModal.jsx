"use client";

import { useState } from "react";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

const TravelTagEditModal = ({ onClose, userProfile, onSave }) => {
  useLockBodyScroll();
  // 모든 성향 옵션들
  const personalityOptions = [
    { value: "새로운 사람과도 금방 친해져요", icon: "💛" },
    { value: "조용한 분위기를 좋아해요", icon: "🟡" },
    { value: "결정을 남이 해주는 게 편해요", icon: "💡" },
    { value: "상황에 맞춰 잘 적응해요", icon: "🔵" },
    { value: "여행 중에도 정보를 꼼꼼히 찾는 편이에요", icon: "💡" },
    { value: "다른 사람 의견을 잘 들어주는 편이에요", icon: "💡" },
    { value: "앞장서서 리드하는 편이에요", icon: "⚫" },
    { value: "분위기를 띄우는 걸 좋아해요", icon: "🟡" },
  ];

  // 모든 여행지 옵션들
  const destinationOptions = [
    { value: "도시/핫플 위주", icon: "🏢" },
    { value: "자연/힐링 위주", icon: "🌿" },
    { value: "바다/해변", icon: "🏖️" },
    { value: "산/등산", icon: "⛰️" },
    { value: "어디든 좋아요", icon: "🌍" },
  ];

  const activityOptions = [
    { key: "nature", label: "🏔️ 자연 경관 감상" },
    { key: "cafe", label: "☕ 카페/휴식" },
    { key: "food", label: "🍽️ 맛집 탐방" },
    { key: "photo", label: "📸 사진 촬영" },
    { key: "shopping", label: "🛍️ 쇼핑" },
    { key: "activity", label: "⚡ 액티비티(서핑 등산 등)" },
  ];

  const travelStyleOptions = [
    { value: "relaxed", label: "🐌 느긋하게 여유롭게" },
    { value: "packed", label: "📋 빽빽하고 알차게" },
    { value: "flexible", label: "상황에 따라 유동적으로" },
  ];

  const drinkingOptions = [
    { value: "love", label: "🍺 술 좋아해요" },
    { value: "moderate", label: "🥂 분위기상 한 두 잔 정도" },
    { value: "none", label: "🚫 술은 즐기지 않아요" },
  ];

  // 기존 태그들을 파싱해서 초기 상태 설정
  const parseExistingTags = (existingTags) => {
    const selectedPersonalityTags = [];
    const selectedDestinationTags = [];
    const activities = {
      nature: false,
      cafe: false,
      food: false,
      photo: false,
      shopping: false,
      activity: false,
    };
    let travelStyle = ""; // 기본값 제거
    let drinkingStyle = ""; // 기본값 제거

    existingTags.forEach((tag) => {
      // 성향 태그 확인
      const personalityMatch = personalityOptions.find(
        (opt) => opt.value === tag
      );
      if (personalityMatch) {
        selectedPersonalityTags.push(tag);
        return;
      }

      // 여행지 태그 확인
      const destinationMatch = destinationOptions.find(
        (opt) => opt.value === tag
      );
      if (destinationMatch) {
        selectedDestinationTags.push(tag);
        return;
      }

      // 활동 태그 확인
      const activityMatch = activityOptions.find((opt) => opt.label === tag);
      if (activityMatch) {
        activities[activityMatch.key] = true;
        return;
      }

      // 여행 스타일 확인
      const styleMatch = travelStyleOptions.find((opt) => opt.label === tag);
      if (styleMatch) {
        travelStyle = styleMatch.value;
        return;
      }

      // 음주 성향 확인
      const drinkingMatch = drinkingOptions.find((opt) => opt.label === tag);
      if (drinkingMatch) {
        drinkingStyle = drinkingMatch.value;
        return;
      }
    });

    return {
      selectedPersonalityTags,
      selectedDestinationTags,
      activities,
      travelStyle,
      drinkingStyle,
    };
  };

  const [formData, setFormData] = useState(() => {
    // 기존 태그들을 파싱해서 초기 상태 설정
    const parsed = parseExistingTags(userProfile.travelTags || []);
    return parsed;
  });

  const handleActivityChange = (activityKey) => {
    setFormData((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activityKey]: !prev.activities[activityKey],
      },
    }));
  };

  const removePersonalityTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      selectedPersonalityTags: prev.selectedPersonalityTags.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
  };

  const addPersonalityTag = (tagToAdd) => {
    if (!formData.selectedPersonalityTags.includes(tagToAdd)) {
      setFormData((prev) => ({
        ...prev,
        selectedPersonalityTags: [...prev.selectedPersonalityTags, tagToAdd],
      }));
    }
  };

  const removeDestinationTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      selectedDestinationTags: prev.selectedDestinationTags.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
  };

  const addDestinationTag = (tagToAdd) => {
    if (!formData.selectedDestinationTags.includes(tagToAdd)) {
      setFormData((prev) => ({
        ...prev,
        selectedDestinationTags: [...prev.selectedDestinationTags, tagToAdd],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 실제로 선택된 태그들만 수집
    const finalTags = [];

    // 성향 태그들 추가
    finalTags.push(...formData.selectedPersonalityTags);

    // 여행지 태그들 추가
    finalTags.push(...formData.selectedDestinationTags);

    // 선택된 활동들만 추가
    Object.keys(formData.activities).forEach((key) => {
      if (formData.activities[key]) {
        const activity = activityOptions.find((opt) => opt.key === key);
        if (activity) {
          finalTags.push(activity.label);
        }
      }
    });

    // 여행 스타일 추가 (선택된 경우에만)
    if (formData.travelStyle) {
      const selectedStyle = travelStyleOptions.find(
        (opt) => opt.value === formData.travelStyle
      );
      if (selectedStyle) {
        finalTags.push(selectedStyle.label);
      }
    }

    // 음주 성향 추가 (선택된 경우에만)
    if (formData.drinkingStyle) {
      const selectedDrinking = drinkingOptions.find(
        (opt) => opt.value === formData.drinkingStyle
      );
      if (selectedDrinking) {
        finalTags.push(selectedDrinking.label);
      }
    }

    onSave(finalTags);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="travel-tag-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="travel-tag-modal-body">
          <h2 className="modal-title">
            <u>{userProfile.username}</u> 여행자님은 어떤 여행을 하고 싶나요?
          </h2>

          <form onSubmit={handleSubmit}>
            {/* 성향 태그 섹션 */}
            <div className="form-section">
              <h3 className="section-title">당신의 여행 중 성향은 어떤가요?</h3>

              <div className="personality-tags-container">
                {formData.selectedPersonalityTags.map((tag) => {
                  const option = personalityOptions.find(
                    (opt) => opt.value === tag
                  );
                  return (
                    <button
                      key={tag}
                      type="button"
                      className="personality-tag-removable"
                      onClick={() => removePersonalityTag(tag)}
                    >
                      <span className="tag-icon">{option?.icon}</span>
                      {tag} ×
                    </button>
                  );
                })}
              </div>

              <div className="dropdown-section">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addPersonalityTag(e.target.value);
                      e.target.value = ""; // 선택 후 리셋
                    }
                  }}
                  className="personality-dropdown"
                >
                  <option value="">성향을 선택하세요</option>
                  {personalityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 활동 선택 */}
            <div className="form-section">
              <h3 className="section-title">어떤 활동을 좋아하나요?</h3>
              <div className="activity-checkboxes">
                {activityOptions.map((activity) => (
                  <label key={activity.key} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.activities[activity.key]}
                      onChange={() => handleActivityChange(activity.key)}
                    />
                    <span className="checkbox-label">{activity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 여행 스타일 */}
            <div className="form-section">
              <h3 className="section-title">당신의 여행 입장 스타일은요?</h3>
              <div className="radio-group">
                {travelStyleOptions.map((style) => (
                  <label key={style.value} className="radio-item">
                    <input
                      type="radio"
                      name="travelStyle"
                      value={style.value}
                      checked={formData.travelStyle === style.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          travelStyle: e.target.value,
                        }))
                      }
                    />
                    <span className="radio-label">{style.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 음주 성향 */}
            <div className="form-section">
              <h3 className="section-title">
                여행 중 숙지사항에 대해 어떻게 생각하세요?
              </h3>
              <div className="radio-group">
                {drinkingOptions.map((option) => (
                  <label key={option.value} className="radio-item">
                    <input
                      type="radio"
                      name="drinkingStyle"
                      value={option.value}
                      checked={formData.drinkingStyle === option.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          drinkingStyle: e.target.value,
                        }))
                      }
                    />
                    <span className="radio-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 여행지 선호도 */}
            <div className="form-section">
              <h3 className="section-title">어떤 여행지를 더 선호하나요?</h3>

              <div className="destination-tags-container">
                {formData.selectedDestinationTags.map((tag) => {
                  const option = destinationOptions.find(
                    (opt) => opt.value === tag
                  );
                  return (
                    <button
                      key={tag}
                      type="button"
                      className="destination-tag-removable"
                      onClick={() => removeDestinationTag(tag)}
                    >
                      <span className="tag-icon">{option?.icon}</span>
                      {tag} ×
                    </button>
                  );
                })}
              </div>

              <div className="dropdown-section">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addDestinationTag(e.target.value);
                      e.target.value = ""; // 선택 후 리셋
                    }
                  }}
                  className="destination-dropdown"
                >
                  <option value="">여행지를 선택하세요</option>
                  {destinationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-submit">
                완료하기!
              </button>
              <button type="button" onClick={onClose} className="btn-cancel">
                다음에 할래요..
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelTagEditModal;
