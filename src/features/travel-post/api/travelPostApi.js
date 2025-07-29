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
  page = 1,
  size = 12
) => {
  try {
    const { data } = await axiosInstance.get(BASE_URL, {
      params: {
        postType: type,
        page: page - 1,
        size,
        sort: filters.sort || "recent", // ✅ 기본값
        title: filters.title || "", // ✅ 제목 검색
        author: filters.author || "", // ✅ 글쓴이 검색
        location: filters.location || "", // ✅ 지역 검색
      },
    });
    const parsedPosts = parseTravelPostsResponse(data);

    return {
      posts: parsedPosts,
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

    // ✅ 테스트용 Mock 데이터
    const testPostDetail = {
      travelPostId: 1,
      title: "제주도 힐링 여행 동행 모집",
      content:
        "이번 여정은 3박 4일 동안 진행됩니다. 첫째 날에는 서울에서 출발하여 강릉을 거쳐 삼척까지! 둘째 날에는 해수욕과 서핑 체험 🏄, 셋째 날에는 하이킹과 계곡 트레킹, 마지막 날에는 강릉 카페 투어로 마무리할 예정입니다. 음식은 현지 맛집으로만 엄선 🍲, 숙소는 감성 가득한 펜션과 캠핑장 준비 완료! 참여 조건은 간단합니다: 여행을 사랑하고 새로운 사람들과 즐겁게 어울릴 수 있는 분이라면 누구나 환영! 선착순 6명 모집 중이니 놓치지 마세요. 🎒 #국내여행 #강원도여행 #서핑 #하이킹 #캠핑",
      location: "JEJU",
      startTime: "2025-08-10",
      endTime: "2025-08-15",
      author: {
        userId: 1,
        nickname: "여행가123",
        profileImgUrl: "https://userProfileImage1.jpg",
      },
      maxParticipants: 5,
      imageUrl: "https://cdn.example.com/images/jeju-trip.jpg",
      createdAt: "2025-08-03",
    };

    // ✅ testFeedDetail의 data만 전달
    return parsePostDetailResponse(testPostDetail);

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
    const { data } = await axiosInstance.patch(
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
