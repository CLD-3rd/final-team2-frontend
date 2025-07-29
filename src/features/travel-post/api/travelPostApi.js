import { axiosInstance } from "@/shared";
import {
  parseTravelPostsResponse,
  parsePlannedCompanionsResponse,
  parseLocalCompanionsResponse,
  parsePostDetailResponse,
} from "@/features/travel-post";

const BASE_URL = "/api/travel-posts";
/**
 * ✅ 공통 CRUD API
 * @param {string} type - "BEFORE" | "NOW"
 * @param {object} params - query params
 * @param {object} payload - body data (POST/PATCH)
 */
// ✅ 모집글 조회
export const getTravelPosts = async (
  type,
  filters = {},
  page = 0,
  size = 12
) => {
  try {
    const { data } = await axiosInstance.get(BASE_URL, {
      params: {
        postType: type,
        page: page,
        size,
        sort: filters.sort || "recent", // ✅ 기본값
        title: filters.title || "", // ✅ 제목 검색
        author: filters.author || "", // ✅ 글쓴이 검색
        location: filters.location || "", // ✅ 지역 검색
      },
    });
    return {
      posts: parseTravelPostsResponse(data),
      pageInfo: data.pageInfo,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `[${type}] 모집글 조회 중 오류가 발생했습니다.`;
    console.error(`[${type}] 모집글 조회 실패`, message);

    throw new Error(message);
  }
};

// ✅ 모집글 상세 조회
export const getTravelPostDetail = async (type, travelPostId) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/${travelPostId}`, {
      params: { postType: type },
    });
    return parsePostDetailResponse(data);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "모집글 상세 조회 중 오류가 발생했습니다.";
    console.error("모집글 상세 조회 실패:", message);

    throw new Error(message);
  }
};

// ✅ 모집글 생성
export const createTravelPost = async (type, payload) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/requests`, payload, {
      params: { postType: type },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `[${type}] 모집글 등록 중 오류가 발생했습니다.`;
    console.error(`[${type}] 모집글 등록 실패`, message);
    throw new Error(message);
  }
};

// ✅ 모집글 수정
export const updateTravelPost = async (type, travelPostId, payload) => {
  try {
    const { data } = await axiosInstance.put(
      `${BASE_URL}/${travelPostId}`,
      payload,
      {
        params: { postType: type },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `[${type}] 모집글 수정 중 오류가 발생했습니다.`;
    console.error(`[${type}] 모집글 수정 실패`, message);
    throw new Error(message);
  }
};

// ✅ 모집글 삭제
export const deleteTravelPost = async (type, travelPostId) => {
  try {
    const { data } = await axiosInstance.delete(`${BASE_URL}/${travelPostId}`, {
      params: { postType: type },
    });
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `[${type}] 모집글 삭제 중 오류가 발생했습니다.`;
    console.error(`[${type}] 모집글 삭제 실패`, message);
    throw new Error(message);
  }
};

// ✅ 참여 신청
export const requestTravelPostJoin = async (type, travelPostId) => {
  try {
    const { data } = await axiosInstance.post(
      `${BASE_URL}/requests/${travelPostId}`,
      {},
      {
        params: { postType: type },
      }
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `[${type}] 모집글 참여 신청 중 오류가 발생했습니다.`;
    console.error("참여 신청 실패:", message);
    throw new Error(message);
  }
};
