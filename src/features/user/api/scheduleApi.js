// ✅ scheduleApi.js
import { axiosInstance } from "@/shared";

export const getSchedules = async () => {
  try {
    const res = await axiosInstance.get(`/api/schedule/mine`);
    return res.data;
  } catch (error) {
    console.error("일정 조회 실패", error);
    return { content: [] };
  }
};

export const getParticipants = async (travelPostId) => {
  try {
    const res = await axiosInstance.get(`/api/schedule/${travelPostId}/participants`);
    return res.data;
  } catch (error) {
    console.error("참가자 조회 실패", error);
    return [];
  }
};

export const getApprovedParticipantCount = async (travelPostId) => {
  try {
    const res = await axiosInstance.get(`/api/schedule/${travelPostId}/participants/approved/count`);
    return res.data;
  } catch (error) {
    console.error("승인 인원 수 조회 실패", error);
    return 0;
  }
};

export const updateParticipantStatus = async (travelPostId, userId, status) => {
  try {
    const res = await axiosInstance.put(
      `/api/schedule/${travelPostId}/participants/${userId}`,
      { status },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (error) {
    console.error("참여자 상태 변경 실패", error);
    throw error;
  }
};