import { axiosInstance } from "@/shared";

const BASE_URL = "/api/users";

// ✅ 현재 로그인한 사용자 정보 조회 (/api/users/me)
export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/me`);
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
    await axiosInstance.post(`${BASE_URL}/logout`);
    return true; // 성공 시 true
  } catch (error) {
    console.error("로그아웃 실패", error);
    return false;
  }
};

// ✅ 사용자 프로필 조회 (/api/users/profile)
export const getUserProfile = async () => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/profile`);
    if (res.status === 200 && res.data) {
      return res.data; // 로그인 사용자 정보
    }
    return null; // 데이터가 없으면 비로그인
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사용자 프로필 조회 중 오류가 발생했습니다.";
    console.error("사용자 프로필 조회 실패:", message);

    throw new Error(message);
  }
};

// ✅ 사용자 프로필 수정
export const updateUserProfile = async (payload) => {
  try {
    const res = await axiosInstance.put(`${BASE_URL}/profile`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사용자 프로필 수정 중 오류가 발생했습니다.";
    console.error("사용자 프로필 수정 실패:", message);

    throw new Error(message);
  }
};

// ✅ 사용자 표시 뱃지 수정
export const updateUserBadge = async (badgeIds) => {
  try {
    const res = await axiosInstance.put(`${BASE_URL}/badges`, { badgeIds });
    return true;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사용자 표시 뱃지 수정 중 오류가 발생했습니다.";
    console.error("사용자 표시 뱃지 수정 실패:", message);

    throw new Error(message);
  }
};

// ✅ 사용자 여행 성향 수정
export const updateUserTravelTag = async (travelTagKeys) => {
  try {
    const res = await axiosInstance.put(`${BASE_URL}/travel-tags`, {
      travelTagKeys,
    });
    return true;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "사용자 여행 성향 수정 중 오류가 발생했습니다.";
    console.error("사용자 여행 성향 수정 실패:", message);

    throw new Error(message);
  }
};
