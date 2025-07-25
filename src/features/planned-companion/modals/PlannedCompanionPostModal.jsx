import { useState, useEffect } from "react";
import { PostForm, useLockBodyScroll } from "@/shared";
import {
  createTravelPost,
  updateTravelPost,
} from "@/features/planned-companion";
import toast from "react-hot-toast";

const PlannedCompanionPostModal = ({
  onClose,
  onPostCreate,
  onSuccess, // ✅ 수정 후 성공 콜백
  initialData = null,
  mode = "create", // ✅ "create" | "edit"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    region: "",
    dateRange: "",
    image: null,
  });
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [loading, setLoading] = useState(false);
  useLockBodyScroll();

  // ✅ initialData 있을 때 formData 세팅
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });

      // ✅ startTime, endTime → Date 객체로 변환
      setDateRange([
        {
          startDate: new Date(initialData.startTime),
          endDate: new Date(initialData.endTime),
          key: "selection",
        },
      ]);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("content", formData.content);
      formPayload.append("location", formData.region);
      // ✅ DateRange 값 변환
      const startDate = dateRange[0].startDate.toISOString().split("T")[0];
      const endDate = dateRange[0].endDate.toISOString().split("T")[0];

      formPayload.append("startTime", startDate); // 2025-08-10
      formPayload.append("endTime", endDate); // 2025-08-15
      if (formData.image) {
        formPayload.append("images", formData.image);
      }

      if (mode === "create") {
        await createTravelPost("BEFORE", formPayload);
        toast.success("사전 동행 모집글이 등록되었습니다!");
        onPostCreate?.();
      } else if (mode === "edit" && initialData?.id) {
        await updateTravelPost("BEFORE", initialData.id, formPayload);
        toast.success("사전 동행 모집글이 수정되었습니다!");
        onSuccess?.();
      }

      onClose();
    } catch (error) {
      toast.error(
        mode === "create"
          ? "사전 동행 모집글 등록에 실패했습니다."
          : "사전 동행 모집글 수정에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "create" ? "사전 동행 모집" : "모집글 수정"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <PostForm
          formData={formData}
          setFormData={setFormData}
          dateRange={dateRange}
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
