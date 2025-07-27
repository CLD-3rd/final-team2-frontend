import { axiosInstance } from "@/shared";
import {
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
  size = 10
) => {
  try {
    const { data } = await axiosInstance.get(BASE_URL, {
      params: {
        postType: type,
        page,
        size,
        sort: filters.sort || "recent", // ✅ 정렬 기본값
        ...filters,
      },
    });

    // ✅ 파서 자동 적용
    let parsedPosts;
    if (type === "BEFORE") {
      parsedPosts = parsePlannedCompanionsResponse(data);
    } else if (type === "NOW") {
      parsedPosts = parseLocalCompanionsResponse(data);
    } else {
      throw new Error(`[모집글 조회]지원하지 않는 postType: ${type}`);
    }

    return {
      posts: parsedPosts,
      pageInfo: data?.data?.pageInfo,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      `[${type}] 모집글 조회 중 오류가 발생했습니다.`;
    console.error(`[${type}] 모집글 조회 실패`, message);
    const testPlannedResponse = {
      posts: [
        {
          travelPostId: 1,
          title: "제주도 힐링 여행 동행 모집",
          content:
            "이번 여행은 제주도 힐링 투어입니다! 🏝️ 맛집 탐방과 카페 투어 위주로 진행할 예정이에요. 자연 속에서 여유를 즐길 분들 기다립니다!",
          location: "JEJU",
          startTime: "2025-08-10",
          endTime: "2025-08-15",
          author: {
            userId: 1,
            nickname: "여행가123",
            profileImgUrl: "https://userProfileImage1.jpg",
          },
          participants: 2, // (+ 현재까지 신청받은 인원 수)
          maxParticipants: 4,
          imageUrl: "https://cdn.example.com/images/jeju-trip.jpg",
          createdAt: "2025-08-03",
        },
        {
          travelPostId: 2,
          title: "부산 해운대 여행 동행",
          content:
            "이번 여정은 3박 4일 동안 진행됩니다. 첫째 날에는 서울에서 출발하여 강릉을 거쳐 삼척까지! 둘째 날에는 해수욕과 서핑 체험 🏄, 셋째 날에는 하이킹과 계곡 트레킹, 마지막 날에는 강릉 카페 투어로 마무리할 예정입니다. 음식은 현지 맛집으로만 엄선 🍲, 숙소는 감성 가득한 펜션과 캠핑장 준비 완료! 참여 조건은 간단합니다: 여행을 사랑하고 새로운 사람들과 즐겁게 어울릴 수 있는 분이라면 누구나 환영! 선착순 6명 모집 중이니 놓치지 마세요. 🎒 #국내여행 #강원도여행 #서핑 #하이킹 #캠핑",
          location: "BUSAN",
          startTime: "2025-09-01",
          endTime: "2025-09-05",
          author: {
            userId: 2,
            nickname: "부산러버",
            profileImgUrl: "https://userProfileImage2.jpg",
          },
          participants: 1, // (+ 현재까지 신청받은 인원 수)
          maxParticipants: 3,
          imageUrl: "https://cdn.example.com/images/busan-beach.jpg",
          createdAt: "2025-08-03",
        },
        {
          travelPostId: 3,
          title: "강원도 캠핑 모임",
          content:
            "강원도 캠핑 동행 모집합니다! ⛺ 산과 강이 함께하는 최고의 힐링 코스를 준비했어요. 밤에는 캠프파이어 🔥와 별 보기 🌌, 낮에는 계곡에서 물놀이까지! 참가자는 4명 선착순으로 모집 중이니, 관심 있으신 분은 빠르게 연락 주세요. 장비는 일부 제공 가능하며, 캠핑 경험 없으셔도 환영합니다! 😊 #캠핑 #힐링여행 #별구경",
          location: "SOKCHO",
          startTime: "2025-08-20",
          endTime: "2025-08-22",
          author: {
            userId: 3,
            nickname: "캠핑매니아",
            profileImgUrl: "https://userProfileImage3.jpg",
          },
          participants: 3, // (+ 현재까지 신청받은 인원 수)
          maxParticipants: 5,
          imageUrl: "https://cdn.example.com/images/gangwon-camp.jpg",
          createdAt: "2025-08-01",
        },
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 3,
      },
    };
    const testLocalResponse = {
      posts: [
        {
          travelPostId: 101,
          title: "제주 카페 투어 동행 구해요 ☕",
          location: "JEJU",
          author: {
            userId: 11,
            nickname: "카페러버",
            profileImgUrl: "https://cdn.example.com/users/11/profile.jpg",
            rating: 3.5,
            tags: ["커피", "사진", "맛집"],
          },
          createdAt: "2025-08-03",
        },
        {
          travelPostId: 102,
          title: "부산 해운대에서 맥주 한잔 하실 분 🍺",
          location: "BUSAN",
          author: {
            userId: 12,
            nickname: "부산사나이",
            profileImgUrl: "https://cdn.example.com/users/12/profile.jpg",
            rating: 4.2,
            tags: ["바다", "야경", "맥주"],
          },
          createdAt: "2025-08-02",
        },
        {
          travelPostId: 103,
          title: "서울 홍대 근처 맛집 탐방 🙌",
          location: "SEOUL",
          author: {
            userId: 13,
            nickname: "맛집헌터",
            profileImgUrl: "https://cdn.example.com/users/13/profile.jpg",
            rating: 4.9,
            tags: ["맛집", "트렌디", "SNS"],
          },
          createdAt: "2025-08-01",
        },
      ],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 3,
      },
    };

    let parsedPosts;
    if (type === "BEFORE") {
      parsedPosts = parsePlannedCompanionsResponse(testPlannedResponse);
    } else if (type === "NOW") {
      parsedPosts = parseLocalCompanionsResponse(testLocalResponse);
    } else {
      throw new Error(`[모집글 조회]지원하지 않는 postType: ${type}`);
    }

    return {
      posts: parsedPosts,
      pageInfo: parsedPosts.pageInfo,
    };
    throw new Error(message);
  }
};

// ✅ 모집글 상세 조회
export const getTravelPostDetail = async (type, travelPostId) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/${travelPostId}`, {
      params: { postType: type },
    });
    return parseFeedDetailResponse(data);
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
    const { data } = await axiosInstance.post(BASE_URL, payload, {
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
