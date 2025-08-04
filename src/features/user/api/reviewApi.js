import { axiosInstance } from "@/shared";

export const submitReview = async (reviewData) => {
  const userId = reviewData.reviewerId; // 필수
  try {
    const res = await axiosInstance.post(`/api/review/${userId}`, reviewData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("리뷰 등록 실패:", error);
    throw error;
  }
};
