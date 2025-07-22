"use client";

import { useState } from "react";

const CreatePostModal = ({ onClose, currentPage, onPostCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    region: "",
    dateRange: "",
    image: null,
    badgeRequest: false,
  });

  const isCompanionPost = currentPage === "photo";

  const handleSubmit = (e) => {
    e.preventDefault();

    // 새 포스트 데이터 생성
    const newPost = {
      id: Date.now(), // 임시 ID
      title: formData.title,
      region: formData.region,
      author: "사용자님", // 로그인된 사용자 이름
      date: new Date().toISOString().split("T")[0], // 오늘 날짜
      images: formData.image
        ? [URL.createObjectURL(formData.image)]
        : ["/placeholder.svg?height=200&width=300&text=새로운+피드"],
      content: formData.content,
      badgeRequest: formData.badgeRequest,
      ...(isCompanionPost && { dateRange: formData.dateRange }),
    };

    // 상위 컴포넌트로 새 포스트 전달
    if (onPostCreate) {
      onPostCreate(newPost);
    }

    console.log("Creating post:", newPost);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isCompanionPost ? "새 동행 모집" : "새 피드 작성"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={
                isCompanionPost
                  ? "프랑스 1박2일 가성비"
                  : "피드 제목을 입력하세요"
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region">지역</label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">지역을 선택하세요</option>
                <option value="부산">부산</option>
                <option value="대전">대전</option>
                <option value="보령">보령</option>
                <option value="안성">안성</option>
                <option value="전주">전주</option>
                <option value="대구">대구</option>
                <option value="김해시">김해시</option>
              </select>
            </div>

            {/* 뱃지요청 체크박스는 피드 작성 시에만 표시 */}
            {currentPage === "feed" && (
              <div className="form-group badge-request-group">
                <div className="badge-request-container">
                  <span className="badge-request-label">뱃지요청</span>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="badgeRequest"
                      checked={formData.badgeRequest}
                      onChange={handleChange}
                      className="badge-request-checkbox"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {isCompanionPost && (
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
            <label htmlFor="content">
              {isCompanionPost ? "여행 계획" : "내용"}
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="5"
              placeholder={
                isCompanionPost
                  ? "프랑스 당일치기 여행갑니다\n일정 : 인천공항 >> 프랑스 공항 >> 인천공항"
                  : "내용을 입력하세요"
              }
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
              {isCompanionPost ? "모집하기" : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
