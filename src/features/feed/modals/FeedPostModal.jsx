import { useState } from "react";
import PostForm from "@/components/modals/PostForm";
import { useLockBodyScroll } from "@/shared";
import { createFeed } from "@/features/feed";

const FeedPostModal = ({ onClose, onPostCreate }) => {
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

      // ✅ UI 반영
      const newPost = {
        id: response.data.feed_id,
        title: response.data.title,
        region: response.data.location,
        author: response.data.author.nickname,
        date: response.data.created_at,
        images: response.data.image_url || [],
      };

      onPostCreate?.(newPost);
      onClose();
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
          includeBadge={true}
          includeDateRange={false}
          includeContent={true}
          includeImage={true}
        />
      </div>
    </div>
  );
};

export default FeedPostModal;
