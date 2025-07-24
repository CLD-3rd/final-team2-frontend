import { axiosInstance } from "@/shared";

const BASE_URL = "/api/planned-companion";

// ✅ 사전 동행 모집글 조회
export const getPlannedCompanions = async (
  filters = {},
  page = 1,
  size = 10
) => {
  try {
    const { data } = await axiosInstance.get(BASE_URL, {
      params: {
        page,
        size,
        sort: filters.sort || "recent", // ✅ 정렬 기본값
        ...filters,
      },
    });
    return {
      posts: parsePlannedCompanionsResponse(data),
      pageInfo: data?.data?.pageInfo,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사전 동행 모집글 조회 중 오류가 발생했습니다.";
    console.error("사전 동행 모집글 조회 실패:", message);
    throw new Error(message);
  }
};

// ✅ 사전 동행 모집글 생성
export const createPlannedCompanion = async (payload) => {
  try {
    const { data } = await axiosInstance.post(BASE_URL, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사전 동행 모집글 등록 중 오류가 발생했습니다.";
    console.error("사전 동행 모집글 등록 실패:", message);
    throw new Error(message);
  }
};

// ✅ 사전 동행 모집글 수정
export const updatePlannedCompanion = async (postId, payload) => {
  try {
    const { data } = await axiosInstance.patch(
      `${BASE_URL}/${postId}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사전 동행 모집글 수정 중 오류가 발생했습니다.";
    console.error("사전 동행 모집글 수정 실패:", message);
    throw new Error(message);
  }
};

// ✅ 사전 동행 모집글 삭제
export const deletePlannedCompanion = async (postId) => {
  try {
    const { data } = await axiosInstance.delete(`${BASE_URL}/${postId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사전 동행 모집글 삭제 중 오류가 발생했습니다.";
    console.error("사전 동행 모집글 삭제 실패:", message);
    throw new Error(message);
  }
};
