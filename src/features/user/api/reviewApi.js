import { axiosInstance } from "@/shared";

export const submitReview = async (reviewData) => {
  try {
    const res = await axiosInstance.post("/api/reviews", reviewData, {
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
