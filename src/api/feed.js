// src/api/feed.js
import axios from "./axiosInstance";
import { parseFeedsResponse } from "@/dto/feedDto";

// ✅ feed 전체 조회
export const getFeeds = async (page = 1, size = 10) => {
  try {
    const res = await axios.get(`/api/feed`, {
      params: { page, size },
    });

    return {
      feeds: parseFeedsResponse(res.data),
      pageInfo: res.data?.data?.pageInfo,
    };
  } catch (error) {
    console.error("피드 조회 실패", error);
    // ✅ 테스트용 데이터
    const testFeeds = {
      status: 200,
      message: "피드 목록 조회 성공 (mock)",
      data: {
        feeds: [
          {
            feed_id: 1,
            user_id: 101,
            title: "제주도 여행 후기",
            content: "제주도에서의 멋진 경험을 공유합니다.",
            image_url: "/images/test-feed.jpg",
            location: "JEJU",
            badge_request: "Y",
            view_count: 134,
            like_count: 57,
            created_at: "2025-07-20",
            modified_at: "2025-07-21",
          },
          {
            feed_id: 2,
            user_id: 102,
            title: "부산 해운대 여행기",
            content: "부산 바다 너무 예뻐요!",
            image_url: "/images/test-feed2.jpg",
            location: "BUSAN",
            badge_request: "N",
            view_count: 200,
            like_count: 89,
            created_at: "2025-07-18",
            modified_at: "2025-07-19",
          },
        ],
        pageInfo: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          totalElements: 2,
        },
      },
    };

    return {
      feeds: parseFeedsResponse(testFeeds),
      pageInfo: null,
    };
  }
};

// ✅ feed 상세 조회
export const getFeedDetail = async (feedId) => {
  const response = await axios.get(`/api/feed/${feedId}`);
  return response.data;
};

// ✅ feed 등록
export const createFeed = async (data) => {
  const response = await axios.post("/api/feed", data);
  return response.data;
};

// ✅ feed 수정
export const updateFeed = async (feedId, data) => {
  const response = await axios.patch(`/api/feed/${feedId}`, data);
  return response.data;
};

// ✅ feed 삭제
export const deleteFeed = async (feedId) => {
  const response = await axios.delete(`/api/feed/${feedId}`);
  return response.data;
};

// ✅ 댓글 조회
export const getComments = async (feedId) => {
  const response = await axios.get(`/api/feed/${feedId}/comments`);
  return response.data;
};

// ✅ 댓글 등록
export const createComment = async (feedId, data) => {
  const response = await axios.post(`/api/feed/${feedId}/comments`, data);
  return response.data;
};

// ✅ 댓글 수정
export const updateComment = async (feedId, commentId, data) => {
  const response = await axios.patch(
    `/api/feed/${feedId}/comments/${commentId}`,
    data
  );
  return response.data;
};

// ✅ 댓글 삭제
export const deleteComment = async (feedId, commentId) => {
  const response = await axios.delete(
    `/api/feed/${feedId}/comments/${commentId}`
  );
  return response.data;
};
