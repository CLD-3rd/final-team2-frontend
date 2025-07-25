"use client";

import { useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { regionOptions } from "@/shared";

const PostForm = ({
  formData,
  setFormData,
  dateRange,
  setDateRange,
  onSubmit,
  onClose,
  titleLabel,
  contentLabel,
  includeBadge,
  includeDateRange,
  includeContent,
  includeImage,
}) => {
  useEffect(() => {
    if (includeDateRange) {
      const formatted = `${format(dateRange[0].startDate, "yy.MM.dd")}~${format(
        dateRange[0].endDate,
        "yy.MM.dd"
      )}`;
      setFormData((prev) => ({
        ...prev,
        dateRange: formatted,
        startTime: dateRange[0].startDate.toISOString().split("T")[0],
        endTime: dateRange[0].endDate.toISOString().split("T")[0],
      }));
    }
  }, [dateRange, includeDateRange, setFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="modal-form">
      {/* 제목 */}
      <div className="form-group">
        <label htmlFor="title">{titleLabel}</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          required
        />
      </div>

      {/* 지역 + 뱃지 */}
      <div className="form-row">
        <div className="form-group region-group">
          <label htmlFor="region">지역</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">지역을 선택하세요</option>
            {regionOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {includeBadge && (
          <div className="form-group badge-request-group">
            <label htmlFor="badgeRequest">뱃지 요청</label>
            <div className="badge-request-container">
              <span className="badge-icon">🏅</span>
              <input
                type="checkbox"
                name="badgeRequest"
                id="badgeRequest"
                checked={formData.badgeRequest}
                onChange={handleChange}
                className="badge-request-checkbox"
              />
            </div>
          </div>
        )}
      </div>

      {/* 여행 기간 */}
      {includeDateRange && (
        <div className="form-group">
          <label>여행 기간</label>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            months={1}
            direction="horizontal"
          />
        </div>
      )}

      {/* 내용 */}
      {includeContent && (
        <div className="form-group">
          <label htmlFor="content">{contentLabel}</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="5"
            placeholder="내용을 입력하세요"
            required
          />
        </div>
      )}

      {/* 최대 인원 입력 */}
      <div className="form-group">
        <label htmlFor="maxParticipants">최대 인원</label>
        <input
          type="number"
          id="maxParticipants"
          name="maxParticipants"
          value={formData.maxParticipants}
          onChange={handleChange}
          placeholder="최대 인원을 입력하세요"
          min={2}
          max={10}
          required
        />
      </div>

      {/* 이미지 */}
      {includeImage && (
        <div className="form-group">
          <label htmlFor="image">이미지</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
            }
          />
        </div>
      )}

      {/* 버튼 */}
      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          취소
        </button>
        <button type="submit" className="btn-submit">
          작성하기
        </button>
      </div>
    </form>
  );
};

export default PostForm;
