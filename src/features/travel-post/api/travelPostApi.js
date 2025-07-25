import { axiosInstance } from "@/shared";
import {
  parsePlannedCompanionsResponse,
  parseLocalCompanionsResponse,
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
          content: "함께 제주도를 여행할 동행을 찾습니다!\n맛집 탐방 필수 🍽",
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
          content: "바다 좋아하시는 분 환영합니다!\n사진 찍기 좋아요 📸",
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
            "바다 좋아하시는 분 환영합니다!\n사진 찍기 좋아요 📸\na\na\na",
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
    // throw new Error(message);
  }
};

// // ✅ 모집글 조회
// export const getTravelPosts = async (
//   type,
//   filters = {},
//   page = 1,
//   size = 10
// ) => {
//   try {
//     const { data } = await axiosInstance.get(BASE_URL, {
//       params: {
//         postType: type,
//         page,
//         size,
//         sort: filters.sort || "recent", // ✅ 정렬 기본값
//         ...filters,
//       },
//     });

//     return {
//       posts: parsePlannedCompanionsResponse(data),
//       pageInfo: data?.data?.pageInfo,
//     };
//   } catch (error) {
//     const message =
//       error.response?.data?.message ||
//       `[${type}] 모집글 조회 중 오류가 발생했습니다.`;
//     console.error(`[${type}] 모집글 조회 실패`, message);
//     throw new Error(message);
//   }
// };

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
export const updateTravelPost = async (type, postId, payload) => {
  try {
    const { data } = await axiosInstance.patch(
      `${BASE_URL}/${postId}`,
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
export const deleteTravelPost = async (type, postId) => {
  try {
    const { data } = await axiosInstance.delete(`${BASE_URL}/${postId}`, {
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
