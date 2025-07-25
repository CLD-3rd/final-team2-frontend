import { useState, useEffect } from "react";
import { PostForm, useLockBodyScroll } from "@/shared";
import { createTravelPost, updateTravelPost } from "@/features/travel-post";
import toast from "react-hot-toast";

const LocalCompanionPostModal = ({
  onClose,
  onPostCreate,
  onSuccess, // ✅ 수정 후 성공 콜백
  initialData = null,
  mode = "create", // ✅ "create" | "edit"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  useLockBodyScroll();

  // ✅ initialData 있을 때 formData 세팅
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("location", formData.region);

      if (mode === "create") {
        await createTravelPost("NOW", formPayload);
        toast.success("현지 동행 모집글이 등록되었습니다!");
        onPostCreate?.();
      } else if (mode === "edit" && initialData?.id) {
        await updateTravelPost("NOW", initialData.id, formPayload);
        toast.success("현지 동행 모집글이 수정되었습니다!");
        onSuccess?.();
      }

      onClose();
    } catch (error) {
      toast.error(
        mode === "create"
          ? "현지 동행 모집글 등록에 실패했습니다."
          : "현지 동행 모집글 수정에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "create" ? "현지 동행 모집" : "모집글 수정"}</h2>
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
        />
      </div>
    </div>
  );
};

export default LocalCompanionPostModal;
