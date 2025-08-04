import { axiosInstance } from "@/shared";

// ✅ 현재 로그인한 사용자 정보 조회 (/api/users/me)
export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.get("/api/users/me");
    if (res.status === 200 && res.data) {
      return res.data; // 로그인 사용자 정보
    }
    return null; // 데이터가 없으면 비로그인
  } catch (error) {
    if (error.response?.status === 401) {
      // ✅ 비로그인 상태 → 정상적인 흐름
      return null;
    }
    console.error("로그인 사용자 정보 조회 실패", error);
    return null; // 기타 에러는 null 처리
  }
};

// ✅ 로그아웃 API (/api/users/logout)
export const logoutUser = async () => {
  try {
    await axiosInstance.post("/api/users/logout");
    return true; // 성공 시 true
  } catch (error) {
    console.error("로그아웃 실패", error);
    return false;
  }
};

// 유저 정보 조회 API
export const getUserInfo = async (userId) => {
  try {
    const res = await axiosInstance.get(`/api/user/info/${userId}`);
    if (res.status === 200 && res.data?.content) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error("유저 정보 조회 실패", error);
    // ✅ 테스트용 데이터
    const testUser = {
      message: "유저 정보",
      content: {
        id: userId || 12,
        email: "user@example.com",
        nickname: "여행쟁이",
        profileImageUrl:
          "https://raw.githubusercontent.com/han199805/personal/main/batcatjpg.jpg",
      },
    };
    return testUser;
  }
};

// ✅ 유저 리뷰 통계 조회
export const getUserReviewStats = async (userId) => {
  try {
    const res = await axiosInstance.get(`/api/review/${userId}`);
    if (res.status === 200 && res.data?.content) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error("리뷰 정보 조회 실패", error);
    // ✅ 테스트용 데이터
    const testReviewStats = {
      message: "사용자 리뷰 조회",
      content: {
        reviewee_id: userId,
        total_reviews: 12,
        total_rating_score: 54,
        average_rating: 4.5,
        last_reviewed_at: "2025-07-20T18:32:00Z",
      },
    };
    return testReviewStats;
  }
};


// ✅ 유저 뱃지 조회
// ✅ 유저 뱃지 조회 - 엔드포인트 수정
export const getUserBadges = async (userId) => {
  try {
    const res = await axiosInstance.get(`/api/user/badge/${userId}`);
    if (res.status === 200 && res.data?.content) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error("뱃지 조회 실패", error);
    // ... 이하 생략
  }
};

