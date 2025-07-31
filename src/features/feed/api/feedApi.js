// src/api/feed.js
import { axiosInstance } from "@/shared";
import { parseFeedsResponse, parseFeedDetailResponse } from "@/features/feed";

const BASE_URL = "/api/feeds";

// ✅ feed 전체 조회
export const getFeeds = async (filters = {}, page = 1, size = 12) => {
  try {
    const { data } = await axiosInstance.get(BASE_URL, {
      params: {
        page,
        size,
        sort: filters.sort || "view", // ✅ 기본값
        title: filters.title || "", // ✅ 제목 검색
        author: filters.author || "", // ✅ 글쓴이 검색
        location: filters.location || "", // ✅ 지역 검색
      },
    });
    return {
      feeds: parseFeedsResponse(data),
      pageInfo: data?.pageInfo,
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "피드 조회 중 오류가 발생했습니다.";
    console.error("피드 조회 실패:", message);

    throw new Error(message);
  }
};

// ✅ feed 상세 조회
export const getFeedDetail = async (feedId) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/${feedId}`);
    return parseFeedDetailResponse(data);
  } catch (error) {
    const message =
      error.response?.data?.message || "피드 상세 조회 중 오류가 발생했습니다.";
    console.error("피드 상세 조회 실패:", message);

    throw new Error(message);
  }
};

// ✅ feed 등록
export const createFeed = async (payload) => {
  try {
    const { data } = await axiosInstance.post(BASE_URL, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "피드 등록 중 오류가 발생했습니다.";
    console.error("피드 등록 실패:", message);
    throw new Error(message);
  }
};

// ✅ feed 수정
export const updateFeed = async (feedId, payload) => {
  try {
    const { data } = await axiosInstance.put(`${BASE_URL}/${feedId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "피드 수정 중 오류가 발생했습니다.";
    console.error("피드 수정 실패:", message);
    throw new Error(message);
  }
};

// ✅ feed 삭제
export const deleteFeed = async (feedId) => {
  try {
    const { data } = await axiosInstance.delete(`${BASE_URL}/${feedId}`);
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "피드 삭제 중 오류가 발생했습니다.";
    console.error("피드 삭제 실패:", message);
    throw new Error(message);
  }
};

// ✅ 댓글 등록
export const createComment = async (feedId, payload) => {
  try {
    const { data } = await axiosInstance.post(
      `${BASE_URL}/${feedId}/comments`,
      payload
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "댓글 등록 중 오류가 발생했습니다.";
    console.error("댓글 등록 실패:", message);
    throw new Error(message);
  }
};

// ✅ 댓글 수정
export const updateComment = async (feedId, commentId, payload) => {
  try {
    const { data } = await axiosInstance.patch(
      `${BASE_URL}/${feedId}/comments/${commentId}`,
      payload
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "댓글 수정 중 오류가 발생했습니다.";
    console.error("댓글 수정 실패:", message);
    throw new Error(message);
  }
};

// ✅ 댓글 삭제
export const deleteComment = async (feedId, commentId) => {
  try {
    const { data } = await axiosInstance.delete(
      `${BASE_URL}/${feedId}/comments/${commentId}`
    );
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "댓글 삭제 중 오류가 발생했습니다.";
    console.error("댓글 삭제 실패:", message);
    throw new Error(message);
  }
};
