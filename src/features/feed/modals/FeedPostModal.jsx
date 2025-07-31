import { useState, useEffect } from "react";
import { PostForm, useLockBodyScroll } from "@/shared";
import { createFeed, updateFeed } from "@/features/feed";
import toast from "react-hot-toast";

const FeedPostModal = ({
  onClose,
  onSuccess, // ✅ 성공 시 콜백 추가
  mode = "create",
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    image: null,
    badgeRequest: false,
  });

  useLockBodyScroll();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("content", formData.content);
      formPayload.append("location", formData.location);
      formPayload.append("badgeRequest", formData.badgeRequest);
      if (formData.image) {
        formPayload.append("image", formData.image);
      }
      if (mode === "edit" && initialData?.id) {
        await updateFeed(initialData.id, formPayload);
      } else {
        console.log(formData);

        await createFeed(formPayload);
      }

      // ✅ 성공 시 콜백 실행 (FeedPage에서 reloadTrigger 증가)
      toast.success("피드가 등록되었습니다!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error.message ||
          (mode === "edit"
            ? "피드 수정에 실패했습니다."
            : "피드 등록에 실패했습니다.")
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "edit" ? "피드 수정" : "새 피드 작성"}</h2>
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
