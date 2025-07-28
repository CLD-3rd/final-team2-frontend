import { axiosInstance } from "@/shared";

// 일정 조회 API
export const getSchedules = async () => {
  try {
    const res = await axiosInstance.get(`/api/schedules`);
    if (res.status === 200 && res.data?.content) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error("일정 조회 실패", error);
    // ✅ 테스트용 데이터 (명세서 예시)
    const testSchedules = {
  message: "테스트 일정 데이터",
  content: [
    {
      travel_post_id: 1,
      title: "7월 서울 여행",
      start_time: "2025-07-23",
      end_time: "2025-07-27",
      is_add_recruit: false,
      recruit_limit: 5,
      location: "Seoul",
      owner: { user_id: 12, nickname: "여행쟁이", is_reviewed: false, image: "/images/default-user.png" },
      participants: [
        { user_id: 20, nickname: "guest1", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
        { user_id: 21, nickname: "guest2", status: "PENDING", is_reviewed: false, image: "/images/default-user.png" },
      ],
      progress_status: "ONGOING",
      is_reviewed: false,
    },
    {
      travel_post_id: 2,
      title: "7월 부산 해변 여행",
      start_time: "2025-07-25",
      end_time: "2025-07-28",
      is_add_recruit: true,
      recruit_limit: 4,
      location: "Busan",
      owner: { user_id: 30, nickname: "host_busan", is_reviewed: false, image: "/images/default-user.png" },
      participants: [
        { user_id: 12, nickname: "여행쟁이", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
        { user_id: 40, nickname: "guest3", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
        { user_id: 41, nickname: "guest4", status: "PENDING", is_reviewed: false, image: "/images/default-user.png" },
      ],
      progress_status: "ONGOING",
      is_reviewed: false,
    },
    {
      travel_post_id: 3,
      title: "8월 도쿄 여행 모집",
      start_time: "2025-08-05",
      end_time: "2025-08-10",
      is_add_recruit: true,
      recruit_limit: 5,
      location: "Tokyo",
      owner: { user_id: 12, nickname: "여행쟁이", is_reviewed: false, image: "/images/default-user.png" },
      participants: [
        { user_id: 50, nickname: "guest5", status: "PENDING", is_reviewed: false, image: "/images/default-user.png" },
        { user_id: 51, nickname: "guest6", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
        { user_id: 52, nickname: "guest7", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
      ],
      progress_status: "UPCOMING",
      is_reviewed: false,
    },
    {
      travel_post_id: 4,
      title: "8월 교토 여행",
      start_time: "2025-08-15",
      end_time: "2025-08-20",
      is_add_recruit: false,
      recruit_limit: 4,
      location: "Kyoto",
      owner: { user_id: 60, nickname: "host_kyoto", is_reviewed: false, image: "/images/default-user.png" },
      participants: [
        { user_id: 12, nickname: "여행쟁이", status: "PENDING", is_reviewed: false, image: "/images/default-user.png" },
        { user_id: 61, nickname: "guest7", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
        { user_id: 62, nickname: "guest8", status: "PENDING", is_reviewed: false, image: "/images/default-user.png" },
      ],
      progress_status: "UPCOMING",
      is_reviewed: false,
    },
    {
      travel_post_id: 6,
      title: "6월 제주도 여행",
      start_time: "2025-06-10",
      end_time: "2025-06-15",
      is_add_recruit: false,
      recruit_limit: 4,
      location: "Jeju",
      owner: { user_id: 12, nickname: "여행쟁이", is_reviewed: true, image: "/images/default-user.png" },
      participants: [
        { user_id: 80, nickname: "guest10", status: "APPROVED", is_reviewed: true, image: "/images/default-user.png" },
        { user_id: 81, nickname: "guest11", status: "APPROVED", is_reviewed: true, image: "/images/default-user.png" },
      ],
      progress_status: "COMPLETED",
      is_reviewed: true,  // 모든 사람이 리뷰를 완료
    },
    {
      travel_post_id: 7,
      title: "6월 강릉 카페 투어",
      start_time: "2025-06-18",
      end_time: "2025-06-20",
      is_add_recruit: false,
      recruit_limit: 3,
      location: "Gangneung",
      owner: { user_id: 90, nickname: "host_gangneung", is_reviewed: false, image: "/images/default-user.png" },
      participants: [
        { user_id: 12, nickname: "여행쟁이", status: "APPROVED", is_reviewed: true, image: "/images/default-user.png" },
        { user_id: 91, nickname: "guest12", status: "APPROVED", is_reviewed: false,image: "/images/default-user.png" },
        ],
        progress_status: "COMPLETED",
        is_reviewed: false,  // 아직 전체 리뷰 완료가 아님
      },
      {
  travel_post_id: 8,
  title: "8월 오사카 쇼핑 여행",
  start_time: "2025-08-25",
  end_time: "2025-08-27",
  is_add_recruit: false,
  recruit_limit: 3,
  location: "Osaka",
  owner: { user_id: 70, nickname: "host_osaka", is_reviewed: false, image: "/images/default-user.png" },
  participants: [
      { user_id: 12, nickname: "여행쟁이", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
      { user_id: 71, nickname: "guest9", status: "APPROVED", is_reviewed: false, image: "/images/default-user.png" },
    ],
    progress_status: "UPCOMING",
    is_reviewed: false,
    },

    ],
    total_elements: 7,
  };

    return testSchedules;
  }
};

export const updateParticipantStatus = async (travelPostId, userId, status) => {
  try {
    const res = await axiosInstance.patch(
      `/schedule/${travelPostId}/participants/${userId}`,
      { status }, // "APPROVED" or "REJECTED"
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 필요 시
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("참여자 상태 변경 실패", error);
    throw error;
  }
};