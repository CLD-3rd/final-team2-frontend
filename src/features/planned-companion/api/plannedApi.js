import { axiosInstance } from "@/shared";
import { parsePlannedCompanionListResponse } from "@/features/planned-companion";

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
    const testResponse = {
      posts: [
        {
          id: 1,
          title: "제주도 힐링 여행 동행 모집",
          location: "JEJU",
          startTime: "2025-08-10",
          endTime: "2025-08-15",
          description:
            "함께 제주도를 여행할 동행을 찾습니다!\n맛집 탐방 필수 🍽",
          author: "여행가123",
          participants: 2,
          maxParticipants: 4,
          image: "https://cdn.example.com/images/jeju-trip.jpg",
        },
        {
          id: 2,
          title: "부산 해운대 여행 동행",
          location: "BUSAN",
          startTime: "2025-09-01",
          endTime: "2025-09-05",
          description: "바다 좋아하시는 분 환영합니다!\n사진 찍기 좋아요 📸",
          author: "부산러버",
          participants: 1,
          maxParticipants: 3,
          image: "https://cdn.example.com/images/busan-beach.jpg",
        },
        {
          id: 3,
          title: "강원도 캠핑 모임",
          location: "SOKCHO",
          startTime: "2025-08-20",
          endTime: "2025-08-22",
          description: "캠핑장비 있으신 분 대환영!\n밤하늘 별보러 가요 🌌",
          author: "캠핑매니아",
          participants: 3,
          maxParticipants: 5,
          image: "https://cdn.example.com/images/gangwon-camp.jpg",
        },
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 3,
      },
    };

    return {
      posts: parsePlannedCompanionListResponse(testResponse),
      pageInfo: testResponse.data?.pageInfo,
    };
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
