import { useState } from "react";
import PostForm from "./PostForm";

const FeedPostModal = ({ onClose, onPostCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    region: "",
    image: null,
    badgeRequest: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      title: formData.title,
      region: formData.region,
      author: "사용자님",
      date: new Date().toISOString().split("T")[0],
      images: formData.image
        ? [URL.createObjectURL(formData.image)]
        : ["/placeholder.svg?height=200&width=300&text=새로운+피드"],
      content: formData.content,
      badgeRequest: formData.badgeRequest,
    };

    onPostCreate?.(newPost);
    onClose();
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
        />
      </div>
    </div>
  );
};

export default FeedPostModal;
