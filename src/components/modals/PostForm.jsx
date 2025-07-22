"use client";
import regionOptions from "@/constants/regionOptions";

const PostForm = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  titleLabel,
  contentLabel,
  includeBadge,
  includeDateRange,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="modal-form">
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

      {includeDateRange && (
        <div className="form-group">
          <label htmlFor="dateRange">여행 기간</label>
          <input
            type="text"
            id="dateRange"
            name="dateRange"
            value={formData.dateRange}
            onChange={handleChange}
            placeholder="25.7.18~25.7.19"
            required
          />
        </div>
      )}

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
