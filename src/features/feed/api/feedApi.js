// src/api/feed.js
import { axiosInstance } from "@/shared";
import { parseFeedsResponse, parseFeedDetailResponse } from "@/features/feed";

// ✅ feed 전체 조회
export const getFeeds = async (page = 1, size = 10) => {
  try {
    const response = await axiosInstance.get(`/api/feed`, {
      params: { page, size },
    });
    if (response.status === 200 && response.data?.data) {
      return {
        feeds: parseFeedsResponse(response.data),
        pageInfo: response.data?.data?.pageInfo,
      };
    }
    return null;
  } catch (error) {
    console.error("피드 조회 실패", error);
    // ✅ 테스트용 데이터
    const testFeeds = {
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
    };

    return {
      feeds: parseFeedsResponse(testFeeds),
      pageInfo: testFeeds.pageInfo,
    };
  }
};

// ✅ feed 상세 조회
export const getFeedDetail = async (feedId) => {
  try {
    const response = await axiosInstance.get(`/api/feed/${feedId}`);
    if (response.status === 200 && response.data?.data) {
      return parseFeedDetailResponse(response.data.data);
    }
    return null;
  } catch (error) {
    console.error("피드 상세 조회 실패", error);

    // ✅ 테스트용 Mock 데이터
    const testFeedDetail = {
      feed_id: 1,
      user_id: 45,
      title: "부산 여행기",
      content: "부산의 아름다운 바다와 맛집을 소개합니다.",
      image_url: [
        "https://cdn.example.com/feed/123/img1.jpg",
        "https://cdn.example.com/feed/123/img2.jpg",
      ],
      location: "BUSAN",
      badge_request: "N",
      view_count: 254,
      like_count: 88,
      created_at: "2025-07-15",
      modified_at: "2025-07-16",
      author: {
        nickname: "여행러버",
        profile_image: "https://cdn.example.com/users/45/profile.jpg",
      },
      comments: [
        {
          comment_id: 1,
          user_id: 201,
          nickname: "댓글유저1",
          content: "부산 진짜 최고죠!",
          created_at: "2025-07-15T13:45:00",
          modified_at: "2025-07-15T13:45:00",
        },
        {
          comment_id: 2,
          user_id: 202,
          nickname: "댓글유저2",
          content: "사진 너무 예뻐요!",
          created_at: "2025-07-15T14:10:00",
          modified_at: "",
        },
      ],
    };

    // ✅ testFeedDetail의 data만 전달
    return parseFeedDetailResponse(testFeedDetail);
  }
};

// ✅ feed 등록
export const createFeed = async (data) => {
  try {
    const response = await axiosInstance.post("/api/feed", data);

    // ✅ 응답 검증
    if (response.status === 200 || response.status === 201) {
      return res.data;
    } else {
      throw new Error(`피드 등록 실패: ${response.status}`);
    }
  } catch (error) {
    console.error("피드 등록 실패:", error);

    // ✅ 사용자에게 보여줄 메시지를 위해 에러 반환
    throw new Error(
      error.response?.data?.message || "피드 등록 중 오류가 발생했습니다."
    );
  }
};

// ✅ feed 수정
export const updateFeed = async (feedId, data) => {
  const response = await axiosInstance.patch(`/api/feed/${feedId}`, data);
  return response.data;
};

// ✅ feed 삭제
export const deleteFeed = async (feedId) => {
  const response = await axiosInstance.delete(`/api/feed/${feedId}`);
  return response.data;
};

// ✅ 댓글 조회
export const getComments = async (feedId) => {
  const response = await axiosInstance.get(`/api/feed/${feedId}/comments`);
  return response.data;
};

// ✅ 댓글 등록
export const createComment = async (feedId, data) => {
  const response = await axiosInstance.post(
    `/api/feed/${feedId}/comments`,
    data
  );
  return response.data;
};

// ✅ 댓글 수정
export const updateComment = async (feedId, commentId, data) => {
  const response = await axiosInstance.patch(
    `/api/feed/${feedId}/comments/${commentId}`,
    data
  );
  return response.data;
};

// ✅ 댓글 삭제
export const deleteComment = async (feedId, commentId) => {
  const response = await axiosInstance.delete(
    `/api/feed/${feedId}/comments/${commentId}`
  );
  return response.data;
};
