// src/api/feed.js
import { axiosInstance } from "@/shared";
import { parseFeedsResponse, parseFeedDetailResponse } from "@/features/feed";

const BASE_URL = "/api/feed";

// ✅ feed 전체 조회
export const getFeeds = async (filters = ({}, (page = 1)), size = 10) => {
  try {
    const { data } = await axiosInstance.get(BASE_URL, {
      params: {
        page,
        size,
        sort: filters.sort,
      },
    });
    return {
      feeds: parseFeedsResponse(data),
      pageInfo: data?.data?.pageInfo,
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "피드 조회 중 오류가 발생했습니다.";
    console.error("피드 조회 실패:", message);
    // ✅ 테스트용 데이터
    const testFeeds = {
      feeds: [
        {
          feedId: 1,
          author: {
            userId: 102,
            nickname: "제주러버",
            profileImgUrl: "/images/user-102.jpg",
          },
          title: "제주도 여행 후기",
          content: "제주도에서의 멋진 경험을 공유합니다.",
          imageUrls: ["/images/test-feed1.jpg", "/images/test-feed2.jpg"],
          location: "JEJU",
          badgeRequest: true,
          viewCount: 134,
          createdAt: "2025-07-20",
        },
        {
          feedId: 2,
          author: {
            userId: 103,
            nickname: "부산홀릭",
            profileImgUrl: "/images/user-103.jpg",
          },
          title: "부산 해운대 여행기",
          content: "부산 바다 너무 예뻐요!",
          imageUrls: [
            "/images/test-feed3.jpg",
            "/images/test-feed4.jpg",
            "/images/test-feed5.jpg",
          ],
          location: "BUSAN",
          badgeRequest: false,
          viewCount: 200,
          created_at: "2025-07-18",
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

    // ✅ 테스트용 Mock 데이터
    const testFeedDetail = {
      feedId: 2,
      author: {
        userId: 103,
        nickname: "부산홀릭",
        profileImgUrl: "/images/user-103.jpg",
      },
      title: "부산 여행기",
      content: "부산의 아름다운 바다와 맛집을 소개합니다.",
      imageUrls: [
        "/images/test-feed3.jpg",
        "/images/test-feed4.jpg",
        "/images/test-feed5.jpg",
      ],
      location: "BUSAN",
      viewCount: 254,
      createdAt: "2025-07-24T12:30:00Z",
      author: {
        nickname: "여행러버",
        profileImgUrl: "https://cdn.example.com/users/45/profile.jpg",
      },
      comments: [
        {
          commentId: 1,
          author: {
            id: 101,
            nickname: "버",
            profileImgUrl: "/images/user-1.jpg",
          },
          content: "정말 멋진 이네요! 저도 가보고 싶어요.",
          createdAt: "2025-07-23T12:30:00Z",
          isMyComment: false,
        },
        {
          commentId: 2,
          author: {
            id: 102,
            nickname: "사작가",
            profileImgUrl: "/images/user-2.jpg",
          },
          content: "사진이 말 잘 나왔네요. 어떤 카메라로 찍으셨나요?",
          createdAt: "2025-07-24T13:00:00Z",
          isMyComment: false,
        },
        {
          commentId: 3,
          author: {
            id: 103,
            nickname: "용자님",
            profileImgUrl: "/images/user-profile.jpg",
          },
          content: "다음에 같가요!",
          createdAt: "2025-07-24T13:30:00Z",
          isMyComment: true,
        },
      ],
    };

    // ✅ testFeedDetail의 data만 전달
    return parseFeedDetailResponse(testFeedDetail);

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
    const { data } = await axiosInstance.patch(
      `${BASE_URL}/${feedId}`,
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
