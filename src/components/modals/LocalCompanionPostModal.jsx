import { useState } from "react";
import PostForm from "@/components/modals/PostForm";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

const LocalCompanionPostModal = ({ onClose, onPostCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    region: "",
    dateRange: "",
    image: null,
  });

  useLockBodyScroll();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      title: formData.title,
      region: formData.region,
      author: "사용자님",
      date: new Date().toISOString().split("T")[0],
      dateRange: formData.dateRange,
      images: formData.image
        ? [URL.createObjectURL(formData.image)]
        : ["/placeholder.svg?height=200&width=300&text=현지+모집"],
      content: formData.content,
    };

    onPostCreate?.(newPost);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>현지 동행 모집</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <PostForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={onClose}
          titleLabel="모집 제목"
          contentLabel="여행 계획"
          includeBadge={false}
          includeDateRange={false}
          includeContent={false}
          includeImage={false}
        />
      </div>
    </div>
  );
};

export default LocalCompanionPostModal;
