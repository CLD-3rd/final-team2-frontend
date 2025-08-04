"use client";

import { useState } from "react";
import { useLockBodyScroll } from "@/shared";
import { TRAVEL_TAG_GROUPS } from "@/features/user/constants/travelTags";

const TravelTagEditModal = ({ onClose, userProfile, onSave }) => {
  useLockBodyScroll();

  const existingTags = userProfile.travelTags || [];

  // ✅ 초기 데이터 파싱
  const parseExistingTags = (tags) => {
    const activities = Object.fromEntries(
      TRAVEL_TAG_GROUPS.activity.map((opt) => [opt.key, tags.includes(opt.key)])
    );

    return {
      selectedPersonalityTags: tags.filter((tag) =>
        TRAVEL_TAG_GROUPS.personality.some((opt) => opt.key === tag)
      ),
      selectedDestinationTags: tags.filter((tag) =>
        TRAVEL_TAG_GROUPS.destination.some((opt) => opt.key === tag)
      ),
      activities,
      travelStyle:
        tags.find((tag) =>
          TRAVEL_TAG_GROUPS.style.some((opt) => opt.key === tag)
        ) || "",
      drinkingStyle:
        tags.find((tag) =>
          TRAVEL_TAG_GROUPS.drinking.some((opt) => opt.key === tag)
        ) || "",
      smokingStyle:
        tags.find((tag) =>
          TRAVEL_TAG_GROUPS.smoking.some((opt) => opt.key === tag)
        ) || "",
    };
  };

  const [formData, setFormData] = useState(parseExistingTags(existingTags));

  // ✅ 공통 상태 업데이트 헬퍼
  const updateArrayField = (field, value, action) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        action === "add"
          ? [...prev[field], value]
          : prev[field].filter((t) => t !== value),
    }));
  };

  const handleActivityChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [key]: !prev.activities[key],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalTags = [
      ...formData.selectedPersonalityTags,
      ...formData.selectedDestinationTags,
      ...Object.keys(formData.activities).filter((k) => formData.activities[k]),
    ];
    if (formData.travelStyle) finalTags.push(formData.travelStyle);
    if (formData.drinkingStyle) finalTags.push(formData.drinkingStyle);
    if (formData.smokingStyle) finalTags.push(formData.smokingStyle);

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
            <u>{userProfile.nickname}</u> 여행자님은 어떤 여행을 하고 싶나요?
          </h2>

          <form onSubmit={handleSubmit}>
            {/* ✅ 성향 */}
            <TagSelector
              title="당신의 여행 중 성향은 어떤가요?"
              selectedTags={formData.selectedPersonalityTags}
              options={TRAVEL_TAG_GROUPS.personality}
              onAdd={(tag) =>
                updateArrayField("selectedPersonalityTags", tag, "add")
              }
              onRemove={(tag) =>
                updateArrayField("selectedPersonalityTags", tag, "remove")
              }
            />

            {/* ✅ 활동 */}
            <div className="form-section">
              <h3 className="section-title">어떤 활동을 즐기시나요?</h3>
              <CheckboxGroup
                options={TRAVEL_TAG_GROUPS.activity}
                selected={formData.activities}
                onChange={handleActivityChange}
              />
            </div>

            {/* ✅ 여행 스타일 */}
            <div className="form-section">
              <h3 className="section-title">여행 스타일은 어떤가요?</h3>
              <RadioGroup
                name="travelStyle"
                options={TRAVEL_TAG_GROUPS.style}
                selected={formData.travelStyle}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, travelStyle: value }))
                }
              />
            </div>

            {/* ✅ 음주 */}
            <div className="form-section">
              <h3 className="section-title">음주에 대한 선호는?</h3>
              <RadioGroup
                name="drinkingStyle"
                options={TRAVEL_TAG_GROUPS.drinking}
                selected={formData.drinkingStyle}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, drinkingStyle: value }))
                }
              />
            </div>

            {/* ✅ 흡연 */}
            <div className="form-section">
              <h3 className="section-title">흡연 여부는?</h3>
              <RadioGroup
                name="smokingStyle"
                options={TRAVEL_TAG_GROUPS.smoking}
                selected={formData.smokingStyle}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, smokingStyle: value }))
                }
              />
            </div>

            {/* ✅ 여행지 */}
            <TagSelector
              title="여행지 취향은 어떤가요?"
              selectedTags={formData.selectedDestinationTags}
              options={TRAVEL_TAG_GROUPS.destination}
              onAdd={(tag) =>
                updateArrayField("selectedDestinationTags", tag, "add")
              }
              onRemove={(tag) =>
                updateArrayField("selectedDestinationTags", tag, "remove")
              }
            />

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

// ✅ 공통 라디오 그룹 컴포넌트
const RadioGroup = ({ name, options, selected, onChange }) => (
  <div className="radio-group">
    {options.map((option) => (
      <label key={option.key} className="radio-item">
        <input
          type="radio"
          name={name}
          value={option.key}
          checked={selected === option.key}
          onChange={() => onChange(option.key)}
        />
        <span className="radio-label">{option.label}</span>
      </label>
    ))}
  </div>
);

// ✅ 공통 체크박스 그룹 (활동)
const CheckboxGroup = ({ options, selected, onChange }) => (
  <div className="activity-checkboxes">
    {options.map((option) => (
      <label key={option.key} className="checkbox-item">
        <input
          type="checkbox"
          checked={selected[option.key]}
          onChange={() => onChange(option.key)}
        />
        <span className="checkbox-label">{option.label}</span>
      </label>
    ))}
  </div>
);

// ✅ 공통 태그 선택 UI
const TagSelector = ({ title, selectedTags, options, onAdd, onRemove }) => {
  const availableOptions = options.filter(
    (option) => !selectedTags.includes(option.key)
  );

  return (
    <div className="form-section">
      <h3 className="section-title">{title}</h3>

      <div className="personality-tags-container">
        {selectedTags.map((tag) => {
          const option = options.find((opt) => opt.key === tag);
          return (
            <button
              key={tag}
              type="button"
              className="personality-tag-removable"
              onClick={() => onRemove(tag)}
            >
              <span className="tag-icon">{option?.icon}</span>
              {option?.label} ×
            </button>
          );
        })}
      </div>

      <div className="dropdown-section">
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              onAdd(e.target.value);
              e.target.value = "";
            }
          }}
          className="personality-dropdown"
        >
          <option value="">선택하세요</option>
          {availableOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
