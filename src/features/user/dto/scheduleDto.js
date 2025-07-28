// 서버에서 받은 일정 데이터를 ScheduleManagementPage 형태로 변환
export const parseScheduleResponse = (rawData, currentUserId) => {
  if (!rawData || !rawData.content) return [];

  return rawData.content.map((item) => {
    // 승인된 인원 수 계산
    const approvedCount = (item.participants || []).filter((p) => p.status === "APPROVED").length;

    // 나 자신의 참가 상태 찾기
    const myStatus =
      (item.participants || []).find((p) => p.user_id === currentUserId)?.status || null;

    return {
      id: item.travel_post_id,
      title: item.title,
      location: item.location,
      startDate: item.start_time,
      endDate: item.end_time,

      // 일정 전체 리뷰 완료 여부
      isReviewed: item.is_reviewed ?? false,
      myJoinStatus: myStatus,

      owner: item.owner
        ? {
            id: item.owner.user_id,
            name: item.owner.nickname,
            image: item.owner.image || "/images/default-user.png",
            isReviewed: item.owner.is_reviewed ?? false,
          }
        : null,

      participants: (item.participants || []).map((p) => ({
        id: p.user_id,
        name: p.nickname,
        status: p.status,
        approved: p.status === "APPROVED",
        image: p.image || "/images/default-user.png",
        isReviewed: p.is_reviewed ?? false,
      })),

      approvedCount,
      recruitLimit: item.recruit_limit ?? 0,

      progressStatus: item.progress_status, // "UPCOMING" | "ONGOING" | "COMPLETED"
    };
  });
};
