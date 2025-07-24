import { useState } from "react";
import { PostForm, useLockBodyScroll } from "@/shared";
import { createPlannedCompanion } from "@/features/planned-companion";
import toast from "react-hot-toast";

const PlannedCompanionPostModal = ({ onClose, onPostCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    region: "",
    dateRange: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useLockBodyScroll();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("content", formData.content);
      formPayload.append("region", formData.region);
      formPayload.append("date_range", formData.dateRange);
      if (formData.image) {
        formPayload.append("images", formData.image);
      }

      const newPost = await createPlannedCompanion(formPayload);
      toast.success("사전 동행 모집글이 등록되었습니다!");
      onPostCreate?.(newPost); // ✅ 성공 시 목록 갱신
      onClose();
    } catch (error) {
      toast.error("사전 동행 모집글 등록에 실패했습니다.");

      // alert("사전 동행 모집글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>사전 동행 모집</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <PostForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={onClose}
          titleLabel="여행 제목"
          contentLabel="여행 계획"
          includeBadge={false}
          includeDateRange={true}
          includeContent={true}
          includeImage={true}
        />
      </div>
    </div>
  );
};

export default PlannedCompanionPostModal;
