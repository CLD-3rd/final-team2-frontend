import { useState } from "react";
import { PostForm } from "@/shared";
import { useLockBodyScroll } from "@/shared";
import { createFeed } from "@/features/feed";

const FeedPostModal = ({ onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    region: "",
    image: null,
    badgeRequest: false,
  });

  useLockBodyScroll();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ FormData 생성
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("content", formData.content);
      formPayload.append("location", formData.region);
      formPayload.append("badge_request", formData.badgeRequest);
      if (formData.image) {
        formPayload.append("images", formData.image);
      }

      // ✅ API 호출
      const response = await createFeed(formPayload);

      // ✅ 성공 → 모달 닫기 + 목록 새로고침
      onClose();
      onRefresh?.();
    } catch (error) {
      console.error("피드 작성 실패", error);
      alert("피드 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>새 피드 작성</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <PostForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={onClose}
          titleLabel="제목"
          contentLabel="내용"
          includeBadge
          includeDateRange={false}
          includeContent
          includeImage
        />
      </div>
    </div>
  );
};

export default FeedPostModal;
